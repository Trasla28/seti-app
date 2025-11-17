// src/app/services/task-data.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  private _storage!: Storage;

  // Claves para Ionic Storage
  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa Ionic Storage
   */
  private async init(): Promise<void> {
    this._storage = await this.storage.create();

    // Inicializamos arreglos vacíos si no existen
    const tasks = await this._storage.get(this.TASKS_KEY);
    if (!tasks) {
      await this._storage.set(this.TASKS_KEY, []);
    }

    const categories = await this._storage.get(this.CATEGORIES_KEY);
    if (!categories) {
      await this._storage.set(this.CATEGORIES_KEY, []);
    }
  }

  // =========================
  // Métodos privados de ayuda
  // =========================

  private async getRawTasks(): Promise<Task[]> {
    const tasks = await this._storage.get(this.TASKS_KEY);
    return tasks || [];
  }

  private async setRawTasks(tasks: Task[]): Promise<void> {
    await this._storage.set(this.TASKS_KEY, tasks);
  }

  private async getRawCategories(): Promise<Category[]> {
    const categories = await this._storage.get(this.CATEGORIES_KEY);
    return categories || [];
  }

  private async setRawCategories(categories: Category[]): Promise<void> {
    await this._storage.set(this.CATEGORIES_KEY, categories);
  }

  /**
   * Genera un ID simple para tareas/categorías
   */
  private generateId(): string {
    return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8);
  }

  // =========================
  //      TAREAS (TASKS)
  // =========================

  /**
   * Retorna todas las tareas
   */
  async getTasks(): Promise<Task[]> {
    return this.getRawTasks();
  }

  /**
   * Retorna tareas filtradas por categoría
   * @param categoryId ID de la categoría
   */
  async getTasksByCategory(categoryId: string): Promise<Task[]> {
    const tasks = await this.getRawTasks();
    return tasks.filter(t => t.categoryId === categoryId);
  }

  /**
   * Agrega una nueva tarea
   * @param title Título de la tarea
   * @param categoryId (opcional) ID de la categoría
   */
  async addTask(title: string, categoryId?: string): Promise<Task> {
    const tasks = await this.getRawTasks();

    const newTask: Task = {
      id: this.generateId(),
      title,
      completed: false,
      categoryId,
      createdAt: Date.now()
    };

    tasks.push(newTask);
    await this.setRawTasks(tasks);

    return newTask;
  }

  /**
   * Actualiza una tarea completa (por ejemplo desde un formulario de edición)
   */
  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = await this.getRawTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);

    if (index !== -1) {
      tasks[index] = { ...updatedTask };
      await this.setRawTasks(tasks);
    }
  }

  /**
   * Marca una tarea como completada / no completada
   * @param taskId ID de la tarea
   * @param completed nuevo estado
   */
  async setTaskCompleted(taskId: string, completed: boolean): Promise<void> {
    const tasks = await this.getRawTasks();
    const index = tasks.findIndex(t => t.id === taskId);

    if (index !== -1) {
      tasks[index] = { ...tasks[index], completed };
      await this.setRawTasks(tasks);
    }
  }

  /**
   * Cambia el título de la tarea (atajo rápido)
   */
  async renameTask(taskId: string, newTitle: string): Promise<void> {
    const tasks = await this.getRawTasks();
    const index = tasks.findIndex(t => t.id === taskId);

    if (index !== -1) {
      tasks[index] = { ...tasks[index], title: newTitle };
      await this.setRawTasks(tasks);
    }
  }

  /**
   * Elimina una tarea por ID
   */
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getRawTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    await this.setRawTasks(filtered);
  }

  /**
   * Elimina todas las tareas (por si quieres un botón de "limpiar")
   */
  async clearAllTasks(): Promise<void> {
    await this.setRawTasks([]);
  }

  // =========================
  //     CATEGORÍAS
  // =========================

  /**
   * Retorna todas las categorías
   */
  async getCategories(): Promise<Category[]> {
    return this.getRawCategories();
  }

  /**
   * Agrega una nueva categoría
   * @param name Nombre de la categoría
   * @param color Color (opcional) por ejemplo "#FF0000"
   */
  async addCategory(name: string, color?: string): Promise<Category> {
    const categories = await this.getRawCategories();

    const newCategory: Category = {
      id: this.generateId(),
      name,
      color
    };

    categories.push(newCategory);
    await this.setRawCategories(categories);

    return newCategory;
  }

  /**
   * Actualiza una categoría completa
   */
  async updateCategory(updatedCategory: Category): Promise<void> {
    const categories = await this.getRawCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);

    if (index !== -1) {
      categories[index] = { ...updatedCategory };
      await this.setRawCategories(categories);
    }
  }

  /**
   * Renombra una categoría (atajo rápido)
   */
  async renameCategory(categoryId: string, newName: string): Promise<void> {
    const categories = await this.getRawCategories();
    const index = categories.findIndex(c => c.id === categoryId);

    if (index !== -1) {
      categories[index] = { ...categories[index], name: newName };
      await this.setRawCategories(categories);
    }
  }

  /**
   * Cambia el color de una categoría (atajo rápido)
   */
  async recolorCategory(categoryId: string, newColor: string): Promise<void> {
    const categories = await this.getRawCategories();
    const index = categories.findIndex(c => c.id === categoryId);

    if (index !== -1) {
      categories[index] = { ...categories[index], color: newColor };
      await this.setRawCategories(categories);
    }
  }

  /**
   * Elimina una categoría.
   * Opcionalmente, también limpia esa categoría de las tareas asociadas.
   * @param categoryId ID de la categoría
   * @param removeCategoryFromTasks si es true, borra el categoryId en las tareas que la usaban
   */
  async deleteCategory(categoryId: string, removeCategoryFromTasks: boolean = false): Promise<void> {
    // 1) Eliminar categoría
    const categories = await this.getRawCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    await this.setRawCategories(filteredCategories);

    // 2) Manejar tareas asociadas
    if (removeCategoryFromTasks) {
      const tasks = await this.getRawTasks();
      const updatedTasks = tasks.map(task => {
        if (task.categoryId === categoryId) {
          // Opción A: quitar la categoría
          const { categoryId, ...rest } = task;
          return { ...rest };
        }
        return task;
      });
      await this.setRawTasks(updatedTasks as Task[]);
    }
  }

  /**
   * Elimina todas las categorías
   */
  async clearAllCategories(): Promise<void> {
    await this.setRawCategories([]);
  }

}
