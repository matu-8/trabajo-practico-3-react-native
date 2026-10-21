import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Cristal, Espaciado } from '@/constants/theme';

import { Texto } from './texto';

export type CampoTextoProps = TextInputProps & {
  etiqueta: string;
  ayuda?: string;
};

// Campo de texto con etiqueta, para los formularios.
export function CampoTexto({ etiqueta, ayuda, style, ...props }: CampoTextoProps) {
  return (
    <View style={styles.contenedor}>
      <Texto variante="etiqueta">{etiqueta}</Texto>
      <TextInput
        placeholderTextColor={Cristal.textoTenue}
        selectionColor={Cristal.acentoClaro}
        style={[styles.campo, style]}
        {...props}
      />
      {ayuda ? (
        <Texto variante="detalle" tono="tenue">
          {ayuda}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Espaciado.xs,
  },
  campo: {
    backgroundColor: Cristal.superficie,
    borderWidth: 1,
    borderColor: Cristal.borde,
    borderRadius: Cristal.radioChico,
    paddingVertical: Espaciado.md,
    paddingHorizontal: Espaciado.md,
    color: Cristal.textoPrimario,
    fontSize: 15,
  },
});
