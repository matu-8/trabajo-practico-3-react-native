import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_ALMACEN = 'mantenimiento-ipf:v1';

/**
 * Lee el estado guardado. Si algo falla (almacenamiento no disponible, datos
 * corruptos) devuelve `null` y la app sigue funcionando en memoria.
 */
export async function leerAlmacen<T>(): Promise<T | null> {
  try {
    const crudo = await AsyncStorage.getItem(CLAVE_ALMACEN);
    if (!crudo) return null;
    return JSON.parse(crudo) as T;
  } catch {
    return null;
  }
}

/** Guarda el estado. Los errores se ignoran a propósito: no pueden romper la app. */
export async function guardarAlmacen<T>(valor: T): Promise<void> {
  try {
    await AsyncStorage.setItem(CLAVE_ALMACEN, JSON.stringify(valor));
  } catch {
    // Sin persistencia no se pierde la funcionalidad, solo los datos al reiniciar.
  }
}
