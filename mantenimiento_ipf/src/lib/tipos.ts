export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export type Sector = 'patio' | 'estacionamiento' | 'pasillo' | 'aulas' | 'sum';

/** Coordenada del desperfecto. `aproximada` marca que el sistema no nos dio precisión exacta. */
export type UbicacionReporte = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  aproximada: boolean;
};

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  estado: EstadoReporte;
  fotoUri?: string;
  ubicacion?: UbicacionReporte;
  sector?: Sector;
  creadoEn: number;
  resueltoEn?: number;
};

export type Aviso = {
  id: string;
  reporteId: string;
  titulo: string;
  cuerpo: string;
  fecha: number;
  leido: boolean;
};

/** Datos que se van completando mientras se arma un reporte nuevo. */
export type BorradorReporte = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fotoUri?: string;
  ubicacion?: UbicacionReporte;
  sector?: Sector;
};

export const CATEGORIAS: { valor: Categoria; etiqueta: string }[] = [
  { valor: 'electricidad', etiqueta: 'Electricidad' },
  { valor: 'agua', etiqueta: 'Agua' },
  { valor: 'mobiliario', etiqueta: 'Mobiliario' },
  { valor: 'equipos', etiqueta: 'Equipos' },
];

export const SECTORES: { valor: Sector; etiqueta: string }[] = [
  { valor: 'patio', etiqueta: 'Patio' },
  { valor: 'estacionamiento', etiqueta: 'Estacionamiento' },
  { valor: 'pasillo', etiqueta: 'Pasillo' },
  { valor: 'aulas', etiqueta: 'Aulas' },
  { valor: 'sum', etiqueta: 'SUM (talleres)' },
];

export const ESTADOS: { valor: EstadoReporte; etiqueta: string }[] = [
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'en curso', etiqueta: 'En curso' },
  { valor: 'resuelto', etiqueta: 'Resuelto' },
];

export const borradorVacio: BorradorReporte = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: 'electricidad',
};

export function etiquetaCategoria(categoria: Categoria): string {
  return CATEGORIAS.find((item) => item.valor === categoria)?.etiqueta ?? categoria;
}

export function etiquetaSector(sector?: Sector): string {
  if (!sector) return '';
  return SECTORES.find((item) => item.valor === sector)?.etiqueta ?? sector;
}

export function etiquetaEstado(estado: EstadoReporte): string {
  return ESTADOS.find((item) => item.valor === estado)?.etiqueta ?? estado;
}
