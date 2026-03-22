package es.uib.easypick.garment.presentation.security;

import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GarmentSecurityTest {

    @Mock
    private GarmentRepository garmentRepository;

    @InjectMocks
    private GarmentSecurity garmentSecurity;

    private UUID userId;
    private UUID garmentId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        garmentId = UUID.randomUUID();
    }

    @Test
    void isOwner_shouldReturnFalse_whenUserIdIsNull() {
        // Act
        boolean result = garmentSecurity.isOwner(null, garmentId);

        // Assert
        assertFalse(result, "Should return false if user ID is null");
        verifyNoInteractions(garmentRepository); // Fast fail check
    }

    @Test
    void isOwner_shouldReturnFalse_whenGarmentIdIsNull() {
        // Act
        boolean result = garmentSecurity.isOwner(userId, null);

        // Assert
        assertFalse(result, "Should return false if garment ID is null");
        verifyNoInteractions(garmentRepository);
    }

    @Test
    void isOwner_shouldReturnTrue_whenRepositoryReturnsTrue() {
        // Arrange
        when(garmentRepository.existsByIdAndUserId(garmentId, userId)).thenReturn(true);

        // Act
        boolean result = garmentSecurity.isOwner(userId, garmentId);

        // Assert
        assertTrue(result, "Should return true if repository confirms ownership");
        verify(garmentRepository).existsByIdAndUserId(garmentId, userId);
    }

    @Test
    void isOwner_shouldReturnFalse_whenRepositoryReturnsFalse() {
        // Arrange
        when(garmentRepository.existsByIdAndUserId(garmentId, userId)).thenReturn(false);

        // Act
        boolean result = garmentSecurity.isOwner(userId, garmentId);

        // Assert
        assertFalse(result, "Should return false if repository denies ownership");
        verify(garmentRepository).existsByIdAndUserId(garmentId, userId);
    }
}