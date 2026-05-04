package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.CategoryEntity;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GarmentUpdateCategoryCommand implements PatchCommand<GarmentEntity> {

    private final CategoryRepository categoryRepository;

    @Override
    public String getFieldName() {
        return "category";
    }

    @Override
    public void execute(GarmentEntity garment, Object newValue) {
        if (newValue == null) {
            garment.setCategory(null);
            return;
        }

        try {
            UUID categoryId = UUID.fromString(String.valueOf(newValue));

            CategoryEntity category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            garment.setCategory(category);

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_UUID_FORMAT);
        }
    }
}
