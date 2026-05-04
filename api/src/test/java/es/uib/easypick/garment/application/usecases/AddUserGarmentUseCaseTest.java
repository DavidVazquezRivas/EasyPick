package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.GarmentProcessorResponseItemTestBuilder;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.application.mappers.GarmentProcessorResponseMapper;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorGateway;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponseItem;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddUserGarmentUseCaseTest {

    @Mock
    private GarmentRepository garmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GarmentProcessorGateway garmentProcessorGateway;

    @Mock
    private StorageGateway storageGateway;

    @Mock
    private GarmentProcessorResponseMapper mapper;

    @InjectMocks
    private AddUserGarmentUseCase useCase;

    @Captor
    private ArgumentCaptor<List<GarmentEntity>> garmentListCaptor;

    private UUID userId;
    private UserEntity mockUser;
    private MockMultipartFile mockFile;
    private String base64EncodedImage;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        mockUser = new UserEntity();
        mockUser.setId(userId);

        byte[] rawImageBytes = "dummy image content".getBytes();
        mockFile = new MockMultipartFile(
                "file", "outfit.jpg", "image/jpeg", rawImageBytes
        );

        // Simulate the base64 payload returned by the processor
        base64EncodedImage = Base64.getEncoder().encodeToString(rawImageBytes);
    }

    @Test
    void execute_ShouldProcessUploadAndSaveGarments_WhenValidDataProvided() {
        // Arrange
        String mockImageUrl1 = "https://s3.amazonaws.com/bucket/garment_1.jpg";
        String mockImageUrl2 = "https://s3.amazonaws.com/bucket/garment_2.jpg";

        GarmentProcessorResponseItem responseItem1 = GarmentProcessorResponseItemTestBuilder
                .aGarmentProcessorResponseItem()
                .build();
        GarmentProcessorResponseItem responseItem2 = GarmentProcessorResponseItemTestBuilder
                .aGarmentProcessorResponseItem()
                .build();

        GarmentProcessorResponse mockedResponse = new GarmentProcessorResponse(List.of(responseItem1, responseItem2));

        // Utilize the Test Data Builder for cleaner instantiation
        GarmentEntity savedGarment1 = GarmentTestBuilder.aGarment()
                .withName("Pending Classification")
                .withImageUrl(mockImageUrl1)
                .withUser(mockUser)
                .build();

        GarmentEntity savedGarment2 = GarmentTestBuilder.aGarment()
                .withName("Pending Classification")
                .withImageUrl(mockImageUrl2)
                .withUser(mockUser)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(garmentProcessorGateway.processImage(mockFile)).thenReturn(mockedResponse);

        // Simulate StorageGateway returning different URLs for consecutive calls
        when(storageGateway.uploadFile(any(byte[].class), anyString(), eq("image/jpeg")))
                .thenReturn(mockImageUrl1)
                .thenReturn(mockImageUrl2);

        // Mock saveAll to return the builder-generated entities
        when(garmentRepository.saveAll(anyList())).thenReturn(List.of(savedGarment1, savedGarment2));

        when(mapper.toEntity(any(), any(), any()))
                .thenAnswer(invocation -> {
                    UserEntity user = invocation.getArgument(1);

                    return GarmentTestBuilder.aGarment()
                            .withName("Pending Classification")
                            .withUser(user)
                            .build();
                });

        // Act
        List<CompleteGarmentResponse> response = useCase.execute(userId, mockFile);

        // Assert
        assertNotNull(response);
        assertEquals(2, response.size(), "Should return exactly two mapped garments");

        assertEquals(mockImageUrl1, response.get(0).imageUrl());
        assertEquals("Pending Classification", response.get(0).name());
        assertEquals(mockImageUrl2, response.get(1).imageUrl());

        // Verify interactions and capture the list sent to the database
        verify(userRepository, times(1)).findById(userId);
        verify(garmentProcessorGateway, times(1)).processImage(mockFile);
        verify(storageGateway, times(2)).uploadFile(any(byte[].class), anyString(), eq("image/jpeg"));
        verify(garmentRepository, times(1)).saveAll(garmentListCaptor.capture());

        List<GarmentEntity> capturedGarments = garmentListCaptor.getValue();
        assertEquals(2, capturedGarments.size(), "Should save exactly two entities in batch");
        assertEquals(mockUser, capturedGarments.getFirst().getUser(), "The user should be assigned correctly prior to saving");
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

        // Verify that we NEVER process the image, upload, or save if user is invalid
        verify(garmentProcessorGateway, never()).processImage(any());
        verify(storageGateway, never()).uploadFile(any(), anyString(), anyString());
        verify(garmentRepository, never()).saveAll(anyList());
    }

    @Test
    void execute_ShouldThrowAppException_WhenNoGarmentsDetected() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        // The processor returns an empty list (no garments found in the photo)
        when(garmentProcessorGateway.processImage(mockFile)).thenReturn(new GarmentProcessorResponse(List.of()));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            useCase.execute(userId, mockFile);
        });

        assertEquals(ErrorCode.NO_GARMENT_DETECTED, exception.getErrorCode());

        // Verify that we NEVER try to upload empty data or save to DB
        verify(storageGateway, never()).uploadFile(any(), anyString(), anyString());
        verify(garmentRepository, never()).saveAll(anyList());
    }
}