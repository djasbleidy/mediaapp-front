import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { SignosService } from 'src/app/_service/signos.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Signos } from 'src/app/_model/signos';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  pacientes: Paciente[];
  pacienteSeleccionado: Paciente;
  form: FormGroup;
  id: number;
  edicion: boolean;
  maxFecha: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private pacienteService: PacienteService

  ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.form = new FormGroup({
      'idSigno': new FormControl(0),
      'idPaciente': new FormControl(''),
      'fecha': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl(''),
      'temperatura': new FormControl(''),
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

  }

 operar() {

    let signo = new Signos();
    let paciente = new Paciente();

    signo.idSigno = this.form.value['idSigno'];
    signo.paciente = this.pacienteSeleccionado;
    signo.fecha = this.form.value['fecha'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmo = this.form.value['ritmo'];
    signo.temperatura = this.form.value['temperatura'];

  if (this.edicion) {
      this.signosService.modificar(signo).subscribe(() => {
        this.signosService.listar().subscribe(data => {
          this.signosService.setSignoCambio(data);
          this.signosService.setMensajeCambio('SE MODIFICÓ');
        });
      });
    }

    else {
      this.signosService.registrar(signo).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignoCambio(data);
        this.signosService.setMensajeCambio('SE REGISTRO');
      });
    }

    this.router.navigate(['/pages/signos']);

  }
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  seleccionarPaciente(e: any) {
    console.log(e.value)
    this.pacienteSeleccionado = e.value;
  }

  initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSigno': new FormControl(data.idSigno),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmo),
          'temperatura': new FormControl(data.temperatura),
        });
      });
    }
  }

}
