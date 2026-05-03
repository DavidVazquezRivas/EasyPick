package es.uib.easypick.user.infrastructure.repositories;

import es.uib.easypick.user.application.entities.UserStylePreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserStylePreferenceRepository
        extends JpaRepository<UserStylePreferenceEntity, UserStylePreferenceEntity.UserStylePreferenceId> {

    Optional<UserStylePreferenceEntity> findByUserIdAndStyleId(UUID userId, UUID styleId);
}