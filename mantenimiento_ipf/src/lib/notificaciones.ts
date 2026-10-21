import { Platform } from 'react-native';

import type { NotificationChannelInput } from 'expo-notifications/build/NotificationChannelManager.types';
import type {
  NotificationPermissionsRequest,
  NotificationPermissionsStatus,
} from 'expo-notifications/build/NotificationPermissions.types';
import type { NotificationRequestInput } from 'expo-notifications/build/Notifications.types';

import type { Reporte } from './tipos';

export const CANAL_REPORTES = 'reportes';

// Desafío opcional G4. Con true, iOS concede acceso provisional a las
// notificaciones sin mostrar el diálogo (llegan en silencio) y el panel de
// /permisos muestra ese estado. Con false (por defecto) se pide el permiso
// normal, que es el comportamiento de la Parte G del enunciado.
export const PERMITIR_NOTIFICACIONES_PROVISIONALES = false;

/**
 * expo-notifications pide sus módulos nativos al cargarse, y uno de ellos
 * (ExpoTopicSubscriptionModule) no existe en el Expo Go de Android: el push
 * remoto no está disponible ahí. Importar el paquete entero reventaba la app
 * al arrancar, así que acá se cargan solo las partes que realmente se usan.
 */
type ModuloNotificaciones = {
  getPermissionsAsync: typeof import('expo-notifications/build/NotificationPermissions')['getPermissionsAsync'];
  requestPermissionsAsync: typeof import('expo-notifications/build/NotificationPermissions')['requestPermissionsAsync'];
  setNotificationChannelAsync: typeof import('expo-notifications/build/setNotificationChannelAsync')['setNotificationChannelAsync'];
  scheduleNotificationAsync: typeof import('expo-notifications/build/scheduleNotificationAsync')['scheduleNotificationAsync'];
  setNotificationHandler: typeof import('expo-notifications/build/NotificationsHandler')['setNotificationHandler'];
  AndroidImportance: typeof import('expo-notifications/build/NotificationChannelManager.types')['AndroidImportance'];
  SchedulableTriggerInputTypes: typeof import('expo-notifications/build/Notifications.types')['SchedulableTriggerInputTypes'];
};

let modulo: ModuloNotificaciones | null = null;
let cargaFallida = false;

/**
 * Carga el módulo de notificaciones a demanda y con protección: si el binario
 * donde corre la app no tiene los módulos nativos, la app sigue funcionando
 * (los avisos quedan en la bandeja de /avisos).
 */
async function cargarModulo(): Promise<ModuloNotificaciones | null> {
  if (modulo) return modulo;
  if (cargaFallida) return null;

  try {
    const [permisos, canal, programar, manejador, tiposCanal, tipos] = await Promise.all([
      import('expo-notifications/build/NotificationPermissions'),
      import('expo-notifications/build/setNotificationChannelAsync'),
      import('expo-notifications/build/scheduleNotificationAsync'),
      import('expo-notifications/build/NotificationsHandler'),
      import('expo-notifications/build/NotificationChannelManager.types'),
      import('expo-notifications/build/Notifications.types'),
    ]);

    modulo = {
      getPermissionsAsync: permisos.getPermissionsAsync,
      requestPermissionsAsync: permisos.requestPermissionsAsync,
      setNotificationChannelAsync: canal.setNotificationChannelAsync,
      scheduleNotificationAsync: programar.scheduleNotificationAsync,
      setNotificationHandler: manejador.setNotificationHandler,
      AndroidImportance: tiposCanal.AndroidImportance,
      SchedulableTriggerInputTypes: tipos.SchedulableTriggerInputTypes,
    };
  } catch {
    cargaFallida = true;
  }

  return modulo;
}

/** ¿La app puede mostrar notificaciones en este binario? */
export async function notificacionesDisponibles(): Promise<boolean> {
  return (await cargarModulo()) !== null;
}

// En Android 13+ el diálogo de POST_NOTIFICATIONS no aparece hasta que existe
// al menos un canal, así que el canal se crea siempre antes de pedir permiso.
export async function crearCanalReportes() {
  const mod = await cargarModulo();
  if (!mod || Platform.OS !== 'android') return;

  const canal: NotificationChannelInput = {
    name: 'Avisos de reportes',
    importance: mod.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#1f7a8c',
  };

  try {
    await mod.setNotificationChannelAsync(CANAL_REPORTES, canal);
  } catch {
    // Si el canal no se puede crear, la app sigue: el aviso queda en /avisos.
  }
}

/** Consulta el permiso de notificaciones. Devuelve null si no hay módulo. */
export async function consultarPermisoNotificaciones(): Promise<NotificationPermissionsStatus | null> {
  const mod = await cargarModulo();
  if (!mod) return null;

  try {
    return await mod.getPermissionsAsync();
  } catch {
    return null;
  }
}

/** Pide el permiso de notificaciones. Devuelve null si no hay módulo. */
export async function pedirPermisoNotificaciones(): Promise<NotificationPermissionsStatus | null> {
  const mod = await cargarModulo();
  if (!mod) return null;

  // Android: creá el canal antes de pedir el permiso
  await crearCanalReportes();

  const actual = await mod.getPermissionsAsync();
  if (actual.granted) return actual;
  if (!actual.canAskAgain) return actual; // ofrecer Ajustes

  const solicitud: NotificationPermissionsRequest = {};
  if (Platform.OS === 'ios') {
    solicitud.ios = {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowProvisional: PERMITIR_NOTIFICACIONES_PROVISIONALES,
    };
  }
  if (Platform.OS === 'android') {
    solicitud.android = {};
  }

  return await mod.requestPermissionsAsync(solicitud);
}

// Agenda el aviso de "reporte resuelto" dentro de 10 segundos.
// Devuelve el identificador de la notificación, o null si no se pudo.
export async function programarAvisoResolucion(reporte: Reporte) {
  const mod = await cargarModulo();
  if (!mod) return null;

  try {
    await crearCanalReportes();

    const solicitud: NotificationRequestInput = {
      content: {
        title: 'Reporte resuelto',
        body: `${reporte.titulo}${reporte.aula ? ` (${reporte.aula})` : ''} ya fue arreglado.`,
        data: { reporteId: reporte.id },
        sound: 'default',
      },
      trigger: {
        type: mod.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        channelId: CANAL_REPORTES,
      },
    };

    return await mod.scheduleNotificationAsync(solicitud);
  } catch {
    // Si no se puede agendar, el aviso queda igual en la bandeja de /avisos.
    return null;
  }
}

// Hay que registrar el manejador antes de que llegue la primera notificación.
export async function configurarManejadorNotificaciones() {
  const mod = await cargarModulo();
  if (!mod) return;

  try {
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // En plataformas sin notificaciones no hace falta manejador.
  }
}
