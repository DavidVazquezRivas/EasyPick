package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.application.entities.ColorEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.application.usecases.GetUserGarmentsFilters;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetUserGarmentsUseCase {

    private final GarmentRepository repository;

    @Transactional(readOnly = true)
    public List<SimpleGarmentResponse> execute(UUID userId, GetUserGarmentsFilters filters) {
        Specification<GarmentEntity> specification = buildSpecification(userId, filters);

        return repository.findAll(specification, Sort.by(Sort.Direction.DESC, "updatedAt"))
                .stream()
                .map(SimpleGarmentResponse::fromEntity)
                .toList();
    }

    private static Specification<GarmentEntity> buildSpecification(UUID userId, GetUserGarmentsFilters filters) {
        Specification<GarmentEntity> spec = Specification
                .where(userIdEquals(userId))
                .and(statusEquals(GarmentStatus.CONFIRMED));

        if (filters.search() != null && !filters.search().isBlank()) {
            spec = spec.and(searchLike(filters.search()));
        }

        List<UUID> categoryIds = parseUuidList(filters.categoryIds());
        if (!categoryIds.isEmpty()) {
            spec = spec.and(categoryIdsIn(categoryIds));
        }

        List<UUID> styleIds = parseUuidList(filters.styleIds());
        if (!styleIds.isEmpty()) {
            spec = spec.and(styleIdsIn(styleIds));
        }

        List<UUID> colorIds = parseUuidList(filters.colorIds());
        if (!colorIds.isEmpty()) {
            spec = spec.and(colorIdsIn(colorIds));
        }

        return spec;
    }

    private static List<UUID> parseUuidList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }

        List<UUID> parsed = new ArrayList<>(values.size());
        for (String value : values) {
            if (value == null || value.isBlank()) {
                continue;
            }

            try {
                parsed.add(UUID.fromString(value.trim()));
            } catch (IllegalArgumentException ignored) {
                // Ignore invalid UUID values so one bad param doesn't break the request.
            }
        }

        return parsed;
    }

    private static Specification<GarmentEntity> userIdEquals(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    private static Specification<GarmentEntity> statusEquals(GarmentStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<GarmentEntity> searchLike(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";

        return (root, query, cb) -> {
            query.distinct(true);
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(cb.coalesce(root.get("description"), "")), pattern)
            );
        };
    }

    private static Specification<GarmentEntity> categoryIdsIn(List<UUID> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return null;
        }

        return (root, query, cb) -> root.get("category").get("id").in(categoryIds);
    }

    private static Specification<GarmentEntity> styleIdsIn(List<UUID> styleIds) {
        if (styleIds == null || styleIds.isEmpty()) {
            return null;
        }

        return (root, query, cb) -> root.get("style").get("id").in(styleIds);
    }

    private static Specification<GarmentEntity> colorIdsIn(List<UUID> colorIds) {
        if (colorIds == null || colorIds.isEmpty()) {
            return null;
        }

        return (root, query, cb) -> {
            query.distinct(true);
            Join<GarmentEntity, ColorEntity> colors = root.join("colors", JoinType.LEFT);
            return colors.get("id").in(colorIds);
        };
    }
}
