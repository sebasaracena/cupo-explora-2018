import { Component, OnInit, ViewChild } from '@angular/core';
import { NavegadorComponent } from './pagina/navegador/navegador.component';
declare let L;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'cupo-explora';
  map:any;
  
  @ViewChild(NavegadorComponent) hijo;  
  click(){
    
  }


}
