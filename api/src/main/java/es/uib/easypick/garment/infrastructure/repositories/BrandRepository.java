package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BrandRepository extends JpaRepository<BrandEntity, UUID> {
}
