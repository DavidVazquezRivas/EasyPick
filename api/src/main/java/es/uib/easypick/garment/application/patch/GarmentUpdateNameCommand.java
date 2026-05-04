package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import org.springframework.stereotype.Component;

@Component
public class GarmentUpdateNameCommand implements PatchCommand<GarmentEntity> {

    @Override
    public String getFieldName() {
        return "name";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if (newValue == null || String.valueOf(newValue).isBlank()) {
            throw new AppException(ErrorCode.INVALID_GARMENT_NAME);
        }

        garment.setName(String.valueOf(newValue));
    }
}