package es.uib.easypick.auth.application.factories;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.application.helpers.UserTestBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.*;

class RefreshTokenFactoryTest {

    private RefreshTokenFactory factory;
    private static final int EXPIRATION_DAYS = 30;

    @BeforeEach
    void setUp() {
        factory = new RefreshTokenFactory();
        // Inject the configuration value that would normally come from @Value
        ReflectionTestUtils.setField(factory, "expirationDays", EXPIRATION_DAYS);
    }

    @Test
    void create_ShouldReturnTokenWithExpirationDate() {
        // Act
        RefreshTokenEntity token = factory.create();

        // Assert
        assertNotNull(token);
        assertNotNull(token.getExpiresAt());

        OffsetDateTime expectedMinExpiration = OffsetDateTime.now().plusDays(EXPIRATION_DAYS).minusSeconds(5);
        OffsetDateTime expectedMaxExpiration = OffsetDateTime.now().plusDays(EXPIRATION_DAYS).plusSeconds(5);

        assertTrue(token.getExpiresAt().isAfter(expectedMinExpiration),
                "Expiration date should be approximately " + EXPIRATION_DAYS + " days from now");
        assertTrue(token.getExpiresAt().isBefore(expectedMaxExpiration),
                "Expiration date should be approximately " + EXPIRATION_DAYS + " days from now");
    }

    @Test
    void create_ShouldReturnTokenWithoutUser() {
        // Act
        RefreshTokenEntity token = factory.create();

        // Assert
        assertNull(token.getUser(), "Token created without user should not have a user associated");
    }

    @Test
    void createForUser_ShouldReturnTokenWithUser() {
        // Arrange
        UserEntity user = UserTestBuilder.aUser().build();

        // Act
        RefreshTokenEntity token = factory.createForUser(user);

        // Assert
        assertNotNull(token);
        assertNotNull(token.getUser());
        assertEquals(user, token.getUser());
    }

    @Test
    void createForUser_ShouldReturnTokenWithExpirationDate() {
        // Arrange
        UserEntity user = UserTestBuilder.aUser().build();

        // Act
        RefreshTokenEntity token = factory.createForUser(user);

        // Assert
        assertNotNull(token.getExpiresAt());

        OffsetDateTime expectedMinExpiration = OffsetDateTime.now().plusDays(EXPIRATION_DAYS).minusSeconds(5);
        OffsetDateTime expectedMaxExpiration = OffsetDateTime.now().plusDays(EXPIRATION_DAYS).plusSeconds(5);

        assertTrue(token.getExpiresAt().isAfter(expectedMinExpiration),
                "Expiration date should be approximately " + EXPIRATION_DAYS + " days from now");
        assertTrue(token.getExpiresAt().isBefore(expectedMaxExpiration),
                "Expiration date should be approximately " + EXPIRATION_DAYS + " days from now");
    }

    @Test
    void createForUser_ShouldCreateNewTokenEachTime() {
        // Arrange
        UserEntity user = UserTestBuilder.aUser().build();

        // Act
        RefreshTokenEntity token1 = factory.createForUser(user);
        RefreshTokenEntity token2 = factory.createForUser(user);

        // Assert
        assertNotSame(token1, token2, "Each call should create a new instance");
    }

    @Test
    void create_WithDifferentExpirationDays_ShouldRespectConfiguration() {
        // Arrange
        int customExpirationDays = 7;
        RefreshTokenFactory customFactory = new RefreshTokenFactory();
        ReflectionTestUtils.setField(customFactory, "expirationDays", customExpirationDays);

        // Act
        RefreshTokenEntity token = customFactory.create();

        // Assert
        OffsetDateTime expectedMinExpiration = OffsetDateTime.now().plusDays(customExpirationDays).minusSeconds(5);
        OffsetDateTime expectedMaxExpiration = OffsetDateTime.now().plusDays(customExpirationDays).plusSeconds(5);

        assertTrue(token.getExpiresAt().isAfter(expectedMinExpiration),
                "Expiration date should respect configured days");
        assertTrue(token.getExpiresAt().isBefore(expectedMaxExpiration),
                "Expiration date should respect configured days");
    }

    @Test
    void createForUser_ShouldNotModifyRevoked() {
        // Arrange
        UserEntity user = UserTestBuilder.aUser().build();

        // Act
        RefreshTokenEntity token = factory.createForUser(user);

        // Assert
        assertFalse(token.isRevoked(), "Newly created token should not be revoked");
    }
}

