package es.uib.easypick.garment.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "styles")
@Getter
@Setter
@NoArgsConstructor
public class StyleEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;
}
