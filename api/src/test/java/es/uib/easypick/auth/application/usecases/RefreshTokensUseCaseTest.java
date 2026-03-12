package es.uib.easypick.auth.application.usecases;

import es.uib.easypick.auth.presentation.dtos.responses.TokenResponse;
import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.auth.application.helpers.RefreshTokenTestBuilder;
import es.uib.easypick.auth.infrastructure.repositories.RefreshTokenRepository;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.presentation.web.security.JwtService;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.application.helpers.UserTestBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokensUseCaseTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private RefreshTokensUseCase refreshTokensUseCase;

    @Captor
    private ArgumentCaptor<RefreshTokenEntity> refreshTokenCaptor;

    private UUID tokenId;
    private UserEntity mockUser;

    @BeforeEach
    void setUp() {
        tokenId = UUID.randomUUID();

        // Si quisieras, también podrías hacer un UserTestBuilder para esto ;)
        mockUser = UserTestBuilder.aUser().build();
    }

    @Test
    void execute_ShouldReturnNewTokens_WhenOldTokenIsValid() {
        // Arrange
        RefreshTokenEntity validToken = RefreshTokenTestBuilder.aRefreshToken()
                .withToken(tokenId)
                .withUser(mockUser)
                .build();

        String generatedAccessToken = "new.jwt.token";
        when(refreshTokenRepository.findById(tokenId)).thenReturn(Optional.of(validToken));
        when(jwtService.generateToken(mockUser)).thenReturn(generatedAccessToken);

        // Act
        TokenResponse response = refreshTokensUseCase.execute(tokenId);

        // Assert
        assertNotNull(response);
        assertEquals(generatedAccessToken, response.accessToken());
        verify(refreshTokenRepository).delete(validToken);

        verify(refreshTokenRepository).save(refreshTokenCaptor.capture());
        RefreshTokenEntity savedToken = refreshTokenCaptor.getValue();
        assertEquals(mockUser, savedToken.getUser());
        assertTrue(savedToken.getExpiresAt().isAfter(OffsetDateTime.now().plusDays(29)));
    }

    @Test
    void execute_ShouldThrowException_WhenTokenNotFound() {
        // Arrange
        when(refreshTokenRepository.findById(tokenId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> refreshTokensUseCase.execute(tokenId));
        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());

        verifyNoInteractions(jwtService);
        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void execute_ShouldDeleteAndThrowException_WhenTokenIsRevoked() {
        // Arrange: Create a token, explicitly revoked
        RefreshTokenEntity revokedToken = RefreshTokenTestBuilder.aRefreshToken()
                .withToken(tokenId)
                .withUser(mockUser)
                .withRevoked(true)
                .build();

        when(refreshTokenRepository.findById(tokenId)).thenReturn(Optional.of(revokedToken));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> refreshTokensUseCase.execute(tokenId));
        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());

        verify(refreshTokenRepository).delete(revokedToken);
        verifyNoInteractions(jwtService);
    }

    @Test
    void execute_ShouldDeleteAndThrowException_WhenTokenIsExpired() {
        // Arrange: Create a token, explicitly expired
        RefreshTokenEntity expiredToken = RefreshTokenTestBuilder.aRefreshToken()
                .withToken(tokenId)
                .withUser(mockUser)
                .withExpiresAt(OffsetDateTime.now().minusDays(1))
                .build();

        when(refreshTokenRepository.findById(tokenId)).thenReturn(Optional.of(expiredToken));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> refreshTokensUseCase.execute(tokenId));
        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());

        verify(refreshTokenRepository).delete(expiredToken);
        verifyNoInteractions(jwtService);
    }
}