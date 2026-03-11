package es.uib.easypick.core.web.security;

import es.uib.easypick.user.entities.UserEntity;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private UserEntity mockUser;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

        // Manually inject environment variables
        ReflectionTestUtils.setField(jwtService, "secretKey", testSecret);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1000L * 60 * 60); // 1 hora

        // Prepare a mock user
        mockUser = new UserEntity();
        mockUser.setId(userId);
        mockUser.setEmail("test@easypick.es");
    }

    @Test
    void generateToken_ShouldReturnValidTokenString() {
        String token = jwtService.generateToken(mockUser);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        // A JWT will always have 3 parts separated by dots
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void extractUserId_ShouldReturnCorrectId() {
        String token = jwtService.generateToken(mockUser);

        UUID extractedId = jwtService.extractUserId(token);

        assertEquals(userId, extractedId);
    }

    @Test
    void isTokenValid_ShouldReturnTrueForCorrectUser() {
        String token = jwtService.generateToken(mockUser);

        assertTrue(jwtService.isTokenValid(token, userId));
    }

    @Test
    void isTokenValid_ShouldReturnFalseForDifferentUser() {
        String token = jwtService.generateToken(mockUser);
        UUID differentUserId = UUID.randomUUID(); // Simulate other user

        assertFalse(jwtService.isTokenValid(token, differentUserId));
    }

    @Test
    void validateToken_ShouldThrowExceptionIfTokenIsExpired() {
        // Force expiration to a negative value so that it is born expired
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", -1000L);
        String expiredToken = jwtService.generateToken(mockUser);

        // Assert that the exception is thrown when we try to validate the token
        assertThrows(ExpiredJwtException.class, () -> {
            jwtService.isTokenValid(expiredToken, userId);
        });
    }
}