import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { FilaPermiso } from '@/components/fila-permiso';
import { GlassCard } from '@/components/glass-card';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espaciado } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { usePermisoEnfocado } from '@/hooks/use-permiso-enfocado';
import { RECURSOS } from '@/lib/permisos/recursos';

export default function Permisos() {
  const router = useRouter();

  const camara = usePermiso('camara');
  const ubicacion = usePermiso('ubicacion');
  const notificaciones = usePermiso('notificaciones');

  usePermisoEnfocado(camara);
  usePermisoEnfocado(ubicacion);
  usePermisoEnfocado(notificaciones);

  const permisos = [
    { recurso: RECURSOS.camara, permiso: camara },
    { recurso: RECURSOS.ubicacion, permiso: ubicacion },
    { recurso: RECURSOS.notificaciones, permiso: notificaciones },
  ];

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <Texto variante="titulo">Permisos</Texto>
        <Texto variante="detalle" tono="secundario">
          La app usa tres permisos, y cada uno se pide solo cuando lo necesitás.
        </Texto>
      </View>

      <GlassCard>
        {permisos.map(({ recurso, permiso }, indice) => (
          <View key={recurso.id}>
            {indice > 0 ? <View style={styles.separador} /> : null}
            <FilaPermiso
              recurso={recurso}
              estado={permiso.estado}
              parcial={permiso.parcial}
              matiz={permiso.matiz}
              cargando={permiso.cargando}
              disponible={permiso.disponible}
              onPedir={() =>
                router.push({ pathname: '/permisos/[recurso]', params: { recurso: recurso.id } })
              }
              onAbrirAjustes={() => void permiso.abrirAjustes()}
              onVerAvisos={() => router.push('/avisos')}
            />
          </View>
        ))}
      </GlassCard>

      <BotonPrimario
        titulo="Actualizar estados"
        variante="secundario"
        onPress={() => {
          void camara.recargar();
          void ubicacion.recargar();
          void notificaciones.recargar();
        }}
      />

      <Texto variante="detalle" tono="tenue" style={styles.nota}>
        Los estados se actualizan solos al volver de los Ajustes del sistema.
      </Texto>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    gap: Espaciado.xs,
    marginBottom: Espaciado.xs,
  },
  separador: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: Espaciado.xs,
  },
  nota: {
    textAlign: 'center',
  },
});
