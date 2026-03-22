package es.uib.easypick.core.application.patch;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatchStrategyContextTest {

    // Create a simple dummy entity class just for testing purposes
    static class DummyEntity {
        String data;
    }

    // Create a concrete implementation of the abstract class just for testing purposes
    static class TestablePatchStrategyContext extends PatchStrategyContext<DummyEntity> {
        protected TestablePatchStrategyContext(List<PatchCommand<DummyEntity>> commands) {
            super(commands);
        }
    }

    @Mock
    private PatchCommand<DummyEntity> statusCommand;

    @Mock
    private PatchCommand<DummyEntity> priceCommand;

    private TestablePatchStrategyContext context;
    private DummyEntity entity;

    @BeforeEach
    void setUp() {
        // Configure the field names for the commands
        when(statusCommand.getFieldName()).thenReturn("status");
        when(priceCommand.getFieldName()).thenReturn("price");

        // Instance our context with the mocked commands
        context = new TestablePatchStrategyContext(List.of(statusCommand, priceCommand));

        // Prepare the entity to be patched
        entity = new DummyEntity();
    }

    @Test
    void shouldExecuteCorrectCommand_whenFieldIsKnown() {
        // Arrange
        Map<String, Object> instructions = Map.of("status", "CONFIRMED");

        // Act
        context.applyPatch(entity, instructions);

        // Assert
        // Verify the correct command was executed with the correct parameters
        verify(statusCommand, times(1)).execute(entity, "CONFIRMED");
        // Verify that the other command was not executed
        verify(priceCommand, never()).execute(any(), any());
    }

    @Test
    void shouldExecuteMultipleCommands_whenMultipleKnownFieldsProvided() {
        // Arrange
        Map<String, Object> instructions = Map.of(
                "status", "CANCELLED",
                "price", 50.0
        );

        // Act
        context.applyPatch(entity, instructions);

        // Assert
        verify(statusCommand, times(1)).execute(entity, "CANCELLED");
        verify(priceCommand, times(1)).execute(entity, 50.0);
    }

    @Test
    void shouldIgnoreUnknownFields_whenFieldIsNotInStrategies() {
        // Arrange
        // Send an unregistered field "unknownField"
        Map<String, Object> instructions = Map.of(
                "status", "PENDING",
                "unknownField", "hacker_value"
        );

        // Act
        context.applyPatch(entity, instructions);

        // Assert
        verify(statusCommand, times(1)).execute(entity, "PENDING");
    }
}