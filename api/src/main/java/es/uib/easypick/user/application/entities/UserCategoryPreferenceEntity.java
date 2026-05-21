package es.uib.easypick.user.application.entities;

import es.uib.easypick.garment.application.entities.CategoryEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "user_category_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserCategoryPreferenceEntity {

    @EmbeddedId
    private UserCategoryPreferenceId id = new UserCategoryPreferenceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    @Column(name = "score", columnDefinition = "integer default 0")
    private Integer score = 0;

    public UserCategoryPreferenceEntity(UserEntity user, CategoryEntity category, Integer score) {
        this.user = user;
        this.category = category;
        this.score = score != null ? score : 0;
        this.id = new UserCategoryPreferenceId(user.getId(), category.getId());
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
    public static class UserCategoryPreferenceId implements Serializable {
        @Column(name = "user_id")
        private UUID userId;

        @Column(name = "category_id")
        private UUID categoryId;
    }
}