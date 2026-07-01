---
slug: angular-signals-deep-dive
lang: es
title: "Angular Signals: Un Análisis Profundo del Estado Reactivo"
excerpt: "Comprende la nueva API de signals de Angular y cómo cambia nuestra forma de pensar sobre la reactividad en aplicaciones Angular."
author: Miguel
publishedAt: 2024-09-10
category: web-development
tags: [Angular, Signals, TypeScript, Frontend]
coverImage: /assets/img/blog/angular-signals.jpg
featured: false
published: true
---

# Angular Signals: Un Análisis Profundo del Estado Reactivo

Angular 16+ introdujo los Signals, un nuevo primitivo para la gestión de estado reactivo que simplifica cómo manejamos la reactividad en aplicaciones Angular. En este artículo exploraremos los signals en profundidad y cómo se comparan con los enfoques tradicionales.

## ¿Qué son los Signals?

Los Signals son un nuevo primitivo reactivo que rastrea cambios de estado y notifica a los consumidores cuando el valor cambia. A diferencia de los Observables de RxJS, los signals son síncronos y más simples de usar.

```typescript
import { signal, computed, effect } from '@angular/core';

// Crear un signal
const count = signal(0);

// Leer el valor
console.log(count()); // 0

// Actualizar el valor
count.set(1);
count.update(value => value + 1);

// Signals computados
const doubleCount = computed(() => count() * 2);

// Efectos
effect(() => {
  console.log('Count cambió:', count());
});
```

## Signals vs Observables

### Cuándo usar Signals

- **Estado de componentes**: Estado local de UI
- **Valores derivados simples**: Valores computados a partir de otros signals
- **Operaciones síncronas**: Cuando no necesitas async

### Cuándo usar Observables

- **Peticiones HTTP**: Operaciones asíncronas
- **Streams de eventos complejos**: Debounce, throttle, merge
- **Interoperabilidad con servicios**: La mayoría de servicios Angular usan RxJS

## Ejemplos Prácticos

### Componente Contador

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <button (click)="decrement()">-</button>
      <span>{{ count() }}</span>
      <button (click)="increment()">+</button>
    </div>
    <p>Doble: {{ doubleCount() }}</p>
  `
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(n => n + 1);
  }
  
  decrement() {
    this.count.update(n => n - 1);
  }
}
```

## Servicios Basados en Signals

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSignal = signal<User | null>(null);
  private loadingSignal = signal(false);
  
  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);
  
  login(email: string, password: string) {
    this.loadingSignal.set(true);
    
    this.http.post<User>('/api/login', { email, password })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: user => this.userSignal.set(user),
        error: err => console.error('Login fallido', err)
      });
  }
  
  logout() {
    this.userSignal.set(null);
  }
}
```

## Beneficios de Rendimiento

Los Signals ofrecen mejor rendimiento porque:

1. **Actualizaciones granulares**: Solo se actualizan los componentes afectados
2. **Sin dependencia de Zone.js**: Funciona con Angular sin zonas
3. **Limpieza automática**: No es necesario cancelar suscripciones

## Conclusión

Angular Signals representan una evolución significativa en el modelo de reactividad de Angular. Simplifican la gestión de estado ofreciendo excelente rendimiento. Empieza a incorporar signals en tus nuevas funcionalidades y migra el código existente gradualmente para obtener aplicaciones más limpias y mantenibles.
