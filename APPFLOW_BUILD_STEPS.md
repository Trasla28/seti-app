# Generar IPA con Ionic Appflow — Pasos manuales (Dashboard)

Hemos confirmado que tu App `seti-app` (ID: `41d94b34`) existe en Appflow y está conectada a tu repositorio GitHub (`Trasla28/seti-app`).

Para generar el IPA, sigue estos pasos desde el dashboard:

## Paso 1: Accede al Dashboard

1. Ve a https://dashboard.ionicjs.com/
2. Selecciona tu App **seti-app**.

## Paso 2: Sube tus Credenciales iOS (si aún no lo has hecho)

1. En el panel izquierdo, busca **Credentials** o **Certificates**.
2. Haz clic en **+ Add Credential** o **+ Add Certificate**.
3. Selecciona **iOS Distribution**.
4. Sube tu certificado `.p12` (Apple Distribution Certificate).
5. Ingresa la contraseña del `.p12`.
6. Sube tu `mobileprovision` (Provisioning Profile).
7. Guarda/confirma.

Si ya tienes credenciales iOS, ve al Paso 3.

## Paso 3: Crear un Build

1. En el panel izquierdo, haz clic en **Builds**.
2. Haz clic en el botón **+ Create Build** (o similar).
3. Selecciona:
   - **Platform:** iOS
   - **Build Type:** Archive (para generar IPA)
   - **Branch:** master (o la rama que desees)
   - **Credential:** Selecciona la credencial iOS que subiste
4. Haz clic en **Build** o **Create Build**.

## Paso 4: Espera el resultado

- El build comenzará a compilar (puede tardar 5-15 minutos).
- Verás el estado del build en la lista de Builds.
- Cuando finalice con estado **Success**, podrás descargar el IPA.

## Paso 5: Descarga el IPA

1. Haz clic en el build completado.
2. Busca el botón **Download** o **Download IPA**.
3. Guarda el archivo `.ipa` en tu máquina.

---

## Alternativa: CLI (si tienes Enterprise)

Si tu plan incluye CLI access, puedes usar:

```bash
ionic link
ionic package build ios --release
```

---

**Notas:**

- Si tienes problemas con las credenciales, verifica que el `.p12` y el `.mobileprovision` sean válidos y correspondan al mismo equipo de desarrollo Apple.
- Los IPAs generados en Appflow son para distribución (App Store).
- Si necesitas un IPA para testing (ad-hoc), asegúrate de que tu provisioning profile sea del tipo correcto.

---

Generado automáticamente. Para soporte, revisa https://ionic.io/appflow/docs o contacta a Ionic Support.
