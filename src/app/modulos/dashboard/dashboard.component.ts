import { Component, OnInit, ViewChild } from '@angular/core';
import { MapaComponent } from './mapa/mapa.component';
import Swal from 'sweetalert2';
declare var $;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent{
  @ViewChild(MapaComponent) hijo;  
   ngOnInit(): void {
     


}



   mensaje() {
     this.hijo.mensaje='Puto';
   }
 
  
  
}
$(document).on('click', "#btn1", function() {
 
});