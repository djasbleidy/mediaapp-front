import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { RolValor } from 'src/app/_model/usuario';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario : string;
  lista: RolValor;

  constructor(private usuarioService:  UsuarioService) {
  }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;

    this.usuarioService.listarPorNombre(this.usuario).subscribe(data => {
      this.lista=data;
    });
  }

}
