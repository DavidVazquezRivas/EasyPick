package es.uib.easypick.garment.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.user.application.entities.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "garments")
@Getter
@Setter
@NoArgsConstructor
public class GarmentEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
