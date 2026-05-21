package es.uib.easypick.user.infrastructure.repositories;

import es.uib.easypick.user.application.entities.UserCategoryPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCategoryPreferenceRepository
        extends JpaRepository<UserCategoryPreferenceEntity, UserCategoryPreferenceEntity.UserCategoryPreferenceId> {

    Optional<UserCategoryPreferenceEntity> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
}