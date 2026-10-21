import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Cristal, Espaciado } from '@/constants/theme';

import { Texto } from './texto';

export type OpcionSelector<T extends string> = {
  valor: T;
  etiqueta: string;
};

export type SelectorOpcionesProps<T extends string> = {
  opciones: OpcionSelector<T>[];
  valor: T;
  onChange: (valor: T) => void;
  etiqueta?: string;
};

// Selector de una sola opción, en forma de chips.
export function SelectorOpciones<T extends string>({
  opciones,
  valor,
  onChange,
  etiqueta,
}: SelectorOpcionesProps<T>) {
  return (
    <View style={styles.contenedor}>
      {etiqueta ? <Texto variante="etiqueta">{etiqueta}</Texto> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {opciones.map((opcion) => {
          const activo = opcion.valor === valor;

          return (
            <Pressable
              key={opcion.valor}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
              onPress={() => onChange(opcion.valor)}
              style={({ pressed }) => [
                styles.chip,
                activo ? styles.chipActivo : null,
                pressed ? styles.presionado : null,
              ]}>
              <Texto
                variante="detalle"
                style={activo ? styles.textoActivo : undefined}
                tono={activo ? 'primario' : 'secundario'}>
                {opcion.etiqueta}
              </Texto>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Espaciado.xs,
  },
  chips: {
    gap: Espaciado.sm,
    paddingVertical: Espaciado.xs,
    paddingRight: Espaciado.lg,
  },
  chip: {
    paddingVertical: Espaciado.sm,
    paddingHorizontal: Espaciado.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Cristal.borde,
    backgroundColor: Cristal.superficie,
  },
  chipActivo: {
    borderColor: Cristal.acentoClaro,
    backgroundColor: 'rgba(31, 122, 140, 0.45)',
  },
  presionado: {
    opacity: 0.7,
  },
  textoActivo: {
    fontWeight: '700',
  },
});
