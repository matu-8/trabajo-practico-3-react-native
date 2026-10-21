import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { CampoTexto } from '@/components/campo-texto';
import { GlassCard } from '@/components/glass-card';
import { IndicadorCarga } from '@/components/indicador-carga';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { usePermisoEnfocado } from '@/hooks/use-permiso-enfocado';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { AJUSTES_CODIGO_BARRAS, codigoAulaDesdeEscaneo } from '@/lib/camara';

export default function Escanear() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useAlmacenReportes();
  const camara = usePermiso('camara');
  usePermisoEnfocado(camara);

  const [escaneado, setEscaneado] = useState(false);
  const [codigoManual, setCodigoManual] = useState(borrador.aula);

  function alEscanear(resultado: BarcodeScanningResult) {
    // El lector dispara muchas veces por segundo: solo guardamos el primero.
    if (escaneado) return;
    setEscaneado(true);

    actualizarBorrador({ aula: codigoAulaDesdeEscaneo(resultado) });
    router.back();
  }

  function guardarManual() {
    actualizarBorrador({ aula: codigoManual });
    router.back();
  }

  // 1. todavía consultando
  if (camara.cargando) {
    return (
      <Pantalla>
        <IndicadorCarga mensaje="Consultando el permiso de cámara…" />
      </Pantalla>
    );
  }

  // 2. concedido: se muestra la cámara
  if (camara.estado === 'concedido') {
    return (
      <Pantalla scroll={false}>
        <View style={styles.camara}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={AJUSTES_CODIGO_BARRAS}
            onBarcodeScanned={alEscanear}
          />
          <View style={styles.marco}>
            <Texto variante="cuerpo" style={styles.marcoTexto}>
              Apuntá al código QR de la puerta del aula
            </Texto>
          </View>
        </View>

        <GlassCard style={styles.tarjeta}>
          <CampoTexto
            etiqueta="O escribí el código a mano"
            placeholder="AULA-12"
            autoCapitalize="characters"
            value={codigoManual}
            onChangeText={setCodigoManual}
          />
          <BotonPrimario
            titulo="Guardar código"
            variante="secundario"
            deshabilitado={!codigoManual.trim()}
            onPress={guardarManual}
          />
        </GlassCard>
      </Pantalla>
    );
  }

  // 3. se puede pedir: la pantalla previa explica el beneficio
  // 4. bloqueado: solo Ajustes
  const bloqueado = camara.estado === 'bloqueado';

  return (
    <Pantalla>
      <GlassCard>
        <Texto variante="subtitulo">
          {bloqueado ? 'La cámara está bloqueada' : 'Necesitamos la cámara'}
        </Texto>
        <Texto variante="cuerpo" tono="secundario">
          Usamos tu cámara para escanear el código QR del aula y para fotografiar el desperfecto
          que reportás.
        </Texto>

        {bloqueado ? (
          <Texto variante="detalle" tono="advertencia">
            Habilitala en los Ajustes del sistema para poder escanear. También podés escribir el
            código del aula a mano.
          </Texto>
        ) : null}

        <BotonPrimario
          titulo={bloqueado ? 'Abrir Ajustes' : 'Continuar'}
          variante={bloqueado ? 'peligro' : 'primario'}
          onPress={() =>
            bloqueado
              ? void camara.abrirAjustes()
              : router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } })
          }
        />
      </GlassCard>

      <GlassCard>
        <CampoTexto
          etiqueta="Escribí el código del aula a mano"
          placeholder="AULA-12"
          autoCapitalize="characters"
          value={codigoManual}
          onChangeText={setCodigoManual}
        />
        <BotonPrimario
          titulo="Guardar código"
          variante="secundario"
          deshabilitado={!codigoManual.trim()}
          onPress={guardarManual}
        />
      </GlassCard>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  camara: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  marco: {
    position: 'absolute',
    left: Espaciado.lg,
    right: Espaciado.lg,
    bottom: Espaciado.lg,
    paddingVertical: Espaciado.sm,
    paddingHorizontal: Espaciado.md,
    borderRadius: 12,
    backgroundColor: 'rgba(2, 43, 58, 0.72)',
  },
  marcoTexto: {
    textAlign: 'center',
  },
  tarjeta: {
    marginTop: Espaciado.md,
  },
});
