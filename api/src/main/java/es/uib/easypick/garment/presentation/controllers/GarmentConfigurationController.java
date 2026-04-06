package es.uib.easypick.garment.presentation.controllers;

import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.garment.application.usecases.GetGarmentConfigurationsUseCase;
import es.uib.easypick.garment.presentation.dtos.responses.ConfigurationsResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/garments/configurations")
@RequiredArgsConstructor
@Tag(name = "Garment Configurations", description = "Endpoints related to garment configurations like brands, colors, categories and styles")
public class GarmentConfigurationController {

    private final GetGarmentConfigurationsUseCase getGarmentConfigurationsUseCase;

    @GetMapping
    public ResponseEntity<ApiResponse<ConfigurationsResponse>> getGarmentConfigurations() {
        ConfigurationsResponse response = getGarmentConfigurationsUseCase.execute();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
