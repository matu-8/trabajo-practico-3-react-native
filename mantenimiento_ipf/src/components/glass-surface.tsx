import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { Cristal } from '@/constants/theme';

/**
 * El "liquid glass" de iOS 26 solo existe en iOS. En el resto de plataformas
 * usamos BlurView (iOS anterior) o una superficie translúcida (Android/web).
 */
function detectarLiquidGlass(): boolean {
  if (Platform.OS !== 'ios') return false;

  try {
    return isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

const HAY_LIQUID_GLASS = detectarLiquidGlass();

export type GlassSurfaceProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  /** Intensidad del desenfoque (solo tiene efecto en el BlurView de iOS). */
  intensity?: number;
  /** Tinte del cristal. */
  tint?: 'light' | 'dark' | 'default';
  /** Agrega la capa translúcida propia de Android y web. */
  translucido?: boolean;
};

/**
 * Superficie de cristal: el bloque básico de la interfaz.
 *
 * - iOS 26+: `GlassView` nativo (liquid glass).
 * - iOS anterior: `BlurView` con desenfoque real.
 * - Android y web: superficie translúcida con borde (el desenfoque de
 *   `expo-blur` no funciona en Android sin un `BlurTargetView`).
 */
export function GlassSurface({
  children,
  style,
  intensity = 40,
  tint = 'dark',
  translucido = true,
  ...props
}: GlassSurfaceProps) {
  if (HAY_LIQUID_GLASS) {
    return (
      <GlassView
        glassEffectStyle="clear"
        tintColor="rgba(31, 122, 140, 0.30)"
        style={[styles.base, style]}
        {...props}>
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint={tint} style={[styles.base, styles.velo, style]} {...props}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.base, translucido ? styles.velo : null, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Cristal.radio,
    borderWidth: 1,
    borderColor: Cristal.borde,
    overflow: 'hidden',
  },
  velo: {
    backgroundColor: Cristal.superficie,
  },
});
