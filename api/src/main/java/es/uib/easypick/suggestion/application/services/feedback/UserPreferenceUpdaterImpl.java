package es.uib.easypick.suggestion.application.services.feedback;

import es.uib.easypick.user.application.entities.UserBrandPreferenceEntity;
import es.uib.easypick.user.application.entities.UserCategoryPreferenceEntity;
import es.uib.easypick.user.application.entities.UserColorPreferenceEntity;
import es.uib.easypick.user.application.entities.UserStylePreferenceEntity;
import es.uib.easypick.user.infrastructure.repositories.UserBrandPreferenceRepository;
import es.uib.easypick.user.infrastructure.repositories.UserCategoryPreferenceRepository;
import es.uib.easypick.user.infrastructure.repositories.UserColorPreferenceRepository;
import es.uib.easypick.user.infrastructure.repositories.UserStylePreferenceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserPreferenceUpdaterImpl implements UserPreferenceUpdater {

    private final UserColorPreferenceRepository colorRepo;
    private final UserBrandPreferenceRepository brandRepo;
    private final UserStylePreferenceRepository styleRepo;
    private final UserCategoryPreferenceRepository categoryRepo;


    @Override
    @Transactional
    public void upsertColorPreference(UUID userId, UUID colorId, int delta) {
        UserColorPreferenceEntity pref = colorRepo.findByUserIdAndColorId(userId, colorId)
                .orElseThrow();

        pref.setScore(pref.getScore() + delta);
        colorRepo.save(pref);
    }

    @Override
    @Transactional
    public void upsertBrandPreference(UUID userId, UUID brandId, int delta) {
        UserBrandPreferenceEntity pref = brandRepo.findByUserIdAndBrandId(userId, brandId)
                .orElseThrow();

        pref.setScore(pref.getScore() + delta);
        brandRepo.save(pref);
    }

    @Override
    @Transactional
    public void upsertStylePreference(UUID userId, UUID styleId, int delta) {
        UserStylePreferenceEntity pref = styleRepo.findByUserIdAndStyleId(userId, styleId)
                .orElseThrow();

        pref.setScore(pref.getScore() + delta);
        styleRepo.save(pref);
    }

    @Override
    @Transactional
    public void upsertCategoryPreference(UUID userId, UUID categoryId, int delta) {
        UserCategoryPreferenceEntity pref = categoryRepo.findByUserIdAndCategoryId(userId, categoryId)
                .orElseThrow();

        pref.setScore(pref.getScore() + delta);
        categoryRepo.save(pref);
    }
}