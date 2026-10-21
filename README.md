# TP3 · Permisos móviles (Android, iOS y Expo)

Repositorio del **Trabajo Práctico N° 3** del Taller Complementario – React Native II del Instituto
Politécnico Formosa.

## Contenido

| Carpeta / archivo | Qué es |
| --- | --- |
| [`mantenimiento_ipf/`](mantenimiento_ipf/) | **La aplicación**: "Mantenimiento IPF" (Expo SDK 57 + TypeScript + Expo Router). Su [README](mantenimiento_ipf/README.md) tiene el árbol de rutas, la tabla de permisos, la auditoría del manifiesto y las capturas. |
| `Practica_teórica/` | Práctica de la parte theoretical-práctica del enunciado. |
| `RESPUESTAS.md` | Respuestas de las Partes A a F del enunciado. |
| `TP3_Permisos_Moviles_React_Native_II - Alumnos-1.pdf` | Enunciado del trabajo (no se versiona). |

## La aplicación en dos minutos

Alumnos y docentes reportan desperfectos del edificio (una luz quemada, una canilla que pierde, un
proyector roto) y reciben un aviso cuando se resuelven. La app usa **cámara, ubicación y
notificaciones**, y elige fotos **sin pedir permiso de galería**.

Los tres principios que guinan el código:

1. **Pedir en contexto.** Ningún permiso se pide al abrir la app: se pide al tocar la función que lo
   necesita, y siempre después de una pantalla previa que explica el beneficio.
2. **Nunca bloquear.** Cada permiso denegado tiene un camino alternativo (escribir el aula a mano,
   elegir la foto del selector del sistema, elegir el sector a mano, mirar la bandeja de avisos).
3. **Mínimo privilegio.** Se declara lo justo: sin micrófono, sin galería, sin ubicación en segundo
   plano. Los permisos sobrantes se bloquean con `android.blockedPermissions`.

## Cómo se corre la app

```bash
cd mantenimiento_ipf
npm install
npx expo start          # Expo Go
npx expo run:android    # development build: necesaria para ver los textos de propósito
```

Controles: `npx expo lint` · `npx tsc --noEmit` · `npx expo-doctor` · `npx expo prebuild --clean`
