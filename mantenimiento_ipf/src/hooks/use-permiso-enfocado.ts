import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import type { UsePermiso } from './usePermiso';

/**
 * Vuelve a consultar el permiso cuando la pantalla vuelve a quedar en primer
 * plano.
 *
 * Hace falta porque cada pantalla tiene su propia instancia de `usePermiso`:
 * si el permiso se concede desde la pantalla previa `/permisos/[recurso]`, la
 * pantalla que la abrió tiene que enterarse al volver.
 */
export function usePermisoEnfocado(permiso: UsePermiso) {
  const { recargar } = permiso;

  useFocusEffect(
    useCallback(() => {
      void recargar();
    }, [recargar])
  );
}
