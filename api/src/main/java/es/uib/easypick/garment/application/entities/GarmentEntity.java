package es.uib.easypick.garment.application.entities;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.user.application.entities.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "garments")
@Getter
@Setter
@NoArgsConstructor
// Name entity graph to optimize fetching a garment with all its related details in a single query when needed
@NamedEntityGraph(
        name = "Garment.withAllDetails",
        attributeNodes = {
                @NamedAttributeNode("user"),
                @NamedAttributeNode("colors"),
                @NamedAttributeNode("brand"),
                @NamedAttributeNode("style"),
                @NamedAttributeNode("category")
        }
)
public class GarmentEntity extends BaseEntity {

    //region JPA Configuration

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "warmth_index", columnDefinition = "integer default 0")
    private Integer warmthIndex = 0;

    @Column(name = "preference_score", columnDefinition = "integer default 0")
    private Integer preferenceScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private GarmentStatus status = GarmentStatus.PENDING;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private BrandEntity brand;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id")
    private StyleEntity style;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    // Lazy loading to avoid unnecessary data retrieval when fetching garments
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "garment_colors",
            joinColumns = @JoinColumn(name = "garment_id"),
            inverseJoinColumns = @JoinColumn(name = "color_id")
    )
    private Set<ColorEntity> colors = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    //endregion

    //region Domain Logic and Business Rules
    public void addColor(ColorEntity color) {
        if (color == null) throw new AppException(ErrorCode.BAD_REQUEST, "color cannot be null");

        this.colors.add(color);
        color.getGarments().add(this);
    }

    public void removeColor(ColorEntity color) {
        if (color == null) throw new AppException(ErrorCode.BAD_REQUEST, "color cannot be null");

        this.colors.remove(color);
        color.getGarments().remove(this);
    }

    public void delete() {
        this.status = GarmentStatus.DELETED;
        this.imageUrl = null;
    }

    public void confirm() {
        this.status = GarmentStatus.CONFIRMED;
    }

    public static GarmentEntity createPendingClassification(UserEntity user, String imageUrl) {
        GarmentEntity garment = new GarmentEntity();

        if (user != null) garment.setUser(user);
        garment.setImageUrl(imageUrl);

        garment.setName("Pending Classification");
        garment.setDescription("This garment is pending classification. Please provide details to complete it.");
        garment.setWarmthIndex(0);
        garment.setPreferenceScore(0);

        return garment;
    }
    //endregion

}
