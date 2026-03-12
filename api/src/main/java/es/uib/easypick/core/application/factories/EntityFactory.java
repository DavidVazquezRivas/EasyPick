package es.uib.easypick.core.application.factories;

/**
 * Factory interface for creating entities.
 * <p>
 * This interface defines a contract for factory classes that encapsulate the creation logic
 * of domain entities. Factories are responsible for initializing entities with proper defaults,
 * configuration values, and business rules, keeping this logic out of Use Cases and Entities.
 * </p>
 * <p>
 * Factories should be registered as Spring beans (@Component, @Service, etc.) to leverage
 * dependency injection for configuration properties and other dependencies.
 * </p>
 *
 * @param <T> The type of entity this factory creates
 */
public interface EntityFactory<T> {

    /**
     * Creates a new instance of the entity with proper initialization.
     *
     * @return A new entity instance
     */
    T create();
}

