package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GarmentRepository extends JpaRepository<GarmentEntity, UUID>, JpaSpecificationExecutor<GarmentEntity> {

    List<GarmentEntity> findByUserIdAndStatusOrderByUpdatedAtDesc(UUID id, GarmentStatus status);

    List<GarmentEntity> findByStatusAndCreatedAtBefore(GarmentStatus status, OffsetDateTime createdAt);

    @EntityGraph(value = "Garment.withAllDetails", type = EntityGraph.EntityGraphType.FETCH)
    List<GarmentEntity> findWithDetailsByUserIdAndStatusOrderByUpdatedAtDesc(UUID id, GarmentStatus status);

    @EntityGraph(value = "Garment.withAllDetails", type = EntityGraph.EntityGraphType.FETCH)
    Optional<GarmentEntity> findWithDetailsById(UUID id);

    @EntityGraph(value = "Garment.withAllDetails", type = EntityGraph.EntityGraphType.LOAD)
    List<GarmentEntity> findAll(Specification<GarmentEntity> spec, Sort sort);

    boolean existsByIdAndUserId(UUID garmentId, UUID userId);
}
