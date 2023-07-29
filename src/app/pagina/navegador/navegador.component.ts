import { Component, Input, OnInit } from '@angular/core';
import { CupoService } from 'src/app/servicio/cupo.service';
declare var $; 
@Component({
  selector: 'app-navegador',
  templateUrl: './navegador.component.html',
  styleUrls: ['./navegador.component.css']
})
export class NavegadorComponent implements OnInit {
  show="true";
  constructor(private cupoService: CupoService) { 
   
  }
  
  ngOnInit(): void {
 
  }

  hide_menu(){

    this.cupoService.openMenu(false);


  }

}
