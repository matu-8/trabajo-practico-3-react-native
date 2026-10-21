# TP3 · Permisos móviles: Android, iOS y Expo

**Tecnicatura Superior en Desarrollo de Software Multiplataforma · Instituto Politécnico Formosa**
**Taller Complementario – React Native II**

**Alumno/a:** Agüero Matias  
**Fecha de entrega:** 23-10-26

---

## Parte A · ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**

_Respuesta:_ El permiso es una autorizacion que da el usuario a la aplicacion para el uso de ciertos recursos propios del dispositivo.  
El papel que cumple la app es de utilizador de los recursos, el sistema operativo la fuente de uso y el usuario el permisionador que sede  
autorizaciones.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**

_Respuesta:_ El sandbox es el mecanismo de seguridad del sistema operativo de dispositivos moviles (Android y IOS) para encapsular a cada aplicacion dentro de un propio entorno privado. Se relaciona con los permisos porque los mismos son la autorizaición que el usuario sede a la aplicacion para que utilice los recursos del teléfono.
Una app sin permisos puede limitarse a hacer todo con respecto a su propio funcionamiento, conectarse a la red, manejar datos privados, cambiar estados de si misma.

**c) Nombrá las cuatro razones por las que existen los permisos y dé un ejemplo concreto de cada una.**

1. Razón: Para mas transparencia con el usuario Ejemplo: En caso de que se haga una aplicacion que solo use los recursos, genera incomodidad en el usuario
2. Razón: Para seguridad  Ejemplo: En el caso de un incidente con la aplicacion (hackeo) el daño se limita a lo permitido. 
3. Razón: Para privacidad Ejemplo: No se deberían de usar el audio o el video sin el consentimiento del usuario. 
4. Razón: Para mayor control Ejemplo: Los permisos sedidos pueden ser cambiados por el usuario en un futuro. 

**d) En la analogía del portero del edificio, ¿quién es la visita, quién el portero y quién el dueño del departamento? ¿Qué significa que "el portero se acuerda de la respuesta"?**

_Respuesta:_ La visita es la aplicacion, el portero es el sistema operativo del dispositivo y el dueño del dpto es el usuario. Que el portero se acuerde de la respuseta, hace referencia a que el sistema operativo es el que pide el consentimiento y guarda la decisión del usuario.

### A2. Declarar y solicitar

| | Declarar (al compilar) | Solicitar (al ejecutar) |
|---|---|---|
| ¿Qué se hace? | Se avisa al sistema que recurso se desea ocupar desde la app | Se ejecuta una petición de acceso alos recursos |
| ¿Dónde / cómo en Android? | En una linea en el AndroidManifest.xml | Para los permisos de tiempo de ejecución |
| ¿Dónde / cómo en iOS? | En Info.plis | Para cada recurso protegido del sistema |
| ¿Dónde / cómo en Expo? | Expo genera los dos archivos mediante app.json  | mediante el metodo request…PermissionsAsync() o el hook para ocupar una funcion en especifico (useCamera, useForegroundPermissions) |
| ¿Qué pasa si se omite? | Se pide de nuevo y se ofrece una mejor explicacion | Ofrecer un boton para activar el permiso desde ajustes del dispositivo |

### A3. Verdadero o falso

Indicá V o F. Justificá las falsas.

**a) El diálogo de permiso lo dibuja tu app con componentes de React Native.**
V / F: Falso Justificación: El cuadro de dialogo de permiso lo hace el sistema propio del dispositivo.

**b) En Expo, la fuente de verdad de los permisos es app.json (o app.config.ts), no el AndroidManifest.xml.**
V / F: Verdadero Justificación: Expo genera sus propios Info.plist y AndroidManifest.xml nativamente a partir de su app.json.

**c) Agregar un permiso nuevo en el Info.plist se puede publicar con una actualización OTA.**
V / F: Falso Justificación: Cualquier modificacion de permisos requiere una nueva reconstrucción de la app (rebuild).

**d) Si tu código pide un permiso que no está en el manifiesto, Android igual muestra el diálogo.**
V / F: Falso Justificación: El sistema de android lo deniega directamente y no muestra del dialogo siquiera.

**e) El paquete expo-permissions es la forma recomendada de pedir permisos en SDK 57.**
V / F: Falso Justificación: El paquete expo-permissions ya no existe. Cada módulo (expo-camera, expo-location, etc.) maneja sus propios permisos.

**f) En iOS, las notificaciones no llevan texto de propósito en el Info.plist.**
V / F: Verdadero Justificación: Las notificaciones se piden directamente, sin clave de texto en el Info.plist.

**g) Con acceso limitado a fotos, status vale 'granted' y el matiz está en accessPrivileges.**
V / F: Verdadero Justificación: El status sigue siendo 'granted'; el detalle del acceso parcial se lee en accessPrivileges (accessPrivileges: 'limited').

**h) Desinstalar y reinstalar la app es la forma confiable de volver a "sin decidir" en las dos plataformas.**
V / F: Verdadero Justificación: Es la forma que indica la clase. Para pruebas sin reinstalar existen comandos como adb o xcrun simctl (ver D6).

### A4. Los estados de un permiso

**a) Describí el diagrama de estados de un permiso en Android y en iOS. ¿Cuál es la diferencia central entre las dos plataformas?**

_Respuesta Android:_ Sin decidir → si acepta pasa a Concedido; si da acceso parcial pasa a Parcial; si rechaza pasa a Denegado (puede volver a pedirse). Si pide de nuevo y acepta pasa a Concedido; si rechaza otra vez pasa a Bloqueado (solo se desbloquea desde Ajustes).

_Respuesta iOS:_ Sin decidir → si acepta pasa a Concedido; si da acceso parcial pasa a Parcial; si rechaza pasa directo a Bloqueado (una sola oportunidad). Desde ese punto solo se puede cambiar desde Ajustes.

_Diferencia central:_ Android da dos oportunidades para aceptar (rechazo → denegado → bloqueado), mientras que iOS da una sola (rechazo → bloqueado).

**b) Completá qué devuelve Expo en cada estado.**

| Estado | status | canAskAgain | ¿Puede aparecer el diálogo? |
|---|---|---|---|
| Sin decidir | undetermined | true | Sí (el diálogo se muestra al pedir) |
| Concedido | granted | No aplica (no determina el uso) | No (ya está concedido) |
| Denegado (se puede volver a pedir) | denied | true | Sí (se puede volver a pedir) |
| Bloqueado | denied | false | No (solo desde Ajustes) |

---

## Parte B · Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos

Indicá el tipo (de instalación / de tiempo de ejecución / especial) y cómo los obtiene la app.

| Permiso | Tipo | ¿Cómo se obtiene? |
|---|---|---|
| INTERNET | De instalación | Se concede solo al instalar la app, sin diálogo |
| CAMERA | De tiempo de ejecución | Diálogo que se muestra mientras se usa la app |
| VIBRATE | De instalación | Se concede solo al instalar la app, sin diálogo |
| SYSTEM_ALERT_WINDOW | Especial | Se activa desde una pantalla de Ajustes (sin diálogo) |
| POST_NOTIFICATIONS | De tiempo de ejecución | Diálogo (desde Android 13) |
| ACCESS_NETWORK_STATE | De instalación | Se concede solo al instalar la app, sin diálogo |
| READ_CONTACTS | De tiempo de ejecución | Diálogo que se muestra mientras se usa la app |
| SCHEDULE_EXACT_ALARM | Especial | Se activa desde una pantalla de Ajustes (sin diálogo) |
| RECORD_AUDIO | De tiempo de ejecución | Diálogo que se muestra mientras se usa la app |
| MANAGE_EXTERNAL_STORAGE | Especial | Se activa desde una pantalla de Ajustes (sin diálogo) |

### B2. Grupos y nombres

**a) ¿Qué es un grupo de permisos? Si la app pide ACCESS_FINE_LOCATION y ACCESS_COARSE_LOCATION juntos, ¿cuántos diálogos ve la persona?**

_Respuesta:_ Un grupo es un conjunto de permisos relacionados que la persona ve como uno solo (por ejemplo, "Ubicación" agrupa precisa y aproximada). Si la app pide ACCESS_FINE_LOCATION y ACCESS_COARSE_LOCATION juntos, la persona ve un solo diálogo.

**b) ¿Qué prefijo lleva el nombre completo de un permiso? Escribí el nombre completo del permiso de cámara.**

_Prefijo:_ android.permission. (el nombre completo siempre empieza con este prefijo)

_Nombre completo de cámara:_ android.permission.CAMERA

**c) ¿Qué son los permisos de firma (signature)? ¿Por qué no se usan en apps comunes?**

_Respuesta:_ Son permisos que solo obtienen las apps firmadas con el mismo certificado que el sistema u otra app (por ejemplo, dos apps del mismo desarrollador). No se usan en apps comunes porque una app de terceros no puede obtener ese certificado.

### B3. Leé el manifiesto

Se toma el `AndroidManifest.xml` generado por `npx expo prebuild`.

**a) ¿Qué permisos se conceden solos al instalar y cuáles hay que pedir además en tiempo de ejecución?**

_Instalación:_ INTERNET (permiso normal; se concede solo al instalar).

_Tiempo de ejecución:_ CAMERA, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION, POST_NOTIFICATIONS, READ_EXTERNAL_STORAGE (hasta API 32) y RECORD_AUDIO (aunque en este manifiesto aparece con tools:node="remove").

**b) ¿Qué significa `android:maxSdkVersion="32"`? ¿Qué permisos reemplazan a READ_EXTERNAL_STORAGE desde Android 13?**

_Respuesta:_ Indica que el permiso aplica solo hasta la API 32 (por ejemplo, en Android 12L o anteriores). Desde Android 13 lo reemplazan READ_MEDIA_IMAGES y READ_MEDIA_VIDEO (permisos separados por tipo de archivo).

**c) ¿Qué hace `tools:node="remove"`? Escribí el fragmento de app.json que lo genera.**

_Respuesta:_ Quita del manifiesto final un permiso que trae una librería. Lo genera la propiedad blockedPermissions (por ejemplo, para quitar RECORD_AUDIO).

_Fragmento de app.json:_

```json
{
  "expo": {
    "android": {
      "blockedPermissions": ["android.permission.RECORD_AUDIO"]
    }
  }
}
```

**d) Necesitás agregar SCHEDULE_EXACT_ALARM, que ninguna librería declara. ¿En qué propiedad de app.json va?**

_Respuesta:_ En expo.android.permissions (suma permisos que ninguna librería declara; por ejemplo, "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]).

**e) ¿Por qué en Expo no conviene editar este archivo a mano? ¿Funciona blockedPermissions en Expo Go?**

_Respuesta:_ Porque el AndroidManifest.xml se regenera en cada prebuild y los cambios manuales se pierden (la fuente de verdad es app.json). blockedPermissions no funciona en Expo Go: solo tiene efecto en una build propia.

### B4. Así pregunta Android

**a) ¿Se puede poner texto propio dentro del diálogo de Android? Entonces, ¿dónde tenés que explicar para qué usás el permiso?**

_Respuesta:_ No. El título y el texto del diálogo los arma el sistema. La explicación se da en la app, antes de pedir el permiso (por ejemplo, en una pantalla previa con un botón "Continuar").

**b) ¿Qué diferencia hay entre "Mientras la app está en uso" y "Solo esta vez"? ¿Para qué permisos existe esta última opción?**

_Respuesta:_ "Mientras la app está en uso" es un acceso que se mantiene, pero solo con la app en primer plano. "Solo esta vez" vale mientras la app se usa, y poco después de salir el sistema lo revoca. "Solo esta vez" existe para ubicación, cámara y micrófono.

**c) En Android 11+, ¿qué pasa si la persona toca "No permitir" dos veces? ¿Qué valor toma canAskAgain?**

_Respuesta:_ Android deja de mostrar el diálogo, es decir, el permiso queda bloqueado. canAskAgain toma el valor false.

**d) La ubicación aproximada tiene una precisión de unos 3 km². Dé un ejemplo de función que anda bien con ella y otro de una que no.**

_Función que anda bien:_ Mostrar farmacias de tu zona o buscar por barrio (no necesita precisión exacta).

_Función que no anda:_ Llegar caminando a la puerta de un local (necesita precisión exacta).

**e) Si la persona revoca un permiso desde Ajustes mientras la app está abierta, ¿qué hace Android con el proceso de la app?**

_Respuesta:_ Termina el proceso de la app. Al volver, la app arranca de cero.

### B5. Android, versión por versión

Completá en qué versión apareció cada cambio y qué implica para el código.

| Cambio | Versión (API) | Qué implica para el código |
|---|---|---|
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | Hay que pedir el permiso en código y manejar la respuesta del diálogo |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 11+ (API 30) | Se concede desde Ajustes; el pedido no muestra diálogo y hay que pedirla después de la de primer plano |
| Dos rechazos equivalen a "no volver a preguntar" | Android 11+ (API 30) | Con canAskAgain false, hay que mandar a la persona a Ajustes |
| Ubicación precisa o aproximada | Android 12+ (API 31) | La app tiene que funcionar con las dos (revisar accuracy) |
| Las notificaciones pasan a ser un permiso (POST_NOTIFICATIONS) | Android 13 (API 33) | Hay que pedir el permiso; el diálogo no aparece sin un canal creado |
| Acceso parcial a fotos y videos ("Seleccionar fotos") | Android 14 (API 34) | Status 'granted' con accessPrivileges 'limited'; trabajar con la selección |
| Permiso de red local (ACCESS_LOCAL_NETWORK) | Android 17 (API 37) | Nuevo permiso a declarar para acceder a la red local |

**¿Qué es el targetSdkVersion? ¿A qué API apunta Expo SDK 57 y qué exige Google Play desde el 31 de agosto de 2026?**

_Respuesta:_ Es la versión de Android para la que la app declara estar preparada; muchos cambios de permisos se aplican según este valor. Expo SDK 57 apunta a API 36, y Google Play exige API 36 para apps nuevas y actualizaciones desde el 31/08/2026.

---

## Parte C · iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist

Escribí la clave que corresponde a cada recurso. Si no lleva clave, indicarlo.

| Recurso | Clave en Info.plist |
|---|---|
| Cámara | NSCameraUsageDescription |
| Micrófono | NSMicrophoneUsageDescription |
| Ubicación en uso | NSLocationWhenInUseUsageDescription |
| Ubicación siempre | NSLocationAlwaysAndWhenInUseUsageDescription |
| Fotos (leer) | NSPhotoLibraryUsageDescription |
| Fotos (solo guardar) | NSPhotoLibraryAddUsageDescription |
| Contactos | NSContactsUsageDescription |
| Face ID | NSFaceIDUsageDescription |
| Rastreo entre apps (ATT) | NSUserTrackingUsageDescription |
| Notificaciones | No lleva clave (se piden directamente) |

### C2. Sin texto, no hay permiso

**a) ¿Qué pasa si falta el texto de propósito y la app intenta usar la cámara? ¿Y al subir la build a App Store Connect? Mencioná el código de error.**

_Respuesta:_ Al usar la cámara, la app se cierra (crash) con el mensaje "attempted to access privacy-sensitive data without a usage description". Al subir la build, App Store Connect la rechaza con el código ITMS-90683: Missing purpose string in Info.plist.

**b) ¿Cuántas veces muestra iOS el diálogo de un permiso? Si la persona dice que no, ¿qué le queda a la app?**

_Respuesta:_ iOS muestra el diálogo una sola vez. Si la persona dice que no, la decisión solo puede cambiarse desde Ajustes (la app no puede volver a preguntar).

**c) En el diálogo de iOS, ¿qué parte arma el sistema y cuál escribís vos? En Expo, ¿dónde se configura ese texto?**

_Respuesta:_ El sistema arma el título con el nombre de la app (no se puede cambiar). El texto de propósito lo escribís vos. En Expo se configura en el plugin de cada módulo o en ios.infoPlist dentro de app.json.

**d) Una librería usa una API protegida que tu app nunca llama y Apple rechaza la build. ¿Por qué pasa y cómo se resuelve?**

_Respuesta:_ Pasa porque la librería incluye el uso de la API protegida aunque tu app no la llame, y Apple exige el texto de propósito igual (ITMS-90683). Se resuelve agregando el texto correspondiente en app.json (plugin o ios.infoPlist) y volviendo a compilar.

### C3. Probador de textos de propósito

Evaluá cada texto para NSLocationWhenInUseUsageDescription según la pauta 5.1.1 de Apple. Indicá si lo aprobarías y reescribí los que no, con el molde "Usamos tu [dato] para [beneficio concreto]".

| Texto propuesto | ¿Aprobado? | Versión mejorada |
|---|---|---|
| "Necesitamos tu ubicación." | No (no dice para qué se usa) | "Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos." |
| "Para mejorar tu experiencia." | No (es vago y no describe el uso) | "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." |
| "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." | Sí (ya cumple el molde) | Sin cambios |
| "La app no funciona sin ubicación." | No (presiona, pero no explica el beneficio) | "Usamos tu ubicación para mostrarte el turno de la clínica más cercana." |
| "Ubicación requerida por el sistema." | No (el sistema no es quien lo requiere; no hay beneficio) | "Usamos tu ubicación para marcar en el mapa dónde está el desperfecto." |

### C4. Acceso parcial y gradual

Para cada caso, indicá desde qué versión de iOS existe y qué valor o función de Expo lo detecta o lo pide.

| Caso | Versión de iOS | En Expo |
|---|---|---|
| Fotos limitadas ("Seleccionar fotos") | iOS 14 | accessPrivileges: 'limited' |
| Ubicación aproximada (interruptor "Precisa") | iOS 14 | ios.accuracy: 'reduced' |
| "Permitir una vez" (ubicación) | iOS 13+ | No tiene función propia: al cerrar y reabrir la app, el status vuelve a 'undetermined' |
| Ubicación escalonada: de "al usar la app" a "Siempre" | iOS 13 | useBackgroundPermissions (segundo pedido) |
| Notificaciones provisionales | iOS 12 | allowProvisional: true al pedir el permiso |
| Rastreo entre apps (App Tracking Transparency) | iOS 14.5 | useTrackingPermissions (expo-tracking-transparency) |

**¿Qué versión mínima de iOS requiere Expo SDK 57? ¿Qué consecuencia práctica tiene eso sobre la tabla anterior?**

_Respuesta:_ Expo SDK 57 requiere iOS 16.4 o superior. Como todos los casos de la tabla son anteriores a iOS 17, en la práctica cualquier usuario de la app tiene esas funciones disponibles y no hace falta verificar la versión para cada una.

### C5. Android vs iOS, lado a lado

| Aspecto | Android | iOS |
|---|---|---|
| ¿Dónde se declara? | En <uses-permission> del AndroidManifest.xml | En el texto de propósito del Info.plist |
| Texto en el diálogo | Lo arma el sistema | Lo escribís vos |
| Oportunidades para preguntar | Dos rechazos y se bloquea (Android 11+) | Una sola |
| "Solo esta vez" / "Permitir una vez" | Ubicación, cámara y micrófono | Solo ubicación ("Permitir una vez") |
| Notificaciones | Permiso de tiempo de ejecución desde Android 13 | Siempre se piden (o provisionales) |
| Ubicación en segundo plano | Se concede desde Ajustes (Android 11+) | Segundo pedido para pasar a "Siempre" |
| Si falta la declaración | Se deniega sin mostrar diálogo | La app falla o se cierra; la tienda rechaza la build |

---

## Parte D · Expo: una API, dos plataformas

### D1. Módulos y funciones

Indicá qué módulo de Expo y qué hook o función de permiso usarías en cada caso.

| Necesidad | Módulo | Hook / función de permiso |
|---|---|---|
| Escanear un QR con la cámara | expo-camera | useCameraPermissions |
| Grabar video con sonido | expo-camera | useMicrophonePermissions |
| Mostrar farmacias cercanas | expo-location | useForegroundPermissions |
| Seguir un envío con la app en segundo plano | expo-location | useBackgroundPermissions |
| Mostrar un recordatorio | expo-notifications | getPermissionsAsync · requestPermissionsAsync |
| Grabar una nota de voz | expo-audio | requestRecordingPermissionsAsync |
| Galería propia dentro de la app | expo-media-library | usePermissions |
| Publicidad personalizada entre apps (iOS) | expo-tracking-transparency | useTrackingPermissions |

**Un tutorial usa `import * as Permissions from 'expo-permissions'`. ¿Qué te dice eso sobre el tutorial?**

_Respuesta:_ Que el tutorial está desactualizado, porque el paquete expo-permissions ya no existe. Cada módulo maneja sus propios permisos.

### D2. Consultar, pedir y el hook

Patrón de referencia con expo-location:

```ts
import * as Location from 'expo-location';
const actual = await Location.getForegroundPermissionsAsync();
const respuesta = await Location.requestForegroundPermissionsAsync();
const [permiso, pedirPermiso, consultarPermiso] = Location.useForegroundPermissions();
```

**a) ¿Qué diferencia hay entre `get…PermissionsAsync()` y `request…PermissionsAsync()`? ¿Cuál puede mostrar un diálogo?**

_Respuesta:_ `get…` consulta el estado actual del permiso sin mostrar nada. `request…` pide el permiso y, si el estado es "sin decidir", muestra el diálogo del sistema. Solo `request…` puede mostrar un diálogo.

**b) El hook devuelve tres elementos. ¿Qué es cada uno? ¿Qué vale `permiso` en el primer render y qué tiene que mostrar la pantalla mientras tanto?**

_Respuesta:_ `permiso` es el estado del permiso, `pedirPermiso` es la función que pide el permiso y `consultarPermiso` es la función que vuelve a consultar el estado (la clase no detalla este tercer elemento). En el primer render `permiso` vale `null`, porque el hook todavía está consultando; la pantalla tiene que mostrar un indicador de carga.

**c) Si canAskAgain es false, ¿qué pasa al llamar a `request…()`? ¿Qué problema aparece si se lo llama en un bucle?**

_Respuesta:_ La llamada vuelve al instante sin mostrar nada. Si se llama en un bucle, la app repite pedidos sin efecto y la pantalla puede quedar trabada en "Pidiendo permiso…" para siempre. Lo correcto es detectarlo y ofrecer abrir Ajustes.

### D3. Leé la respuesta

Para cada PermissionResponse, indicá qué debería hacer la app.

| Respuesta | Qué hace la app |
|---|---|
| `null` | Mostrar un indicador de carga (el hook todavía está consultando) |
| `{ status: 'granted', granted: true }` | Usar la función |
| `{ status: 'undetermined', canAskAgain: true }` | Explicar el beneficio y ofrecer un botón que llame a pedir |
| `{ status: 'denied', canAskAgain: true }` | Mostrar una alternativa y la opción de volver a intentar |
| `{ status: 'denied', canAskAgain: false }` | Explicar cómo habilitarlo y abrir Ajustes con Linking.openSettings() |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Trabajar con la selección y ofrecer ampliarla, sin insistir |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Mostrar resultados por zona en lugar de distancias exactas |

**¿Cuáles son los dos campos que deciden casi todo? ¿Qué pregunta responde cada uno?**

_Respuesta:_ `granted` responde "¿lo puedo usar?" y `canAskAgain` responde "¿lo pido o mando a la persona a Ajustes?".

### D4. Simulación del ciclo completo

**Android 14, app recién instalada, expo-location.** Escribí el estado después de cada paso.

| # | Acción | status | canAskAgain | ¿Diálogo? |
|---|---|---|---|---|
| 1 | `getForegroundPermissionsAsync()` | undetermined | true | No (solo consulta) |
| 2 | `requestForegroundPermissionsAsync()` → "No permitir" | denied | true | Sí (se muestra) |
| 3 | `requestForegroundPermissionsAsync()` → "No permitir" | denied | false | Sí (se muestra por última vez) |
| 4 | `requestForegroundPermissionsAsync()` | denied | false | No (vuelve al instante) |
| 5 | `Linking.openSettings()` → habilita "Mientras la app está en uso" → vuelve y la app consulta | granted | No aplica | No |
| 6 | Igual que el 5, pero la app no vuelve a consultar: ¿qué muestra? | denied (dato desactualizado) | false (dato desactualizado) | No |

_Paso 6:_ La pantalla muestra "bloqueado" aunque el permiso ya esté habilitado, porque la app no volvió a consultar el estado.

**Repetí los pasos 1 a 4 en iOS. ¿En qué paso cambia el resultado y por qué?**

_Respuesta:_ Cambia en el paso 2. iOS da una sola oportunidad: un "No permitir" pasa directo a denied con canAskAgain false (bloqueado). Desde el paso 3 ya no aparece ningún diálogo.

**¿Qué pasa en iOS si la persona elige "Permitir una vez" y después cierra y reabre la app?**

_Respuesta:_ El estado vuelve a "sin decidir" (undetermined), por lo que la app puede volver a pedir el permiso.

### D6. Expo Go no es tu app

**a) ¿Por qué tus textos de propósito no aparecen cuando probás en Expo Go?**

_Respuesta:_ Porque Expo Go es una app ya compilada, con su propio Info.plist y su propio manifiesto. Los diálogos que aparecen son los de Expo Go, no los de tu app.

**b) ¿Qué se puede probar en Expo Go y qué necesita una development build? Pensá en push en Android y en ubicación en segundo plano.**

_Respuesta:_ En Expo Go se pueden probar la lógica, los estados, los botones, el ir a Ajustes y las alternativas (y las notificaciones locales). Una development build es necesaria para las notificaciones push en Android (desde SDK 53 no están en Expo Go) y para la ubicación en segundo plano (Expo Go no la soporta en iOS).

**c) Escribí los comandos para ver los archivos nativos generados y para compilar una development build en Android.**

_Ver archivos nativos:_ `npx expo prebuild` (genera las carpetas android/ e ios/ con AndroidManifest.xml e Info.plist).

_Compilar development build Android:_ La clase no indica el comando exacto. Solo menciona que los archivos nativos se generan con prebuild o con EAS Build.

**d) ¿Cómo volvés un permiso a "sin decidir" sin reinstalar, en Android (adb) y en el simulador de iOS (xcrun simctl)?**

_Android (adb):_ `adb shell pm revoke <paquete> android.permission.ACCESS_FINE_LOCATION`

_iOS (xcrun simctl):_ `xcrun simctl privacy booted reset location <bundle id>`

---

## Parte E · Recetas: leer y corregir código

### E2. El orden importa (ubicación)

**a) ¿Qué está mal en la función `activarSeguimiento()`? ¿Qué ocurre en iOS y qué ocurre en Android 11+?**

_Respuesta:_ Pide primero el permiso de segundo plano y después el de primer plano, cuando el orden correcto es al revés. En iOS, el sistema primero pregunta "al usar la app", por lo que el pedido de "Siempre" no se completa de una vez. En Android 11+, el pedido de segundo plano no muestra diálogo sino que abre Ajustes, y sin el permiso de primer plano no se obtiene.

**d) ¿Hace falta segundo plano para "farmacias cercanas"? ¿Qué exige Google Play si lo pedís?**

_Respuesta:_ No. Para "farmacias cercanas" alcanza con primer plano. Si se pide segundo plano, Google Play exige una declaración especial (con aviso visible en la app y un video).

### E3. Notificaciones mudas

Un compañero dice: "En Android 14 llamo a `requestPermissionsAsync()` y nunca aparece el diálogo".

**a) ¿Cuál es la causa más probable? ¿Qué hay que hacer antes de pedir el permiso?**

_Respuesta:_ La causa más probable es que no se creó ningún canal de notificaciones: sin un canal, Expo no muestra el diálogo. Antes de pedir el permiso hay que crear el canal.

**b) ¿Qué pasa con este permiso en Android 12 o anterior?**

_Respuesta:_ Las notificaciones vienen habilitadas por defecto, y el pedido responde sin mostrar diálogo.

**c) ¿Qué opción de iOS permite recibir notificaciones sin diálogo? ¿Cómo detectás en código ese estado?**

_Respuesta:_ La opción es allowProvisional: true, que entrega notificaciones silenciosas sin diálogo previo (llegan al Centro de notificaciones y la persona decide después si las mantiene). La clase no indica un valor específico para detectar este estado en código.

**d) ¿En qué momento conviene pedir este permiso? Dé un ejemplo de buen momento y de mal momento.**

_Buen momento:_ Después de una acción con sentido, por ejemplo al tocar "Avisame cuando mi pedido esté listo".

_Mal momento:_ Apenas se abre la app por primera vez, sin contexto.

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
|---|---|---|
| Elegir una foto de perfil | ImagePicker.launchImageLibraryAsync (selector del sistema) | Ninguno |
| Sacar una foto en el momento | ImagePicker.launchCameraAsync o expo-camera | Cámara |
| Editor que muestra toda la galería | expo-media-library | Fotos (completo o limitado) |
| Adjuntar la foto de un comprobante | ImagePicker.launchImageLibraryAsync (selector del sistema) | Ninguno |

**¿Por qué Google Play restringe READ_MEDIA_IMAGES y READ_MEDIA_VIDEO? ¿Desde cuándo? ¿Qué es "el mejor permiso"?**

_Respuesta:_ Google Play los permite solo a apps cuya función principal necesite acceso amplio a la galería (por ejemplo, editores de fotos). Desde el 28/05/2025, el resto debe usar el selector del sistema. "El mejor permiso" es el que no hay que pedir: con el selector, la persona elige la imagen y la app recibe solo esa, sin acceder al resto de la galería.

### E5. Volver de Ajustes

**a) ¿Por qué los hooks de Expo no se enteran solos de que el permiso cambió en Ajustes?**

_Respuesta:_ Porque el cambio ocurre fuera de la app, en Ajustes, y los hooks no escuchan ese cambio. Por eso hay que volver a consultar el permiso cuando la app regresa a primer plano (con AppState).

**b) ¿Qué función del hook de cámara le pasarías a `useRevisarAlVolver`?**

_Respuesta:_ La función que vuelve a consultar el permiso del hook de cámara (el equivalente a consultarPermiso del hook de ubicación del punto D2).

**c) ¿Por qué no conviene guardar el estado del permiso en un store global "para siempre"?**

_Respuesta:_ Porque el permiso puede cambiar en Ajustes en cualquier momento, y el store quedaría con un valor viejo (por ejemplo, mostrar "bloqueado" cuando ya fue habilitado). Conviene consultarlo cada vez que la app vuelve.

---

## Parte F · Buenas prácticas y tiendas

### F1. Pedir en contexto

Indicá el momento justo para pedir cada permiso y la alternativa si la persona dice que no.

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
|---|---|---|
| Delivery · ubicación | Al tocar "buscar cerca de mí" o al elegir la dirección de entrega | Buscar por ciudad, barrio o código postal |
| Billetera virtual · cámara | Al tocar "escanear" o "sacar foto del comprobante" | Elegir una imagen con el selector o escribir el código a mano |
| Red social · contactos | Al tocar "invitar amigos" | Compartir un enlace de invitación con el menú del sistema |
| Mensajería · micrófono | Al tocar el botón para grabar un mensaje de voz | Escribir el mensaje en lugar de dictarlo |
| Turnos médicos · notificaciones | Al confirmar un turno y ofrecer el aviso previo | Una bandeja de avisos dentro de la app |
| Editor de fotos · galería completa | Al tocar "agregar foto desde la galería" | Usar el selector del sistema o trabajar con la selección limitada |

**¿Por qué pedir cuatro permisos apenas se abre la app "entrena el No permitir automático"?**

_Respuesta:_ Porque la persona todavía no entiende para qué sirve cada permiso ni qué gana con él, y responde "No permitir" por reflejo. Al repetirse esto, la persona aprende a rechazar todo automáticamente.

### F2. La pantalla previa

**a) ¿Qué tres elementos tiene una buena pantalla previa al diálogo del sistema?**

1. El beneficio, en una frase (por ejemplo, "Escaneá tus tickets")
2. Un único botón "Continuar" que lleva al diálogo del sistema
3. Una aclaración de que se puede cambiar en Ajustes (por ejemplo, "Podés cambiarlo cuando quieras en Ajustes")

**b) ¿Por qué el botón debe decir "Continuar" y no "Permitir"?**

_Respuesta:_ Porque el permiso lo da el sistema, no el botón de la app. "Continuar" lleva al diálogo del sistema, donde la persona decide.

**c) ¿Qué dice la pauta 5.1.1(iv) de Apple sobre botones como "Ahora no" o "Cerrar" en esa pantalla?**

_Respuesta:_ Que la app no debe manipular, engañar ni forzar a la persona a dar acceso a datos innecesarios. La guía de interfaz pide un único botón que abra el diálogo y ninguna forma de salir antes; apps con botones como "Ahora no" o "Cerrar" son rechazadas.

**d) ¿Cómo cambia la pantalla si el permiso ya está bloqueado?**

_Respuesta:_ Cambia el texto para explicar cómo habilitarlo en Ajustes, y el botón pasa a ser "Abrir Ajustes".

### F3. Mínimo privilegio

Para cada caso, elegí la opción más chica que alcanza y justificá.

**a) Ubicación precisa o aproximada para "puntos de reciclaje de tu barrio".**
Opción elegida: Aproximada. Justificación: Alcanza para mostrar resultados por zona (barrio), sin necesitar la posición exacta.

**b) Ubicación "en uso" o "siempre" para "registrar una carrera con el celular en el bolsillo".**
Opción elegida: Siempre (segundo plano). Justificación: Con el celular en el bolsillo la app está en segundo plano, y "en uso" solo funciona con la app en primer plano.

**c) Selector del sistema o permiso de galería para "subir la foto del DNI".**
Opción elegida: Selector del sistema. Justificación: La persona elige la foto y la app recibe solo esa imagen, sin permiso de galería.

**d) expo-camera con o sin micrófono para "escanear el QR del aula".**
Opción elegida: Sin micrófono. Justificación: Escanear un QR no requiere grabar sonido (microphonePermission: false y recordAudioAndroid: false).

### F4. Tiendas

**a) Nombrá dos requisitos de Google Play y dos de App Store relacionados con permisos y privacidad.**

_Google Play:_

1. Declaración de permisos sensibles (por ejemplo, ubicación en segundo plano con aviso visible y video)
2. Seguridad de los datos: informar qué datos se recolectan y para qué

_App Store:_

1. Textos de propósito claros y completos (pauta 5.1.1)
2. Etiquetas de privacidad en App Store Connect

**b) ¿Qué es el manifiesto de privacidad (PrivacyInfo.xcprivacy) y dónde se configura en Expo?**

_Respuesta:_ Es el archivo donde la app declara qué datos y APIs de privacidad usa. En Expo se configura en app.json, dentro de ios.privacyManifests.

**c) ¿Qué suma Android 17 y qué va a exigir Google Play desde el 27/01/2027 a las apps que hoy piden READ_CONTACTS?**

_Respuesta:_ Android 17 suma el permiso de red local (ACCESS_LOCAL_NETWORK) y un selector de contactos del sistema. Desde el 27/01/2027, Google Play va a exigir ese selector a muchas apps que hoy piden READ_CONTACTS (para apps con target API 37).

### F5. Errores comunes

Para cada situación, explicá la causa y la solución.

**a) La consola de Xcode muestra: "This app has crashed because it attempted to access privacy-sensitive data without a usage description."**

_Causa:_ Falta el texto de propósito (clave NS…UsageDescription) en el Info.plist para el recurso usado.

_Solución:_ Configurar el plugin del módulo o ios.infoPlist en app.json y volver a compilar.

**b) "En Expo Go anda, en la build no": en la development build la cámara se deniega sin mostrar ningún diálogo.**

_Causa:_ Expo Go trae sus propios permisos. En la build solo existe lo que se declaró en app.json, y la cámara no fue declarada.

_Solución:_ Agregar el plugin de expo-camera en app.json y volver a compilar.

**c) Después de habilitar la ubicación en Ajustes, la app sigue diciendo "bloqueado".**

_Causa:_ La app no vuelve a consultar el permiso al regresar de Ajustes.

_Solución:_ Revisar el permiso al volver a la app, usando AppState (el hook de la receta 5).

**d) La pantalla queda en "Pidiendo permiso…" para siempre porque el código llama a `request…()` cada vez que se renderiza.**

_Causa:_ Cada render dispara un nuevo pedido, y con canAskAgain false el pedido vuelve al instante sin mostrar nada, en un bucle.

_Solución:_ Llamar a `request…()` solo dentro de una acción de la persona (por ejemplo, al tocar "Continuar") y no en el render.

**e) Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones.**

_Causa:_ El permiso de notificaciones está bloqueando la app entera, cuando debería ser solo una función no esencial.

_Solución:_ Dejar que la app funcione sin el permiso y ofrecer una alternativa (por ejemplo, una bandeja de avisos dentro de la app).

---

## Observaciones

_Espacio libre para comentarios sobre el trabajo, dudas o referencias consultadas:_
