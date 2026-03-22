package es.uib.easypick.core.infrastructure.gateways.storage.s3;

import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
public class S3StorageGateway implements StorageGateway {

    private final S3Client s3Client;
    private final String bucketName;
    private final String publicUrl;

    public S3StorageGateway(
            S3Client s3Client,
            @Value("${cloud.aws.s3.public-url}") String publicUrl,
            @Value("${cloud.aws.s3.bucket-name}") String bucketName) {

        this.bucketName = bucketName;
        this.publicUrl = publicUrl;
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(byte[] content, String originalFilename, String contentType) {
        String extension = FilenameUtils.getExtension(originalFilename);

        String fileName = "%s.%s".formatted(UUID.randomUUID(), extension);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(contentType)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(content));

        return UriComponentsBuilder.fromUriString(publicUrl)
                .pathSegment(bucketName, fileName)
                .build()
                .toUriString();
    }

    @Override
    public void deleteFilesBatch(List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) return;

        List<ObjectIdentifier> keysToDelete = fileUrls.stream()
                .filter(Objects::nonNull)
                .map(this::extractKeyFromUrl)
                .map(key -> ObjectIdentifier.builder().key(key).build())
                .toList();

        if (keysToDelete.isEmpty()) return;

        Delete deleteAction = Delete.builder()
                .objects(keysToDelete)
                .quiet(true)
                .build();

        DeleteObjectsRequest deleteObjectsRequest = DeleteObjectsRequest.builder()
                .bucket(bucketName)
                .delete(deleteAction)
                .build();
        
        s3Client.deleteObjects(deleteObjectsRequest);
    }

    private String extractKeyFromUrl(String imageUrl) {
        try {
            // Parse url in a safe way to ignore host
            URI uri = new URI(imageUrl);
            String path = uri.getPath();

            if (path == null || path.isEmpty()) {
                return imageUrl;
            }

            // Clean initial slash ("/easypick-images/..." -> "easypick-images/...")
            if (path.startsWith("/")) {
                path = path.substring(1);
            }

            // Case 1: MinIO/Local Format (Path-style) - E.g., localhost:9000/easypick-images/photo.jpg
            String bucketPrefix = bucketName + "/";
            if (path.startsWith(bucketPrefix)) {
                return path.substring(bucketPrefix.length());
            }

            // Case 2: AWS Production Format (Virtual-hosted style) - E.g., easypick-images.s3.amazonaws.com/photo.jpg
            return path;

        } catch (URISyntaxException e) {
            // Fallback, hard lookup for bucket name
            int index = imageUrl.indexOf(bucketName + "/");
            if (index != -1) {
                return imageUrl.substring(index + bucketName.length() + 1);
            }

            return imageUrl;
        }
    }
}
