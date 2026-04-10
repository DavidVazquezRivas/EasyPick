package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Component
public class HttpGarmentProcessorGateway implements GarmentProcessorGateway {

    private final RestClient.Builder restClientBuilder;
    private final String baseUrl;
    private final String processEndpoint;
    private final ObjectMapper objectMapper;

    public HttpGarmentProcessorGateway(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${application.modules.garment.processor.base-url:http://localhost:8081}") String baseUrl,
            @Value("${application.modules.garment.processor.process-endpoint:/process-garments}") String processEndpoint
    ) {
        this.restClientBuilder = restClientBuilder;
        this.objectMapper = objectMapper;
        this.baseUrl = baseUrl;
        this.processEndpoint = processEndpoint;
    }

    @Override
    public List<GarmentProcessorResponse> processImage(MultipartFile file) {
        try {
            ProcessorHttpResponse response = restClientBuilder
                    .baseUrl(baseUrl)
                    .build()
                    .post()
                    .uri(processEndpoint)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(buildMultipartPayload(file))
                    .retrieve()
                    .body(ProcessorHttpResponse.class);

            return mapToContract(response);
        } catch (AppException exc) {
            throw exc;
        } catch (RestClientResponseException exc) {
            String detail = extractDetail(exc.getResponseBodyAsString());
            if (exc.getStatusCode().isSameCodeAs(HttpStatus.UNPROCESSABLE_ENTITY)) {
                throw new AppException(
                        ErrorCode.NO_GARMENT_DETECTED,
                        resolveMessage(detail, ErrorCode.NO_GARMENT_DETECTED)
                );
            }

            throw new AppException(
                    ErrorCode.UPLOAD_IMAGE_ERROR,
                    resolveMessage(detail, ErrorCode.UPLOAD_IMAGE_ERROR)
            );
        } catch (RestClientException exc) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR);
        } catch (IOException exc) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR);
        } catch (Exception exc) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR);
        }
    }

    private MultiValueMap<String, Object> buildMultipartPayload(MultipartFile file) throws IOException {
        InputStreamResource resource = new InputStreamResource(file.getInputStream()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg";
            }

            @Override
            public long contentLength() {
                return file.getSize();
            }
        };

        MultiValueMap<String, Object> multipart = new LinkedMultiValueMap<>();
        multipart.add("image", resource);
        return multipart;
    }

    private List<GarmentProcessorResponse> mapToContract(ProcessorHttpResponse response) {
        if (response == null || response.garments() == null || response.garments().isEmpty()) {
            return List.of();
        }

        return response.garments().stream()
                .filter(garment -> garment != null && garment.imageBase64() != null && !garment.imageBase64().isBlank())
                .map(garment -> new GarmentProcessorResponse(garment.imageBase64()))
                .toList();
    }

    private String extractDetail(String rawBody) {
        if (rawBody == null || rawBody.isBlank()) {
            return null;
        }

        try {
            ProcessorErrorResponse parsed = objectMapper.readValue(rawBody, ProcessorErrorResponse.class);
            if (parsed.detail() != null && !parsed.detail().isBlank()) {
                return parsed.detail();
            }
        } catch (Exception ignored) {
        }

        return rawBody;
    }

    private String resolveMessage(String detail, ErrorCode fallbackErrorCode) {
        if (detail == null || detail.isBlank()) {
            return fallbackErrorCode.getDefaultMessage();
        }

        return detail;
    }
}
