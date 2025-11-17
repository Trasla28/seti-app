import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes standalone de Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonCheckbox,
  IonLabel,
} from '@ionic/angular/standalone';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    // Angular
    CommonModule,   // *ngIf, *ngFor, ngClass, etc.
    FormsModule,    // [(ngModel)]

    // Ionic
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonCheckbox,
    IonLabel,
  ],
})
export class HomePage implements OnInit {

  newTaskTitle = '';
  tasks: Task[] = [];
  private nextId = 1;

  // clave en localStorage
  private readonly STORAGE_KEY = 'tasks';

  // =======================
  // Ciclo de vida
  // =======================
  ngOnInit(): void {
    this.loadTasksFromStorage();
  }

  // =======================
  // Métodos públicos (UI)
  // =======================

  addTask() {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: this.nextId++,
      title,
      completed: false,
    };

    this.tasks.push(newTask);
    this.newTaskTitle = '';
    this.saveTasksToStorage();
  }

  toggleCompleted(task: Task) {
    task.completed = !task.completed;
    this.saveTasksToStorage();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasksToStorage();
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  // =======================
  // Almacenamiento local
  // =======================

  private loadTasksFromStorage(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) {
        this.tasks = parsed;
        // recalcular nextId para no reutilizar IDs
        const maxId = this.tasks.reduce((max, t) => t.id > max ? t.id : max, 0);
        this.nextId = maxId + 1;
      }
    } catch (err) {
      console.error('Error al leer tareas de localStorage', err);
    }
  }

  private saveTasksToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (err) {
      console.error('Error al guardar tareas en localStorage', err);
    }
  }
}
