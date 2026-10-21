import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Cristal, Espaciado, Paleta } from '@/constants/theme';

import { Texto } from './texto';

export type VarianteBoton = 'primario' | 'secundario' | 'peligro';

export type BotonPrimarioProps = {
  titulo: string;
  onPress: () => void;
  variante?: VarianteBoton;
  cargando?: boolean;
  deshabilitado?: boolean;
  icono?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function BotonPrimario({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  icono,
  style,
  accessibilityLabel,
  accessibilityHint,
}: BotonPrimarioProps) {
  const inactivo = deshabilitado || cargando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactivo }}
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        pressed && !inactivo ? styles.presionado : null,
        inactivo ? styles.inactivo : null,
        style,
      ]}>
      {cargando ? (
        <ActivityIndicator color={variante === 'primario' ? Paleta.blanco : Cristal.acentoClaro} />
      ) : (
        icono
      )}
      <Texto
        variante="cuerpo"
        style={styles.texto}
        tono={variante === 'primario' ? 'primario' : variante === 'peligro' ? 'peligro' : 'primario'}>
        {titulo}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaciado.sm,
    paddingVertical: Espaciado.md,
    paddingHorizontal: Espaciado.lg,
    borderRadius: Cristal.radioChico,
    borderWidth: 1,
  },
  primario: {
    backgroundColor: Cristal.acento,
    borderColor: Cristal.acento,
  },
  secundario: {
    backgroundColor: Cristal.superficie,
    borderColor: Cristal.borde,
  },
  peligro: {
    backgroundColor: 'transparent',
    borderColor: Cristal.peligro,
  },
  presionado: {
    opacity: 0.75,
  },
  inactivo: {
    opacity: 0.45,
  },
  texto: {
    fontWeight: '700',
  },
});
