import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { consultarPermiso, pedirPermiso } from '@/lib/permisos/consultar';
import {
  calcularEstado,
  type EstadoPermiso,
  type RespuestaPermiso,
} from '@/lib/permisos/estados';
import type { Recurso } from '@/lib/permisos/recursos';

import { useRevisarAlVolver } from './use-revisar-al-volver';

export type UsePermiso = {
  // Estado unificado del permiso.
  estado: EstadoPermiso;
  // Concedido pero acotado: fotos limitadas o ubicación aproximada.
  parcial: boolean;
  matiz: string | null;
  // Respuesta cruda del sistema, por si hace falta mirar un campo puntual.
  respuesta: RespuestaPermiso | null;
  // true mientras se consulta el estado por primera vez.
  cargando: boolean;
  // false cuando el módulo nativo no existe en el binario donde corre la app
  // (por ejemplo, un Expo Go sin el módulo de notificaciones).
  disponible: boolean;
  // Muestra el diálogo del sistema. Solo se llama desde /permisos/[recurso].
  pedir: () => Promise<RespuestaPermiso>;
  // Abre los Ajustes de la app en el sistema.
  abrirAjustes: () => Promise<void>;
  // Vuelve a consultar el estado (por ejemplo, al volver de Ajustes).
  recargar: () => Promise<RespuestaPermiso>;
};

type Consulta = {
  recurso: Recurso;
  respuesta: RespuestaPermiso;
};

// Hook unificado de permisos.
//
// Traduce la respuesta de Expo a los cuatro estados que usa la app:
// 'cargando' | 'concedido' | 'preguntable' | 'bloqueado'.
// Se re-consulta automáticamente cuando la persona vuelve de los Ajustes,
// porque los hooks de Expo no se enteran solos de ese cambio.
export function usePermiso(recurso: Recurso): UsePermiso {
  const [consulta, setConsulta] = useState<Consulta | null>(null);

  const recargar = useCallback(async () => {
    const nueva = await consultarPermiso(recurso);
    setConsulta({ recurso, respuesta: nueva });
    return nueva;
  }, [recurso]);

  useEffect(() => {
    let vigente = true;

    consultarPermiso(recurso).then((nueva) => {
      if (!vigente) return;
      setConsulta({ recurso, respuesta: nueva });
    });

    return () => {
      vigente = false;
    };
  }, [recurso]);

  useRevisarAlVolver(() => {
    void recargar();
  });

  const pedir = useCallback(async () => {
    const nueva = await pedirPermiso(recurso);
    setConsulta({ recurso, respuesta: nueva });
    return nueva;
  }, [recurso]);

  const abrirAjustes = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  // La respuesta vale solo si es del recurso que se está mostrando ahora.
  const respuesta = consulta?.recurso === recurso ? consulta.respuesta : null;
  const { estado, parcial, matiz } = calcularEstado(respuesta);

  return {
    estado,
    parcial,
    matiz,
    respuesta,
    cargando: respuesta === null,
    disponible: respuesta?.disponible !== false,
    pedir,
    abrirAjustes,
    recargar,
  };
}
