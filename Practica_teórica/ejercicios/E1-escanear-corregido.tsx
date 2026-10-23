// E1 · Encontrá los errores (cámara) — versión corregida
// Errores del original:
//   1. Crash / render roto en el primer render: permiso vale null y el código
//      hace permiso.status === 'granted' sin chequear antes.
//   2. No maneja el estado bloqueado: si canAskAgain es false queda para
//      siempre en la pantalla de preguntar, sin ofrecer Ajustes.
//   3. El botón dice "Permitir": el diálogo del sistema lo dibuja él, el
//      botón de la app solo debe abrirlo ("Continuar").
//   4. Bonus: pide el permiso directamente en la misma pantalla, sin
//      explicar el beneficio en el texto de la Explicacion.

import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Linking } from 'react-native';
// Cargando y Explicacion son componentes propios de la app

export default function Escanear() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const abrirAjustes = () => Linking.openSettings();

  if (!permiso) return <Cargando />; // 1. cargando: todavía consultando

  if (permiso.granted) {             // 2. concedido
    return <CameraView style={{ flex: 1 }} facing="back" />;
  }

  if (permiso.canAskAgain) {         // 3. preguntable: se puede pedir
    return (
      <Explicacion texto="Usamos la cámara para leer el QR del aula.">
        <Button title="Continuar" onPress={pedirPermiso} />
      </Explicacion>
    );
  }

  return (                           // 4. bloqueado: solo Ajustes
    <Explicacion texto="La cámara está desactivada para esta app. Podés habilitarla en Ajustes.">
      <Button title="Abrir Ajustes" onPress={abrirAjustes} />
    </Explicacion>
  );
}
