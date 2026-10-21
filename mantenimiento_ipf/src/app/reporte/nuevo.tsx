import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { BotonPrimario } from '@/components/boton-primario';
import { CampoTexto } from '@/components/campo-texto';
import { GlassCard } from '@/components/glass-card';
import { Pantalla } from '@/components/pantalla';
import { SelectorOpciones } from '@/components/selector-opciones';
import { Texto } from '@/components/texto';
import { useAlmacenReportes } from '@/lib/almacenamiento/almacen-reportes';
import { CATEGORIAS, etiquetaSector, type Categoria } from '@/lib/tipos';

export default function NuevoReporte() {
  const router = useRouter();
  const { borrador, actualizarBorrador, crearReporte } = useAlmacenReportes();
  const [error, setError] = useState<string | null>(null);

  function enviar() {
    if (!borrador.titulo.trim()) {
      setError('Poné un título para que se entienda qué hay que arreglar.');
      return;
    }

    setError(null);
    const reporte = crearReporte(borrador);
    router.replace(`/reporte/${reporte.id}`);
  }

  return (
    <Pantalla>
      <GlassCard>
        <CampoTexto
          etiqueta="Título"
          placeholder="Luz quemada en el pasillo"
          value={borrador.titulo}
          onChangeText={(titulo) => {
            actualizarBorrador({ titulo });
            setError(null);
          }}
        />

        <CampoTexto
          etiqueta="Descripción"
          placeholder="Contale qué pasa y desde cuándo"
          value={borrador.descripcion}
          onChangeText={(descripcion) => actualizarBorrador({ descripcion })}
          multiline
          numberOfLines={4}
          style={styles.multilinea}
        />

        <SelectorOpciones
          etiqueta="Categoría"
          opciones={CATEGORIAS}
          valor={borrador.categoria}
          onChange={(categoria: Categoria) => actualizarBorrador({ categoria })}
        />
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Aula</Texto>
        <Texto variante="detalle" tono="secundario">
          Podés escanear el QR de la puerta o escribir el código a mano. Ninguna de las dos
          opciones necesita permiso.
        </Texto>
        <CampoTexto
          etiqueta="Código del aula"
          placeholder="AULA-12"
          autoCapitalize="characters"
          value={borrador.aula}
          onChangeText={(aula) => actualizarBorrador({ aula })}
        />
        <BotonPrimario
          titulo="Escanear QR del aula"
          variante="secundario"
          onPress={() => router.push('/reporte/escanear')}
        />
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Foto del desperfecto</Texto>
        <Texto variante="detalle" tono="secundario">
          Opcional. Podés sacarla con la cámara o elegirla del selector del sistema, sin dar
          permiso de galería.
        </Texto>
        {borrador.fotoUri ? (
          <Image source={{ uri: borrador.fotoUri }} style={styles.previa} resizeMode="cover" />
        ) : null}
        <BotonPrimario
          titulo={borrador.fotoUri ? 'Cambiar la foto' : 'Adjuntar foto'}
          variante="secundario"
          onPress={() => router.push('/reporte/foto')}
        />
      </GlassCard>

      <GlassCard>
        <Texto variante="subtitulo">Dónde está</Texto>
        <Texto variante="detalle" tono="secundario">
          Marcamos la posición solo mientras usás la app. Si no querés, elegí el sector a mano.
        </Texto>
        {borrador.ubicacion ? (
          <Texto variante="detalle" tono="advertencia">
            {borrador.ubicacion.aproximada
              ? 'Ubicación aproximada'
              : `Ubicación fijada (${borrador.ubicacion.latitude.toFixed(4)}, ${borrador.ubicacion.longitude.toFixed(4)})`}
          </Texto>
        ) : null}
        {borrador.sector ? (
          <Texto variante="detalle">Sector: {etiquetaSector(borrador.sector)}</Texto>
        ) : null}
        <BotonPrimario
          titulo="Marcar ubicación"
          variante="secundario"
          onPress={() => router.push('/reporte/ubicacion')}
        />
      </GlassCard>

      {error ? (
        <Texto variante="detalle" tono="peligro">
          {error}
        </Texto>
      ) : null}

      <BotonPrimario titulo="Enviar reporte" onPress={enviar} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  multilinea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  previa: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
});
