package es.uib.easypick.user.infrastructure.repositories;

import es.uib.easypick.user.application.entities.UserBrandPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBrandPreferenceRepository
        extends JpaRepository<UserBrandPreferenceEntity, UserBrandPreferenceEntity.UserBrandPreferenceId> {

    Optional<UserBrandPreferenceEntity> findByUserIdAndBrandId(UUID userId, UUID brandId);
}