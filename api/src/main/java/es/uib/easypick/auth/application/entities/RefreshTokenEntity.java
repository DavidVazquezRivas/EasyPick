package es.uib.easypick.auth.application.entities;

import es.uib.easypick.user.application.entities.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name="refresh_tokens")
@Getter
@Setter
public class RefreshTokenEntity {

    //<editor-fold desc="JPA">
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID token;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private boolean revoked = false;

    // Lazy loading to avoid unnecessary user data retrieval when fetching the token
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
    //</editor-fold>

    //<editor-fold desc="Business Logic">

    public boolean isExpired() {
        return expiresAt.isBefore(OffsetDateTime.now());
    }

    //</editor-fold>


}
