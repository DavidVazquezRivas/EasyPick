package es.uib.easypick.garment.presentation.controllers;

import es.uib.easypick.core.presentation.web.resolvers.AuthenticatedUserId;
import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.garment.application.usecases.AddUserGarmentUseCase;
import es.uib.easypick.garment.application.usecases.GetUserGarmentsUseCase;
import es.uib.easypick.garment.application.usecases.PatchGarmentUseCase;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/garments")
@RequiredArgsConstructor
@Tag(name = "Garment", description = "Endpoints related to garments")
public class GarmentController {

    private final GetUserGarmentsUseCase getUserGarmentsUseCase;
    private final AddUserGarmentUseCase addUserGarmentUseCase;
    private final PatchGarmentUseCase patchGarmentUseCase;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<SimpleGarmentResponse>>> getUserGarments(
            @AuthenticatedUserId UUID userId
    ) {
        List<SimpleGarmentResponse> response = getUserGarmentsUseCase.execute(userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<CompleteGarmentResponse>>> createGarment(
            @AuthenticatedUserId UUID userId,
            @RequestParam("image") MultipartFile image
    ) {
        List<CompleteGarmentResponse> response = addUserGarmentUseCase.execute(userId, image);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("@garmentSecurity.isOwner(#userId, #id)")
    public ResponseEntity<ApiResponse<CompleteGarmentResponse>> patchGarment(
            @PathVariable UUID id,
            @AuthenticatedUserId UUID userId,
            @RequestBody Map<String, Object> patchInstructions
    ) {
        CompleteGarmentResponse response = patchGarmentUseCase.execute(id, patchInstructions);

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
