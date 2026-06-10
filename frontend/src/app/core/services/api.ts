import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programador, Proyecto } from '../../models/data.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) { }

  // Usa el tipo <any> para la respuesta de Strapi porque envuelve los datos en { data: ... }
  getProgramadores(): Observable<{ data: Programador[] }> {
    return this.http.get<{ data: Programador[] }>(`${this.baseUrl}/programadors?populate=*`);
  }

  // Obtener solo los proyectos marcados como destacados
  getProyectosDestacados(): Observable<{ data: Proyecto[] }> {
    // Usamos el filtro de Strapi: [destacado][$eq]=true
    // populate=* asegura que traiga la imagen y los programadores relacionados
    return this.http.get<{ data: Proyecto[] }>(
      `${this.baseUrl}/proyectos?filters[Destacado][$eq]=true&populate=*`
    );
  }

  getProgramadorBySlug(slug: string): Observable<any> {
    const url = `${this.baseUrl}/programadors?filters[Slug][$eq]=${slug}&populate[Foto_perfil]=true&populate[proyectos][populate]=Imagen`;

    return this.http.get<any>(url);
  }

  getProyectoBySlug(slug: string) {
    return this.http.get(`${this.baseUrl}/proyectos?filters[Slug][$eq]=${slug}&populate=*`);
  }
}