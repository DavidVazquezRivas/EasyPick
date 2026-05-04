package es.uib.easypick.user.application.entities;

import es.uib.easypick.garment.application.entities.ColorEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "user_color_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserColorPreferenceEntity {

    @EmbeddedId
    private UserColorPreferenceId id = new UserColorPreferenceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("colorId")
    @JoinColumn(name = "color_id")
    private ColorEntity color;

    @Column(name = "score", columnDefinition = "integer default 0")
    private Integer score = 0;

    public UserColorPreferenceEntity(UserEntity user, ColorEntity color, Integer score) {
        this.user = user;
        this.color = color;
        this.score = score != null ? score : 0;
        this.id = new UserColorPreferenceId(user.getId(), color.getId());
    }

    public void updateScore(Integer newScore) {
        this.score = newScore;
    }

    // --- Embedded ID Class ---
    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class UserColorPreferenceId implements Serializable {
        @Column(name = "user_id")
        private UUID userId;

        @Column(name = "color_id")
        private UUID colorId;
    }
}