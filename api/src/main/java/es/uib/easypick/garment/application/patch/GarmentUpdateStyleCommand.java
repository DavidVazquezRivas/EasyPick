package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.StyleEntity;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GarmentUpdateStyleCommand implements PatchCommand<GarmentEntity>{

    private final StyleRepository styleRepository;

    @Override
    public String getFieldName() {
        return "style";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if (newValue == null) {
            garment.setStyle(null);
            return;
        }

        try {
            UUID styleId = UUID.fromString(String.valueOf(newValue));

            StyleEntity style = styleRepository.findById(styleId)
                    .orElseThrow(() -> new AppException(ErrorCode.STYLE_NOT_FOUND));

            garment.setStyle(style);

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_UUID_FORMAT);
        }
    }
}
