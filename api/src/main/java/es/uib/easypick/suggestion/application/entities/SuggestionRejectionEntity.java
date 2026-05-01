package es.uib.easypick.suggestion.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "suggestion_rejections")
@Getter
@Setter
@NoArgsConstructor
public class SuggestionRejectionEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggestion_id", nullable = false)
    private SuggestionEntity suggestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejection_reason_id")
    private RejectionReasonEntity reason;

    @Column(name = "custom_reason", columnDefinition = "TEXT")
    private String customReason;

    public SuggestionRejectionEntity(SuggestionEntity suggestion, RejectionReasonEntity reason, String customReason) {
        this.suggestion = suggestion;
        this.reason = reason;
        this.customReason = customReason;
    }
}