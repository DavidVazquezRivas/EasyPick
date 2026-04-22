package es.uib.easypick.core.application.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // ---- System Errors ----
    INTERNAL_SERVER_ERROR(1000, "An unexpected error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_ERROR(1001, "Validation failed for the request.", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1002, "The requested resource was not found.", HttpStatus.NOT_FOUND),
    MALFORMED_REQUEST(1003, "The request was malformed or contains invalid data.", HttpStatus.BAD_REQUEST),
    BAD_REQUEST(1004, "The request could not be understood or was missing required parameters.", HttpStatus.BAD_REQUEST),

    // ---- Authentication and Authorization Errors ----
    UNAUTHORIZED(2000, "Authentication is required to access this resource.", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(2001, "You do not have permission to access this resource.", HttpStatus.FORBIDDEN),
    INVALID_GOOGLE_TOKEN(2002, "The given google token id was not valid", HttpStatus.UNAUTHORIZED),

    // --- User Module Logic Errors ---
    USER_NOT_FOUND(3000, "The specified user was not found.", HttpStatus.NOT_FOUND),

    // --- Garment Module Logic Errors ---
    UPLOAD_IMAGE_ERROR(3100, "Failed to upload the image. Please check the file is not corrupted.",
            HttpStatus.INTERNAL_SERVER_ERROR),
    NO_GARMENT_DETECTED(3101, "No garment could be detected in the uploaded image. Please try with a different image.",
            HttpStatus.BAD_REQUEST),
    INVALID_GARMENT_STATUS(3102, "The provided garment status is invalid.", HttpStatus.BAD_REQUEST),
    GARMENT_NOT_FOUND(3103, "The specified garment was not found.", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(3104, "The specified category was not found.", HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND(3105, "The specified brand was not found.", HttpStatus.NOT_FOUND),
    STYLE_NOT_FOUND(3106, "The specified style was not found.", HttpStatus.NOT_FOUND),
    COLOR_NOT_FOUND(3107, "One or more of the specified colors were not found.", HttpStatus.NOT_FOUND),
    INVALID_GARMENT_NAME(3108, "The provided garment name is invalid or empty.", HttpStatus.BAD_REQUEST),
    INVALID_UUID_FORMAT(3109, "The provided ID format is invalid.", HttpStatus.BAD_REQUEST);

    private final Integer errorCode;
    private final String defaultMessage;
    private final HttpStatus httpStatus;
}
