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

---

# 7. Preguntas teóricas 

1. ¿Cuáles fueron los principales desafíos al implementar las funcionalidades?

El primer reto fue ajustar la estructura de Ionic/Angular para que la pantalla principal funcionara correctamente con la versión actual del framework. Al ser un proyecto con componentes standalone, inicialmente aparecían muchos errores de tipo NG8001 porque no estaban importados los módulos correctos (CommonModule, FormsModule y los componentes standalone de Ionic). Tocó revisar con cuidado los imports de HomePage y agregar únicamente lo necesario.

El segundo desafío estuvo en la integración con Cordova. El comando ionic cordova build android intentaba ejecutar un builder de Angular con un parámetro --platform que mi versión de @ionic/angular-toolkit no reconocía. Para evitar bloquearme, opté por separar la build web con ionic build y luego usar directamente cordova build android, que me permitió generar el APK sin romper la compatibilidad de Angular.

Finalmente, en la parte de UX, el reto fue que la gestión de categorías, el filtrado y el feature flag resultaran claros para el usuario. Hice varios ajustes en el layout, textos y botones (por ejemplo, botón + visible, botones de “Editar” y “Eliminar” con texto y no solo iconos) hasta lograr una interfaz intuitiva.

2. ¿Qué técnicas de optimización aplicaste y por qué?

A nivel de rendimiento, empecé por mantener la lógica de datos en memoria y apoyarme en localStorage para persistencia. Esto evita llamadas remotas innecesarias, la app es muy rápida porque todo el CRUD de tareas y categorías ocurre en el cliente. En la capa de presentación, utilicé trackByTaskId en el *ngFor de las tareas para que Angular no tenga que recrear toda la lista cada vez que se actualiza una tarea; solo actualiza el item que cambió. Esto es simple pero efectivo cuando la lista crece.

Para Remote Config, configuré minimumFetchIntervalMillis a 0 solo en desarrollo, de manera que pueda ver los cambios del feature flag inmediatamente. En un entorno real, este valor se puede aumentar para reducir llamadas a Firebase y mejorar la experiencia cuando la app está en producción.

También cuidé que el servicio de feature flags cargue los valores de Remote Config una sola vez y luego los comparta mediante una instancia singleton (providedIn: 'root'). Así evito inicializaciones repetidas de Firebase y lecturas redundantes del mismo parámetro.

3. ¿Cómo aseguraste la calidad y mantenibilidad del código?

La calidad la enfoqué en tres frentes: estructura, tipado y simplicidad.

En estructura, separé responsabilidades claras: la pantalla HomePage se encarga de la lógica de tareas y categorías, mientras que FeatureFlagService se ocupa exclusivamente de inicializar Firebase y exponer los flags. La configuración sensible está aislada en firebase-config.ts. Esto facilita cambiar el origen de los flags o cambiar el backend sin tener que tocar la UI.

En cuanto al tipado, definí interfaces explícitas para Task y Category. Esto me ayudó a detectar errores tempranamente (por ejemplo, campos faltantes o mal escritos) y hace que el código sea más auto-documentado. También mantuve constantes para las claves de localStorage, evitando strings mágicas dispersas.

Por simplicidad, evité lógica compleja en el template y preferí métodos pequeños y descriptivos en el componente (addTaskFromPrompt, updateTaskCategory, deleteCategory, etc.). Además, documenté el flujo completo en el README: cómo ejecutar el proyecto, cómo compilar APK/IPA y cómo probar el feature flag. Todo esto facilita que otra persona pueda clonar el repo, ejecutar la app y entender rápidamente las decisiones que tomé.




