---
slug: flutter-clean-architecture
lang: es
title: "Arquitectura Limpia en Flutter: Guía Práctica"
excerpt: "Aprende a estructurar tus aplicaciones Flutter usando principios de arquitectura limpia para mayor mantenibilidad y testabilidad."
author: Miguel
publishedAt: 2024-11-20
category: mobile-development
tags: [Flutter, Dart, Architecture, Mobile]
coverImage: /assets/img/blog/flutter-architecture.jpg
featured: true
published: true
---

# Arquitectura Limpia en Flutter: Guía Práctica

Después de construir varias aplicaciones Flutter en producción, he encontrado que la arquitectura limpia es la forma más efectiva de crear apps móviles mantenibles, testeables y escalables. En esta guía comparto mi enfoque para implementar arquitectura limpia en Flutter.

## ¿Por qué Arquitectura Limpia?

La arquitectura limpia ofrece varios beneficios:

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
- **Testeabilidad**: La lógica de negocio está aislada y es fácil de testear
- **Flexibilidad**: Puedes intercambiar implementaciones sin afectar otras capas
- **Escalabilidad**: Fácil agregar nuevas funcionalidades sin romper código existente

## Estructura del Proyecto

Esta es la estructura de carpetas que uso en proyectos Flutter:

```
lib/
├── core/
│   ├── error/
│   ├── network/
│   ├── utils/
│   └── widgets/
├── features/
│   └── auth/
│       ├── data/
│       │   ├── datasources/
│       │   ├── models/
│       │   └── repositories/
│       ├── domain/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── usecases/
│       └── presentation/
│           ├── bloc/
│           ├── pages/
│           └── widgets/
└── injection_container.dart
```

## Las Tres Capas

### Capa de Dominio

La capa de dominio contiene la lógica de negocio y es la capa más interna. No tiene dependencias de frameworks externos.

```dart
// Entidad
class User {
  final String id;
  final String email;
  final String name;
  
  const User({
    required this.id,
    required this.email,
    required this.name,
  });
}

// Contrato de Repositorio
abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, Unit>> logout();
}

// Caso de Uso
class LoginUseCase {
  final AuthRepository repository;
  
  LoginUseCase(this.repository);
  
  Future<Either<Failure, User>> call(LoginParams params) {
    return repository.login(params.email, params.password);
  }
}
```

### Capa de Datos

La capa de datos implementa los contratos del repositorio y maneja las fuentes de datos.

```dart
// Modelo
class UserModel extends User {
  const UserModel({
    required String id,
    required String email,
    required String name,
  }) : super(id: id, email: email, name: name);
  
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      name: json['name'],
    );
  }
}

// Implementación del Repositorio
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  
  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    try {
      final user = await remoteDataSource.login(email, password);
      await localDataSource.cacheUser(user);
      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
}
```

### Capa de Presentación

La capa de presentación maneja la UI y la gestión de estado. Prefiero usar BLoC para la gestión de estado.

```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  
  AuthBloc({required this.loginUseCase}) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
  }
  
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    final result = await loginUseCase(
      LoginParams(email: event.email, password: event.password),
    );
    
    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }
}
```

## Inyección de Dependencias

Uso GetIt para la inyección de dependencias:

```dart
final sl = GetIt.instance;

Future<void> init() async {
  // Bloc
  sl.registerFactory(() => AuthBloc(loginUseCase: sl()));
  
  // Casos de uso
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  
  // Repositorio
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );
}
```

## Conclusión

La arquitectura limpia requiere más configuración inicial, pero los beneficios en mantenibilidad y testeabilidad lo justifican. Empieza con poco y adopta estos patrones gradualmente a medida que tu aplicación crece.
