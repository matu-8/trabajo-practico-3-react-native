import { Platform, StyleSheet, View } from 'react-native';

import { Cristal, Espaciado } from '@/constants/theme';
import type { EstadoPermiso } from '@/lib/permisos/estados';
import type { DefinicionRecurso } from '@/lib/permisos/recursos';

import { BotonPrimario } from './boton-primario';
import { Texto } from './texto';

export type FilaPermisoProps = {
  recurso: DefinicionRecurso;
  estado: EstadoPermiso;
  parcial: boolean;
  matiz: string | null;
  cargando: boolean;
  /** false cuando el módulo nativo no está en el binario donde corre la app. */
  disponible: boolean;
  onPedir: () => void;
  onAbrirAjustes: () => void;
  onVerAvisos: () => void;
};

const ETIQUETA_ESTADO: Record<EstadoPermiso, string> = {
  cargando: 'Consultando…',
  concedido: 'Concedido',
  preguntable: 'Te lo podemos pedir',
  bloqueado: 'Bloqueado',
};

const COLOR_ESTADO: Record<EstadoPermiso, string> = {
  cargando: Cristal.textoTenue,
  concedido: Cristal.exito,
  preguntable: Cristal.acentoClaro,
  bloqueado: Cristal.peligro,
};

// Fila del panel /permisos: estado, plataforma y matiz de cada recurso.
export function FilaPermiso({
  recurso,
  estado,
  parcial,
  matiz,
  cargando,
  disponible,
  onPedir,
  onAbrirAjustes,
  onVerAvisos,
}: FilaPermisoProps) {
  const color = COLOR_ESTADO[estado];

  return (
    <View style={styles.fila}>
      <View style={styles.encabezado}>
        <Texto variante="subtitulo">{recurso.nombre}</Texto>
        <View style={[styles.estado, { borderColor: color }]}>
          <Texto variante="etiqueta" style={{ color }}>
            {disponible ? ETIQUETA_ESTADO[estado] : 'No disponible'}
          </Texto>
        </View>
      </View>

      <Texto variante="detalle" tono="secundario">
        Módulo: {recurso.modulo} · Plataforma: {Platform.OS}
      </Texto>

      {parcial && matiz ? (
        <Texto variante="detalle" tono="advertencia">
          {matiz}
        </Texto>
      ) : null}

      {!disponible ? (
        <>
          <Texto variante="detalle" tono="advertencia">
            Este build no trae el módulo nativo de {recurso.nombre.toLowerCase()}. Los avisos
            siguen llegando igual a la bandeja Avisos de la app.
          </Texto>
          <BotonPrimario titulo="Ver la bandeja de avisos" variante="secundario" onPress={onVerAvisos} />
        </>
      ) : null}

      {disponible && estado === 'bloqueado' ? (
        <Texto variante="detalle" tono="secundario">
          {recurso.comoHabilitar[Platform.OS === 'ios' ? 'ios' : 'android']}
        </Texto>
      ) : null}

      {disponible && !cargando && estado !== 'concedido' ? (
        <BotonPrimario
          titulo={estado === 'bloqueado' ? 'Abrir Ajustes' : 'Pedir permiso'}
          variante={estado === 'bloqueado' ? 'peligro' : 'secundario'}
          onPress={estado === 'bloqueado' ? onAbrirAjustes : onPedir}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    gap: Espaciado.sm,
    paddingVertical: Espaciado.md,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Espaciado.sm,
  },
  estado: {
    paddingVertical: 3,
    paddingHorizontal: Espaciado.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
});
