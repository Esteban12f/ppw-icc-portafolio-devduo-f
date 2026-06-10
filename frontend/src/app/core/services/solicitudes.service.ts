import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Solicitud } from '../../models/data.models';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private firestore = inject(Firestore);

  private get colRef(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'solicitudes') as CollectionReference<DocumentData>;
  }

  /**
   * Carga las solicitudes ENVIADAS por un usuario externo (por su UID).
   */
  async getMisSolicitudes(userId: string): Promise<Solicitud[]> {
    const q = query(this.colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Solicitud));
  }

  /**
   * Carga las solicitudes RECIBIDAS por un programador (por su correo).
   * El campo `programadorEmail` en Firestore debe coincidir con el correo
   * del programador en Firebase Auth y en Strapi (Correo_contacto).
   */
  async getSolicitudesPorProgramador(programadorEmail: string): Promise<Solicitud[]> {
    const q = query(this.colRef, where('programadorEmail', '==', programadorEmail));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Solicitud));
  }

  /**
   * Crea una nueva solicitud en Firestore.
   */
  async crearSolicitud(data: Omit<Solicitud, 'id'>): Promise<string> {
    const docRef = await addDoc(this.colRef, data);
    return docRef.id;
  }

  /**
   * Actualiza el estado y/o la observación de una solicitud.
   * Solo el programador destinatario debe poder llamar esta función
   * (controlado también desde las Firestore Security Rules).
   */
  async actualizarSolicitud(
    id: string,
    updates: { estado?: Solicitud['estado']; observacion?: string }
  ): Promise<void> {
    const docRef = doc(this.firestore, 'solicitudes', id);
    await updateDoc(docRef, updates);
  }
}
