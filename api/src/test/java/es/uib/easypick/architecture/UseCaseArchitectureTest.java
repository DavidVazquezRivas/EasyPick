package es.uib.easypick.architecture;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

import es.uib.easypick.core.usecases.UseCase;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;


@AnalyzeClasses(packages = "es.uib.easypick")
public class UseCaseArchitectureTest {

    // Define a custom condition to check for the presence of an 'execute' method
    private static final ArchCondition<JavaClass> HAVE_AN_EXECUTE_METHOD =
            new ArchCondition<>("must have an execute() method") {
                @Override
                public void check(JavaClass javaClass, ConditionEvents events) {
                    boolean hasExecute = javaClass.getMethods().stream()
                            .anyMatch(method -> method.getName().equals("execute"));

                    if (!hasExecute) {
                        String message = String.format("The class %s must have an execute() method as the entry point for the use case.",
                                javaClass.getSimpleName());
                        events.add(SimpleConditionEvent.violated(javaClass, message));
                    }
                }
            };

    // Apply the rule to all classes annotated with @UseCase
    @ArchTest
    static final ArchRule useCasesMustHaveExecuteMethod =
            classes()
                    .that().areAnnotatedWith(UseCase.class)
                    .should(HAVE_AN_EXECUTE_METHOD)
                    .allowEmptyShould(true)
                    .because("Every Use Case should have an execute() method as the main entry point for its logic.");

    // Rule to avoid god classes
    @ArchTest
    static final ArchRule useCasesShouldNotBeNamedService =
            classes()
                    .that().areAnnotatedWith(UseCase.class)
                    .should().haveSimpleNameNotEndingWith("Service")
                    .allowEmptyShould(true)
                    .because("A use case is a concrete implementation of a business logic, not a global service. Naming it as a service can lead to confusion and god classes.");
}