import { Usuario } from './../interfaces/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, delay } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http:HttpClient) { }
  url: string = "http://127.0.0.1:8080/api"

  registerUser(usario: Usuario) {
    let json = JSON.stringify(usario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + '/usuario', params, { headers: headers }).pipe(map(data => { return data }));
  }

/*
getCharacter(id:number){
    return this._http.get<RickMorty>(this.ulrRick+"/"+id)
  } */
}

