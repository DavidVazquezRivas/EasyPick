package es.uib.easypick.garment.application.patch;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class GarmentUpdateDescriptionCommandTest {

    private final GarmentUpdateDescriptionCommand command = new GarmentUpdateDescriptionCommand();

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("description", command.getFieldName());
    }

    @Test
    void shouldUpdateDescription_whenValueIsProvided() {
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        String newDesc = "Camiseta 100% algodón orgánico";

        command.execute(garment, newDesc);

        assertEquals(newDesc, garment.getDescription());
    }

    @Test
    void shouldSetNull_whenValueIsNull() {
        GarmentEntity garment = GarmentTestBuilder.aGarment().withDescription("Old").build();

        command.execute(garment, null);

        assertNull(garment.getDescription());
    }
}