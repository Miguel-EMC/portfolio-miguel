---
title: "Clean Architecture in Flutter: A Practical Guide"
slug: "flutter-clean-architecture"
excerpt: "Learn how to structure your Flutter applications using clean architecture principles for better maintainability and testability."
author: "Miguel"
publishedAt: "2024-11-20T10:00:00.000Z"
category: "mobile-development"
tags: ["Flutter", "Dart", "Architecture", "Mobile"]
coverImage: "/assets/img/blog/flutter-architecture.jpg"
featured: true
published: true
---

# Clean Architecture in Flutter: A Practical Guide

After building several production Flutter applications, I've found that clean architecture is the most effective way to create maintainable, testable, and scalable mobile apps. In this guide, I'll share my approach to implementing clean architecture in Flutter.

## Why Clean Architecture?

Clean architecture provides several benefits:

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: Business logic is isolated and easy to test
- **Flexibility**: You can swap implementations without affecting other layers
- **Scalability**: Easy to add new features without breaking existing code

## Project Structure

Here's the folder structure I use for Flutter projects:

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

## The Three Layers

### Domain Layer

The domain layer contains the business logic and is the innermost layer. It has no dependencies on external frameworks.

```dart
// Entity
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

// Repository Contract
abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, Unit>> logout();
}

// Use Case
class LoginUseCase {
  final AuthRepository repository;
  
  LoginUseCase(this.repository);
  
  Future<Either<Failure, User>> call(LoginParams params) {
    return repository.login(params.email, params.password);
  }
}
```

### Data Layer

The data layer implements the repository contracts and handles data sources.

```dart
// Model
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

// Repository Implementation
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  
  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });
  
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

### Presentation Layer

The presentation layer handles UI and state management. I prefer using BLoC for state management.

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

## Dependency Injection

I use GetIt for dependency injection:

```dart
final sl = GetIt.instance;

Future<void> init() async {
  // Bloc
  sl.registerFactory(() => AuthBloc(loginUseCase: sl()));
  
  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  
  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );
  
  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(client: sl()),
  );
}
```

## Conclusion

Clean architecture requires more initial setup, but the benefits in maintainability and testability are worth it. Start small and gradually adopt these patterns as your application grows.
