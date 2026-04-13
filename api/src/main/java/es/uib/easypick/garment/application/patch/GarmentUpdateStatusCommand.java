package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import org.springframework.stereotype.Component;

@Component
public class GarmentUpdateStatusCommand implements PatchCommand<GarmentEntity> {

    @Override
    public String getFieldName() {
        return "status";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if (newValue == null) throw new AppException(ErrorCode.INVALID_GARMENT_STATUS);

        GarmentStatus newStatus;
        try {
            newStatus = GarmentStatus.valueOf(String.valueOf(newValue).toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_GARMENT_STATUS);
        }

        switch (newStatus) {
            case CONFIRMED:
                garment.confirm();
                break;
            case DELETED:
                // This should be handled via DELETE endpoint, but we will allow it here for flexibility
                // TODO - Call the use case to delete the image when remove functionality is implemented
                break;
            default:
                throw new AppException(ErrorCode.INVALID_GARMENT_STATUS);
        }
    }
}
