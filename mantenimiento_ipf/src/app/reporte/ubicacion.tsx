import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BotonPrimario } from '@/components/boton-primario';
import { GlassCard } from '@/components/glass-card';
import { IndicadorCarga } from '@/components/indicador-carga';
import { Pantalla } from '@/components/pantalla';
import { SelectorOpciones } from '@/components/selector-opciones';
import { Texto } from '@/components/texto';
import { usePermiso } from '@/hooks/usePermiso';
import { usePermisoEnfocado } from '@/hooks/use-permiso-enfocado';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { SECTORES, type Sector } from '@/lib/tipos';
import { obtenerUbicacion } from '@/lib/ubicacion';

export default function Ubicacion() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useAlmacenReportes();
  const ubicacion = usePermiso('ubicacion');
  usePermisoEnfocado(ubicacion);
  const [buscando, setBuscando] = useState(false);
  const [sinPermiso, setSinPermiso] = useState(false);

  async function marcar() {
    setBuscando(true);
    const posicion = await obtenerUbicacion();
    setBuscando(false);

    // Si se denegó el permiso seguimos igual: se elige el sector a mano.
    if (!posicion) {
      setSinPermiso(true);
      return;
    }

    actualizarBorrador({ ubicacion: posicion, sector: undefined });
    router.back();
  }

  function elegirSector(sector: Sector) {
    // Elegir el sector a mano reemplaza la ubicación por coordenadas.
    actualizarBorrador({ sector, ubicacion: undefined });
  }

  return (
    <Pantalla>
      <GlassCard>
        <Texto variante="subtitulo">Marcar dónde está el problema</Texto>
        <Texto variante="detalle" tono="secundario">
          Usamos tu ubicación mientras usás la app para marcar en qué sector del edificio está el
          desperfecto que reportás. Nunca pedimos ubicación en segundo plano.
        </Texto>

        {ubicacion.cargando ? (
          <IndicadorCarga mensaje="Consultando el permiso de ubicación…" />
        ) : ubicacion.estado === 'bloqueado' ? (
          <>
            <Texto variante="detalle" tono="advertencia">
              La ubicación está bloqueada. Habilitala en los Ajustes del sistema o elegí el sector a
              mano.
            </Texto>
            <BotonPrimario
              titulo="Abrir Ajustes"
              variante="peligro"
              onPress={() => void ubicacion.abrirAjustes()}
            />
          </>
        ) : ubicacion.estado === 'preguntable' ? (
          <BotonPrimario
            titulo="Continuar"
            onPress={() =>
              router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'ubicacion' } })
            }
          />
        ) : (
          <BotonPrimario
            titulo="Usar mi ubicación"
            cargando={buscando}
            onPress={() => void marcar()}
          />
        )}

        {sinPermiso ? (
          <Texto variante="detalle" tono="advertencia">
            Sin permiso de ubicación no pasa nada: elegí el sector a mano y el reporte se carga
            igual.
          </Texto>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">O elegí el sector a mano</Texto>
        <Texto variante="detalle" tono="secundario">
          Esta opción siempre está disponible, sin ningún permiso.
        </Texto>
        <SelectorOpciones
          opciones={SECTORES}
          valor={borrador.sector ?? SECTORES[0].valor}
          onChange={elegirSector}
        />
        <BotonPrimario
          titulo="Guardar sector"
          variante="secundario"
          deshabilitado={!borrador.sector}
          onPress={() => router.back()}
        />
      </GlassCard>
    </Pantalla>
  );
}
