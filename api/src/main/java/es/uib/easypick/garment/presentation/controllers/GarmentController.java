package es.uib.easypick.garment.presentation.controllers;

import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.core.presentation.web.resolvers.AuthenticatedUserId;
import es.uib.easypick.garment.application.usecases.AddUserGarmentUseCase;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.garment.application.usecases.GetUserGarmentsUseCase;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/garments")
@RequiredArgsConstructor
@Tag(name = "Garment", description = "Endpoints related to garments")
public class GarmentController {

    private final GetUserGarmentsUseCase getUserGarmentsUseCase;
    private final AddUserGarmentUseCase addUserGarmentUseCase;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<SimpleGarmentResponse>>> getUserGarments(
            @AuthenticatedUserId UUID userId
    ) {
        List<SimpleGarmentResponse> response = getUserGarmentsUseCase.execute(userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SimpleGarmentResponse>> createGarment(
            @AuthenticatedUserId UUID userId,
            @RequestParam("image") MultipartFile image
    ) {
        SimpleGarmentResponse response = addUserGarmentUseCase.execute(userId, image);

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
