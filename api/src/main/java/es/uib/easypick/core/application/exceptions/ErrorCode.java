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

    // ---- Authentication and Authorization Errors ----
    UNAUTHORIZED(2000, "Authentication is required to access this resource.", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(2001, "You do not have permission to access this resource.", HttpStatus.FORBIDDEN);

    // --- Business Logic Errors ---
    // (Add specific business logic error codes here as needed)

    private final Integer errorCode;
    private final String defaultMessage;
    private final HttpStatus httpStatus;
}
