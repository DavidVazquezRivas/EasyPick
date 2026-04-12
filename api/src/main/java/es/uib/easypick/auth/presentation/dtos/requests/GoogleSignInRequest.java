package es.uib.easypick.auth.presentation.dtos.requests;

import jakarta.validation.constraints.NotNull;

public record GoogleSignInRequest(@NotNull String idToken) {
}
