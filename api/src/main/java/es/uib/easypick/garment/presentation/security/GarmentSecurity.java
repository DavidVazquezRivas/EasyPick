package es.uib.easypick.garment.presentation.security;

import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GarmentSecurity {
    private final GarmentRepository garmentRepository;

    public boolean isOwner(UUID userId, UUID garmentId) {
        if (userId == null || garmentId == null) return false;
        return garmentRepository.existsByIdAndUserId(garmentId, userId);
    }
}
