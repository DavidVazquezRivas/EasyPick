package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.core.application.patch.PatchStrategyContext;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GarmentPatchStrategyContext extends PatchStrategyContext<GarmentEntity> {
    public GarmentPatchStrategyContext(List<PatchCommand<GarmentEntity>> commands) {
        super(commands);
    }
}
