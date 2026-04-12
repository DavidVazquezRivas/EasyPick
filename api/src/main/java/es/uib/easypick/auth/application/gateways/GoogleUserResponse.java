package es.uib.easypick.auth.application.gateways;

public record GoogleUserResponse(
        String email,
        String firstName,
        String lastName
) {
}
