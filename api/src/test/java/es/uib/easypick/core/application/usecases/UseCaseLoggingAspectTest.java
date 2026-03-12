package es.uib.easypick.core.application.usecases;

import es.uib.easypick.core.application.usecases.UseCaseLoggingAspect;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UseCaseLoggingAspectTest {

    @InjectMocks
    private UseCaseLoggingAspect aspect;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Signature signature;

    @Test
    void logUseCaseExecution_ShouldProceedAndReturnResult() throws Throwable {
        // Arrange
        Object targetInstance = new Object(); // Use object simulating a use case instance
        Object expectedResult = "Success result";

        when(joinPoint.getTarget()).thenReturn(targetInstance);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("executeUseCase");
        when(joinPoint.proceed()).thenReturn(expectedResult);

        // Act
        Object actualResult = aspect.logUseCaseExecution(joinPoint);

        // Assert
        assertEquals(expectedResult, actualResult, "The aspect should return the result from the proceed method");
        verify(joinPoint, times(1)).proceed(); // Assert that proceed was called exactly once
    }

    @Test
    void logUseCaseExecution_ShouldRethrowException() throws Throwable {
        // Arrange
        Object targetInstance = new Object();
        RuntimeException expectedException = new RuntimeException("Mocked exception");

        when(joinPoint.getTarget()).thenReturn(targetInstance);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("executeUseCase");
        when(joinPoint.proceed()).thenThrow(expectedException);

        // Act & Assert
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            aspect.logUseCaseExecution(joinPoint);
        });

        assertEquals("Mocked exception", thrownException.getMessage());
        verify(joinPoint, times(1)).proceed(); // Assert that proceed was called exactly once
    }
}