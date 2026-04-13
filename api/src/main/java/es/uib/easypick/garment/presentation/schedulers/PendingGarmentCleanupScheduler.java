package es.uib.easypick.garment.presentation.schedulers;

import es.uib.easypick.garment.application.usecases.DeletePendingGarmentsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        prefix = "application.modules.garment.cleaner.scheduler",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = false
)
public class PendingGarmentCleanupScheduler {
    private final DeletePendingGarmentsUseCase deletePendingGarmentsUseCase;

    @Scheduled(cron = "${application.modules.garment.cleaner.scheduler.cron:*/10 * * * *}")
    public void cleanUpPendingGarments() {
        deletePendingGarmentsUseCase.execute();
    }
}
