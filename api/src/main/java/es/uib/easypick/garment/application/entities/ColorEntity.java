package es.uib.easypick.garment.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "colors")
@Getter
@Setter
@NoArgsConstructor
public class ColorEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 7, name="hex_code")
    private String hexCode;

    @ManyToMany(mappedBy = "colors", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<GarmentEntity> garments = new HashSet<>();
}
