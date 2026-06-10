export interface Programador {
  id: number;
  Nombre: string;
  Especialidad: string;
  Slug: string;
  Descripcion: string;
  Descripcion_completa: any[];
  Foto_perfil: any | null;
  Correo_contacto: string;
  Redes_sociales: {
    github?: string; 
    linkedin?: string;
  };
  Estado: boolean;
  proyectos: Proyecto[]; 
}

export interface Proyecto {
  id: number;
  Titulo: string;
  Slug: string;
  Imagen: any;
  Descripcion_breve: string;
  Descripcion_completa: any[];
  Tipo_proyecto: 'academico' | 'personal' | 'laboral' | 'simulado';
  Tecnologias: string[];
  Enlace_repo?: string | null;
  Enlace_demo?: string | null;
  Destacado: boolean;
}

/**
 * Representa una solicitud de contacto guardada en Cloud Firestore.
 *
 * Estructura de la colección: /solicitudes/{solicitudId}
 */
export interface Solicitud {
  /** ID del documento en Firestore (se asigna tras la creación) */
  id?: string;
 
  // --- Datos del solicitante ---
  nombre: string;
  correo: string;
 
  // --- Datos del proyecto / solicitud ---
  proyecto: string;
  descripcion: string;
 
  // --- Destino ---
  /** Nombre legible del programador seleccionado */
  programador: string;
  /** Correo del programador (usado para filtrar en Firestore) */
  programadorEmail: string;
 
  // --- Metadata del usuario autenticado ---
  userId: string;
  userEmail: string;
 
  // --- Control ---
  fecha: string;
  estado: 'Pendiente' | 'Aprobado' | 'Denegado';
 
  /** Respuesta u observación del programador */
  observacion?: string;
}