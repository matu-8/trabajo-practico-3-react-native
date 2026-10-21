import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Espaciado, Paleta } from '@/constants/theme';

import { Texto } from './texto';

export type IndicadorCargaProps = {
  mensaje: string;
};

// Indicador de carga con su mensaje: la app siempre dice qué está esperando.
export function IndicadorCarga({ mensaje }: IndicadorCargaProps) {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator color={Paleta.celeste} size="large" />
      <Texto variante="detalle" tono="secundario" style={styles.mensaje}>
        {mensaje}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaciado.md,
    paddingVertical: Espaciado.xl,
  },
  mensaje: {
    textAlign: 'center',
  },
});
