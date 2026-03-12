package es.uib.easypick.core.application.usecases;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class UseCaseLoggingAspect {
    // Intercepts all methods within classes annotated with @UseCase
    @Around("@within(es.uib.easypick.core.application.usecases.UseCase)")
    public Object logUseCaseExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String useCaseName = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        long startTime = System.currentTimeMillis();

        log.info("Executing use case: {}.{}()", useCaseName, methodName);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            log.info("Completed use case: {}.{}() in {} ms", useCaseName, methodName, duration);
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("Error in use case: {}.{}() after {} ms - {}", useCaseName, methodName, executionTime, e.getMessage(), e);
            throw e; // Rethrow the exception to be handled by the global exception handler
        }
    }
}
