package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeletePendingGarmentsUseCaseTest {

    @Mock
    private GarmentRepository garmentRepository;

    @Mock
    private StorageGateway storageGateway;

    private DeletePendingGarmentsUseCase useCase;

    @Captor
    private ArgumentCaptor<List<String>> urlsListCaptor;

    @Captor
    private ArgumentCaptor<List<GarmentEntity>> garmentListCaptor;

    private final Duration RETENTION_TIME = Duration.ofHours(1);

    @BeforeEach
    void setUp() {
        // Instantiate manually to properly pass the Duration value
        useCase = new DeletePendingGarmentsUseCase(garmentRepository, storageGateway, RETENTION_TIME);
    }

    @Test
    void execute_ShouldProcessAndDeleteGarments_WhenExpiredGarmentsExist() {
        // Arrange
        String mockImageUrl1 = "https://s3.amazonaws.com/bucket/garment_1.jpg";
        String mockImageUrl2 = "https://s3.amazonaws.com/bucket/garment_2.jpg";

        GarmentEntity expiredGarment1 = GarmentTestBuilder.aGarment()
                .withName("Pending Garment 1")
                .withImageUrl(mockImageUrl1)
                .build();
        expiredGarment1.setStatus(GarmentStatus.PENDING);

        GarmentEntity expiredGarment2 = GarmentTestBuilder.aGarment()
                .withName("Pending Garment 2")
                .withImageUrl(mockImageUrl2)
                .build();
        expiredGarment2.setStatus(GarmentStatus.PENDING);

        List<GarmentEntity> expiredGarments = List.of(expiredGarment1, expiredGarment2);

        // Mock the repository to return our expired garments
        when(garmentRepository.findByStatusAndCreatedAtBefore(eq(GarmentStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(expiredGarments);

        // Act
        useCase.execute();

        // Assert
        // 1. Verify that StorageGateway was called with the correct URLs
        verify(storageGateway, times(1)).deleteFilesBatch(urlsListCaptor.capture());
        List<String> capturedUrls = urlsListCaptor.getValue();
        assertEquals(2, capturedUrls.size(), "Should send exactly two URLs to the storage gateway");
        assertTrue(capturedUrls.contains(mockImageUrl1));
        assertTrue(capturedUrls.contains(mockImageUrl2));

        // 2. Verify that GarmentRepository saved the updated entities
        verify(garmentRepository, times(1)).saveAll(garmentListCaptor.capture());
        List<GarmentEntity> capturedGarments = garmentListCaptor.getValue();
        assertEquals(2, capturedGarments.size(), "Should save exactly two entities in batch");

        // 3. Verify that the entities' domain method delete() was executed properly
        GarmentEntity savedGarment1 = capturedGarments.getFirst();
        assertEquals(GarmentStatus.DELETED, savedGarment1.getStatus(), "Status should be updated to DELETED");
        assertNull(savedGarment1.getImageUrl(), "Image URL should be nullified after deletion");

        GarmentEntity savedGarment2 = capturedGarments.get(1);
        assertEquals(GarmentStatus.DELETED, savedGarment2.getStatus(), "Status should be updated to DELETED");
        assertNull(savedGarment2.getImageUrl(), "Image URL should be nullified after deletion");
    }

    @Test
    void execute_ShouldDoNothing_WhenNoExpiredGarmentsExist() {
        // Arrange
        when(garmentRepository.findByStatusAndCreatedAtBefore(eq(GarmentStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(List.of());

        // Act
        useCase.execute();

        // Assert
        // Verify that we NEVER call the storage gateway or the repository save method
        verify(storageGateway, never()).deleteFilesBatch(anyList());
        verify(garmentRepository, never()).saveAll(anyList());
    }
}