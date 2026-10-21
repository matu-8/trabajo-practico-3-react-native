import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { IndicadorCarga } from '@/components/indicador-carga';
import { Pantalla } from '@/components/pantalla';
import { PantallaPreviaPermiso } from '@/components/pantalla-previa-permiso';
import { usePermiso } from '@/hooks/usePermiso';
import { esRecurso, RECURSOS } from '@/lib/permisos/recursos';

export default function PreviaPermiso() {
  const router = useRouter();
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const [pidiendo, setPidiendo] = useState(false);

  // Si el recurso no está en el catálogo no hay nada que pedir.
  const valido = !!recurso && esRecurso(recurso);
  const permiso = usePermiso(valido ? recurso : 'camara');
  const definicion = valido ? RECURSOS[recurso] : RECURSOS.camara;

  async function continuar() {
    setPidiendo(true);
    await permiso.pedir();
    setPidiendo(false);
    router.back();
  }

  if (permiso.cargando) {
    return (
      <Pantalla scroll={false}>
        <IndicadorCarga mensaje="Consultando el estado del permiso…" />
      </Pantalla>
    );
  }

  return (
    <Pantalla scroll={false}>
      <PantallaPreviaPermiso
        recurso={definicion}
        estado={valido ? permiso.estado : 'bloqueado'}
        cargando={pidiendo}
        onContinuar={() => void continuar()}
        onAbrirAjustes={() => void permiso.abrirAjustes()}
      />
    </Pantalla>
  );
}
