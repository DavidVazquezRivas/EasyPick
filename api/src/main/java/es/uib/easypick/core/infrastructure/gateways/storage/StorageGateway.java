package es.uib.easypick.core.infrastructure.gateways.storage;

import es.uib.easypick.core.application.exceptions.AppException;

import java.util.List;

public interface StorageGateway {
    /**
     * Uploads an image file to a storage service and returns the public URL of the uploaded image.
     *
     * @param content          The byte array representing the content of the image file to be uploaded.
     * @param originalFilename The original filename of the image file, used to determine the file extension and for metadata purposes.
     * @param contentType      The MIME type of the image file,
     * @return The public URL of the uploaded image
     * @throws AppException If an error occurs during file reading or uploading, an AppException is thrown
     *                      to indicate the failure of the upload process.
     */
    String uploadFile(byte[] content, String originalFilename, String contentType);

    /**
     * Deletes a batch of files from the storage service based on their public URLs.
     *
     * @param fileUrls A list of public URLs corresponding to the files that need to be deleted from the storage
     *                 service.
     */
    void deleteFilesBatch(List<String> fileUrls);
}
