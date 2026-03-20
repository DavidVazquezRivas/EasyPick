package es.uib.easypick.core.infrastructure.gateway.storage.s3;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.infrastructure.gateway.storage.StorageGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Component
public class S3StorageGateway implements StorageGateway {

    private final S3Client s3Client;
    private final String bucketName;
    private final String endpointUrl;
    private final String publicUrl;

    public S3StorageGateway(
            S3Client s3Client,
            @Value("${cloud.aws.s3.endpoint}") String endpoint,
            @Value("${cloud.aws.s3.public-url}") String publicUrl,
            @Value("${cloud.aws.s3.bucket-name}") String bucketName) {

        this.bucketName = bucketName;
        this.endpointUrl = endpoint;
        this.publicUrl = publicUrl;
        this.s3Client = s3Client;
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = StringUtils.hasText(originalFilename) &&
                        StringUtils.hasText(StringUtils.getFilenameExtension(originalFilename))
                    ? StringUtils.getFilenameExtension(originalFilename)
                    : "jpg"; // Default to jpg if no extension is found

            String fileName = "%s.%s".formatted(UUID.randomUUID(), extension);

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return UriComponentsBuilder.fromUriString(publicUrl)
                    .pathSegment(bucketName, fileName)
                    .build()
                    .toUriString();
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR);
        }
    }
}
