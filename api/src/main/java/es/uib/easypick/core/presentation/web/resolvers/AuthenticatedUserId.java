package es.uib.easypick.core.presentation.web.resolvers;

import java.lang.annotation.*;

/**
 * Resolves the authenticated user's UUID from the JWT token in the SecurityContext.
 * Use on controller method parameters instead of accepting userId from the request,
 * which would allow clients to access other users' resources.
 *
 * <pre>{@code
 * @GetMapping("/me/garments")
 * public ResponseEntity<?> getMyGarments(@AuthenticatedUserId UUID userId) { ... }
 * }</pre>
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuthenticatedUserId {
}

