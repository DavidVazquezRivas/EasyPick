package es.uib.easypick.auth.usecases;

import es.uib.easypick.auth.dtos.responses.TokenResponse;
import es.uib.easypick.auth.entities.RefreshTokenEntity;
import es.uib.easypick.auth.repositories.RefreshTokenRepository;
import es.uib.easypick.core.exceptions.AppException;
import es.uib.easypick.core.exceptions.ErrorCode;
import es.uib.easypick.core.usecases.UseCase;
import es.uib.easypick.core.web.security.JwtService;
import es.uib.easypick.user.entities.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class RefreshTokensUseCase {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    // As it is an atomic operation, writing to the database, we need to make it transactional
    @Transactional
    public TokenResponse execute(UUID oldRefreshTokenId) {
        RefreshTokenEntity oldToken = refreshTokenRepository.findById(oldRefreshTokenId)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED, "Refresh token not found"));

        if (oldToken.isRevoked() || oldToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            refreshTokenRepository.delete(oldToken);
            throw new AppException(ErrorCode.UNAUTHORIZED, "Expired or invalid refresh token");
        }

        UserEntity user = oldToken.getUser();

        String newAccessToken = jwtService.generateToken(user);

        RefreshTokenEntity newRefreshToken = new RefreshTokenEntity();
        newRefreshToken.setUser(user);
        newRefreshToken.setExpiresAt(OffsetDateTime.now().plusDays(30));
        refreshTokenRepository.save(newRefreshToken);

        refreshTokenRepository.delete(oldToken);

        return TokenResponse
                .builder()
                .refreshToken(newRefreshToken.getToken())
                .accessToken(newAccessToken)
                .build();
    }
}
