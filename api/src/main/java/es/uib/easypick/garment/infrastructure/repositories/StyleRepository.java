package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.StyleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StyleRepository extends JpaRepository<StyleEntity, UUID> {
}
