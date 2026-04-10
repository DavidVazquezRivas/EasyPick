package es.uib.easypick.auth.infrastructure.gateways;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import es.uib.easypick.auth.application.gateways.GoogleAuthGateway;
import es.uib.easypick.auth.application.gateways.GoogleUserResponse;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleAuthGatewayImpl implements GoogleAuthGateway {

    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthGatewayImpl(
            @Value("${application.modules.auth.oauth.google.client-id}") String googleClientId
    ) {
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();
    }

    @Override
    public GoogleUserResponse verifyAndExtractUser(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_GOOGLE_TOKEN);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            if (lastName == null) lastName = "";
            if (firstName == null) firstName = "User";

            return new GoogleUserResponse(email, firstName, lastName);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_GOOGLE_TOKEN);
        }
    }
}