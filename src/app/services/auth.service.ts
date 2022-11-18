import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // private _usuario: Usuario| null = new Usuario();
  private _usuario: Usuario| null = null;
  private _token: string| null = null;

  constructor(private http: HttpClient) {}

  getUserRegisters() {
    return this.http.get<Usuario[]>(environment.Url + '/personas');
  }

  registerUser(usuario: Usuario) {
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(environment.Url + '/usuario', params, { headers: headers })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = environment.UrlAuth + 'oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.email);
    params.set('password', usuario.password);
    //console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  //Obtiene el token de inicio
  public get tokencito(): string| null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  //obtiene el usuario activo
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  //Obtengo datos del token atraves del access_token
  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      console.log("obtenerDatosToken: ", JSON.parse(atob(accessToken.split('.')[1])));
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  // compruebo si esta autenticado
  isAuthenticated(): boolean {
    console.log("isAuthenticated-tokencito: ", this.tokencito)
    let payload = this.obtenerDatosToken(this.tokencito!);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

 //boolenao si tiene un rol
  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }


  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    localStorage.clear();
  }




//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

guardarUsuario(accessToken: string): void {
  let payload = this.obtenerDatosToken(accessToken);
  this._usuario = new Usuario();
  this._usuario.id = payload.id;
  this._usuario.nombre = payload.nombre;
  this._usuario.apellido = payload.apellido;
  this._usuario.email = payload.roles;
  this._usuario.email = payload.user_name;
  this._usuario.roles = payload.authorities;
  let a = sessionStorage.setItem('usuario', JSON.stringify(this._usuario)); //UNDEFINED
}

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }


 /* loginAutomatico(){

    this.logout();
     let user: Usuario = new Usuario();
     user.email = 'soporte.alaorden@gmail.com';
     user.password = btoa('igPqEn');
     this.login(user).subscribe(res => {

   this.guardarUsuario(res.access_token);
     this.guardarToken(res.access_token);
    // this._route.navigateByUrl('/home/inicio');
    return true;


   }, error =>{
        //alert("Erro Login");

        // console.log(error.error);
          // console.log(error.error);
          // this.cargando = false;
       });
    }*/

}
