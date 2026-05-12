package es.uib.easypick.suggestion.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rejection_reasons")
@Getter
@Setter
@NoArgsConstructor
public class RejectionReasonEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;
}