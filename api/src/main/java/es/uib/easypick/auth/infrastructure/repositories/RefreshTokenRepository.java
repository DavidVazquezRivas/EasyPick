package es.uib.easypick.auth.infrastructure.repositories;

import es.uib.easypick.auth.application.entities.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
}
