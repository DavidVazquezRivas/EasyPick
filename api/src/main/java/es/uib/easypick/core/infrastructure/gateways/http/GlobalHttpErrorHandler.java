package es.uib.easypick.core.infrastructure.gateways.http;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GlobalHttpErrorHandler {

    private final ObjectMapper objectMapper;

    public GlobalHttpErrorHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void handle(HttpStatusCode statusCode, ClientHttpResponse response, ErrorCode fallbackError) throws IOException {
        String rawBody = new String(response.getBody().readAllBytes());
        String detail = extractDetail(rawBody);

        if (statusCode.isSameCodeAs(HttpStatus.UNPROCESSABLE_CONTENT)) {
            throw new AppException(ErrorCode.NO_GARMENT_DETECTED, detail != null ? detail : ErrorCode.NO_GARMENT_DETECTED.getDefaultMessage());
        }

        throw new AppException(fallbackError, detail != null ? detail : fallbackError.getDefaultMessage());
    }

    private String extractDetail(String rawBody) {
        try {
            JsonNode root = objectMapper.readTree(rawBody);
            return root.has("detail") ? root.get("detail").asText() : rawBody;
        } catch (Exception e) {
            return rawBody;
        }
    }
}