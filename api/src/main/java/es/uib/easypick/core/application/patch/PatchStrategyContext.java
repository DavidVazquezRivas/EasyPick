package es.uib.easypick.core.application.patch;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
public abstract class PatchStrategyContext<T> {
    private final Map<String, PatchCommand<T>> strategies;

    protected PatchStrategyContext(List<PatchCommand<T>> commands) {
        this.strategies = commands.stream()
                .collect(Collectors.toMap(PatchCommand::getFieldName, Function.identity()));
    }

    public void applyPatch(T entity, Map<String, Object> patchInstructions) {
        patchInstructions.forEach((fieldName, value) -> {
            PatchCommand<T> command = strategies.get(fieldName);

            if (command != null) {
                command.execute(entity, value);
            } else {
                // We could throw an exception here if we want to enforce strict patching,
                // we will just ignore unknown fields for now, but this is a design decision that can be revisited.
                log.warn("{} is not a valid patch command", fieldName);
            }
        });
    }
}
