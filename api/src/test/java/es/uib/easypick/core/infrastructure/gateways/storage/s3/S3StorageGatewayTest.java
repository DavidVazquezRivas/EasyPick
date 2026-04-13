package es.uib.easypick.core.infrastructure.gateways.storage.s3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.util.List;

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

    //region --- uploadFile() Tests ---

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
        String originalFilename = "my-shirt"; // no extension
        String contentType = "application/octet-stream";

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadFile(DUMMY_CONTENT, originalFilename, contentType);

        // Assert
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"));

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertFalse(capturedRequest.key().endsWith("."), "S3 key should not end with a trailing dot when there is no extension");
        assertEquals("application/octet-stream", capturedRequest.contentType());
    }

    @Test
    void uploadFile_ShouldHandleNullFilename() {
        // Arrange
        String contentType = "application/octet-stream";

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadFile(DUMMY_CONTENT, null, contentType);

        // Assert
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"));

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertFalse(capturedRequest.key().endsWith("."), "S3 key should not end with a trailing dot when filename is null");
    }

    @Test
    void uploadFile_ShouldHandleBlankFilename() {
        // Arrange
        String contentType = "application/octet-stream";

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // Act
        String resultUrl = gateway.uploadFile(DUMMY_CONTENT, "   ", contentType);

        // Assert
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith(PUBLIC_URL + "/" + BUCKET_NAME + "/"));

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertFalse(capturedRequest.key().endsWith("."), "S3 key should not end with a trailing dot when filename is blank");
    }
    //endregion

    //region --- deleteFilesBatch() Tests ---
    @Test
    void deleteFilesBatch_ShouldNotCallS3_WhenListIsNull() {
        // Act
        gateway.deleteFilesBatch(null);

        // Assert
        verify(s3Client, never()).deleteObjects(any(DeleteObjectsRequest.class));
    }

    @Test
    void deleteFilesBatch_ShouldNotCallS3_WhenListIsEmpty() {
        // Act
        gateway.deleteFilesBatch(java.util.Collections.emptyList());

        // Assert
        verify(s3Client, never()).deleteObjects(any(DeleteObjectsRequest.class));
    }

    @Test
    void deleteFilesBatch_ShouldExtractKeysCorrectly_ForMinioStyleUrls() {
        // Arrange
        String filename1 = "image-1.jpg";
        String filename2 = "image-2.png";

        // Simulating http://localhost:9000/test-bucket/image-1.jpg
        List<String> urls = List.of(
                PUBLIC_URL + "/" + BUCKET_NAME + "/" + filename1,
                PUBLIC_URL + "/" + BUCKET_NAME + "/" + filename2
        );

        // Act
        gateway.deleteFilesBatch(urls);

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client, times(1)).deleteObjects(requestCaptor.capture());

        DeleteObjectsRequest capturedRequest = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, capturedRequest.bucket(), "Should target the correct bucket");
        assertTrue(capturedRequest.delete().quiet(), "Quiet mode should be enabled");

        List<ObjectIdentifier> objectsToDelete = capturedRequest.delete().objects();
        assertEquals(2, objectsToDelete.size(), "Should contain exactly 2 objects to delete");

        // Verify keys were extracted correctly (bucket name should be removed)
        assertEquals(filename1, objectsToDelete.get(0).key());
        assertEquals(filename2, objectsToDelete.get(1).key());
    }

    @Test
    void deleteFilesBatch_ShouldExtractKeysCorrectly_ForAwsVirtualHostedStyleUrls() {
        // Arrange
        String filename1 = "folder/image-1.jpg";

        // Simulating https://test-bucket.s3.eu-west-1.amazonaws.com/folder/image-1.jpg
        String awsRealUrl = "https://" + BUCKET_NAME + ".s3.eu-west-1.amazonaws.com/" + filename1;

        // Act
        gateway.deleteFilesBatch(List.of(awsRealUrl));

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());

        List<ObjectIdentifier> objectsToDelete = requestCaptor.getValue().delete().objects();
        assertEquals(1, objectsToDelete.size());

        // Verify key was extracted correctly (domain should be ignored)
        assertEquals(filename1, objectsToDelete.getFirst().key());
    }

    @Test
    void deleteFilesBatch_ShouldIgnoreNullElementsInList() {
        // Arrange
        String validUrl = PUBLIC_URL + "/" + BUCKET_NAME + "/valid.jpg";

        java.util.List<String> urlsWithNulls = new java.util.ArrayList<>();
        urlsWithNulls.add(validUrl);
        urlsWithNulls.add(null);

        // Act
        gateway.deleteFilesBatch(urlsWithNulls);

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());

        List<ObjectIdentifier> objectsToDelete = requestCaptor.getValue().delete().objects();
        assertEquals(1, objectsToDelete.size(), "Null elements should be filtered out");
        assertEquals("valid.jpg", objectsToDelete.getFirst().key());
    }

    @Test
    void deleteFilesBatch_ShouldTriggerFallback_WhenUriSyntaxIsInvalid() {
        // Arrange
        // An unencoded space makes the URI strictly invalid in Java, forcing a URISyntaxException
        String invalidUri = "http://invalid domain.com/some/path/" + BUCKET_NAME + "/my-key.jpg";

        // Act
        gateway.deleteFilesBatch(List.of(invalidUri));

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());

        List<ObjectIdentifier> objectsToDelete = requestCaptor.getValue().delete().objects();
        assertEquals(1, objectsToDelete.size());

        // The catch block should successfully extract the key using indexOf
        assertEquals("my-key.jpg", objectsToDelete.getFirst().key());
    }

    @Test
    void deleteFilesBatch_ShouldReturnOriginalUrl_WhenPathIsEmptyOrNull() {
        // Arrange
        // A valid URI, but with no path attached
        String urlWithoutPath = "http://localhost:9000";

        // Act
        gateway.deleteFilesBatch(List.of(urlWithoutPath));

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());

        List<ObjectIdentifier> objectsToDelete = requestCaptor.getValue().delete().objects();
        assertEquals(1, objectsToDelete.size());

        // Should return the original string since path is empty
        assertEquals(urlWithoutPath, objectsToDelete.getFirst().key());
    }

    @Test
    void deleteFilesBatch_ShouldReturnOriginalString_WhenUrlIsCompletelyUnrecognized() {
        // Arrange
        // A string that is technically a valid URI path, but doesn't match our bucket logic
        String randomString = "just-a-random-string-without-bucket-name";

        // Act
        gateway.deleteFilesBatch(List.of(randomString));

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());

        List<ObjectIdentifier> objectsToDelete = requestCaptor.getValue().delete().objects();
        assertEquals(1, objectsToDelete.size());

        // Should return the original string as a safe fallback
        assertEquals(randomString, objectsToDelete.getFirst().key());
    }
    //endregion
}