import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import {
  consultarPermisoNotificaciones,
  pedirPermisoNotificaciones,
} from '@/lib/notificaciones';

import type { RespuestaPermiso } from './estados';
import type { Recurso } from './recursos';

// Cuando el módulo no existe en la plataforma (por ejemplo, notificaciones en
// un Expo Go sin ese módulo) no hay nada que consultar: se responde como
// bloqueado y con "disponible: false" para que la interfaz lo diga, en vez de
// prometer un permiso que no se puede pedir.
const SIN_SOPORTE: RespuestaPermiso = {
  status: 'denied',
  granted: false,
  canAskAgain: false,
  disponible: false,
};

// Consulta el estado actual de un permiso. No muestra ningún diálogo.
export async function consultarPermiso(recurso: Recurso): Promise<RespuestaPermiso> {
  try {
    switch (recurso) {
      case 'camara':
        return await Camera.getCameraPermissionsAsync();
      case 'ubicacion':
        return await Location.getForegroundPermissionsAsync();
      case 'notificaciones': {
        const respuesta = await consultarPermisoNotificaciones();
        return respuesta ?? SIN_SOPORTE;
      }
    }
  } catch {
    return SIN_SOPORTE;
  }
}

// Pide el permiso al sistema. Este es el único lugar de la app donde se
// dispara un diálogo, y siempre después de que la persona vio la pantalla
// previa /permisos/[recurso].
export async function pedirPermiso(recurso: Recurso): Promise<RespuestaPermiso> {
  try {
    switch (recurso) {
      case 'camara':
        return await Camera.requestCameraPermissionsAsync();
      case 'ubicacion':
        return await Location.requestForegroundPermissionsAsync();
      case 'notificaciones': {
        const respuesta = await pedirPermisoNotificaciones();
        return respuesta ?? SIN_SOPORTE;
      }
    }
  } catch {
    return SIN_SOPORTE;
  }
}
