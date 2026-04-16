package es.uib.easypick.auth.application.usecases;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.auth.application.factories.RefreshTokenFactory;
import es.uib.easypick.auth.application.gateways.GoogleAuthGateway;
import es.uib.easypick.auth.application.gateways.GoogleUserResponse;
import es.uib.easypick.auth.infrastructure.repositories.RefreshTokenRepository;
import es.uib.easypick.auth.presentation.dtos.responses.TokenResponse;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.core.presentation.web.security.JwtService;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class GoogleSignInUseCase {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RefreshTokenFactory refreshTokenFactory;
    private final RefreshTokenRepository refreshTokenRepository;
    private final GoogleAuthGateway googleAuthGateway;

    @Transactional
    public TokenResponse execute(String idTokenString) {
        GoogleUserResponse googleUser = googleAuthGateway.verifyAndExtractUser(idTokenString);

        UserEntity user = userRepository.findByEmail(googleUser.email())
                .orElseGet(() -> userRepository.save(UserEntity.create(
                        googleUser.firstName() + " " + googleUser.lastName(),
                        googleUser.email()
                )));

        String accessToken = jwtService.generateToken(user);
        RefreshTokenEntity refreshTokenEntity = refreshTokenFactory.createForUser(user);

        refreshTokenRepository.save(refreshTokenEntity);

        return TokenResponse.builder()
                .refreshToken(refreshTokenEntity.getToken())
                .accessToken(accessToken)
                .build();
    }
}