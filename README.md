# SETI To-Do App – Ionic + Cordova + Firebase Remote Config

Aplicación híbrida construida con **Ionic Angular**, **Cordova**, y **Firebase Remote Config**.  
Desarrollada como parte de la prueba técnica, incluye:

- Lista de tareas con CRUD completo  
- Sistema de categorías (crear, editar, eliminar)  
- Asignación de categorías a tareas  
- Filtro por categoría  
- Persistencia local con LocalStorage  
- Feature flag remoto (`enable_categories`) usando Firebase Remote Config  
- Proyecto preparado para compilación en **Android** e **iOS** con Cordova  
- Código modular, mantenible y documentado  

---

## Tecnologías utilizadas

- **Ionic 7 + Angular 17 (Standalone Components)**
- **Cordova**
- **Firebase Remote Config**
- **TypeScript**
- **LocalStorage**

---

# 1. Instalación del proyecto

```bash
git clone https://github.com/TU_USUARIO/seti-app.git
cd seti-app
npm install
ionic serve
```
Abrirá la app en:
http://localhost:8100

---

# 2. Integración con Firebase & Remote Config

2.1 Crear un proyecto en Firebase

- Ingresar a https://console.firebase.google.com
- Crear proyecto
- Registrar la app Web (icono </>)

2.2 Configuración en el proyecto

Crear archivo:

src/app/firebase-config.ts

```bash
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};
```

2.3 Crear parámetro de Remote Config

Firebase → Remote Config → Agregar parámetro

2.4 ¿Cómo funciona el feature flag?

enable_categories = true
→ Se muestra todo el módulo de categorías (CRUD completo).

enable_categories = false
→ El módulo desaparece y se muestra un mensaje indicando que fue desactivado.

---

# 3. Preparación para Android e iOS (Cordova)
3.1 Instalar herramientas
npm install -g cordova native-run cordova-res

3.2 Habilitar integración Cordova en Ionic
ionic integrations enable cordova

3.3 Añadir plataformas
Android:
cordova platform add android

iOS (solo macOS):
cordova platform add ios

---

# 4. Compilar APK (Android)
4.1 Generar build web
ionic build

4.2 Compilar APK
cordova build android


El archivo resultante estará en:

platforms/android/app/build/outputs/apk/debug/app-debug.apk

4.3 Ejecutar en un dispositivo/emulador
cordova run android

---

# 5. Compilar IPA (iOS)

Solo disponible en macOS

cordova build ios


Luego abrir Xcode:

open platforms/ios/


Generar .ipa desde
Product → Archive → Distribute App

---

# 6. Funcionalidades implementadas
- CRUD de tareas

Crear tareas

Marcar como completadas

Eliminar tareas

- CRUD de categorías

Crear categoría

Editar categoría

Eliminar categoría

- Asignar categoría a una tarea

Tarea sin categoría → asignarla

Tarea con categoría → cambiarla

- Filtro por categoría

ion-select en el header permite filtrar todas las tareas.

- Persistencia local

Todo se guarda en localStorage.

- Feature flag con Firebase

Controla dinámicamente si las categorías están activas o no.




