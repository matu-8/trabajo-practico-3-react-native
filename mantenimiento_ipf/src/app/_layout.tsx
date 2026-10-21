import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Paleta, temaOscuro } from '@/constants/theme';
import { AlmacenReportesProvider } from '@/lib/almacenamiento/almacen-reportes';
import { configurarManejadorNotificaciones } from '@/lib/notificaciones';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 250, fade: true });

export default function Layout() {
  useEffect(() => {
    // El manejador tiene que estar registrado antes de que llegue la primera
    // notificación, si no iOS no la muestra en primer plano.
    void configurarManejadorNotificaciones();
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={temaOscuro}>
      <AlmacenReportesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Paleta.profundo },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reporte" />
          <Stack.Screen name="ajustes-app" />
          <Stack.Screen
            name="permisos/[recurso]"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </AlmacenReportesProvider>
    </ThemeProvider>
  );
}
