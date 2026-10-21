import { Platform, StyleSheet, View } from 'react-native';

import { Cristal, Espaciado } from '@/constants/theme';
import type { EstadoPermiso } from '@/lib/permisos/estados';
import type { DefinicionRecurso } from '@/lib/permisos/recursos';

import { BotonPrimario } from './boton-primario';
import { Texto } from './texto';

export type PantallaPreviaPermisoProps = {
  recurso: DefinicionRecurso;
  estado: EstadoPermiso;
  cargando: boolean;
  onContinuar: () => void;
  onAbrirAjustes: () => void;
};

/**
 * Contenido de /permisos/[recurso].
 *
 * Antes de cada diálogo del sistema se muestra esta pantalla con un único
 * botón "Continuar" (sin "Ahora no" ni "Cerrar", como pide la pauta 5.1.1 de
 * Apple). Si el permiso quedó bloqueado, el botón pasa a ser "Abrir Ajustes".
 */
export function PantallaPreviaPermiso({
  recurso,
  estado,
  cargando,
  onContinuar,
  onAbrirAjustes,
}: PantallaPreviaPermisoProps) {
  const bloqueado = estado === 'bloqueado';

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Texto variante="etiqueta" tono="tenue">
          Permiso de {recurso.nombre.toLowerCase()}
        </Texto>
        <Texto variante="titulo">{recurso.nombre}</Texto>
      </View>

      <View style={styles.beneficio}>
        <Texto variante="cuerpo" style={styles.beneficioTexto}>
          {recurso.beneficio}
        </Texto>
      </View>

      {bloqueado ? (
        <View style={styles.bloqueado}>
          <Texto variante="subtitulo" tono="peligro">
            Está bloqueado
          </Texto>
          <Texto variante="detalle" tono="secundario">
            {`Para poder usarlo hay que habilitarlo desde los Ajustes del sistema: ${recurso.comoHabilitar[Platform.OS === 'ios' ? 'ios' : 'android']}`}
          </Texto>
          <Texto variante="detalle" tono="secundario">
            {recurso.alternativa}
          </Texto>
        </View>
      ) : null}

      <BotonPrimario
        titulo={bloqueado ? 'Abrir Ajustes' : 'Continuar'}
        variante={bloqueado ? 'peligro' : 'primario'}
        cargando={cargando}
        onPress={bloqueado ? onAbrirAjustes : onContinuar}
      />

      <Texto variante="detalle" tono="tenue" style={styles.nota}>
        Podés cambiar este permiso en cualquier momento desde los Ajustes del sistema.
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: Espaciado.lg,
    justifyContent: 'center',
  },
  encabezado: {
    gap: Espaciado.xs,
  },
  beneficio: {
    padding: Espaciado.lg,
    borderRadius: Cristal.radioChico,
    borderWidth: 1,
    borderColor: Cristal.bordeActivo,
    backgroundColor: Cristal.superficie,
  },
  beneficioTexto: {
    lineHeight: 22,
  },
  bloqueado: {
    gap: Espaciado.sm,
    padding: Espaciado.lg,
    borderRadius: Cristal.radioChico,
    borderWidth: 1,
    borderColor: Cristal.peligro,
    backgroundColor: 'rgba(244, 112, 122, 0.10)',
  },
  nota: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
