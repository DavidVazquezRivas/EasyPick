package es.uib.easypick.user.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.garment.application.entities.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserColorPreferenceEntity> colorPreferences = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserBrandPreferenceEntity> brandPreferences = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserStylePreferenceEntity> stylePreferences = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserCategoryPreferenceEntity> categoryPreferences = new HashSet<>();

    //endregion

    //region Domain Logic and Business Rules

    public static UserEntity create(String name, String email) {
        return UserEntity.builder()
                .name(name)
                .email(email)
                .colorPreferences(new HashSet<>())
                .brandPreferences(new HashSet<>())
                .stylePreferences(new HashSet<>())
                .categoryPreferences(new HashSet<>())
                .build();
    }

    public void initializePreferences(
            List<ColorEntity> colors,
            List<BrandEntity> brands,
            List<StyleEntity> styles,
            List<CategoryEntity> categories
    ) {
        colors.forEach(color -> this.colorPreferences.add(new UserColorPreferenceEntity(this, color, 0)));
        brands.forEach(brand -> this.brandPreferences.add(new UserBrandPreferenceEntity(this, brand, 0)));
        styles.forEach(style -> this.stylePreferences.add(new UserStylePreferenceEntity(this, style, 0)));
        categories.forEach(category -> this.categoryPreferences.add(new UserCategoryPreferenceEntity(this, category, 0)));
    }

    //endregion
}
