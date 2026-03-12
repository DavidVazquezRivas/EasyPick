package es.uib.easypick.auth.application.helpers;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import es.uib.easypick.user.application.entities.UserEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class RefreshTokenTestBuilder {

    private UUID token;
    private UserEntity user;
    private boolean revoked;
    private OffsetDateTime expiresAt;

    private RefreshTokenTestBuilder() {
        this.token = UUID.randomUUID();
        this.user = null;
        this.revoked = false;
        this.expiresAt = OffsetDateTime.now().plusDays(1); // Valid by default
    }

    public static RefreshTokenTestBuilder aRefreshToken() {
        return new RefreshTokenTestBuilder();
    }

    public RefreshTokenTestBuilder withToken(UUID token) {
        this.token = token;
        return this;
    }

    public RefreshTokenTestBuilder withUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public RefreshTokenTestBuilder withRevoked(boolean revoked) {
        this.revoked = revoked;
        return this;
    }

    public RefreshTokenTestBuilder withExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
        return this;
    }

    public RefreshTokenEntity build() {
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setToken(this.token);
        entity.setUser(this.user);
        entity.setRevoked(this.revoked);
        entity.setExpiresAt(this.expiresAt);
        return entity;
    }
}