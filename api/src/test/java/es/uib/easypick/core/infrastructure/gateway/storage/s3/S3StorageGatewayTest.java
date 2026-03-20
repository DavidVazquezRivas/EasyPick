package es.uib.easypick.core.infrastructure.gateway.storage.s3;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.mockito.ArgumentMatchers.any;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3StorageGatewayTest {

    @Mock
    private S3Client s3Client;

    @Mock
    private MultipartFile mockFile;

    private S3StorageGateway gateway;

    private final String BUCKET_NAME = "test-bucket";
    private final String PUBLIC_URL = "http://localhost:9000";

    @BeforeEach
    void setUp() {
        String ENDPOINT_URL = "http://minio:9000";
        gateway = new S3StorageGateway(s3Client, ENDPOINT_URL, PUBLIC_URL, BUCKET_NAME);
    }

    private void givenFileWith(String filename, String contentType) throws IOException {
        InputStream stream = new ByteArrayInputStream("dummy data".getBytes());
        when(mockFile.getOriginalFilename()).thenReturn(filename);
        when(mockFile.getContentType()).thenReturn(contentType);
        when(mockFile.getSize()).thenReturn(10L);
        when(mockFile.getInputStream()).thenReturn(stream);
    }

    @Test
    void uploadImage_ShouldReturnFormattedUrl_WhenUploadIsSuccessful() throws IOException {
        // Arrange
        givenFileWith("my-shirt.png", "image/png");

        // Mock S3 response to simulate successful upload
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadImage(mockFile);

        // Assert
        assertNotNull(resultUrl, "The returned URL should not be null");
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"),
                "URL should start with the correct endpoint and bucket format");
        assertTrue(resultUrl.endsWith(".png"), "URL should preserve the original file extension");

        // Verify interaction and capture arguments
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client, times(1)).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, capturedRequest.bucket(), "Should upload to the correct configured bucket");
        assertEquals("image/png", capturedRequest.contentType(), "Should set the correct MIME type in S3");
        assertTrue(capturedRequest.key().endsWith(".png"), "The object key inside S3 should have the correct extension");
    }

    @Test
    void uploadImage_ShouldThrowAppException_WhenFileStreamFails() throws IOException {
        // Arrange
        when(mockFile.getOriginalFilename()).thenReturn("error-image.jpg");
        when(mockFile.getContentType()).thenReturn("image/jpeg");
        when(mockFile.getInputStream()).thenThrow(new IOException("Disk error reading file"));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> gateway.uploadImage(mockFile), "Should propagate " +
                "AppException if reading the file stream fails");

        assertEquals(ErrorCode.UPLOAD_IMAGE_ERROR, exception.getErrorCode());

        // Verify that if the file fails to read, AWS is NEVER called
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void uploadImage_ShouldUseDefaultExtension_WhenFileHasNoExtension() throws IOException {
        // Arrange
        givenFileWith("my-shirt", "image/jpeg"); // sin extensión

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadImage(mockFile);

        // Assert
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"));

        assertTrue(resultUrl.endsWith(".jpg"),
                "Should use default jpg extension when no extension is provided");

        // Verify that the S3 request uses the default extension
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertTrue(capturedRequest.key().endsWith(".jpg"), "S3 key should use default jpg extension");
    }
}