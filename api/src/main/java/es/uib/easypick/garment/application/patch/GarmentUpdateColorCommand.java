package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.ColorEntity;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import java.util.UUID;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GarmentUpdateColorCommand implements PatchCommand<GarmentEntity> {

    private final ColorRepository colorRepository;

    @Override
    public String getFieldName() {
        return "colors";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if(!(newValue instanceof List<?> idList)) {
            garment.getColors().clear();
            return;
        }

        try {
            List<UUID> colorIds = idList.stream()
                    .map(id -> UUID.fromString(String.valueOf(id)))
                    .toList();

            List<ColorEntity> foundColors = colorRepository.findAllById(colorIds);

            if (foundColors.size() != colorIds.size()) {
                throw new AppException(ErrorCode.COLOR_NOT_FOUND);
            }

            garment.getColors().clear();
            garment.getColors().addAll(foundColors);

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_UUID_FORMAT);
        }


    }
}
