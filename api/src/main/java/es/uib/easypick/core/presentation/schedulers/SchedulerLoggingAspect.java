package es.uib.easypick.core.presentation.schedulers;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@Slf4j
public class SchedulerLoggingAspect {

    @Around("@annotation(org.springframework.scheduling.annotation.Scheduled)")
    public Object logScheduledTaskExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        String jobIdentifier = "job-" + UUID.randomUUID();
        MDC.put("jobIdentifier", jobIdentifier);

        long startTime = System.currentTimeMillis();
        log.info("Starting execution of {}.{}.{}", className, methodName, jobIdentifier);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            log.info("Completed execution of {}.{}.{} in {} ms", className, methodName, jobIdentifier, duration);
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("Error in {}.{}.{} after {} ms - {}", className, methodName, jobIdentifier, executionTime, e.getMessage(), e);

            throw e;
        } finally {
            MDC.remove("jobIdentifier");
        }
    }
}
