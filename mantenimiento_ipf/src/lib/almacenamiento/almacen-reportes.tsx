import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import {
  borradorVacio,
  type Aviso,
  type BorradorReporte,
  type Reporte,
} from '@/lib/tipos';

import { guardarAlmacen, leerAlmacen } from './persistencia';

type EstadoAlmacen = {
  reportes: Reporte[];
  avisos: Aviso[];
  borrador: BorradorReporte;
  avisosActivados: boolean;
};

const estadoInicial: EstadoAlmacen = {
  reportes: [],
  avisos: [],
  borrador: borradorVacio,
  avisosActivados: false,
};

type Accion =
  | { tipo: 'hidratar'; payload: Partial<EstadoAlmacen> }
  | { tipo: 'actualizarBorrador'; payload: Partial<BorradorReporte> }
  | { tipo: 'limpiarBorrador' }
  | { tipo: 'crearReporte'; payload: Reporte }
  | { tipo: 'marcarResuelto'; payload: { id: string; resueltoEn: number } }
  | { tipo: 'agregarAviso'; payload: Aviso }
  | { tipo: 'marcarAvisoLeido'; payload: { id: string } }
  | { tipo: 'establecerAvisosActivados'; payload: boolean };

function reducer(estado: EstadoAlmacen, accion: Accion): EstadoAlmacen {
  switch (accion.tipo) {
    case 'hidratar':
      return {
        ...estado,
        ...accion.payload,
        borrador: { ...borradorVacio, ...(accion.payload.borrador ?? {}) },
      };
    case 'actualizarBorrador':
      return { ...estado, borrador: { ...estado.borrador, ...accion.payload } };
    case 'limpiarBorrador':
      return { ...estado, borrador: borradorVacio };
    case 'crearReporte':
      return { ...estado, reportes: [accion.payload, ...estado.reportes] };
    case 'marcarResuelto':
      return {
        ...estado,
        reportes: estado.reportes.map((reporte) =>
          reporte.id === accion.payload.id
            ? { ...reporte, estado: 'resuelto', resueltoEn: accion.payload.resueltoEn }
            : reporte
        ),
      };
    case 'agregarAviso':
      return { ...estado, avisos: [accion.payload, ...estado.avisos] };
    case 'marcarAvisoLeido':
      return {
        ...estado,
        avisos: estado.avisos.map((aviso) =>
          aviso.id === accion.payload.id ? { ...aviso, leido: true } : aviso
        ),
      };
    case 'establecerAvisosActivados':
      return { ...estado, avisosActivados: accion.payload };
    default:
      return estado;
  }
}

function generarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type ValorAlmacen = {
  reportes: Reporte[];
  avisos: Aviso[];
  borrador: BorradorReporte;
  avisosActivados: boolean;
  cargando: boolean;
  actualizarBorrador: (cambios: Partial<BorradorReporte>) => void;
  limpiarBorrador: () => void;
  crearReporte: (datos: BorradorReporte) => Reporte;
  marcarResuelto: (id: string) => void;
  agregarAviso: (aviso: Omit<Aviso, 'id' | 'leido' | 'fecha'>) => Aviso;
  marcarAvisoLeido: (id: string) => void;
  establecerAvisosActivados: (valor: boolean) => void;
  obtenerReporte: (id: string) => Reporte | undefined;
};

const ContextoAlmacen = createContext<ValorAlmacen | null>(null);

export function AlmacenReportesProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, estadoInicial);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    let vigente = true;

    leerAlmacen<EstadoAlmacen>().then((guardado) => {
      if (!vigente) return;
      if (guardado) despachar({ tipo: 'hidratar', payload: guardado });
      setHidratado(true);
    });

    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    void guardarAlmacen(estado);
  }, [estado, hidratado]);

  const actualizarBorrador = useCallback((cambios: Partial<BorradorReporte>) => {
    despachar({ tipo: 'actualizarBorrador', payload: cambios });
  }, []);

  const limpiarBorrador = useCallback(() => {
    despachar({ tipo: 'limpiarBorrador' });
  }, []);

  const crearReporte = useCallback((datos: BorradorReporte): Reporte => {
    const reporte: Reporte = {
      id: generarId(),
      titulo: datos.titulo.trim() || 'Desperfecto sin título',
      descripcion: datos.descripcion.trim(),
      aula: datos.aula.trim(),
      categoria: datos.categoria,
      estado: 'pendiente',
      fotoUri: datos.fotoUri,
      ubicacion: datos.ubicacion,
      sector: datos.sector,
      creadoEn: Date.now(),
    };
    despachar({ tipo: 'crearReporte', payload: reporte });
    despachar({ tipo: 'limpiarBorrador' });
    return reporte;
  }, []);

  const marcarResuelto = useCallback((id: string) => {
    despachar({ tipo: 'marcarResuelto', payload: { id, resueltoEn: Date.now() } });
  }, []);

  const agregarAviso = useCallback((aviso: Omit<Aviso, 'id' | 'leido' | 'fecha'>): Aviso => {
    const nuevo: Aviso = { ...aviso, id: generarId(), fecha: Date.now(), leido: false };
    despachar({ tipo: 'agregarAviso', payload: nuevo });
    return nuevo;
  }, []);

  const marcarAvisoLeido = useCallback((id: string) => {
    despachar({ tipo: 'marcarAvisoLeido', payload: { id } });
  }, []);

  const establecerAvisosActivados = useCallback((valor: boolean) => {
    despachar({ tipo: 'establecerAvisosActivados', payload: valor });
  }, []);

  const obtenerReporte = useCallback(
    (id: string) => estado.reportes.find((reporte) => reporte.id === id),
    [estado.reportes]
  );

  const valor = useMemo<ValorAlmacen>(
    () => ({
      reportes: estado.reportes,
      avisos: estado.avisos,
      borrador: estado.borrador,
      avisosActivados: estado.avisosActivados,
      cargando: !hidratado,
      actualizarBorrador,
      limpiarBorrador,
      crearReporte,
      marcarResuelto,
      agregarAviso,
      marcarAvisoLeido,
      establecerAvisosActivados,
      obtenerReporte,
    }),
    [
      estado.reportes,
      estado.avisos,
      estado.borrador,
      estado.avisosActivados,
      hidratado,
      actualizarBorrador,
      limpiarBorrador,
      crearReporte,
      marcarResuelto,
      agregarAviso,
      marcarAvisoLeido,
      establecerAvisosActivados,
      obtenerReporte,
    ]
  );

  return <ContextoAlmacen.Provider value={valor}>{children}</ContextoAlmacen.Provider>;
}

export function useAlmacenReportes(): ValorAlmacen {
  const valor = useContext(ContextoAlmacen);
  if (!valor) {
    throw new Error('useAlmacenReportes debe usarse dentro de <AlmacenReportesProvider>');
  }
  return valor;
}
