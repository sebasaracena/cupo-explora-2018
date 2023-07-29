import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CupoService } from './servicio/cupo.service';
declare var $; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'cupo-explora';
  open=true; 
  help=false;
  constructor(private cupoService: CupoService,private route:Router) {}

   ngOnInit(){
     this.cupoService.openmenu$.subscribe(r=>{
     
      this.open=r
       this.show();
    });
   }


  ayuda(){
    if(this.help)this.help=false;
    else this.help=true;
    this.cupoService.openAyuda(this.help);
  }

  show(){
    if(this.open) this.open=false;
    else this.open=true;
   
    $('#sidebar, #content').toggleClass('active');
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  } 


}
