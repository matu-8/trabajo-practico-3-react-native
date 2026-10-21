import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Espaciado } from '@/constants/theme';

import { FondoGlass } from './fondo-glass';

export type PantallaProps = {
  children: ReactNode;
  /** false cuando la pantalla necesita controlar su propio scroll (por ejemplo, la cámara). */
  scroll?: boolean;
  refreshing?: boolean;
};

// Envoltorio común de las pantallas: fondo con degradado, safe area y scroll.
export function Pantalla({ children, scroll = true }: PantallaProps) {
  return (
    <FondoGlass>
      <SafeAreaView style={styles.contenedor} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.contenido}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={styles.contenido}>{children}</View>
        )}
      </SafeAreaView>
    </FondoGlass>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    flexGrow: 1,
    padding: Espaciado.lg,
    paddingBottom: Espaciado.xxl,
    gap: Espaciado.lg,
  },
});
