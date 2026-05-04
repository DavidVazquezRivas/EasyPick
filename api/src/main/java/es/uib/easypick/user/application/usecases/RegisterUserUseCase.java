package es.uib.easypick.user.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final ColorRepository colorRepository;
    private final BrandRepository brandRepository;
    private final StyleRepository styleRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public UserEntity execute(String name, String email) {
        UserEntity newUser = UserEntity.create(name, email);

        newUser.initializePreferences(
                colorRepository.findAll(),
                brandRepository.findAll(),
                styleRepository.findAll(),
                categoryRepository.findAll()
        );

        return userRepository.save(newUser);
    }
}