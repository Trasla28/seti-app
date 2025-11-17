// src/app/feature-flag.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getRemoteConfig,
  RemoteConfig,
  fetchAndActivate,
  getBoolean,
} from 'firebase/remote-config';
import { firebaseConfig } from './firebase-config';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private app?: FirebaseApp;
  private remoteConfig?: RemoteConfig;

  featureFlagsLoaded = false;

  // Flag que usaremos en la UI
  enableCategories = true; // valor por defecto

  constructor() {
    // Podemos arrancar la carga apenas se construye el servicio
    this.init();
  }

  async init(): Promise<void> {
    if (this.featureFlagsLoaded) return;

    // Inicializar Firebase solo una vez
    if (!this.app) {
      this.app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    }

    this.remoteConfig = getRemoteConfig(this.app);

    // Configuración recomendada para desarrollo (permitir recargas rápidas)
    this.remoteConfig.settings = {
    minimumFetchIntervalMillis: 0,   // en dev: permite recargar siempre
    fetchTimeoutMillis: 60000,       // 60 segundos de timeout para el fetch
    };

    // Valores por defecto de los flags
    this.remoteConfig.defaultConfig = {
      enable_categories: true,
    };

    try {
      await fetchAndActivate(this.remoteConfig);
      this.enableCategories = getBoolean(
        this.remoteConfig,
        'enable_categories'
      );
      console.log('[RemoteConfig] enable_categories =', this.enableCategories);
    } catch (err) {
      console.error('Error al cargar Remote Config', err);
      // si falla, usamos default (true)
      this.enableCategories = true;
    } finally {
      this.featureFlagsLoaded = true;
    }
  }
}
