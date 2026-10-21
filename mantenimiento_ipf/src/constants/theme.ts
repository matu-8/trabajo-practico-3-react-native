import '@/global.css';

import { DarkTheme, type Theme } from 'expo-router';

/** Paleta del proyecto "Mantenimiento IPF" (vidrio / glassmorphism). */
export const Paleta = {
  profundo: '#022b3a',
  teal: '#1f7a8c',
  celeste: '#bfdbf7',
  niebla: '#e1e5f2',
  blanco: '#ffffff',
} as const;

/** Tokens de las superficies translúcidas. */
export const Cristal = {
  superficie: 'rgba(255, 255, 255, 0.10)',
  superficieFuerte: 'rgba(255, 255, 255, 0.16)',
  superficieOscura: 'rgba(2, 43, 58, 0.55)',
  borde: 'rgba(255, 255, 255, 0.22)',
  bordeActivo: 'rgba(191, 219, 247, 0.55)',
  radio: 20,
  radioChico: 12,
  textoPrimario: Paleta.niebla,
  textoSecundario: 'rgba(225, 229, 242, 0.72)',
  textoTenue: 'rgba(225, 229, 242, 0.48)',
  acento: Paleta.teal,
  acentoClaro: Paleta.celeste,
  peligro: '#f4707a',
  exito: '#7ee0a8',
  advertencia: '#f2c66b',
} as const;

export const Espaciado = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Tipografia = {
  titulo: { fontSize: 26, fontWeight: '700', color: Cristal.textoPrimario },
  subtitulo: { fontSize: 18, fontWeight: '600', color: Cristal.textoPrimario },
  cuerpo: { fontSize: 15, fontWeight: '400', color: Cristal.textoPrimario },
  detalle: { fontSize: 13, fontWeight: '500', color: Cristal.textoSecundario },
  etiqueta: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Cristal.textoTenue,
  },
} as const;

/** Tema de navegación oscuro, alineado con la paleta. */
export const temaOscuro: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Paleta.teal,
    background: Paleta.profundo,
    card: Cristal.superficieOscura,
    text: Cristal.textoPrimario,
    border: Cristal.borde,
    notification: Paleta.celeste,
  },
};
