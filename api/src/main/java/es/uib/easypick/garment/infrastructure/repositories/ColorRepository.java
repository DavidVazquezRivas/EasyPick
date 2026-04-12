package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.ColorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ColorRepository extends JpaRepository<ColorEntity, UUID> {
	Optional<ColorEntity> findByNameIgnoreCase(String name);
}
