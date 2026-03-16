package es.uib.easypick.auth.presentation.dtos.requests;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RefreshTokenRequest(
        @NotNull
        UUID refreshToken
) {
}
