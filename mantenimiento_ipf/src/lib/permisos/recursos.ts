/**
 * Catálogo único de los recursos que la app pide. Cada recurso declara para qué
 * se usa (beneficio), qué módulo de Expo lo maneja y qué puede hacer la persona
 * si decide denegarlo. La app nunca deja una función sin alternativa.
 */
export type Recurso = 'camara' | 'ubicacion' | 'notificaciones';

export type DefinicionRecurso = {
  id: Recurso;
  nombre: string;
  /** Frase con el molde "Usamos tu [dato] para [beneficio concreto]". */
  beneficio: string;
  /** Módulo de Expo responsable de pedir el permiso. */
  modulo: string;
  /** Qué puede hacer la persona si deniega el permiso. */
  alternativa: string;
  /** Camino exacto en los Ajustes del sistema para habilitarlo a mano. */
  comoHabilitar: {
    ios: string;
    android: string;
  };
};

export const RECURSOS: Record<Recurso, DefinicionRecurso> = {
  camara: {
    id: 'camara',
    nombre: 'Cámara',
    beneficio:
      'Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto que reportás.',
    modulo: 'expo-camera',
    alternativa:
      'Podés escribir el código del aula a mano y adjuntar la foto desde el selector de imágenes del sistema.',
    comoHabilitar: {
      ios: 'Ajustes › Mantenimiento IPF › Cámara › Allow',
      android: 'Ajustes › Aplicaciones › Mantenimiento IPF › Permisos › Cámara › Permitir',
    },
  },
  ubicacion: {
    id: 'ubicacion',
    nombre: 'Ubicación',
    beneficio:
      'Usamos tu ubicación mientras usás la app para marcar en qué sector del edificio está el desperfecto que reportás.',
    modulo: 'expo-location',
    alternativa:
      'Podés elegir el sector a mano (patio, estacionamiento, pasillo, aulas o taller) en el mismo formulario.',
    comoHabilitar: {
      ios: 'Ajustes › Mantenimiento IPF › Ubicación › While Using the App',
      android: 'Ajustes › Aplicaciones › Mantenimiento IPF › Permisos › Ubicación › Permitir',
    },
  },
  notificaciones: {
    id: 'notificaciones',
    nombre: 'Notificaciones',
    beneficio:
      'Usamos tus notificaciones para avisarte apenas se resuelva el reporte que hiciste.',
    modulo: 'expo-notifications',
    alternativa:
      'Si preferís no recibir notificaciones, los avisos quedan igual disponibles en la bandeja de la app (Avisos).',
    comoHabilitar: {
      ios: 'Ajustes › Mantenimiento IPF › Notificaciones › Allow Notifications',
      android: 'Ajustes › Aplicaciones › Mantenimiento IPF › Notificaciones › Activar',
    },
  },
};

export const RECURSOS_LISTA: DefinicionRecurso[] = [
  RECURSOS.camara,
  RECURSOS.ubicacion,
  RECURSOS.notificaciones,
];

export function esRecurso(valor: string): valor is Recurso {
  return valor === 'camara' || valor === 'ubicacion' || valor === 'notificaciones';
}
