package es.uib.easypick.suggestion.infrastructure.repositories;

import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SuggestionRepository extends JpaRepository<SuggestionEntity, UUID> {

    @Query("SELECT DISTINCT s FROM SuggestionEntity s " +
            "LEFT JOIN FETCH s.garmentSuggestions gs " +
            "LEFT JOIN FETCH gs.garment g " +
            "LEFT JOIN FETCH s.rejection " +
            "WHERE g.user.id = :userId")
    List<SuggestionEntity> findByUserId(@Param("userId") UUID userId);

}