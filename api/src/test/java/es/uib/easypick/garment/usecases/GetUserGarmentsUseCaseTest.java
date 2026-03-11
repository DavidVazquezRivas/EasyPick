package es.uib.easypick.garment.usecases;

import es.uib.easypick.garment.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.garment.entities.GarmentEntity;
import es.uib.easypick.garment.repositories.GarmentRepository;
import es.uib.easypick.user.entities.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import es.uib.easypick.garment.helpers.GarmentTestBuilder;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetUserGarmentsUseCaseTest {

    @Mock
    private GarmentRepository repository;

    @InjectMocks
    private GetUserGarmentsUseCase useCase;

    private UUID userId;
    private UserEntity mockUser;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        // We create a basic mock user to assign to our garments
        mockUser = new UserEntity();
        mockUser.setId(userId);
    }

    @Test
    void execute_ShouldReturnMappedGarments_WhenUserHasGarments() {
        GarmentEntity winterJacket = GarmentTestBuilder
                .aGarment()
                .withName("Winter Jacket")
                .withUser(mockUser)
                .build();

        GarmentEntity summerShorts = GarmentTestBuilder
                .aGarment()
                .withName("Summer Shorts")
                .withUser(mockUser)
                .build();

        List<GarmentEntity> repositoryResult = List.of(winterJacket, summerShorts);

        // Mock the repository behavior
        when(repository.findByUserIdOrderByUpdatedAtDesc(userId)).thenReturn(repositoryResult);

        // Act
        List<SimpleGarmentResponse> result = useCase.execute(userId);

        // Assert
        assertNotNull(result, "The returned list should never be null");
        assertEquals(2, result.size(), "The size of the response list should match the entity list");

        assertEquals("Winter Jacket", result.get(0).name(), "The first garment name should be mapped correctly");
        assertEquals("Summer Shorts", result.get(1).name(), "The second garment name should be mapped correctly");

        // Verify repository interaction
        verify(repository, times(1)).findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Test
    void execute_ShouldReturnEmptyList_WhenUserHasNoGarments() {
        // Arrange
        when(repository.findByUserIdOrderByUpdatedAtDesc(userId)).thenReturn(Collections.emptyList());

        // Act
        List<SimpleGarmentResponse> result = useCase.execute(userId);

        // Assert
        assertNotNull(result, "Even if there are no garments, it should return an empty list, not null");
        assertTrue(result.isEmpty(), "The returned list should be empty");

        // Verify repository interaction
        verify(repository, times(1)).findByUserIdOrderByUpdatedAtDesc(userId);
    }
}