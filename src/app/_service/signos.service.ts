import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Signos } from '../_model/signos';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  private signoCambio = new Subject<Signos[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /* get, set */
  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setSignoCambio(lista: Signos[]){
    this.signoCambio.next(lista);
  }

  getSignoCambio(){
    return this.signoCambio.asObservable();
  }
}
