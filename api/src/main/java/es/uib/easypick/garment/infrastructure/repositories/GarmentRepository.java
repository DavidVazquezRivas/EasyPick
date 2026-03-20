package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GarmentRepository extends JpaRepository<GarmentEntity, UUID> {

    List<GarmentEntity> findByUserIdOrderByUpdatedAtDesc(UUID id);

    @EntityGraph(value = "Garment.withAllDetails", type = EntityGraph.EntityGraphType.FETCH)
    List<GarmentEntity> findWithDetailsByUserIdOrderByUpdatedAtDesc(UUID id);
}
