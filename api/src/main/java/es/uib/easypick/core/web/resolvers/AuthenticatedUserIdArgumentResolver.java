package es.uib.easypick.core.web.resolvers;

import es.uib.easypick.core.exceptions.AppException;
import es.uib.easypick.core.exceptions.ErrorCode;
import es.uib.easypick.core.web.config.WebConfig;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.UUID;

/**
 * Resolves controller parameters annotated with {@link AuthenticatedUserId}
 * by extracting the authenticated user's UUID from the Spring Security context.
 *
 * Registered in {@link WebConfig#addArgumentResolvers}.
 */
@Component
public class AuthenticatedUserIdArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticatedUserId.class)
                && parameter.getParameterType().equals(UUID.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "No authenticated user found");
        }

        return authentication.getPrincipal();
    }
}

