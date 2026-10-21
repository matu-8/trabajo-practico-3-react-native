import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { GlassCard } from '@/components/glass-card';
import { IndicadorCarga } from '@/components/indicador-carga';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { usePermisoEnfocado } from '@/hooks/use-permiso-enfocado';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { elegirFotoDeGaleria, sacarFoto } from '@/lib/fotos';

export default function Foto() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useAlmacenReportes();
  const camara = usePermiso('camara');
  usePermisoEnfocado(camara);
  const [ocupado, setOcupado] = useState(false);

  async function conCamara() {
    // Si la cámara no está concedida, primero se muestra la pantalla previa.
    if (camara.estado !== 'concedido') {
      router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } });
      return;
    }

    setOcupado(true);
    const uri = await sacarFoto();
    setOcupado(false);

    if (!uri) return;

    actualizarBorrador({ fotoUri: uri });
    router.back();
  }

  async function desdeGaleria() {
    // El selector del sistema no necesita ningún permiso de galería.
    setOcupado(true);
    const uri = await elegirFotoDeGaleria();
    setOcupado(false);

    if (!uri) return;

    actualizarBorrador({ fotoUri: uri });
    router.back();
  }

  return (
    <Pantalla>
      {borrador.fotoUri ? (
        <GlassCard>
          <Texto variante="subtitulo">Foto actual</Texto>
          <Image source={{ uri: borrador.fotoUri }} style={styles.previa} resizeMode="cover" />
        </GlassCard>
      ) : null}

      <GlassCard>
        <Texto variante="subtitulo">Sacar una foto</Texto>
        <Texto variante="detalle" tono="secundario">
          Usamos tu cámara para fotografiar el desperfecto que reportás. Si no querés dar permiso,
          podés elegir una foto del selector del sistema.
        </Texto>

        {camara.cargando ? (
          <IndicadorCarga mensaje="Consultando el permiso de cámara…" />
        ) : camara.estado === 'bloqueado' ? (
          <BotonPrimario
            titulo="Abrir Ajustes"
            variante="peligro"
            onPress={() => void camara.abrirAjustes()}
          />
        ) : camara.estado === 'preguntable' ? (
          <BotonPrimario
            titulo="Continuar"
            onPress={() =>
              router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } })
            }
          />
        ) : (
          <BotonPrimario
            titulo="Sacar foto"
            cargando={ocupado}
            onPress={() => void conCamara()}
          />
        )}
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Elegir de la galería</Texto>
        <Texto variante="detalle" tono="secundario">
          Se abre el selector de imágenes del sistema. La app no accede a tu galería ni te pide
          permiso para verla: solo recibís la foto que elijas.
        </Texto>
        <BotonPrimario
          titulo="Elegir de la galería"
          variante="secundario"
          cargando={ocupado}
          onPress={() => void desdeGaleria()}
        />
      </GlassCard>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  previa: {
    width: '100%',
    height: 220,
    borderRadius: Espaciado.md,
  },
});
