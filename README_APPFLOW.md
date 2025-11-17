# Ionic Appflow — Instrucciones rápidas

Este documento explica cómo conectar este repositorio a Ionic Appflow y generar un IPA (iOS) a partir de los certificados/provisioning profile.

Requisitos previos

- Cuenta en Ionic Appflow (https://ionic.io/appflow)
- Certificado de distribución en formato `.p12` (Apple Distribution) y su contraseña
- Provisioning Profile (.mobileprovision) para el `bundleId` de tu app

Pasos en Appflow (resumen)

1. Accede a https://dashboard.ionicjs.com/ y crea una nueva App. Conecta el repositorio (GitHub/GitLab/Bitbucket).
2. En la App -> **Credentials**, sube tu certificado `.p12` y el provisioning profile. Appflow pedirá la contraseña del `.p12`.
3. Configura el `bundle id` en Appflow si no lo detecta automáticamente.
4. Crea un nuevo build: elige plataforma **iOS**, el tipo **archive**, y selecciona la credencial que subiste.
5. Ejecuta el build. Cuando finalice podrás descargar el IPA desde la sección de builds.

Seguridad

- No subas contraseñas en texto plano a repositorios públicos.
- Mantén tus certificados en un lugar seguro. Appflow almacena las credenciales de forma cifrada.

Archivos de ejemplo incluidos en este repo

- `scripts/encode_appflow_secrets.ps1`: script para codificar `p12` y `mobileprovision` como base64 (útil si usas la API de Appflow o secretos automatizados).
- `build.json.example`: ejemplo de `build.json` (placeholders) para uso local o referencia.
- `exportOptions.plist.example`: `exportOptions.plist` de ejemplo para Xcode export.

Uso rápido (si prefieres línea de comandos)

- Puedes usar el CLI de Appflow (`ionic login` y `ionic link`) y luego `ionic deploy`/`ionic package` según la documentación de Appflow.

Si quieres, puedo:

- (A) crear el build en Appflow por ti si me proporcionas un token de Appflow y autorizas el uso (no se recomienda compartir tokens públicamente), o
- (B) dejar todo preparado y mostrártelo paso a paso para que lo ejecutes desde tu cuenta.

--
Generado automáticamente por el asistente.
