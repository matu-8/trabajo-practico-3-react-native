import { type BarcodeScanningResult, type BarcodeSettings, type CameraView } from 'expo-camera';

// Solo leemos códigos QR: son los que están pegados en la puerta de cada aula.
export const AJUSTES_CODIGO_BARRAS: BarcodeSettings = {
  barcodeTypes: ['qr'],
};

// Toma una foto con la cámara ya abierta.
// Devuelve la uri de la imagen, o null si algo sale mal (la app nunca se rompe).
export async function tomarFoto(camara: CameraView | null) {
  if (!camara) return null;

  try {
    const foto = await camara.takePictureAsync({ quality: 0.8 });
    return foto?.uri ?? null;
  } catch {
    return null;
  }
}

// Interpreta el contenido del QR pegado en la puerta del aula.
// Acepta "AULA-12", "aula 12" o "ipf.edu.ar/aula/12" y devuelve siempre un
// código legible. Si no reconoce el formato, usa el texto tal cual.
export function extraerCodigoAula(datos: string) {
  const limpio = datos.trim();
  const coincidencia = limpio.match(/AULA[-_\s/]?([A-Z0-9]+)/i);

  if (coincidencia?.[1]) {
    return `AULA-${coincidencia[1].toUpperCase()}`;
  }

  return limpio.toUpperCase().slice(0, 24);
}

// Traduce el resultado del escáner al código de aula.
export function codigoAulaDesdeEscaneo(resultado: BarcodeScanningResult) {
  return extraerCodigoAula(resultado.data);
}
