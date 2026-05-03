package es.uib.easypick.user.infrastructure.repositories;

import es.uib.easypick.user.application.entities.UserColorPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserColorPreferenceRepository
        extends JpaRepository<UserColorPreferenceEntity, UserColorPreferenceEntity.UserColorPreferenceId> {

    Optional<UserColorPreferenceEntity> findByUserIdAndColorId(UUID userId, UUID colorId);
}