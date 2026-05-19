
package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.AttributePreferenceDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.CompleteSuggestionDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import es.uib.easypick.user.application.entities.UserEntity;
// ...existing code...
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@UseCase
@RequiredArgsConstructor
public class GetSuggestionContextUseCase {

	private final UserRepository userRepository;
	private final GarmentRepository garmentRepository;
	private final SuggestionRepository suggestionRepository;

	@Value("${application.suggestion.requested-outfit-count:3}")
	private Integer requestedOutfitCount;

	@Transactional(readOnly = true)
	public SuggestionContextRequest execute(UUID userId, LocationDto location) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

		List<AttributePreferenceDto> colorPreferences = user.getColorPreferences().stream()
				.map(pref -> new AttributePreferenceDto(pref.getColor().getId(), pref.getScore()))
				.collect(Collectors.toList());
		List<AttributePreferenceDto> brandPreferences = user.getBrandPreferences().stream()
				.map(pref -> new AttributePreferenceDto(pref.getBrand().getId(), pref.getScore()))
				.collect(Collectors.toList());
		List<AttributePreferenceDto> categoryPreferences = user.getCategoryPreferences().stream()
				.map(pref -> new AttributePreferenceDto(pref.getCategory().getId(), pref.getScore()))
				.collect(Collectors.toList());
		List<AttributePreferenceDto> stylePreferences = user.getStylePreferences().stream()
				.map(pref -> new AttributePreferenceDto(pref.getStyle().getId(), pref.getScore()))
				.collect(Collectors.toList());

		List<CompleteGarmentResponse> garments = garmentRepository.findWithDetailsByUserIdAndStatusOrderByUpdatedAtDesc(userId, GarmentStatus.CONFIRMED)
				.stream()
				.map(CompleteGarmentResponse::fromEntity)
				.collect(Collectors.toList());

		List<CompleteSuggestionDto> previousSuggestions = suggestionRepository.findByUserId(userId).stream()
				.map(CompleteSuggestionDto::fromEntity)
				.collect(Collectors.toList());

		return new SuggestionContextRequest(
				colorPreferences,
				brandPreferences,
				categoryPreferences,
				stylePreferences,
				garments,
				previousSuggestions,
				requestedOutfitCount,
				location
		);
	}
}
