import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Usuario } from './../interfaces/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _usuario: Usuario;
   private _token: string  = "";

  constructor(private _http:HttpClient) {}

  registerUser(usuario: Usuario) {
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(environment.Url + '/usuario', params, { headers: headers }).pipe(map(data => { return data }));
  }

  getUserRegisters(){
    return this._http.get<Usuario[]>(environment.Url + "/personas")
  }

  login(usuario: Usuario): Observable<any>{
    const urlEndpoint = environment.UrlAuth + "oauth/token?";

    const credenciales = btoa("angularapp" + ":" + "12345");

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + credenciales,
    });

    let params = new URLSearchParams();
    params.set("username", usuario.email);
    params.set("password", usuario.password);
    params.set("grant_type", "password");
    console.log('Parametros: ', params.toString());

    return this._http.post<any>(urlEndpoint+ params.toString(), {
      headers: httpHeaders,
    });
  }



    // public get token(): Observable<string > {

    //   if (this._token != null) {
    //     return new Promise((resolve)=>{
    //       resolve("");
    //     });
    //   } else if (this._token == null && sessionStorage.getItem("token") != null) {
    //     this._token = sessionStorage.getItem("token");
    //     //return this._token;
    //   }
    //   //return null;
    // }


  // guardarToken(accessToken: string): void {
  //   this._token = accessToken;
  //   sessionStorage.setItem("token", accessToken);
  // }

  // obtenerDatosToken(accessToken: string): any {
  //   if (accessToken != null) {
  //     return JSON.parse(atob(accessToken.split(".")[1]));
  //   }
  //   return null;
  // }

}


