package es.uib.easypick.auth.dtos.requests;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RefreshTokenRequest(
        @NotNull
        UUID refreshToken
) {
}
