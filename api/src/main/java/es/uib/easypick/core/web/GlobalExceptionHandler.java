package es.uib.easypick.core.web;

import es.uib.easypick.core.exceptions.AppException;
import es.uib.easypick.core.exceptions.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Controlled business exceptions (Thrown by UseCases)
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex, HttpServletRequest request) {
        log.warn("Business Exception: {} - {}", ex.getErrorCode().getErrorCode(), ex.getMessage());
        return buildErrorResponse(ex.getErrorCode(), ex.getMessage(), request);
    }

    // 2. Validity errors in DTOs (@Valid, @NotNull, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("Validation Error: {}", errorMessage);
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, errorMessage, request);
    }

    // 3. Error when receiving a malformed JSON
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleMalformedJson(HttpMessageNotReadableException ex, HttpServletRequest request) {
        log.warn("Malformed JSON request: {}", ex.getMessage());
        return buildErrorResponse(ErrorCode.MALFORMED_REQUEST, null, request);
    }

    // 4. Internal errors that we didn't foresee (NullPointers, database, etc.)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, HttpServletRequest request) {
        // Do log the exception with stacktrace for internal debugging, but return a generic message to the client
        log.error("CRITICAL UNHANDLED EXCEPTION: ", ex);
        return buildErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, null, request);
    }

    // Helper method to build error responses consistently
    private ResponseEntity<ApiResponse<Void>> buildErrorResponse(ErrorCode code, String message, HttpServletRequest request) {
        ApiResponse<Void> response = ApiResponse.error(code, message, request.getRequestURI());
        return new ResponseEntity<>(response, code.getHttpStatus());
    }
}