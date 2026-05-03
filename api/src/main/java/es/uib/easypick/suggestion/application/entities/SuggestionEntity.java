package es.uib.easypick.suggestion.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.user.application.entities.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "suggestions")
@Getter
@Setter
@NoArgsConstructor
public class SuggestionEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    private SuggestionStatus status = SuggestionStatus.PENDING;

    @Column(name = "generated_at")
    private OffsetDateTime generatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "suggestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GarmentSuggestionEntity> garmentSuggestions = new HashSet<>();

    @OneToOne(mappedBy = "suggestion", cascade = CascadeType.ALL)
    private SuggestionRejectionEntity rejection;

    /*
       @ManyToOne(fetch = FetchType.LAZY)
       @JoinColumn(name = "context_id")
       private ContextEntity context;
    */

    //region Domain Logic
    public void accept() {
        this.status = SuggestionStatus.ACCEPTED;
    }

    public void reject(RejectionReasonEntity reason, String customReason) {
        this.status = SuggestionStatus.REJECTED;
        this.rejection = new SuggestionRejectionEntity(this, reason, customReason);
    }

    public void toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
    //endregion
}