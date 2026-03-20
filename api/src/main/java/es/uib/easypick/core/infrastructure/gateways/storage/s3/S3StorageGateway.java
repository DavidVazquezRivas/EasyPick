package es.uib.easypick.core.infrastructure.gateways.storage.s3;

import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

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
}
