package es.uib.easypick.suggestion.infrastructure.repositories;

import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SuggestionRepository extends JpaRepository<SuggestionEntity, UUID> {

    @Query("SELECT DISTINCT s FROM SuggestionEntity s " +
            "LEFT JOIN FETCH s.garmentSuggestions gs " +
            "LEFT JOIN FETCH gs.garment g " +
            "LEFT JOIN FETCH s.rejection " +
            "WHERE g.user.id = :userId")
    List<SuggestionEntity> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT s FROM SuggestionEntity s " +
            "LEFT JOIN FETCH s.garmentSuggestions gs " +
            "LEFT JOIN FETCH gs.garment g " +
            "LEFT JOIN FETCH s.rejection " +
            "WHERE s.user.id = :userId " +
            "AND s.status = :status " +
            "AND s.generatedAt >= :startOfDay " +
            "ORDER BY s.generatedAt ASC")
    List<SuggestionEntity> findPendingSuggestionsForUserSince(
            @Param("userId") UUID userId,
            @Param("status") SuggestionStatus status,
            @Param("startOfDay") OffsetDateTime startOfDay
    );

    Optional<SuggestionEntity> findFirstByUserIdOrderByGeneratedAtDesc(UUID userId);

}