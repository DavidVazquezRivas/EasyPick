package es.uib.easypick.user.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserEntity extends BaseEntity {

    //region JPA Configuration

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String email;

    // Persist and update on cascade, manually hand remove
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<GarmentEntity> garments = new ArrayList<>();

    @PreRemove
    private void preRemove() {
        garments.forEach(garment -> garment.setUser(null));
    }

    //endregion

    //region Domain Logic and Business Rules

    public static UserEntity create(String name, String email) {
        return UserEntity.builder()
                .name(name)
                .email(email)
                .build();
    }

    //endregion
}
