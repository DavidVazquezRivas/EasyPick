package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.BrandEntity;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GarmentUpdateBrandCommand implements PatchCommand<GarmentEntity> {

    private final BrandRepository brandRepository;

    @Override
    public String getFieldName() {
        return "brand";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if (newValue == null) {
            garment.setBrand(null);
            return;
        }

        try {
            UUID brandId = UUID.fromString(String.valueOf(newValue));

            BrandEntity brand = brandRepository.findById(brandId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

            garment.setBrand(brand);

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_UUID_FORMAT);
        }
    }
}
