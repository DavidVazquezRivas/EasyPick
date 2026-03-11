# EasyPick API — Guía de Arquitectura y Convenciones del Backend

> **Stack**: Spring Boot 4.0.3 · Java 21 · PostgreSQL · Flyway · JWT (jjwt) · Lombok · SpringDoc OpenAPI · ArchUnit

---

## 📁 Estructura del Proyecto

```
es.uib.easypick
├── core/                          # Núcleo compartido (cross-cutting concerns)
│   ├── entities/                  # BaseEntity (id, createdAt)
│   ├── exceptions/                # AppException + ErrorCode (enum centralizado)
│   ├── usecases/                  # @UseCase (anotación) + UseCaseLoggingAspect (AOP)
│   └── web/
│       ├── config/                # WebConfig (prefijo global /api/v1, CORS, ObjectMapper)
│       │                          # SwaggerConfig
│       ├── resolvers/             # @AuthenticatedUserId + Resolver
│       ├── response/              # ApiResponse<T>, ErrorDetails, GlobalExceptionHandler
│       └── security/              # SecurityConfig, JwtService, JwtAuthenticationFilter,
│                                  # CustomAuthenticationEntryPoint
├── auth/                          # Módulo de autenticación
│   ├── controllers/               # AuthController
│   ├── dtos/requests/             # RefreshTokenRequest (record)
│   ├── dtos/responses/            # TokenResponse (record)
│   ├── entities/                  # RefreshTokenEntity
│   ├── repositories/              # RefreshTokenRepository
│   └── usecases/                  # RefreshTokensUseCase
├── garment/                       # Módulo de prendas
│   ├── controllers/               # GarmentController
│   ├── dtos/responses/            # SimpleGarmentResponse (record)
│   ├── entities/                  # GarmentEntity
│   ├── repositories/              # GarmentRepository
│   └── usecases/                  # GetUserGarmentsUseCase
└── user/                          # Módulo de usuarios
    ├── entities/                  # UserEntity
    └── repositories/              # UserRepository
```

Cada módulo de dominio (`auth`, `garment`, `user`) sigue la misma estructura de carpetas: `controllers → dtos → entities → repositories → usecases`. El paquete `core` contiene todo lo transversal.

---

## 1. Records como DTOs

Los **DTOs** (requests y responses) se implementan como **Java Records**, aprovechando que son inmutables, concisos y generan automáticamente `equals()`, `hashCode()` y `toString()`.

### Response DTO con `@Builder` y método factoría `fromEntity`

```java
@Builder
public record SimpleGarmentResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        OffsetDateTime updatedAt
) {
    public static SimpleGarmentResponse fromEntity(GarmentEntity entity) {
        return SimpleGarmentResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
```

**Convenciones:**

| Aspecto | Convención |
|---|---|
| **Records** | Todos los DTOs son `record`. Nunca clases mutables. |
| **`@Builder` (Lombok)** | Se usa en responses para facilitar la construcción. |
| **`fromEntity()`** | Método estático de mapeo dentro del propio record. No se usa un mapper externo (MapStruct, etc.): la conversión queda localizada en el DTO. |
| **Validación** | En los request DTOs se usan anotaciones de `jakarta.validation` (`@NotNull`, etc.) directamente sobre los campos del record. |
| **Separación requests/responses** | Cada tipo de DTO va en su subcarpeta (`dtos/requests/`, `dtos/responses/`). |

### Request DTO con validación

```java
public record RefreshTokenRequest(
        @NotNull UUID refreshToken
) {}
```

> **¿Por qué records y no clases?**  
> Los records garantizan inmutabilidad por diseño, eliminan boilerplate y comunican la intención de "portador de datos sin lógica de negocio". Jackson los deserializa correctamente y `@Valid` funciona sobre sus componentes.

---

## 2. Casos de Uso con `@UseCase` y método `execute()`

### La anotación `@UseCase`

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface UseCase {
    @AliasFor(annotation = Component.class)
    String value() default "";
}
```

`@UseCase` es una **anotación semántica** que actúa como `@Component` (Spring la registra como bean), pero comunica que la clase representa **un caso de uso de negocio concreto**.

### Contrato obligatorio: método `execute()`

Cada clase anotada con `@UseCase` **debe** tener un método público llamado `execute()`. Esto se valida automáticamente con un **test de arquitectura (ArchUnit)**:

```java
@ArchTest
static final ArchRule useCasesMustHaveExecuteMethod =
        classes()
                .that().areAnnotatedWith(UseCase.class)
                .should(HAVE_AN_EXECUTE_METHOD)
                .because("Every Use Case should have an execute() method as the main entry point.");
```

Además, hay una regla que **prohíbe nombrar un caso de uso como "Service"**, para evitar la tentación de crear god-classes:

```java
@ArchTest
static final ArchRule useCasesShouldNotBeNamedService =
        classes()
                .that().areAnnotatedWith(UseCase.class)
                .should().haveSimpleNameNotEndingWith("Service")
                .because("A use case is not a global service. Naming it 'Service' leads to god classes.");
```

### Ejemplo de caso de uso

```java
@UseCase
@RequiredArgsConstructor
public class GetUserGarmentsUseCase {

    private final GarmentRepository repository;

    @Transactional(readOnly = true)
    public List<SimpleGarmentResponse> execute(UUID userId) {
        return repository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(SimpleGarmentResponse::fromEntity)
                .toList();
    }
}
```

**Principio:** Un caso de uso = una clase = una responsabilidad. El controlador simplemente delega al `execute()`:

```java
@GetMapping("/me")
public ResponseEntity<ApiResponse<List<SimpleGarmentResponse>>> getUserGarments(
        @AuthenticatedUserId UUID userId) {
    List<SimpleGarmentResponse> response = getUserGarmentsUseCase.execute(userId);
    return ResponseEntity.ok(ApiResponse.success(response));
}
```

---

## 3. `@Transactional`: `readOnly` para consultas, escritura para mutaciones

| Tipo de operación | Anotación | Ejemplo |
|---|---|---|
| **Consulta (solo lectura)** | `@Transactional(readOnly = true)` | `GetUserGarmentsUseCase.execute()` |
| **Escritura (atómica)** | `@Transactional` | `RefreshTokensUseCase.execute()` |

### ¿Por qué `readOnly = true` para consultas?

- Hibernate activa **optimizaciones de flush**: no hace dirty-checking al final de la transacción.
- PostgreSQL puede rutear la consulta a una réplica de lectura si se configura.
- Comunica la intención al lector del código: "este método no modifica nada".

### ¿Por qué `@Transactional` sin `readOnly` en escrituras?

En `RefreshTokensUseCase.execute()` se realizan múltiples operaciones de escritura (buscar token viejo, generar nuevo, guardar, borrar). Si algo falla, **toda la operación se revierte**. El comentario en el propio código lo documenta:

```java
// As it is an atomic operation, writing to the database, we need to make it transactional
@Transactional
public TokenResponse execute(UUID oldRefreshTokenId) { ... }
```

---

## 4. Entity Graphs / Evitar N+1 (Estrategia de Fetching)

### Decisiones de Lazy vs Eager Loading

En este proyecto **todas las relaciones `@ManyToOne` usan `FetchType.LAZY` explícitamente**, documentando el motivo con un comentario:

**`GarmentEntity`:**
```java
// Lazy loading to avoid unnecessary data retrieval when fetching garments
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private UserEntity user;
```

**`RefreshTokenEntity`:**
```java
// Lazy loading to avoid unnecessary user data retrieval when fetching the token
@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "user_id", nullable = false)
private UserEntity user;
```

> **¿Por qué LAZY por defecto?**  
> `FetchType.EAGER` carga la relación **siempre**, aunque no la necesites. Esto provoca queries N+1 y desperdicia memoria. Con `LAZY`, el proxy de Hibernate solo ejecuta la query adicional si accedes al campo. Cuando **sí** necesites la relación, usa `@EntityGraph` o `JOIN FETCH` en el repositorio.

### Cuándo usar `@NamedEntityGraph` / `@EntityGraph`

Actualmente el proyecto no tiene consultas que necesiten datos de relaciones LAZY en la misma transacción (por ejemplo, `GetUserGarmentsUseCase` no accede a `garment.getUser()`). Sin embargo, para futuras funcionalidades donde se necesite, el patrón a seguir es:

```java
// En la entidad:
@NamedEntityGraph(
    name = "GarmentEntity.withUser",
    attributeNodes = @NamedAttributeNode("user")
)
@Entity
public class GarmentEntity extends BaseEntity { ... }

// En el repositorio:
@EntityGraph("GarmentEntity.withUser")
List<GarmentEntity> findByUserIdOrderByUpdatedAtDesc(UUID id);
```

Esto genera un `LEFT JOIN FETCH` en vez de N queries adicionales.

### Relación `@OneToMany` y `CascadeType`

En `UserEntity`:

```java
// Persist and update on cascade, manually hand remove
@OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private List<GarmentEntity> garments = new ArrayList<>();

@PreRemove
private void preRemove() {
    garments.forEach(garment -> garment.setUser(null));
}
```

**Decisiones clave:**
- **No se usa `CascadeType.REMOVE`**: borrar un usuario no borra sus prendas (se pone `user_id = NULL`, como indica la FK con `ON DELETE SET NULL`).
- **`@PreRemove`** desasocia manualmente las prendas antes de eliminar el usuario, manteniendo coherencia con la política de la base de datos.
- **La colección `garments` no usa `FetchType.EAGER`** (JPA default para `@OneToMany` es `LAZY`), evitando cargar todas las prendas cada vez que se lee un usuario.

---

## 5. Otras Decisiones de Diseño Importantes

### 5.1 BaseEntity

```java
@MappedSuperclass
@Getter @Setter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
```

- **UUIDs como claves primarias**: evita colisiones en sistemas distribuidos y no expone información secuencial.
- **`createdAt` con `updatable = false`**: una vez creado, no se puede modificar. Se inicializa en Java, no se delega al default de la DB, para consistencia.
- **`OffsetDateTime`**: incluye zona horaria (vs `LocalDateTime`), requerido para APIs con clientes en distintos husos horarios.
- **Nota**: `RefreshTokenEntity` **no** extiende `BaseEntity` porque su PK es el propio `token` UUID, no un `id` autogenerado aparte.

### 5.2 Manejo Centralizado de Errores

`GlobalExceptionHandler` captura **7 tipos de excepción**, cada uno mapeado a un `ErrorCode`:

| # | Excepción | ErrorCode | HTTP Status |
|---|---|---|---|
| 1 | `AppException` (negocio) | Dinámico | Dinámico |
| 2 | `MethodArgumentNotValidException` | `VALIDATION_ERROR` | 400 |
| 3 | `HttpMessageNotReadableException` | `MALFORMED_REQUEST` | 400 |
| 4 | `AccessDeniedException` | `FORBIDDEN` | 403 |
| 5 | `Exception` (genérica) | `INTERNAL_SERVER_ERROR` | 500 |
| 6 | `JwtException` | `UNAUTHORIZED` | 401 |
| 7 | `NoResourceFoundException` | `RESOURCE_NOT_FOUND` | 404 |

**Formato de respuesta unificado** con `ApiResponse<T>`:

```json
{
  "success": false,
  "message": { "code": 2000, "message": "Expired or invalid refresh token" },
  "path": "/api/v1/auth/refresh",
  "timestamp": "2026-03-10T20:00:00Z"
}
```

Campos nulos se omiten gracias a `@JsonInclude(JsonInclude.Include.NON_NULL)`.

### 5.3 Prefijo Global `/api/v1`

Configurado en `WebConfig` con `configurePathMatch`, aplica automáticamente a todos los `@RestController`:

```java
@Override
public void configurePathMatch(PathMatchConfigurer configurer) {
    configurer.addPathPrefix("/api/v1",
            HandlerTypePredicate.forAnnotation(RestController.class));
}
```

No hace falta repetir `/api/v1` en cada `@RequestMapping`.

### 5.4 `@AuthenticatedUserId` — Resolver Personalizado

En vez de recibir el `userId` como path/query param (lo cual permitiría al cliente acceder a recursos de otros usuarios), se extrae del JWT mediante un `HandlerMethodArgumentResolver`:

```java
@GetMapping("/me")
public ResponseEntity<?> getUserGarments(@AuthenticatedUserId UUID userId) { ... }
```

El resolver lee el `principal` del `SecurityContext` (que fue puesto por `JwtAuthenticationFilter`).

### 5.5 Seguridad: JWT Stateless

- **Sin sesiones**: `SessionCreationPolicy.STATELESS`.
- El `JwtAuthenticationFilter` extrae el userId del token y lo pone como `principal` en el `SecurityContext`.
- **No se carga el usuario de la DB en cada request** (no hay `UserDetailsService`): el JWT es auto-contenido. Esto mejora el rendimiento a costa de no poder revocar access tokens antes de su expiración.
- Los **refresh tokens** sí van contra DB para permitir revocación.
- El `CustomAuthenticationEntryPoint` redirige errores de auth al `GlobalExceptionHandler` para mantener un formato de respuesta unificado.

### 5.6 Logging Automático con AOP

`UseCaseLoggingAspect` intercepta **todos los métodos de clases `@UseCase`**:

```
INFO  Executing use case: RefreshTokensUseCase.execute()
INFO  Completed use case: RefreshTokensUseCase.execute() in 45 ms
ERROR Error in use case: RefreshTokensUseCase.execute() after 12 ms - Refresh token not found
```

Esto evita ensuciar cada caso de uso con código de logging repetitivo.

### 5.7 Migraciones con Flyway + Seeds

- **Migraciones** (`db/migration/V1__*.sql`, `V2__*.sql`): DDL versionado. Flyway las ejecuta en orden.
- **Seeds** (`db.seeds/V1_*.sql`): datos de prueba. Se cargan con `spring.sql.init.mode=always` y `data-locations`.
- Los seeds usan `DELETE FROM` antes de insertar para ser idempotentes.

### 5.8 Swagger / OpenAPI

- `springdoc-openapi-starter-webmvc-ui` expone automáticamente `/swagger-ui.html`.
- Los controllers usan `@Tag` y `@Operation` para documentar endpoints.
- Las rutas de Swagger están excluidas de autenticación en `SecurityConfig`.

### 5.9 Inyección de Dependencias

- Se usa **inyección por constructor** exclusivamente, facilitada por `@RequiredArgsConstructor` de Lombok.
- Los campos de dependencias son `private final` (inmutables tras construcción).
- Esto facilita el testing: se pueden pasar mocks directamente por constructor.

---

## 6. Guía de Testing

### 6.1 Objetivo de Cobertura

**100% de cobertura en líneas y ramas de los `UseCases`.** Los casos de uso contienen la lógica de negocio y son la capa más crítica.

### 6.2 Framework y Setup

```java
@ExtendWith(MockitoExtension.class)
class RefreshTokensUseCaseTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private RefreshTokensUseCase refreshTokensUseCase;
```

| Elemento | Propósito |
|---|---|
| `@ExtendWith(MockitoExtension.class)` | Activa Mockito sin levantar Spring (test unitario puro). |
| `@Mock` | Crea un mock para cada dependencia del UseCase. |
| `@InjectMocks` | Instancia el UseCase inyectando los mocks automáticamente. |
| `@Captor` | Captura argumentos pasados a mocks para aserciones detalladas. |

> **No se usa `@SpringBootTest`** para tests de UseCases. Son tests unitarios puros, rápidos y sin contexto Spring.

### 6.3 Patrón TestBuilder

Para crear entidades de test se usa el **patrón Test Data Builder**, implementado en la carpeta `helpers/` de cada módulo:

```java
// Ubicación: src/test/java/es/uib/easypick/{modulo}/helpers/{Entidad}TestBuilder.java

GarmentEntity garment = GarmentTestBuilder
        .aGarment()
        .withName("Winter Jacket")
        .withUser(mockUser)
        .build();
```

**Estructura de un TestBuilder:**

```java
public class GarmentTestBuilder {

    // Valores por defecto válidos para evitar fragilidad
    private UUID id = UUID.randomUUID();
    private String name = "Default T-Shirt";
    private String description = "Default description...";
    private String imageUrl = "https://example.com/default.jpg";
    private OffsetDateTime createdAt = OffsetDateTime.now().minusDays(1);
    private OffsetDateTime updatedAt = OffsetDateTime.now();
    private UserEntity user = null;

    private GarmentTestBuilder() {}

    public static GarmentTestBuilder aGarment() {
        return new GarmentTestBuilder();
    }

    public GarmentTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    // ... más withXxx() ...

    public GarmentEntity build() {
        GarmentEntity garment = new GarmentEntity();
        garment.setId(this.id);
        garment.setName(this.name);
        // ...
        return garment;
    }
}
```

**Convenciones del TestBuilder:**

| Regla | Detalle |
|---|---|
| Constructor privado | Solo se instancia mediante `aXxx()` (factory method). |
| Valores por defecto válidos | `build()` sin ningún `withXxx()` debe generar una entidad completamente válida. |
| API fluida | Cada `withXxx()` retorna `this` para encadenar. |
| Ubicación | `src/test/java/es/uib/easypick/{modulo}/helpers/{Entidad}TestBuilder.java` |
| Naming | `{Entidad}TestBuilder` con método estático `a{Entidad}()` o `an{Entidad}()`. |

**Builders existentes:**

| Builder | Módulo |
|---|---|
| `UserTestBuilder` | `user/helpers/` |
| `GarmentTestBuilder` | `garment/helpers/` |
| `RefreshTokenTestBuilder` | `auth/helpers/` |

> Siempre que se cree una nueva entidad, **crear su TestBuilder correspondiente**.

### 6.4 Estructura de un Test: AAA (Arrange, Act, Assert)

Todos los tests siguen el patrón **Arrange → Act → Assert**, con comentarios explícitos:

```java
@Test
void execute_ShouldReturnNewTokens_WhenOldTokenIsValid() {
    // Arrange
    RefreshTokenEntity validToken = RefreshTokenTestBuilder.aRefreshToken()
            .withToken(tokenId)
            .withUser(mockUser)
            .build();
    when(refreshTokenRepository.findById(tokenId)).thenReturn(Optional.of(validToken));
    when(jwtService.generateToken(mockUser)).thenReturn("new.jwt.token");

    // Act
    TokenResponse response = refreshTokensUseCase.execute(tokenId);

    // Assert
    assertNotNull(response);
    assertEquals("new.jwt.token", response.accessToken());
    verify(refreshTokenRepository).delete(validToken);
}
```

### 6.5 Naming de Tests

Formato: `execute_Should{ExpectedBehavior}_When{Scenario}`

Ejemplos:
- `execute_ShouldReturnMappedGarments_WhenUserHasGarments`
- `execute_ShouldReturnEmptyList_WhenUserHasNoGarments`
- `execute_ShouldDeleteAndThrowException_WhenTokenIsRevoked`
- `execute_ShouldThrowException_WhenTokenNotFound`

### 6.6 Uso de `ArgumentCaptor`

Para verificar **qué se guardó en el repositorio** (no solo que se llamó a `save()`):

```java
@Captor
private ArgumentCaptor<RefreshTokenEntity> refreshTokenCaptor;

// En el test:
verify(refreshTokenRepository).save(refreshTokenCaptor.capture());
RefreshTokenEntity savedToken = refreshTokenCaptor.getValue();
assertEquals(mockUser, savedToken.getUser());
assertTrue(savedToken.getExpiresAt().isAfter(OffsetDateTime.now().plusDays(29)));
```

### 6.7 Verificación de No-Interacciones

Cuando un path de error no debería tocar ciertos mocks:

```java
verifyNoInteractions(jwtService);
verify(refreshTokenRepository, never()).save(any());
```

### 6.8 Tests de Arquitectura con ArchUnit

`UseCaseArchitectureTest` valida reglas estructurales en **tiempo de compilación de tests**:

1. Toda clase `@UseCase` debe tener un método `execute()`.
2. Ninguna clase `@UseCase` puede terminar en "Service".

Estos tests evitan que las convenciones se degraden con el tiempo.

### 6.9 Test de `JwtService` (sin mocks, con `ReflectionTestUtils`)

`JwtService` usa `@Value` para inyectar secretos. En tests se usa `ReflectionTestUtils.setField()` para inyectar valores sin Spring:

```java
jwtService = new JwtService();
ReflectionTestUtils.setField(jwtService, "secretKey", testSecret);
ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1000L * 60 * 60);
```

---

## 7. Checklist para Nuevas Funcionalidades

Al implementar una nueva funcionalidad, seguir este checklist:

### Código de producción

- [ ] **Entidad**: extender `BaseEntity`, usar `@Getter @Setter @NoArgsConstructor`, relaciones `LAZY` por defecto.
- [ ] **Repositorio**: interfaz que extiende `JpaRepository<Entidad, UUID>`.
- [ ] **DTOs**: records. Requests con validación `@NotNull`/`@NotBlank`/etc. Responses con `@Builder` y `fromEntity()`.
- [ ] **UseCase**: anotar con `@UseCase`, inyección por constructor (`@RequiredArgsConstructor`), método `execute()`.
- [ ] **`@Transactional`**: `readOnly = true` para consultas, sin `readOnly` para escrituras.
- [ ] **Controller**: `@RestController`, delegar al UseCase, devolver `ApiResponse.success(data)`.
- [ ] **Errores**: lanzar `AppException(ErrorCode.XXX)`. Si se necesita un nuevo código, añadirlo al enum `ErrorCode`.
- [ ] **Si hay relaciones que deben cargarse juntas**: usar `@EntityGraph` o `@NamedEntityGraph` para evitar N+1.
- [ ] **Migración SQL**: crear `V{N}__descripcion.sql` en `db/migration/`.
- [ ] **Seed** (si aplica): crear/actualizar en `db.seeds/`.

### Tests

- [ ] **TestBuilder** para cada nueva entidad en `{modulo}/helpers/{Entidad}TestBuilder.java`.
- [ ] **Test del UseCase** en `{modulo}/usecases/{NombreUseCase}Test.java`.
- [ ] Usar `@ExtendWith(MockitoExtension.class)` + `@Mock` + `@InjectMocks`.
- [ ] Cubrir **todos los caminos**: caso feliz, entidad no encontrada, validaciones de negocio, edge cases.
- [ ] Usar `ArgumentCaptor` para verificar datos guardados.
- [ ] Usar `verifyNoInteractions()` / `verify(..., never())` para paths de error.
- [ ] Naming: `execute_Should{Behavior}_When{Condition}`.
- [ ] **Objetivo: 100% cobertura de líneas y ramas** en el UseCase.

