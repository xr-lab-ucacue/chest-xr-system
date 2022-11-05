import { Injectable } from '@angular/core';
import { Usuario2, Cliente2 } from './../interfaces/UserAuth';
import { Usuario } from './../interfaces/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _usuario: Usuario;
  // private _token: string;

  constructor(private _http:HttpClient) { }
  url: string = "http://localhost:8080/api"

  registerUser(usuario: Usuario) {
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + '/usuario', params, { headers: headers }).pipe(map(data => { return data }));
  }

  getUserRegisters(){
    return this._http.get<Usuario>(this.url + "/personas")
  }

  tv(){
    return this._http.get<TV>("https://swapi.dev/api/planets/3/")
  }


  /* login(usuario: Usuario): Observable<any>{
    const urlEndpoint = this.url + "oauth/token";

    const credenciales = btoa("angularapp" + ":" + "12345");

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + credenciales,
    });

    let params = new URLSearchParams();
    params.set("grant_type", "password");
    params.set("username", usuario.email as string);
    params.set("password", usuario.password as string);
    console.log(params.toString());

    return this._http.post<any>(urlEndpoint, params.toString(), {
      headers: httpHeaders,
    });

  } */



  // public get token(): string {
  //   if (this._token != null) {
  //     return this._token;
  //   } else if (this._token == null && sessionStorage.getItem("token") != null) {
  //     this._token = sessionStorage.getItem("token");
  //     return this._token;
  //   }
  //   return null;
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

export interface TV {
  name?:            string;
  rotation_period?: string;
  orbital_period?:  string;
  diameter?:        string;
  climate?:         string;
  gravity?:         string;
  terrain?:         string;
  surface_water?:   string;
  population?:      string;
  residents?:       any[];
  films?:           string[];
  created?:         Date;
  edited?:          Date;
  url?:             string;
}

