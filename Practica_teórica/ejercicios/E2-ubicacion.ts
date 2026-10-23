// E2 · El orden importa (ubicación) — versión corregida
// El original pedía primero el permiso de segundo plano y después el de
// primer plano: en iOS el pedido de "Siempre" no se completa de una vez y
// en Android 11+ el pedido de segundo plano no muestra diálogo (abre
// Ajustes), así que sin el permiso de primer plano no se obtiene.

import * as Location from 'expo-location';

export async function activarSeguimiento() {
  // Segundo plano: SIEMPRE después del primer plano
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}

export async function obtenerUbicacion() {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) return null; // la app sigue: sector elegido a mano

  const aproximada =
    permiso.android?.accuracy === 'coarse' ||
    permiso.ios?.accuracy === 'reduced';

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { ...coords, aproximada };
}
