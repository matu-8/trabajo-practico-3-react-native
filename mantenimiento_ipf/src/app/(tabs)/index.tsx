import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { ChipEstado } from '@/components/chip-estado';
import { GlassCard } from '@/components/glass-card';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { etiquetaCategoria } from '@/lib/tipos';

export default function Reportes() {
  const router = useRouter();
  const { reportes } = useAlmacenReportes();

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <Texto variante="titulo">Mantenimiento IPF</Texto>
        <Texto variante="detalle" tono="secundario">
          Reportá los desperfectos del edificio y seguí su estado.
        </Texto>
      </View>

      <BotonPrimario
        titulo="Nuevo reporte"
        onPress={() => router.push('/reporte/nuevo')}
      />

      {reportes.length === 0 ? (
        <GlassCard>
          <Texto variante="subtitulo">Todavía no reportaste nada</Texto>
          <Texto variante="detalle" tono="secundario">
            Cuando veas una luz quemada, una canilla que pierde o un proyector roto, creá un
            reporte. No necesitás ningún permiso para empezar.
          </Texto>
        </GlassCard>
      ) : (
        reportes.map((reporte) => (
          <GlassCard
            key={reporte.id}
            style={styles.tarjeta}
            accessibilityLabel={`Ver reporte ${reporte.titulo}`}
            onPress={() => router.push(`/reporte/${reporte.id}`)}>
            <View style={styles.fila}>
              <Texto variante="subtitulo" style={styles.titulo} numberOfLines={2}>
                {reporte.titulo}
              </Texto>
              <ChipEstado estado={reporte.estado} />
            </View>
            <Texto variante="detalle" tono="secundario">
              {etiquetaCategoria(reporte.categoria)}
              {reporte.aula ? ` · ${reporte.aula}` : ''}
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Espaciado.sm,
  },
  titulo: {
    flex: 1,
  },
});
