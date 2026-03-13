package es.uib.easypick.garment.presentation.controllers;

import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.core.presentation.web.resolvers.AuthenticatedUserId;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.garment.application.usecases.GetUserGarmentsUseCase;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/garments")
@RequiredArgsConstructor
@Tag(name = "Garment", description = "Endpoints related to garments")
public class GarmentController {

    private final GetUserGarmentsUseCase getUserGarmentsUseCase;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<SimpleGarmentResponse>>> getUserGarments(
            @AuthenticatedUserId UUID userId
    ) {
        List<SimpleGarmentResponse> response = getUserGarmentsUseCase.execute(userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
