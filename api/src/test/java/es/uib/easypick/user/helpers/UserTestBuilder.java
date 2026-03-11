package es.uib.easypick.user.helpers;

import es.uib.easypick.user.entities.UserEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Test Data Builder for UserEntity.
 * Centraliza la creación de usuarios para que los tests sean limpios y resistentes a cambios.
 */
public class UserTestBuilder {

    private UUID id;
    private String email;
    private String name;
    private OffsetDateTime createdAt;

    private UserTestBuilder() {
        this.id = UUID.randomUUID();
        this.email = "default.user@easypick.es";
        this.name = "Default User";
        this.createdAt = OffsetDateTime.now().minusDays(10);
    }

    public static UserTestBuilder aUser() {
        return new UserTestBuilder();
    }

    public UserTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public UserTestBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public UserTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public UserTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public UserEntity build() {
        UserEntity user = new UserEntity();
        user.setId(this.id);
        user.setEmail(this.email);
        user.setName(this.name);
        user.setCreatedAt(this.createdAt);

        return user;
    }
}