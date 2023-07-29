import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  count_total: number;
  count_sql: number;
};

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  cupo_explora:any=[];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.iniciar_tabla();
  }

 iniciar_tabla(){
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    serverSide: true,
    processing: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      "processing": "Cargando Historial de Cupos.."
    },
    ajax: (dataTablesParameters: any, callback) => {
      this.http
        .post<DataTablesResponse>(
         environment.devApiCupoExplora+'/carreras/campus/tablas/',
          dataTablesParameters, {}
        ).subscribe(resp => {
          this.cupo_explora = resp.data;

          callback({
            recordsTotal: resp.count_sql ,
            recordsFiltered: Number(resp.count_total),
            data: []
          });
        });
    },
    responsive: true,
    columns: [{ data: 'carrera', width: "40%" }, { data: 'nombre',width: "20%" }, { data: 'campus',width: "20%" },{ data: 'cupo',width: "20%" },{ data: 'anio',width: "20%" }]
  };
 }

 mapa(id_sede ){

 }

 onSort({column, direction}:any) {
   console.log(column);   

 }
}
