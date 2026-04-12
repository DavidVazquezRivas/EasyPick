package es.uib.easypick.auth.application.gateways;

import es.uib.easypick.core.application.exceptions.AppException;

public interface GoogleAuthGateway {

    /**
     * Verify the sign and validity of a Google Token
     *
     * @param idTokenString Google JWT.
     * @return Extracted data JWT
     * @throws AppException if the token is not valid
     */
    GoogleUserResponse verifyAndExtractUser(String idTokenString);
}