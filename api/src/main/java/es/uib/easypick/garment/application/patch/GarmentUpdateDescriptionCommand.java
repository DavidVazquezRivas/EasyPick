package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import org.springframework.stereotype.Component;

@Component
public class GarmentUpdateDescriptionCommand implements PatchCommand<GarmentEntity> {

    @Override
    public String getFieldName() {
        return "description";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        String description = (newValue == null) ? null : String.valueOf(newValue);

        garment.setDescription(description);
    }
}