// Los cuatro estados que maneja la app.
// 'preguntable' = todavía se puede mostrar el diálogo del sistema.
// 'bloqueado'   = ya no se puede, hay que ir a los Ajustes del sistema.
export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

// En iOS, el estado 3 de UNAuthorizationStatus es la autorización provisional:
// la app puede avisar, pero en silencio y sin mostrar ningún diálogo.
// Va como constante y no como import de expo-notifications a propósito: esa
// capa tiene que quedar en JS puro, sin depender de módulos nativos.
export const IOS_AUTORIZACION_PROVISIONAL = 3;

// Forma común de las respuestas de Expo. Incluye los datos extra que aporta
// cada módulo: precisión de la ubicación, acceso limitado a fotos y estado
// provisional de las notificaciones en iOS.
export type RespuestaPermiso = {
  status: 'granted' | 'denied' | 'undetermined';
  granted: boolean;
  canAskAgain: boolean;
  expires?: 'never' | number;
  accessPrivileges?: 'all' | 'limited' | 'none';
  // false cuando el módulo nativo no está disponible en el binario donde
  // corre la app (por ejemplo, en una versión de Expo Go sin ese módulo).
  disponible?: boolean;
  android?: {
    accuracy?: 'fine' | 'coarse' | 'none';
    importance?: number;
    interruptionFilter?: number;
  };
  ios?: {
    status?: number;
    accuracy?: 'full' | 'reduced';
  };
};

export type DetallePermiso = {
  estado: EstadoPermiso;
  // Concedido pero acotado: fotos limitadas o ubicación aproximada.
  parcial: boolean;
  matiz: string | null;
};

// Con ubicación aproximada o con fotos limitadas el permiso está concedido,
// pero el matiz hay que mostrarlo: no alcanza con decir "concedido".
export function detectarMatiz(respuesta: RespuestaPermiso): string | null {
  if (respuesta.accessPrivileges === 'limited') {
    return 'Acceso limitado a algunas fotos';
  }
  if (respuesta.android?.accuracy === 'coarse') {
    return 'Ubicación aproximada';
  }
  if (respuesta.ios?.accuracy === 'reduced') {
    return 'Ubicación aproximada';
  }
  if (respuesta.ios?.status === IOS_AUTORIZACION_PROVISIONAL) {
    return 'Notificaciones provisionales (llegan en silencio)';
  }
  return null;
}

// Traduce la respuesta del sistema a los cuatro estados de la app.
export function calcularEstado(respuesta: RespuestaPermiso | null): DetallePermiso {
  if (!respuesta) {
    return { estado: 'cargando', parcial: false, matiz: null }; // 1. todavía consultando
  }

  // Las notificaciones provisionales de iOS cuentan como concedidas: la app
  // puede avisar, pero en silencio y sin diálogo.
  const esProvisional = respuesta.ios?.status === IOS_AUTORIZACION_PROVISIONAL;

  if (respuesta.granted || esProvisional) {
    const matiz = esProvisional
      ? 'Notificaciones provisionales (llegan en silencio)'
      : detectarMatiz(respuesta);
    return { estado: 'concedido', parcial: esProvisional || matiz !== null, matiz }; // 2. concedido
  }

  if (respuesta.status === 'undetermined') {
    return { estado: 'preguntable', parcial: false, matiz: null }; // 3. se puede pedir
  }

  if (respuesta.status === 'denied') {
    // canAskAgain decide entre "pedir" y "mandar a Ajustes".
    // En iOS el primer "No" ya deja canAskAgain en false.
    return respuesta.canAskAgain
      ? { estado: 'preguntable', parcial: false, matiz: null }
      : { estado: 'bloqueado', parcial: false, matiz: null }; // 4. bloqueado: solo Ajustes
  }

  return { estado: 'preguntable', parcial: false, matiz: null };
}
