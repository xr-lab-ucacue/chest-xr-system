import { Observable, map } from 'rxjs';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(environment.Url + '/upload', formData);
  }

  convertToDicom(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(environment.Flask + '/convert', formData, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/octet-stream'),
      })
      .toPromise()
      .then((response: Blob) => response)
      .catch((error: any) => {
        console.error('Error al convertir el archivo:', error);
        throw error; // O maneja el error de otra forma según tus necesidades
      });
  }

  convertToDicom2(file: File): Promise<File> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(environment.Flask + '/convert', formData, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/octet-stream'),
      })
      .toPromise()
      .then((response: Blob) => {
        // Crear un nuevo objeto File a partir del Blob
        const convertedFile = new File([response], 'converted.dcm', { type: 'application/octet-stream' });
        return convertedFile;
      })
      .catch((error: any) => {
        console.error('Error al convertir el archivo:', error);
        throw error; // O maneja el error de otra forma según tus necesidades
      });
  }
}
