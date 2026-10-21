import * as Location from 'expo-location';

// Pide la ubicación en primer plano y devuelve la posición actual.
//
// Si se deniega devuelve null y la app sigue: el reporte se completa con el
// sector elegido a mano. Nunca pedimos ubicación en segundo plano, que
// Google Play exige justificar por separado.
export async function obtenerUbicacion() {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) return null; // la app sigue: búsqueda manual

  const aproximada =
    permiso.android?.accuracy === 'coarse' ||
    permiso.ios?.accuracy === 'reduced';

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { ...coords, aproximada };
}
