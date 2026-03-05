package es.uib.easypick.core.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import es.uib.easypick.core.exceptions.ErrorCode;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // Ignores null fields in the JSON response
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorDetails message;
    private String path;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String message, String path) {
        ErrorDetails errorDetails = new ErrorDetails(
                errorCode.getErrorCode(),
                message != null ? message : errorCode.getDefaultMessage());

        return ApiResponse.<T>builder()
                .success(false)
                .message(errorDetails)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
