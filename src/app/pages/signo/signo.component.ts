import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  displayedColumns = ['idSigno', 'paciente',  'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number = 0;

  constructor(
    private signoService: SignosService,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.signoService.getSignoCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.signoService.listarPageable(0, 10).subscribe(data => {
      //this.crearTabla(data.content);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Signos[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.signoService.eliminar(id).pipe(switchMap(() => {
      return this.signoService.listar();
    })).subscribe(data => {
      this.signoService.setSignoCambio(data);
      this.signoService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
