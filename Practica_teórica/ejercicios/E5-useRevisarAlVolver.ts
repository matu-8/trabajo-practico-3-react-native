// E5 · Volver de Ajustes — hook con los espacios completados
// Espacios:
//   estabaAfuera  = anterior.current !== 'active'
//   condición     = nuevo === 'active'
//   limpieza      = sub.remove()

import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/** Llama a revisar() cada vez que la app vuelve al frente. */
export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current !== 'active';
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });
    return () => sub.remove();
  }, [revisar]);
}
