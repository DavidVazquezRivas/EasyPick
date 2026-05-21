package es.uib.easypick.garment.application.usecases;

import java.util.List;

public record GetUserGarmentsFilters(
        String search,
        List<String> categoryIds,
        List<String> styleIds,
        List<String> colorIds
) {
}
