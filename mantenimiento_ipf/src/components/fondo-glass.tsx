import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Paleta } from '@/constants/theme';

export type FondoGlassProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Fondo de la app: degradado de la paleta con manchas de luz difusas.
 * Es la base sobre la que flotan las superficies de cristal.
 */
export function FondoGlass({ children, style }: FondoGlassProps) {
  return (
    <LinearGradient
      colors={[Paleta.profundo, '#0d4257', Paleta.teal, '#0a3346']}
      locations={[0, 0.35, 0.68, 1]}
      style={[styles.fondo, style]}>
      <View pointerEvents="none" style={styles.blobUno} />
      <View pointerEvents="none" style={styles.blobDos} />
      <View pointerEvents="none" style={styles.blobTres} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  blobUno: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    experimental_backgroundImage:
      'radial-gradient(circle, rgba(191, 219, 247, 0.32) 0%, rgba(191, 219, 247, 0) 70%)',
  },
  blobDos: {
    position: 'absolute',
    top: '38%',
    right: -140,
    width: 380,
    height: 380,
    borderRadius: 190,
    experimental_backgroundImage:
      'radial-gradient(circle, rgba(31, 122, 140, 0.55) 0%, rgba(31, 122, 140, 0) 70%)',
  },
  blobTres: {
    position: 'absolute',
    bottom: -160,
    left: -60,
    width: 340,
    height: 340,
    borderRadius: 170,
    experimental_backgroundImage:
      'radial-gradient(circle, rgba(191, 219, 247, 0.18) 0%, rgba(191, 219, 247, 0) 70%)',
  },
});
