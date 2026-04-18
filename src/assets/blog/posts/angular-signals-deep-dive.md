---
title: "Angular Signals: A Deep Dive into Reactive State Management"
slug: "angular-signals-deep-dive"
excerpt: "Understanding Angular's new signals API and how it changes the way we think about reactivity in Angular applications."
author: "Miguel"
publishedAt: "2024-09-10T10:00:00.000Z"
category: "web-development"
tags: ["Angular", "Signals", "TypeScript", "Frontend"]
coverImage: "/assets/img/blog/angular-signals.jpg"
featured: false
published: true
---

# Angular Signals: A Deep Dive into Reactive State Management

Angular 16+ introduced Signals, a new primitive for reactive state management that simplifies how we handle reactivity in Angular applications. In this article, we'll explore signals in depth and how they compare to traditional approaches.

## What are Signals?

Signals are a new reactive primitive that tracks state changes and notifies consumers when the value changes. Unlike RxJS Observables, signals are synchronous and simpler to use.

```typescript
import { signal, computed, effect } from '@angular/core';

// Create a signal
const count = signal(0);

// Read the value
console.log(count()); // 0

// Update the value
count.set(1);
count.update(value => value + 1);

// Computed signals
const doubleCount = computed(() => count() * 2);

// Effects
effect(() => {
  console.log('Count changed:', count());
});
```

## Signals vs Observables

### When to Use Signals

- **Component state**: Local UI state
- **Simple derived values**: Computed values from other signals
- **Synchronous operations**: When you don't need async

### When to Use Observables

- **HTTP requests**: Async operations
- **Complex event streams**: Debounce, throttle, merge
- **Interop with services**: Most Angular services use RxJS

## Practical Examples

### Counter Component

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <button (click)="decrement()">-</button>
      <span>{{ count() }}</span>
      <button (click)="increment()">+</button>
    </div>
    <p>Double: {{ doubleCount() }}</p>
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

### Todo List with Signals

```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  template: `
    <input #newTodo (keyup.enter)="addTodo(newTodo.value); newTodo.value = ''">
    
    <ul>
      @for (todo of filteredTodos(); track todo.id) {
        <li [class.completed]="todo.completed">
          <input type="checkbox" 
                 [checked]="todo.completed"
                 (change)="toggleTodo(todo.id)">
          {{ todo.text }}
        </li>
      }
    </ul>
    
    <div class="filters">
      <button (click)="filter.set('all')" [class.active]="filter() === 'all'">All</button>
      <button (click)="filter.set('active')" [class.active]="filter() === 'active'">Active</button>
      <button (click)="filter.set('completed')" [class.active]="filter() === 'completed'">Completed</button>
    </div>
    
    <p>{{ remainingCount() }} items left</p>
  `
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');
  
  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    
    switch (currentFilter) {
      case 'active':
        return allTodos.filter(t => !t.completed);
      case 'completed':
        return allTodos.filter(t => t.completed);
      default:
        return allTodos;
    }
  });
  
  remainingCount = computed(() => 
    this.todos().filter(t => !t.completed).length
  );
  
  addTodo(text: string) {
    this.todos.update(todos => [
      ...todos,
      { id: Date.now(), text, completed: false }
    ]);
  }
  
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
}
```

## Signal-Based Services

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSignal = signal<User | null>(null);
  private loadingSignal = signal(false);
  
  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);
  
  constructor(private http: HttpClient) {}
  
  login(email: string, password: string) {
    this.loadingSignal.set(true);
    
    this.http.post<User>('/api/login', { email, password })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: user => this.userSignal.set(user),
        error: err => console.error('Login failed', err)
      });
  }
  
  logout() {
    this.userSignal.set(null);
  }
}
```

## Performance Benefits

Signals provide better performance because:

1. **Fine-grained updates**: Only affected components update
2. **No Zone.js dependency**: Works with zoneless Angular
3. **Automatic cleanup**: No need to unsubscribe

## Conclusion

Angular Signals represent a significant evolution in Angular's reactivity model. They simplify state management while providing excellent performance. Start incorporating signals into your new features and gradually migrate existing code for cleaner, more maintainable applications.
