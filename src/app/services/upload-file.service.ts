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
    let json = JSON.stringify(file);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http
      .post(environment.Url + 'upload', params, { headers: headers })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
