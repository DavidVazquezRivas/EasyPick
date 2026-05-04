package es.uib.easypick.auth.application.usecases;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.auth.application.factories.RefreshTokenFactory;
import es.uib.easypick.auth.application.gateways.GoogleAuthGateway;
import es.uib.easypick.auth.application.gateways.GoogleUserResponse;
import es.uib.easypick.auth.application.helpers.RefreshTokenTestBuilder;
import es.uib.easypick.auth.infrastructure.repositories.RefreshTokenRepository;
import es.uib.easypick.auth.presentation.dtos.responses.TokenResponse;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.presentation.web.security.JwtService;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.application.helpers.UserTestBuilder;
import es.uib.easypick.user.application.usecases.RegisterUserUseCase;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleSignInUseCaseTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenFactory refreshTokenFactory;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private GoogleAuthGateway googleAuthGateway;

    @Mock
    private RegisterUserUseCase registerUserUseCase;

    @InjectMocks
    private GoogleSignInUseCase useCase;

    private String validGoogleToken;
    private GoogleUserResponse mockGoogleUser;
    private UserEntity mockUser;
    private RefreshTokenEntity mockRefreshToken;

    @BeforeEach
    void setUp() {
        validGoogleToken = "header.payload.signature";

        mockGoogleUser = new GoogleUserResponse("test@example.com", "John", "Doe");

        mockUser = UserTestBuilder.aUser()
                .withEmail("test@example.com")
                .build();

        mockRefreshToken = RefreshTokenTestBuilder.aRefreshToken()
                .withUser(mockUser)
                .build();
    }

    @Test
    void execute_ShouldReturnTokens_WhenUserAlreadyExists() {
        // Arrange
        String expectedAccessToken = "jwt.access.token";

        when(googleAuthGateway.verifyAndExtractUser(validGoogleToken)).thenReturn(mockGoogleUser);
        when(userRepository.findByEmail(mockGoogleUser.email())).thenReturn(Optional.of(mockUser));

        when(jwtService.generateToken(mockUser)).thenReturn(expectedAccessToken);
        when(refreshTokenFactory.createForUser(mockUser)).thenReturn(mockRefreshToken);

        // Act
        TokenResponse response = useCase.execute(validGoogleToken);

        // Assert
        assertNotNull(response);
        assertEquals(expectedAccessToken, response.accessToken());
        assertEquals(mockRefreshToken.getToken(), response.refreshToken());

        verify(googleAuthGateway).verifyAndExtractUser(validGoogleToken);
        verify(userRepository).findByEmail(mockGoogleUser.email());
        verify(userRepository, never()).save(any(UserEntity.class)); // No se guarda un usuario nuevo
        verify(refreshTokenRepository).save(mockRefreshToken);
    }

    @Test
    void execute_ShouldCreateUserAndReturnTokens_WhenUserDoesNotExist() {
        // Arrange
        String expectedAccessToken = "jwt.access.token.new";
        UserEntity user = UserTestBuilder.aUser()
                .withEmail(mockGoogleUser.email())
                .build();

        when(googleAuthGateway.verifyAndExtractUser(validGoogleToken)).thenReturn(mockGoogleUser);
        when(userRepository.findByEmail(mockGoogleUser.email())).thenReturn(Optional.empty());
        when(jwtService.generateToken(any(UserEntity.class))).thenReturn(expectedAccessToken);
        when(refreshTokenFactory.createForUser(any(UserEntity.class))).thenReturn(mockRefreshToken);
        when(registerUserUseCase.execute(any(String.class), any(String.class))).thenReturn(user);

        // Act
        TokenResponse response = useCase.execute(validGoogleToken);

        // Assert
        assertNotNull(response);
        assertEquals(expectedAccessToken, response.accessToken());
        assertEquals(mockRefreshToken.getToken(), response.refreshToken());

        verify(googleAuthGateway).verifyAndExtractUser(validGoogleToken);
        verify(userRepository).findByEmail(mockGoogleUser.email());
        verify(registerUserUseCase).execute("John Doe", mockGoogleUser.email());
        verify(userRepository, never()).save(any(UserEntity.class));
        verify(refreshTokenRepository).save(mockRefreshToken);
    }

    @Test
    void execute_ShouldThrowAppException_WhenGoogleTokenIsInvalid() {
        // Arrange
        String invalidToken = "invalid.token";
        when(googleAuthGateway.verifyAndExtractUser(invalidToken))
                .thenThrow(new AppException(ErrorCode.INVALID_GOOGLE_TOKEN));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> useCase.execute(invalidToken));
        assertEquals(ErrorCode.INVALID_GOOGLE_TOKEN, exception.getErrorCode());

        // Aseguramos que nada de la lógica interna se ejecuta si falla el token
        verifyNoInteractions(userRepository, jwtService, refreshTokenFactory, refreshTokenRepository);
    }
}