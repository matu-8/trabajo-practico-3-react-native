import { Stack } from 'expo-router';

import { Cristal, Paleta } from '@/constants/theme';

export default function ReporteLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Paleta.profundo },
        headerTintColor: Cristal.textoPrimario,
        headerTitleStyle: { color: Cristal.textoPrimario },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Paleta.profundo },
      }}>
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo reporte' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear QR del aula' }} />
      <Stack.Screen name="foto" options={{ title: 'Adjuntar foto' }} />
      <Stack.Screen name="ubicacion" options={{ title: 'Marcar ubicación' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle del reporte' }} />
    </Stack>
  );
}
