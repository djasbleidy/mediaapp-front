import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RolValor } from '../_model/usuario';
import { GenericService } from './generic.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<RolValor>{

  private rolUsuario = new Subject<RolValor>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/usuarios`);
  }


  listarPorNombre(nombre: string) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<any>(`${this.url}/valor`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  getMenuCambio() {
    return this.rolUsuario.asObservable();
  }

  setMenuCambio(usuario: RolValor) {
    this.rolUsuario.next(usuario);
  }

}
