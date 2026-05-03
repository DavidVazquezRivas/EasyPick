package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.SuggestionGateway;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import es.uib.easypick.suggestion.application.usecases.responses.GeneratedSuggestionResponse;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GenerateSuggestionsUseCase {
    private static final long GENERATION_THROTTLE_HOURS = 10;

    private final GetSuggestionContextUseCase getSuggestionContextUseCase;
    private final SuggestionGateway suggestionGateway;
    private final GarmentRepository garmentRepository;
    private final SuggestionRepository suggestionRepository;
    private final UserRepository userRepository;

    public List<GeneratedSuggestionResponse> execute(UUID userId, LocationDto location) {
        // Fetch user entity for validation and future suggestion persistence.
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User " + userId + " not found"));

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime startOfDay = now.withHour(0).withMinute(0).withSecond(0).withNano(0);

        List<SuggestionEntity> pendingSuggestions = suggestionRepository.findPendingSuggestionsForUserSince(userId, SuggestionStatus.PENDING, startOfDay);
        if (!pendingSuggestions.isEmpty()) {
            return pendingSuggestions.stream().map(this::toResponse).toList();
        }

        if (suggestionRepository.findFirstByUserIdOrderByGeneratedAtDesc(userId)
                .map(SuggestionEntity::getGeneratedAt)
                .map(lastGeneratedAt -> lastGeneratedAt.plusHours(GENERATION_THROTTLE_HOURS))
                .filter(nextAvailableAt -> now.isBefore(nextAvailableAt))
                .isPresent()) {
            return List.of();
        }

        SuggestionContextRequest context = getSuggestionContextUseCase.execute(userId, location);

        SuggestionGatewayResponse response = suggestionGateway.getSuggestions(context);

        List<GeneratedSuggestionResponse> results = new ArrayList<>();

        int idx = 1;
        for (SuggestionGatewayResponseOutfit outfit : response.outfits()) {
            SuggestionEntity suggestion = new SuggestionEntity();
            suggestion.setName("Suggestion " + idx);
            suggestion.setUser(user);
            suggestion.setGeneratedAt(OffsetDateTime.now());

            List<CompleteGarmentResponse> garmentsForResponse = new ArrayList<>();

            for (UUID garmentId : outfit.garmentIds()) {
                GarmentEntity garment = garmentRepository.findWithDetailsById(garmentId)
                        .orElseThrow(() -> new AppException(ErrorCode.GARMENT_NOT_FOUND, "Garment " + garmentId + " not found for suggestion"));
                GarmentSuggestionEntity gs = new GarmentSuggestionEntity(suggestion, garment);
                suggestion.getGarmentSuggestions().add(gs);
                garmentsForResponse.add(CompleteGarmentResponse.fromEntity(garment));
            }

            SuggestionEntity saved = suggestionRepository.save(suggestion);

            results.add(new GeneratedSuggestionResponse(saved.getId(), saved.getName(), garmentsForResponse, saved.getStatus().name()));
            idx++;
        }

        return results;
    }

    private GeneratedSuggestionResponse toResponse(SuggestionEntity suggestion) {
        List<CompleteGarmentResponse> garments = suggestion.getGarmentSuggestions().stream()
                .map(GarmentSuggestionEntity::getGarment)
                .map(CompleteGarmentResponse::fromEntity)
                .toList();

        return new GeneratedSuggestionResponse(
                suggestion.getId(),
                suggestion.getName(),
                garments,
                suggestion.getStatus().name()
        );
    }
}
