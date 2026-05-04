package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.core.application.patch.PatchStrategyContext;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SuggestionPatchStrategyContext extends PatchStrategyContext<SuggestionEntity> {
    public SuggestionPatchStrategyContext(List<PatchCommand<SuggestionEntity>> commands) {
        super(commands);
    }
}

