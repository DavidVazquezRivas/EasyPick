package es.uib.easypick.core.presentation.schedulers;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.MDC;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchedulerLoggingAspectTest {

    @InjectMocks
    private SchedulerLoggingAspect aspect;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Signature signature;

    @AfterEach
    void tearDown() {
        MDC.clear();
    }

    @Test
    void logScheduledTaskExecution_ShouldProceedAndManageMDC() throws Throwable {
        // Arrange
        Object targetInstance = new Object();
        Object expectedResult = "Success result";

        when(joinPoint.getTarget()).thenReturn(targetInstance);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("executeJob");

        when(joinPoint.proceed()).thenAnswer(invocation -> {
            assertNotNull(MDC.get("jobIdentifier"), "El MDC debe contener el jobIdentifier durante la ejecución");
            assertTrue(MDC.get("jobIdentifier").startsWith("job-"));
            return expectedResult;
        });

        // Act
        Object actualResult = aspect.logScheduledTaskExecution(joinPoint);

        // Assert
        assertEquals(expectedResult, actualResult, "Debe devolver el resultado del proceed()");
        verify(joinPoint, times(1)).proceed();

        // Verify that the MDC is cleared after execution
        assertNull(MDC.get("jobIdentifier"), "El MDC debe limpiarse después de una ejecución exitosa");
    }

    @Test
    void logScheduledTaskExecution_ShouldRethrowExceptionAndCleanUpMDC() throws Throwable {
        // Arrange
        Object targetInstance = new Object();
        RuntimeException expectedException = new RuntimeException("Simulated job failure");

        when(joinPoint.getTarget()).thenReturn(targetInstance);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("executeJob");
        when(joinPoint.proceed()).thenThrow(expectedException);

        // Act & Assert
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            aspect.logScheduledTaskExecution(joinPoint);
        });

        assertEquals("Simulated job failure", thrownException.getMessage());
        verify(joinPoint, times(1)).proceed();

        // Verify that the MDC is cleared even after an exception
        assertNull(MDC.get("jobIdentifier"), "El MDC debe limpiarse incluso si salta una excepción");
    }
}