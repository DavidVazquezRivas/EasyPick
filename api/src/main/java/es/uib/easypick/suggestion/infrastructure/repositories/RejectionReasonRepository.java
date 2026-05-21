package es.uib.easypick.suggestion.infrastructure.repositories;

import es.uib.easypick.suggestion.application.entities.RejectionReasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface RejectionReasonRepository extends JpaRepository<RejectionReasonEntity, UUID> {
	List<RejectionReasonEntity> findAllByOrderByNameAsc();
}

