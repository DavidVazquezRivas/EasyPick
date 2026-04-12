package es.uib.easypick.garment.infrastructure.repositories;

import es.uib.easypick.garment.application.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {
	Optional<CategoryEntity> findByNameIgnoreCase(String name);
}
