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



  /* constructor(private _http:HttpClient) { }
  ulrRick: String = "https://rickandmortyapi.com/api/character"
  
getCharacter(id:number){
    return this._http.get<RickMorty>(this.ulrRick+"/"+id)
  } */
}

/* this._rickAndMorty.getCharacter(i).subscribe(resp =>{
  // console.log("RESPUESTA", resp)
  // Destructura Objetos ...resto
  const { id, name, image } = resp;
  //Paso lo necesario
  this.charter.push({ id, name, image });
}, (err) =>{
  console.log("Error", err)
  //Error personaje no econtrado
  alert(err.error.error)
}, () => {
  // complet
  this.poketypes();
  this.pokeDescriptions();
  this.pokeTypeRelations();
}); */