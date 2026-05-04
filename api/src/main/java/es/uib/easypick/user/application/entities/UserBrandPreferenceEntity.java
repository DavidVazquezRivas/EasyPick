package es.uib.easypick.user.application.entities;

import es.uib.easypick.garment.application.entities.BrandEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "user_brand_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserBrandPreferenceEntity {

    @EmbeddedId
    private UserBrandPreferenceId id = new UserBrandPreferenceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("brandId")
    @JoinColumn(name = "brand_id")
    private BrandEntity brand;

    @Column(name = "score", columnDefinition = "integer default 0")
    private Integer score = 0;

    public UserBrandPreferenceEntity(UserEntity user, BrandEntity brand, Integer score) {
        this.user = user;
        this.brand = brand;
        this.score = score != null ? score : 0;
        this.id = new UserBrandPreferenceId(user.getId(), brand.getId());
    }

    public void updateScore(Integer newScore) {
        this.score = newScore;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class UserBrandPreferenceId implements Serializable {
        @Column(name = "user_id")
        private UUID userId;

        @Column(name = "brand_id")
        private UUID brandId;
    }
}