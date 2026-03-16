package es.uib.easypick.auth.presentation.controllers;

import es.uib.easypick.auth.presentation.dtos.requests.RefreshTokenRequest;
import es.uib.easypick.auth.presentation.dtos.responses.TokenResponse;
import es.uib.easypick.auth.application.usecases.RefreshTokensUseCase;
import es.uib.easypick.core.presentation.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Gestión de sesiones y tokens")
public class AuthController {

    private final RefreshTokensUseCase refreshTokensUseCase;

    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh access tokens",
            description = "Generates a new access token using a valid refresh. The old refresh token is revoked and " +
                    "replaced with a new one. Note that the refresh token is sent in the request body, as design for " +
                    "mobile access, not web."
    )
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest requestBody
    ) {
        TokenResponse response = refreshTokensUseCase.execute(requestBody.refreshToken());

        return ResponseEntity.ok().body(ApiResponse.success(response));
    }
}