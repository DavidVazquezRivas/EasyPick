package es.uib.easypick.core.application.patch;

public interface PatchCommand<T> {
    String getFieldName();

    void execute(T entity, Object value);
}
