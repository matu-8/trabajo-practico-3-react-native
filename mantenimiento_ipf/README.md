# Mantenimiento IPF

App para que alumnos y docentes reporten desperfectos del edificio (una luz quemada, una canilla
que pierde, un proyector roto) y reciban un aviso cuando se resuelven.

Es el desarrollo de sistema del **TP3 · Permisos móviles (Android, iOS y Expo)** — Parte G del
enunciado. Toda la app está construida alrededor de una idea: **pedir cada permiso en el momento
justo, leer bien la respuesta del sistema y tener siempre un camino alternativo** para que ninguna
persona quede bloqueada sin poder reportar.

---

## 1. Stack

| Pieza | Versión | Para qué |
| --- | --- | --- |
| Expo SDK | 57 | Base del proyecto |
| React Native | 0.86.3 | — |
| TypeScript | 6.0.3 | Todo el código tipado (`strict: true`) |
| Expo Router | 57.0.29 | Navegación por archivos en `src/app` |
| expo-camera | 57.0.6 | Escáner de QR y foto del desperfecto |
| expo-location | 57.0.22 | Ubicación en primer plano |
| expo-image-picker | 57.0.20 | Selector de imágenes del sistema (sin permiso de galería) |
| expo-notifications | 57.0.23 | Canal y notificación local de aviso |
| expo-glass-effect | 57.0.4 | Liquid glass de iOS 26+ |
| expo-blur | 57.0.3 | Desenfoque real en iOS anteriores a 26 |
| expo-linear-gradient | 57.0.2 | Fondo con degradado de la paleta |
| @react-native-async-storage/async-storage | 2.2.0 | Guardado local de reportes y avisos |

> `expo-permissions` **no** está instalado: está deprecado y el enunciado lo prohíbe. Cada permiso
> se pide con la API del módulo que lo corresponde (`Camera.requestCameraPermissionsAsync()`,
> `Location.requestForegroundPermissionsAsync()`, `Notifications.requestPermissionsAsync()`).

### Cómo se corre

```bash
npm install
npx expo start          # Expo Go
npx expo run:android    # development build (obligatoria para ver los textos de propósito)
npx expo run:ios
```

Comandos de control:

```bash
npx expo lint           # ESLint (eslint-config-expo)
npx tsc --noEmit        # TypeScript
npx expo-doctor         # dependencias vs. SDK
npx expo prebuild --clean   # genera android/ e ios/ (auditoría del manifiesto)
```

---

## 2. Árbol de `src/app` y mapa de rutas

```
src/app/
├── _layout.tsx                 Stack raíz + ThemeProvider + AlmacenReportesProvider
│                               + <Stack.Screen name="permisos/[recurso]" presentation="modal" />
├── (tabs)/
│   ├── _layout.tsx             NativeTabs: Reportes · Avisos · Permisos
│   ├── _layout.web.tsx         Versión headless (expo-router/ui) para web
│   ├── index.tsx               → /
│   ├── avisos.tsx              → /avisos
│   └── permisos.tsx            → /permisos
├── reporte/
│   ├── _layout.tsx             Stack con encabezado nativo
│   ├── nuevo.tsx               → /reporte/nuevo
│   ├── escanear.tsx            → /reporte/escanear
│   ├── foto.tsx                → /reporte/foto
│   ├── ubicacion.tsx           → /reporte/ubicacion
│   └── [id].tsx                → /reporte/[id]
├── permisos/
│   └── [recurso].tsx           → /permisos/[recurso]   (modal)
└── ajustes-app.tsx             → /ajustes-app
```

| URL | Archivo | Pantalla | Permiso |
| --- | --- | --- | --- |
| `/` | `src/app/(tabs)/index.tsx` | Inicio: mis reportes y botón "Nuevo reporte" | Ninguno |
| `/reporte/nuevo` | `src/app/reporte/nuevo.tsx` | Formulario: título, descripción, aula y categoría | **Ninguno al abrir** |
| `/reporte/escanear` | `src/app/reporte/escanear.tsx` | Escáner de QR del aula | Cámara (4 estados) |
| `/reporte/foto` | `src/app/reporte/foto.tsx` | Adjuntar foto del desperfecto | Cámara solo para "Sacar foto" |
| `/reporte/ubicacion` | `src/app/reporte/ubicacion.tsx` | Marcar dónde está el problema | Ubicación en primer plano |
| `/reporte/[id]` | `src/app/reporte/[id].tsx` | Detalle del reporte + "Simular resolución" | Ninguno |
| `/avisos` | `src/app/(tabs)/avisos.tsx` | Bandeja de avisos dentro de la app | Ninguno |
| `/permisos` | `src/app/(tabs)/permisos.tsx` | Panel con el estado de cada permiso | Ninguno |
| `/permisos/[recurso]` | `src/app/permisos/[recurso].tsx` | Pantalla previa antes del diálogo | El que se va a pedir |
| `/ajustes-app` | `src/app/ajustes-app.tsx` | Interruptor "Avisarme cuando se resuelva mi reporte" | Notificaciones, al activar |

El grupo `(tabs)` **no cambia ninguna URL**: solo organiza las tres pestañas dentro de la barra
nativa. Las URLs exigidas por el enunciado son exactamente las de la tabla.

---

## 3. Configuración de permisos (`app.json`)

### 3.1 Bloque `plugins` comentado

```jsonc
"plugins": [
  "expo-router",

  ["expo-splash-screen", {
    "backgroundColor": "#022b3a",
    "image": "./assets/images/splash-icon.png",
    "imageWidth": 128
  }],

  // Cámara: lee QR y saca fotos. El micrófono se apaga por completo.
  ["expo-camera", {
    "cameraPermission": "Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto que reportás.",
    "microphonePermission": false,   // quita NSMicrophoneUsageDescription del Info.plist
    "recordAudioAndroid": false,     // no agrega RECORD_AUDIO al manifiesto
    "barcodeScannerEnabled": true
  }],

  // Selector de imágenes: la app NO accede a la galería.
  ["expo-image-picker", {
    "photosPermission": false,       // quita NSPhotoLibraryUsageDescription
    "cameraPermission": "Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto que reportás.",
    "microphonePermission": false    // quita RECORD_AUDIO
  }],

  // Ubicación: solo primer plano, nunca en segundo plano.
  ["expo-location", {
    "locationWhenInUsePermission": "Usamos tu ubicación mientras usás la app para marcar en qué sector del edificio está el desperfecto que reportás.",
    "locationAlwaysAndWhenInUsePermission": false,  // no declaramos "siempre"
    "locationAlwaysPermission": false,
    "motionUsagePermission": false,                  // no usamos el sensor de movimiento
    "isAndroidBackgroundLocationEnabled": false,     // no ACCESS_BACKGROUND_LOCATION
    "isIosBackgroundLocationEnabled": false          // no UIBackgroundModes
  }],

  // Notificaciones: canal propio "reportes".
  ["expo-notifications", {
    "icon": "./assets/images/notification-icon.png",
    "color": "#1f7a8c",
    "defaultChannel": "reportes"
  }]
]
```

### 3.2 Textos de propósito

Todos siguen el molde **"Usamos tu [dato] para [beneficio concreto]"**, que es lo que pide la
pauta 5.1.1 de Apple:

| Recurso | Clave | Texto |
| --- | --- | --- |
| Cámara | `NSCameraUsageDescription` | "Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto que reportás." |
| Ubicación | `NSLocationWhenInUseUsageDescription` | "Usamos tu ubicación mientras usás la app para marcar en qué sector del edificio está el desperfecto que reportás." |
| Fotos | — | **No se declara nada**: la app no pide permiso de galería |
| Micrófono | — | **No se declara nada**: la app no graba audio |
| Notificaciones | — | iOS no lleva texto de propósito para las notificaciones |

### 3.3 Mínimo privilegio: `android.blockedPermissions`

Cada permiso bloqueado sale del manifiesto final con `tools:node="remove"`:

| Permiso bloqueado | Por qué |
| --- | --- |
| `android.permission.RECORD_AUDIO` | La app no graba video ni audio. `expo-camera` lo agrega por defecto aunque solo se usen fotos. |
| `android.permission.READ_MEDIA_IMAGES` | La app nunca lee la galería: usa el selector del sistema, que no necesita permiso. |
| `android.permission.READ_MEDIA_VIDEO` | Ídem, para video. |
| `android.permission.READ_EXTERNAL_STORAGE` | Declarado por `expo-image` y `expo-image-picker` con `maxSdkVersion="32"`; el selector moderno no lo necesita. |
| `android.permission.WRITE_EXTERNAL_STORAGE` | La app no escribe nada fuera de su propia carpeta. |
| `android.permission.SYSTEM_ALERT_WINDOW` | La app no flota sobre otras ni muestra ventanas superpuestas. |
| `android.permission.ACCESS_BACKGROUND_LOCATION` | Solo se marca el lugar del desperfecto mientras la app está abierta. |
| `android.permission.FOREGROUND_SERVICE_LOCATION` | No hay seguimiento en segundo plano. |
| `android.permission.ACTIVITY_RECOGNITION` | No se usa el sensor de movimiento ni actividad física. |

> `blockedPermissions` **no funciona en Expo Go**: solo tiene efecto en el prebuild, en las
> development builds y en las builds de producción. Por eso los textos de propósito tampoco se ven
> en Expo Go (ver §7).

---

## 4. Tabla de permisos

| Recurso | Módulo de Expo | Cuándo se pide | Si lo deniega | Matiz |
| --- | --- | --- | --- | --- |
| **Cámara** | `expo-camera` | Al tocar "Escanear QR" o "Sacar foto", y solo después de la pantalla previa `/permisos/camara` | Se escribe el código del aula a mano y se elige la foto del selector del sistema | — |
| **Ubicación** | `expo-location` (primer plano) | Al tocar "Marcar ubicación", y solo después de `/permisos/ubicacion` | Se elige el sector a mano (patio, estacionamiento, pasillo, aulas, SUM) | `android.accuracy === 'coarse'` o `ios.accuracy === 'reduced'` → **"Ubicación aproximada"**, y la app no muestra coordenadas exactas |
| **Notificaciones** | `expo-notifications` | **Solo** al activar el interruptor de `/ajustes-app`, nunca al abrir la app | El aviso queda igual en la bandeja `/avisos` | En iOS, `ios.status === PROVISIONAL` → "Notificaciones provisionales (llegan en silencio)" |
| **Galería** | `expo-image-picker` | **Nunca** | — | — |

> Si el binario donde corre la app no trae el módulo nativo de notificaciones (Expo Go en Android),
> el panel `/permisos` lo dice explícitamente ("No disponible") y el interruptor de `/ajustes-app`
> queda desactivado, con el aviso a `/avisos` como camino Alternativo.

### Los cuatro estados

`usePermiso(recurso)` devuelve siempre uno de estos cuatro:

| Estado | Qué significa | Qué ve la persona |
| --- | --- | --- |
| `cargando` | Todavía no se consultó el estado | Indicador de carga |
| `concedido` | El sistema autorizó el permiso | La función (cámara, ubicación, avisos) |
| `preguntable` | Se puede mostrar el diálogo del sistema | Explicación + botón **"Continuar"** |
| `bloqueado` | Ya no se puede mostrar el diálogo | Explicación + botón **"Abrir Ajustes"** |

La diferencia central entre plataformas:

| Situación | iOS | Android 11+ |
| --- | --- | --- |
| Nunca se preguntó | `undetermined` → preguntable | `undetermined` → preguntable |
| Primer "No permitir" | `denied` con `canAskAgain: false` → **bloqueado** | `denied` con `canAskAgain: true` → **preguntable** |
| Segundo "No permitir" | — | `denied` con `canAskAgain: false` → **bloqueado** |

En iOS el sistema solo muestra el diálogo una vez: después del primer "No" hay que ir a Ajustes.
En Android 11+ hacen falta dos rechazos para que el permiso quede bloqueado.

---

## 5. El hook `usePermiso`

`src/hooks/usePermiso.ts` es el corazón de la app:

```ts
const { estado, parcial, matiz, pedir, abrirAjustes, recargar } = usePermiso('camara');
```

- **Consulta** el estado con `get*PermissionsAsync()` (nunca muestra un diálogo).
- Traduce la respuesta a los cuatro estados de la tabla de arriba.
- Detecta el matiz: fotos limitadas (`accessPrivileges === 'limited'`), ubicación aproximada
  (`accuracy`) y notificaciones provisionales (`ios.status === PROVISIONAL`).
- **Se re-consulta solo cuando la persona vuelve de los Ajustes del sistema**, usando `AppState`:
  los hooks de Expo no se enteran de ese cambio por su cuenta.

```ts
// src/hooks/use-revisar-al-volver.ts
const subscription = AppState.addEventListener('change', (nuevo) => {
  const estabaAfuera = anterior.current === 'background' || anterior.current === 'inactive';
  const volvio = nuevo === 'active';
  if (estabaAfuera && volvio) revisar();
  anterior.current = nuevo;
});
```

El estado **no** se guarda en un store global "para siempre": se vuelve a leer del sistema cada vez
que la app vuelve al primer plano, porque la única fuente de verdad es el sistema operativo.

---

## 6. Auditoría del manifiesto (desafío opcional G4)

Generado con `npx expo prebuild --clean` y revisando el manifiesto de la app junto con los
manifiestos de todas las librerías que se fusionan en el build de Gradle.

### 6.1 Permisos que quedan en el `AndroidManifest.xml` final

| Permiso | Tipo | Quién lo agrega | Para qué lo usa la app |
| --- | --- | --- | --- |
| `android.permission.INTERNET` | Instalación | `expo-image` | Descargar y mostrar imágenes |
| `android.permission.ACCESS_NETWORK_STATE` | Instalación | `expo-image` | Saber si hay red |
| `android.permission.VIBRATE` | Instalación | Template de Expo | Vibrar en la notificación de aviso |
| `android.permission.CAMERA` | Tiempo de ejecución | `expo-camera`, `expo-image-picker` | Escanear el QR y sacar la foto |
| `android.permission.ACCESS_COARSE_LOCATION` | Tiempo de ejecución | `expo-location` | Ubicación aproximada (la que da Android cuando la persona elige "aproximada") |
| `android.permission.ACCESS_FINE_LOCATION` | Tiempo de ejecución | `expo-location` | Ubicación precisa |
| `android.permission.POST_NOTIFICATIONS` | Tiempo de ejecución (Android 13+) | `expo-notifications` | Aviso de reporte resuelto |
| `android.permission.RECEIVE_BOOT_COMPLETED` | Instalación | `expo-notifications` | Reprogramar avisos tras reiniciar el dispositivo |

Los permisos de tipo "instalación" se conceden solos al instalar: no se pide nada en runtime.

**No están** (quedaron bloqueados con `tools:node="remove"`): `RECORD_AUDIO`, `READ_MEDIA_IMAGES`,
`READ_MEDIA_VIDEO`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `SYSTEM_ALERT_WINDOW`,
`ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE_LOCATION`, `ACTIVITY_RECOGNITION`.

### 6.2 Claves del `Info.plist` de iOS

Generado con `npx expo prebuild --clean --platform ios`. Esto es **todo** lo que la app declara:

```
ITSAppUsesNonExemptEncryption = False
NSCameraUsageDescription       = Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto que reportás.
NSLocationWhenInUseUsageDescription = Usamos tu ubicación mientras usás la app para marcar en qué sector del edificio está el desperfecto que reportás.
```

No hay `NSMicrophoneUsageDescription`, ni `NSPhotoLibraryUsageDescription`, ni
`NSLocationAlwaysUsageDescription`, ni `NSLocationAlwaysAndWhenInUseUsageDescription`, ni
`NSMotionUsageDescription`, ni `UIBackgroundModes`.

---

## 7. ¿Por qué los textos de propósito no aparecen en Expo Go?

Expo Go es una app genérica: usa su propio `Info.plist` y su propio `AndroidManifest.xml`. Los
textos de propósito y las declaraciones de permisos de **tu** app solo existen en el binario que
compilás vos.

Para verlos hay que hacer una **development build**:

```bash
npx expo run:android      # o npx eas build --profile development
npx expo run:ios
```

Lo que sí funciona en Expo Go: cámara, escáner de QR, ubicación en primer plano, selector de
imágenes y notificaciones **locales**. Lo que necesita development build: los textos de propósito
propios, el `blockedPermissions` y las notificaciones push.

### El detalle del módulo de notificaciones

`expo-notifications` pide sus módulos nativos **al cargarse**, y uno de ellos
(`ExpoTopicSubscriptionModule`, el de las suscripciones a topics de push) **no existe en el Expo Go
de Android**, porque el push remoto no está disponible ahí. Importar el paquete entero reventaba la
app al arrancar:

```
Cannot find native module 'ExpoTopicSubscriptionModule'
    at import * as Notifications from 'expo-notifications'   (src/lib/notificaciones.ts)
    at src/app/_layout.tsx
```

Por eso `src/lib/notificaciones.ts` **no importa el paquete**: carga solo los módulos que la app
usa de verdad (`NotificationPermissions`, `setNotificationChannelAsync`, `scheduleNotificationAsync`,
`NotificationsHandler`), y lo hace con `import()` dinámico dentro de un `try/catch`. Si el binario
donde corre la app no tiene esos módulos, la app **arranca igual** y las notificaciones quedan
desactivadas: el aviso sigue apareciendo en la bandeja `/avisos`.

Es el mismo criterio que se aplica a los permisos: **la app nunca se bloquea**, ni por un permiso
denegado ni por un módulo que falta.

---

## 8. Cómo se pide cada permiso (nunca se insiste)

1. La persona toca una función (escanear, sacar foto, marcar ubicación, activar el interruptor de
   avisos).
2. La app muestra la **pantalla previa** `/permisos/[recurso]`: el beneficio en una frase, un único
   botón **"Continuar"** y la aclaración de que se puede cambiar en Ajustes. Si el permiso está
   bloqueado, el botón pasa a ser **"Abrir Ajustes"** y se explica el camino exacto según la
   plataforma.
3. Solo al tocar "Continuar" se llama a `request*PermissionsAsync()` y aparece el diálogo del
   sistema.
4. La pantalla previa **nunca aparece sola**: si la persona ya dijo que no, la app no vuelve a
   molestar; el aviso de nuevo aparece cuando toca la función otra vez.

Y en todos los casos hay un camino alternativo, para que **nadie quede bloqueado**:

| Permiso denegado | Alternativa |
| --- | --- |
| Cámara | Escribir el código del aula a mano · elegir la foto del selector del sistema |
| Ubicación | Elegir el sector a mano (patio, estacionamiento, pasillo, aulas, SUM) |
| Notificaciones | La bandeja `/avisos` de la app |

---

## 9. Desafíos opcionales implementados

- [x] **Auditoría del manifiesto** (§6): `npx expo prebuild --clean` + tabla de permisos con quién
  los agrega y cuáles se quitaron.
- [x] **Notificaciones provisionales**: `PERMITIR_NOTIFICACIONES_PROVISIONALES` en
  `src/lib/notificaciones.ts` (en `false` por defecto). Si se activa, iOS concede acceso
  provisional sin diálogo y el panel `/permisos` muestra el estado *"Notificaciones provisionales
  (llegan en silencio)"*. El código de detección ya está implementado.
- [x] **Bloqueo por plataforma**: cada recurso declara en `src/lib/permisos/recursos.ts` el camino
  exacto en Ajustes para iOS y para Android, que se muestra en la pantalla previa y en el panel.
- [ ] **Nota de voz con `expo-audio`**: no implementada. Requeriría un módulo nativo nuevo, por lo
  que **no se podría publicar solo con una actualización OTA**: hay que sacar una build nueva.

---

## 10. Capturas

Pendientes de tomar en la development build (se agrega una por cada punto):

- [ ] Escáner en sus cuatro estados: cargando, concedido, preguntable y bloqueado.
- [ ] Ubicación concedida y ubicación denegada (con el sector elegido a mano).
- [ ] Foto elegida desde el selector del sistema.
- [ ] Notificación local recibida ("Reporte resuelto").
- [ ] Panel de permisos antes y después de volver de los Ajustes del sistema.

---

## 11. Estructura completa de `src/`

```
src/
├── app/                     rutas (Expo Router)
├── components/              interfaz de cristal
│   ├── boton-primario.tsx   glass-card.tsx       campo-texto.tsx
│   ├── chip-estado.tsx      fondo-glass.tsx      glass-surface.tsx
│   ├── indicador-carga.tsx  pantalla.tsx         pantalla-previa-permiso.tsx
│   ├── fila-permiso.tsx     selector-opciones.tsx texto.tsx
├── constants/theme.ts       paleta y tokens del cristal
├── hooks/
│   ├── usePermiso.ts        hook unificado de permisos
│   └── use-revisar-al-volver.ts   detección de la vuelta de Ajustes
└── lib/
    ├── permisos/
    │   ├── recursos.ts      catálogo: beneficio, módulo y alternativa
    │   ├── consultar.ts     get*PermissionsAsync / request*PermissionsAsync
    │   └── estados.ts       respuesta del sistema → 4 estados + matiz
    ├── camara.ts            QR y foto
    ├── fotos.ts             selector del sistema y cámara del sistema
    ├── notificaciones.ts    canal, permiso y aviso programado
    ├── ubicacion.ts         obtenerUbicacion()
    ├── tipos.ts             tipos del dominio
    └── almacenamiento/
        ├── almacen-reportes.tsx   Context + reducer
        └── persistencia.ts       AsyncStorage
```

### Paleta

`#022b3a` (profundo) · `#1f7a8c` (teal) · `#bfdbf7` (celeste) · `#e1e5f2` (niebla) ·
`#ffffff` (blanco), en `src/constants/theme.ts`.

El estilo es **glassmorphism**: las superficies usan `GlassView` de `expo-glass-effect` en iOS 26+,
`BlurView` de `expo-blur` en iOS anteriores y una capa translúcida con borde en Android, siempre
sobre un fondo con degradado y manchas de luz difusas.
