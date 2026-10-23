// D5 · Configurar app.json
// App que: escanea QR sin micrófono, usa ubicación solo en primer plano
// y no debe tener SYSTEM_ALERT_WINDOW en el manifiesto final.

// ¿Por qué expo-camera agrega RECORD_AUDIO en Android aunque la app no
// grabe sonido? Porque el plugin declara los permisos que el módulo podría
// necesitar (grabar video con sonido); audio se escribe en un archivo y
// Android lo considera RECORD_AUDIO. Como esta app no graba sonido, se
// quita con recordAudioAndroid: false (en iOS basta microphonePermission: false).

export const plugins = [
  [
    'expo-camera',
    {
      cameraPermission: 'Usamos tu cámara para escanear el QR del aula y completar el aula del reporte.',
      microphonePermission: false,   // sin texto en iOS: no grabamos video con sonido
      recordAudioAndroid: false,     // quita RECORD_AUDIO del manifiesto de Android
    },
  ],
  [
    'expo-location',
    {
      locationWhenInUsePermission: 'Usamos tu ubicación para marcar dónde está el desperfecto y mostrar puntos de reciclaje cercanos.',
      isAndroidBackgroundLocationEnabled: false, // solo primer plano
      isIosBackgroundLocationEnabled: false,     // solo primer plano
    },
  ],
];

// Aparte, dentro de expo.android:
//   blockedPermissions: ['android.permission.SYSTEM_ALERT_WINDOW']
// Genera tools:node="remove" en el AndroidManifest final, para quitar un
// permiso que trae alguna librería y la app no usa. No funciona en Expo Go:
// solo tiene efecto en una build propia (prebuild o development build).
export const android = {
  blockedPermissions: ['android.permission.SYSTEM_ALERT_WINDOW'],
};
