import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { ChipEstado } from '@/components/chip-estado';
import { GlassCard } from '@/components/glass-card';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { programarAvisoResolucion } from '@/lib/notificaciones';
import { etiquetaCategoria, etiquetaSector } from '@/lib/tipos';

export default function DetalleReporte() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reportes, marcarResuelto, agregarAviso } = useAlmacenReportes();
  const [simulando, setSimulando] = useState(false);

  const reporte = reportes.find((item) => item.id === id);

  // Si el id no existe en el store, avisamos en vez de mostrar una pantalla vacía.
  if (!reporte) {
    return (
      <Pantalla>
        <GlassCard>
          <Texto variante="subtitulo">Ese reporte no existe</Texto>
          <Texto variante="detalle" tono="secundario">
            Puede que se haya borrado o que el enlace esté incompleto.
          </Texto>
          <BotonPrimario
            titulo="Volver a mis reportes"
            variante="secundario"
            onPress={() => router.replace('/')}
          />
        </GlassCard>
      </Pantalla>
    );
  }

  async function simularResolucion() {
    if (!reporte) return;

    setSimulando(true);
    marcarResuelto(reporte.id);

    // El aviso va siempre a la bandeja, aunque no haya permiso de notificaciones.
    agregarAviso({
      reporteId: reporte.id,
      titulo: 'Reporte resuelto',
      cuerpo: `${reporte.titulo}${reporte.aula ? ` (${reporte.aula})` : ''} ya fue arreglado.`,
    });

    await programarAvisoResolucion(reporte);
    setSimulando(false);
  }

  return (
    <Pantalla>
      <GlassCard>
        <View style={styles.encabezado}>
          <Texto variante="titulo" style={styles.titulo}>
            {reporte.titulo}
          </Texto>
          <ChipEstado estado={reporte.estado} />
        </View>

        {reporte.descripcion ? (
          <Texto variante="cuerpo" tono="secundario">
            {reporte.descripcion}
          </Texto>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Datos</Texto>
        <Dato etiqueta="Categoría" valor={etiquetaCategoria(reporte.categoria)} />
        <Dato etiqueta="Aula" valor={reporte.aula || 'Sin especificar'} />
        <Dato
          etiqueta="Sector"
          valor={etiquetaSector(reporte.sector) || (reporte.ubicacion ? 'Marcado en el mapa' : 'Sin especificar')}
        />
        <Dato
          etiqueta="Ubicación"
          valor={
            reporte.ubicacion
              ? reporte.ubicacion.aproximada
                ? 'Ubicación aproximada'
                : `${reporte.ubicacion.latitude.toFixed(4)}, ${reporte.ubicacion.longitude.toFixed(4)}`
              : 'No se marcó ubicación'
          }
        />
        <Dato
          etiqueta="Creado"
          valor={new Date(reporte.creadoEn).toLocaleString('es-AR')}
        />
      </GlassCard>

      {reporte.fotoUri ? (
        <GlassCard>
          <Texto variante="subtitulo">Foto del desperfecto</Texto>
          <Image source={{ uri: reporte.fotoUri }} style={styles.foto} resizeMode="cover" />
        </GlassCard>
      ) : null}

      {reporte.estado === 'resuelto' ? (
        <GlassCard>
          <Texto variante="subtitulo" tono="exito">
            Resuelto
          </Texto>
          <Texto variante="detalle" tono="secundario">
            {reporte.resueltoEn
              ? `Se resolvió el ${new Date(reporte.resueltoEn).toLocaleString('es-AR')}.`
              : 'Este reporte ya fue arreglado.'}
          </Texto>
        </GlassCard>
      ) : (
        <BotonPrimario
          titulo="Simular resolución"
          cargando={simulando}
          onPress={() => void simularResolucion()}
          accessibilityHint="Marca el reporte como resuelto, deja un aviso en la bandeja y programa una notificación"
        />
      )}
    </Pantalla>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <Texto variante="etiqueta">{etiqueta}</Texto>
      <Texto variante="cuerpo">{valor}</Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Espaciado.sm,
  },
  titulo: {
    flex: 1,
  },
  dato: {
    gap: 2,
  },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: Espaciado.md,
  },
});
