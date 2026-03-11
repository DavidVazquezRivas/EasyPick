package es.uib.easypick.auth.dtos.responses;

import lombok.Builder;

import java.util.UUID;

@Builder
public record TokenResponse(
        String accessToken,
        UUID refreshToken
) {
}
