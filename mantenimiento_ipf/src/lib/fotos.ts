import * as ImagePicker from 'expo-image-picker';

// Abre el selector de imágenes del sistema para elegir una foto existente.
//
// La app NO pide permiso de galería: el selector del sistema se abre en otro
// proceso y la persona solo nos entrega el archivo que eligió. En Android
// declaramos READ_MEDIA_IMAGES como permiso bloqueado justamente para esto.
export async function elegirFotoDeGaleria() {
  try {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true haría que iOS use el selector viejo
      // (UIImagePickerController), que sí necesita permiso de galería.
      allowsEditing: false,
      quality: 0.8,
    });

    if (resultado.canceled) return null;

    return resultado.assets[0]?.uri ?? null;
  } catch {
    return null;
  }
}

// Abre la cámara del sistema para sacar una foto.
// El permiso de cámara lo pide la pantalla, con el hook usePermiso: este
// helper solo lanza la cámara del sistema.
export async function sacarFoto() {
  try {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (resultado.canceled) return null;

    return resultado.assets[0]?.uri ?? null;
  } catch {
    return null;
  }
}
