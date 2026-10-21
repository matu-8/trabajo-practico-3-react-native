import { type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Espaciado } from '@/constants/theme';

import { GlassSurface } from './glass-surface';
import { Texto } from './texto';

export type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
};

// Tarjeta de cristal: el bloque básico con el que se arma la interfaz.
export function GlassCard({ children, style, onPress, accessibilityLabel }: GlassCardProps) {
  if (!onPress) {
    return <GlassSurface style={[styles.card, style]}>{children}</GlassSurface>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [pressed ? styles.presionado : null]}>
      <GlassSurface style={[styles.card, style]}>{children}</GlassSurface>
    </Pressable>
  );
}

// Encabezado de una tarjeta.
export function GlassCardTitulo({ children }: { children: ReactNode }) {
  return (
    <Texto variante="subtitulo" style={styles.titulo}>
      {children}
    </Texto>
  );
}

// Texto de apoyo dentro de una tarjeta.
export function GlassCardDescripcion({ children }: { children: ReactNode }) {
  return (
    <Texto variante="detalle" tono="secundario" style={styles.descripcion}>
      {children}
    </Texto>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Espaciado.lg,
    gap: Espaciado.md,
  },
  presionado: {
    opacity: 0.8,
  },
  titulo: {
    marginBottom: Espaciado.xs,
  },
  descripcion: {
    lineHeight: 19,
  },
});
