package es.uib.easypick.garment.application.entities;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.helpers.ColorTestBuilder;
import es.uib.easypick.user.application.entities.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class GarmentEntityTest {

    private GarmentEntity garment;
    private ColorEntity mockColor;

    @BeforeEach
    void setUp() {
        garment = new GarmentEntity();

        mockColor = ColorTestBuilder.aColor().withName("Red").build();
    }

    //region --- addColor() Tests ---

    @Test
    void addColor_ShouldAddBidirectionally_WhenColorIsValid() {
        // Act
        garment.addColor(mockColor);

        // Assert
        assertTrue(garment.getColors().contains(mockColor), "The garment should contain the color");
        assertTrue(mockColor.getGarments().contains(garment), "The color should contain the garment (bidirectional)");
    }

    @Test
    void addColor_ShouldThrowAppException_WhenColorIsNull() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            garment.addColor(null);
        });

        assertEquals(ErrorCode.BAD_REQUEST, exception.getErrorCode());
        assertEquals("color cannot be null", exception.getMessage());
    }

    //endregion

    //region --- removeColor() Tests ---

    @Test
    void removeColor_ShouldRemoveBidirectionally_WhenColorExists() {
        // Arrange
        garment.addColor(mockColor);

        // Act
        garment.removeColor(mockColor);

        // Assert
        assertFalse(garment.getColors().contains(mockColor), "The garment should not contain the color anymore");
        assertFalse(mockColor.getGarments().contains(garment), "The color should not contain the garment anymore");
    }

    @Test
    void removeColor_ShouldThrowAppException_WhenColorIsNull() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            garment.removeColor(null);
        });

        assertEquals(ErrorCode.BAD_REQUEST, exception.getErrorCode());
    }

    //endregion

    //region --- delete() Tests ---

    @Test
    void delete_ShouldSetStatusToDeletedAndImageUrlToNull() {
        // Arrange
        garment.setStatus(GarmentStatus.PENDING);
        garment.setImageUrl("https://example.com/jacket.jpg");

        // Act
        garment.delete();

        // Assert
        assertEquals(GarmentStatus.DELETED, garment.getStatus(), "The garment status should be updated to DELETED");
        assertNull(garment.getImageUrl(), "The image URL should be set to null to free up storage references");
    }

    //endregion

    //region --- confirm() Tests ---

    @Test
    void confirm_ShouldSetStatusToConfirmed() {
        // Arrange
        garment.setStatus(GarmentStatus.PENDING);

        // Act
        garment.confirm();

        // Assert
        assertEquals(GarmentStatus.CONFIRMED, garment.getStatus(), "The garment status should be updated to CONFIRMED");
    }

    //endregion

    //region --- createPendingClassification() Tests ---

    @Test
    void createPendingClassification_ShouldInitializeCorrectly_WhenUserIsProvided() {
        // Arrange
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        String imageUrl = "https://example.com/jacket.jpg";

        // Act
        GarmentEntity newGarment = GarmentEntity.createPendingClassification(user, imageUrl);

        // Assert
        assertEquals(user, newGarment.getUser(), "User should be assigned");
        assertEquals(imageUrl, newGarment.getImageUrl(), "Image URL should be assigned");
        assertEquals("This garment is pending classification. Please provide details to complete it.", newGarment.getDescription());
        assertEquals(0, newGarment.getWarmthIndex());
        assertEquals(0, newGarment.getPreferenceScore());
    }

    @Test
    void createPendingClassification_ShouldInitializeCorrectly_WhenUserIsNull() {
        // Arrange (Test for specific business rule regarding ads/global garments)
        String imageUrl = "https://example.com/global-ad-jacket.jpg";

        // Act
        GarmentEntity newGarment = GarmentEntity.createPendingClassification(null, imageUrl);

        // Assert
        assertNull(newGarment.getUser(), "User should be null for garments without an owner");
        assertEquals(imageUrl, newGarment.getImageUrl());
    }

    //endregion
}