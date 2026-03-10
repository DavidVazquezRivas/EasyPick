package es.uib.easypick.garment.repositories;

import es.uib.easypick.garment.entities.GarmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GarmentRepository extends JpaRepository<GarmentEntity, UUID> {
    // Query: SELECT * FROM garments WHERE user_id = :id ORDER BY updated_at DESC
    List<GarmentEntity> findByUserIdOrderByUpdatedAtDesc(UUID id);
}
