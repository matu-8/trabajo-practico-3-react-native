import { StyleSheet, View } from 'react-native';

import { Cristal, Espaciado } from '@/constants/theme';
import { etiquetaEstado, type EstadoReporte } from '@/lib/tipos';

import { Texto } from './texto';

const COLOR_POR_ESTADO: Record<EstadoReporte, string> = {
  pendiente: Cristal.acentoClaro,
  'en curso': Cristal.advertencia,
  resuelto: Cristal.exito,
};

// Chip con el estado del reporte.
export function ChipEstado({ estado }: { estado: EstadoReporte }) {
  const color = COLOR_POR_ESTADO[estado];

  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <View style={[styles.punto, { backgroundColor: color }]} />
      <Texto variante="etiqueta" style={{ color }}>
        {etiquetaEstado(estado)}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: Espaciado.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
