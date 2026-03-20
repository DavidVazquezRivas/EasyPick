package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.infrastructure.gateway.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddUserGarmentUseCaseTest {

    @Mock
    private GarmentRepository garmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StorageGateway storageGateway;

    @InjectMocks
    private AddUserGarmentUseCase useCase;

    private UUID userId;
    private UserEntity mockUser;
    private MockMultipartFile mockFile;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        mockUser = new UserEntity();
        mockUser.setId(userId);

        mockFile = new MockMultipartFile(
                "file", "tshirt.jpg", "image/jpeg", "dummy image content".getBytes()
        );
    }

    @Test
    void execute_ShouldUploadImageAndSaveGarment_WhenUserExists() {
        // Arrange
        String MOCK_IMAGE_URL = "https://s3.amazonaws.com/bucket/image.jpg";
        GarmentEntity savedGarment = new GarmentEntity();
        savedGarment.setId(UUID.randomUUID());
        savedGarment.setName("Prenda por clasificar");
        savedGarment.setImageUrl(MOCK_IMAGE_URL);
        savedGarment.setCreatedAt(OffsetDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(storageGateway.uploadImage(mockFile)).thenReturn(MOCK_IMAGE_URL);

        // Mock the save method
        when(garmentRepository.save(any(GarmentEntity.class))).thenReturn(savedGarment);

        // Act
        SimpleGarmentResponse response = useCase.execute(userId, mockFile);

        // Assert
        assertNotNull(response, "The response should not be null");
        assertEquals("Prenda por clasificar", response.name());
        assertEquals(MOCK_IMAGE_URL, response.imageUrl());

        // Verify interactions
        verify(userRepository, times(1)).findById(userId);
        verify(storageGateway, times(1)).uploadImage(mockFile);
        verify(garmentRepository, times(1)).save(any(GarmentEntity.class));
    }

    @Test
    void execute_ShouldThrowAppException_WhenUserDoesNotExist() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            useCase.execute(userId, mockFile);
        });

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());

        // Verify that we NEVER upload the image or save the garment if user is invalid
        verify(storageGateway, never()).uploadImage(any());
        verify(garmentRepository, never()).save(any());
    }
}