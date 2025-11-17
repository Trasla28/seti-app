import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ionic standalone
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
} from '@ionic/angular/standalone';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  categoryId?: string | null;
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonButton,
    IonList,
    IonCheckbox,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButtons,
  ],
})
export class HomePage implements OnInit {

  // ====== tareas ======
  newTaskTitle = '';
  tasks: Task[] = [];
  private nextTaskId = 1;
  private readonly STORAGE_TASKS_KEY = 'tasks';

  // ====== categorías ======
  categories: Category[] = [];
  newCategoryName = '';
  private readonly STORAGE_CATEGORIES_KEY = 'categories';

  // categoría seleccionada para FILTRAR
  selectedCategoryIdFilter: string = ''; // '' = todas

  // categoría seleccionada al CREAR una nueva tarea
  selectedCategoryIdForNewTask: string = ''; // '' = sin categoría

  ngOnInit(): void {
    this.loadCategoriesFromStorage();
    this.loadTasksFromStorage();
  }

  // =======================
  //       TAREAS
  // =======================

  addTask() {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: this.nextTaskId++,
      title,
      completed: false,
      categoryId: this.selectedCategoryIdForNewTask || null,
    };

    this.tasks.push(newTask);
    this.newTaskTitle = '';
    this.saveTasksToStorage();
  }

  /** Botón + de TAREAS (título) */
  addTaskFromPrompt() {
    const title = window.prompt('Descripción de la nueva tarea');
    if (!title) return;

    this.newTaskTitle = title;
    // si hay filtro aplicado, usamos esa categoría por defecto
    this.selectedCategoryIdForNewTask = this.selectedCategoryIdFilter || '';
    this.addTask();
  }

  toggleCompleted(task: Task) {
    task.completed = !task.completed;
    this.saveTasksToStorage();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasksToStorage();
  }

  /** Cambiar la categoría de una tarea ya creada */
  updateTaskCategory(task: Task, categoryId: string | null | '') {
    task.categoryId = categoryId || null; // '' -> null
    this.saveTasksToStorage();
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  get filteredTasks(): Task[] {
    if (!this.selectedCategoryIdFilter) {
      return this.tasks;
    }
    return this.tasks.filter(
      t => t.categoryId === this.selectedCategoryIdFilter
    );
  }

  getCategoryName(categoryId?: string | null): string {
    if (!categoryId) return 'Sin categoría';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Sin categoría';
  }

  // =======================
  //     CATEGORÍAS
  // =======================

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    const newCategory: Category = {
      id: this.generateId(),
      name,
    };

    this.categories.push(newCategory);
    this.newCategoryName = '';
    this.saveCategoriesToStorage();
  }

  /** Botón + de CATEGORÍAS (título) */
  addCategoryFromPrompt() {
    const name = window.prompt('Nombre de la nueva categoría');
    if (!name) return;

    this.newCategoryName = name;
    this.addCategory();
  }

  renameCategory(category: Category) {
    const nuevoNombre = window.prompt('Nuevo nombre de la categoría', category.name);
    if (!nuevoNombre) return;

    category.name = nuevoNombre.trim();
    this.saveCategoriesToStorage();
  }

  deleteCategory(category: Category) {
    this.categories = this.categories.filter(c => c.id !== category.id);
    this.saveCategoriesToStorage();

    this.tasks = this.tasks.map(t =>
      t.categoryId === category.id ? { ...t, categoryId: null } : t
    );
    this.saveTasksToStorage();

    if (this.selectedCategoryIdFilter === category.id) {
      this.selectedCategoryIdFilter = '';
    }

    if (this.selectedCategoryIdForNewTask === category.id) {
      this.selectedCategoryIdForNewTask = '';
    }
  }

  // =======================
  //  Almacenamiento local
  // =======================

  private loadTasksFromStorage(): void {
    const raw = localStorage.getItem(this.STORAGE_TASKS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) {
        this.tasks = parsed;
        const maxId = this.tasks.reduce(
          (max, t) => (t.id > max ? t.id : max),
          0
        );
        this.nextTaskId = maxId + 1;
      }
    } catch (err) {
      console.error('Error al leer tareas de localStorage', err);
    }
  }

  private saveTasksToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(this.tasks));
    } catch (err) {
      console.error('Error al guardar tareas en localStorage', err);
    }
  }

  private loadCategoriesFromStorage(): void {
    const raw = localStorage.getItem(this.STORAGE_CATEGORIES_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Category[];
      if (Array.isArray(parsed)) {
        this.categories = parsed;
      }
    } catch (err) {
      console.error('Error al leer categorías de localStorage', err);
    }
  }

  private saveCategoriesToStorage(): void {
    try {
      localStorage.setItem(
        this.STORAGE_CATEGORIES_KEY,
        JSON.stringify(this.categories)
      );
    } catch (err) {
      console.error('Error al guardar categorías en localStorage', err);
    }
  }

  private generateId(): string {
    return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8);
  }
}
