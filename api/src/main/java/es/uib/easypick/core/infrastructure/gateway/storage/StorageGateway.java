package es.uib.easypick.core.infrastructure.gateway.storage;

import es.uib.easypick.core.application.exceptions.AppException;
import org.springframework.web.multipart.MultipartFile;

public interface StorageGateway {
    /**
     * Uploads an image file to a storage service and returns the public URL of the uploaded image.
     * @param file The file to be uploaded, received as a multipart file from an HTTP request.
     * @return The public URL of the uploaded image
     * @throws AppException If an error occurs during file reading or uploading, an AppException is thrown
     * to indicate the failure of the upload process.
     */
    String uploadImage(MultipartFile file);
}
