package es.uib.easypick.suggestion.application.entities;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "garment_suggestions")
@Getter
@Setter
@NoArgsConstructor
public class GarmentSuggestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggestion_id", nullable = false)
    private SuggestionEntity suggestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garment_id", nullable = false)
    private GarmentEntity garment;

    public GarmentSuggestionEntity(SuggestionEntity suggestion, GarmentEntity garment) {
        this.suggestion = suggestion;
        this.garment = garment;
    }
}