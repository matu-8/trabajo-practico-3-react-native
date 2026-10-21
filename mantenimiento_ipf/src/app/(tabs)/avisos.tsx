import { StyleSheet, View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';

export default function Avisos() {
  const { avisos, marcarAvisoLeido } = useAlmacenReportes();

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <Texto variante="titulo">Avisos</Texto>
        <Texto variante="detalle" tono="secundario">
          Los avisos de tus reportes quedan acá, aunque no hayas permitido las notificaciones.
        </Texto>
      </View>

      {avisos.length === 0 ? (
        <GlassCard>
          <Texto variante="subtitulo">No hay avisos todavía</Texto>
          <Texto variante="detalle" tono="secundario">
            Cuando se resuelva un reporte que hiciste, vas a ver el aviso acá y también te
            llega una notificación si la activaste en Ajustes de la app.
          </Texto>
        </GlassCard>
      ) : (
        avisos.map((aviso) => (
          <GlassCard
            key={aviso.id}
            style={styles.tarjeta}
            accessibilityLabel={`Aviso ${aviso.titulo}`}
            onPress={() => marcarAvisoLeido(aviso.id)}>
            <View style={styles.fila}>
              <Texto variante="subtitulo" style={styles.titulo}>
                {aviso.titulo}
              </Texto>
              {!aviso.leido ? <View style={styles.punto} /> : null}
            </View>
            <Texto variante="cuerpo" tono="secundario">
              {aviso.cuerpo}
            </Texto>
            <Texto variante="detalle" tono="tenue">
              {new Date(aviso.fecha).toLocaleString('es-AR')}
            </Texto>
          </GlassCard>
        ))
      )}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    gap: Espaciado.xs,
    marginBottom: Espaciado.xs,
  },
  tarjeta: {
    gap: Espaciado.sm,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Espaciado.sm,
  },
  titulo: {
    flex: 1,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bfdbf7',
  },
});
