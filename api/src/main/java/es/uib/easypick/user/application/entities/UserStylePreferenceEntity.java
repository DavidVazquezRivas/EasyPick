package es.uib.easypick.user.application.entities;

import es.uib.easypick.garment.application.entities.StyleEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "user_style_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserStylePreferenceEntity {

    @EmbeddedId
    private UserStylePreferenceId id = new UserStylePreferenceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("styleId")
    @JoinColumn(name = "style_id")
    private StyleEntity style;

    @Column(name = "score", columnDefinition = "integer default 0")
    private Integer score = 0;

    public UserStylePreferenceEntity(UserEntity user, StyleEntity style, Integer score) {
        this.user = user;
        this.style = style;
        this.score = score != null ? score : 0;
        this.id = new UserStylePreferenceId(user.getId(), style.getId());
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
    public static class UserStylePreferenceId implements Serializable {
        @Column(name = "user_id")
        private UUID userId;

        @Column(name = "style_id")
        private UUID styleId;
    }
}