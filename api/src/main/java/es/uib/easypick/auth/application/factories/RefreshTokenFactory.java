package es.uib.easypick.auth.application.factories;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.core.application.factories.EntityFactory;
import es.uib.easypick.user.application.entities.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

/**
 * Factory for creating RefreshTokenEntity instances.
 * <p>
 * Encapsulates the creation logic of refresh tokens, including expiration date calculation
 * based on application configuration. This keeps the creation logic out of use cases and entities.
 * </p>
 */
@Component
@RequiredArgsConstructor
public class RefreshTokenFactory implements EntityFactory<RefreshTokenEntity> {

    @Value("${application.security.refresh-token.expiration-days}")
    private int expirationDays;

    /**
     * Creates a new RefreshTokenEntity without an associated user.
     * This method is typically not used directly; prefer {@link #createForUser(UserEntity)}.
     *
     * @return A new RefreshTokenEntity instance
     */
    @Override
    public RefreshTokenEntity create() {
        RefreshTokenEntity token = new RefreshTokenEntity();
        token.setExpiresAt(OffsetDateTime.now().plusDays(expirationDays));
        return token;
    }

    /**
     * Creates a new RefreshTokenEntity for a specific user.
     *
     * @param user The user who owns this refresh token
     * @return A new RefreshTokenEntity instance with expiration date set from configuration
     */
    public RefreshTokenEntity createForUser(UserEntity user) {
        RefreshTokenEntity token = create();
        token.setUser(user);
        return token;
    }
}

