import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { Cristal, Tipografia } from '@/constants/theme';

export type VarianteTexto = 'titulo' | 'subtitulo' | 'cuerpo' | 'detalle' | 'etiqueta';

export type TonoTexto =
  | 'primario'
  | 'secundario'
  | 'tenue'
  | 'acento'
  | 'peligro'
  | 'exito'
  | 'advertencia';

export type TextoProps = TextProps & {
  variante?: VarianteTexto;
  tono?: TonoTexto;
  style?: StyleProp<TextStyle>;
};

const VARIANTES: Record<VarianteTexto, TextStyle> = {
  titulo: Tipografia.titulo,
  subtitulo: Tipografia.subtitulo,
  cuerpo: Tipografia.cuerpo,
  detalle: Tipografia.detalle,
  etiqueta: Tipografia.etiqueta,
};

const TONOS: Record<TonoTexto, string> = {
  primario: Cristal.textoPrimario,
  secundario: Cristal.textoSecundario,
  tenue: Cristal.textoTenue,
  acento: Cristal.acentoClaro,
  peligro: Cristal.peligro,
  exito: Cristal.exito,
  advertencia: Cristal.advertencia,
};

/** Tipografía de la app. Reemplaza al `ThemedText` del template de Expo. */
export function Texto({
  variante = 'cuerpo',
  tono = 'primario',
  style,
  ...props
}: TextoProps) {
  return (
    <Text
      style={[VARIANTES[variante], { color: TONOS[tono] }, style]}
      {...props}
    />
  );
}

export const estilosTexto = StyleSheet.create({
  centrado: {
    textAlign: 'center',
  },
});
