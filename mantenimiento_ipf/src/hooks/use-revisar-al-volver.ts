import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Ejecuta `revisar` cuando la app vuelve al primer plano.
 *
 * Los hooks de permisos de Expo no se enteran solos de que la persona cambió
 * una autorización en los Ajustes del sistema: hay que volver a consultar.
 * Este hook detecta ese momento (app en segundo plano → app activa).
 */
export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);
  const revisarActual = useRef(revisar);

  useEffect(() => {
    revisarActual.current = revisar;
  }, [revisar]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current === 'background' || anterior.current === 'inactive';
      const volvio = nuevo === 'active';

      if (estabaAfuera && volvio) {
        revisarActual.current();
      }

      anterior.current = nuevo;
    });

    return () => subscription.remove();
  }, []);
}
