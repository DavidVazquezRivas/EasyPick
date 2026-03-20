package es.uib.easypick.core.infrastructure.gateways.storage.s3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3StorageGatewayTest {

    @Mock
    private S3Client s3Client;

    private S3StorageGateway gateway;

    private final String BUCKET_NAME = "test-bucket";
    private final String PUBLIC_URL = "http://localhost:9000";
    private final byte[] DUMMY_CONTENT = "dummy data".getBytes();

    @BeforeEach
    void setUp() {
        gateway = new S3StorageGateway(s3Client, PUBLIC_URL, BUCKET_NAME);
    }

    @Test
    void uploadFile_ShouldReturnFormattedUrl_WhenUploadIsSuccessful() {
        // Arrange
        String originalFilename = "my-shirt.png";
        String contentType = "image/png";

        // Mock S3 response to simulate successful upload
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadFile(DUMMY_CONTENT, originalFilename, contentType);

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
    void uploadFile_ShouldHandleFilesWithoutExtension() {
        // Arrange
        String originalFilename = "my-shirt"; // sin extensión
        String contentType = "application/octet-stream";

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadFile(DUMMY_CONTENT, originalFilename, contentType);

        // Assert
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"));

        // Verify that the S3 request works with the current formatting implementation
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        // Nota: Como en tu código haces "%s.%s".formatted(uuid, ""), el archivo terminará con un punto "uuid."
        assertTrue(capturedRequest.key().endsWith("."), "S3 key will end with a dot due to the current string formatting");
        assertEquals("application/octet-stream", capturedRequest.contentType());
    }
}