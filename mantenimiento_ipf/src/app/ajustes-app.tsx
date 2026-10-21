import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { GlassCard } from '@/components/glass-card';
import { IndicadorCarga } from '@/components/indicador-carga';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Cristal, Espaciado } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { crearCanalReportes } from '@/lib/notificaciones';
import { calcularEstado } from '@/lib/permisos/estados';

export default function AjustesApp() {
  const router = useRouter();
  const { avisosActivados, establecerAvisosActivados } = useAlmacenReportes();
  const notificaciones = usePermiso('notificaciones');
  const { recargar } = notificaciones;
  const [trabajando, setTrabajando] = useState(false);
  // Intención de la persona: se pide el permiso y, si lo concede, el
  // interruptor queda en "sí" aunque el permiso se haya dado en otra pantalla.
  const [quisoActivar, setQuisoActivar] = useState(false);

  // Al volver de la pantalla previa o de los Ajustes del sistema hay que
  // revisar si el permiso quedó concedido.
  useFocusEffect(
    useCallback(() => {
      void recargar().then((respuesta) => {
        if (quisoActivar && calcularEstado(respuesta).estado === 'concedido') {
          establecerAvisosActivados(true);
        }
      });
    }, [recargar, quisoActivar, establecerAvisosActivados])
  );

  async function cambiarInterruptor(activo: boolean) {
    if (!activo) {
      setQuisoActivar(false);
      establecerAvisosActivados(false);
      return;
    }

    setQuisoActivar(true);
    setTrabajando(true);

    // En Android el canal tiene que existir antes de pedir el permiso.
    await crearCanalReportes();
    const respuesta = await notificaciones.recargar();

    if (calcularEstado(respuesta).estado === 'concedido') {
      establecerAvisosActivados(true);
      setTrabajando(false);
      return;
    }

    // El permiso todavía no está: se muestra la pantalla previa.
    setTrabajando(false);
    router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'notificaciones' } });
  }

  const activado = avisosActivados && notificaciones.estado === 'concedido';

  return (
    <Pantalla>
      <GlassCard>
        <Texto variante="subtitulo">Avisos de tus reportes</Texto>
        <Texto variante="detalle" tono="secundario">
          Usamos tus notificaciones para avisarte apenas se resuelva el reporte que hiciste.
        </Texto>

        <View style={styles.fila}>
          <Texto variante="cuerpo" style={styles.textoInterruptor}>
            Avisarme cuando se resuelva mi reporte
          </Texto>
          <Switch
            value={activado}
            onValueChange={(valor) => void cambiarInterruptor(valor)}
            disabled={trabajando || notificaciones.cargando || !notificaciones.disponible}
            trackColor={{ false: Cristal.superficie, true: Cristal.acento }}
            thumbColor={activado ? Cristal.acentoClaro : Cristal.textoSecundario}
            accessibilityLabel="Avisarme cuando se resuelva mi reporte"
          />
        </View>

        {notificaciones.cargando ? (
          <IndicadorCarga mensaje="Consultando el permiso de notificaciones…" />
        ) : null}

        {!notificaciones.disponible ? (
          <Texto variante="detalle" tono="advertencia">
            Este build no trae el módulo nativo de notificaciones, así que el interruptor no se
            puede activar. Los avisos igual quedan guardados en la pestaña Avisos.
          </Texto>
        ) : null}

        {!activado && notificaciones.disponible && notificaciones.estado === 'bloqueado' ? (
          <>
            <Texto variante="detalle" tono="advertencia">
              Las notificaciones están bloqueadas. Podés habilitarlas en los Ajustes del sistema,
              o seguir usando la bandeja de avisos de la app.
            </Texto>
            <BotonPrimario
              titulo="Abrir Ajustes"
              variante="peligro"
              onPress={() => void notificaciones.abrirAjustes()}
            />
          </>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Sin notificaciones, igual te enterás</Texto>
        <Texto variante="detalle" tono="secundario">
          Cada vez que se resuelva un reporte tuyo, el aviso queda guardado en la pestaña Avisos de
          la app. Por eso ningún permiso puede dejarte sin noticias.
        </Texto>
        <BotonPrimario
          titulo="Ver la bandeja de avisos"
          variante="secundario"
          onPress={() => router.push('/avisos')}
        />
      </GlassCard>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Espaciado.md,
  },
  textoInterruptor: {
    flex: 1,
  },
});
