import { Component, Input, OnInit } from '@angular/core';
import { CupoService } from '../../../../servicio/cupo.service';

import Swal from 'sweetalert2';
import { Cupo } from '../../../../servicio/cupo';
declare let L;
declare var $;
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit{
  title = 'cupo-explora';
  map:any;
  Layer:any;
  load_change:boolean=false;
  change_region:boolean=false;
  change_universidades:boolean=false;
  mapOSM:any;
  cupo:Cupo={
    universidad:null,
    carrera:null,
    cod_region:null,
    id_sede:null,
    anio:'2021',
    porcentaje:'0.5'
  
  }
  ayuda=false;
  sede:any={
    carrera:null,
    id_sede:null,
    porcentaje:'0.5'
  }
  universidades:any;
  lista_carrera:any={
    carrera:null
  }

  datos:any;
  regiones:any;
  ejecutar:boolean=false;
  @Input() mensaje:string;
  trigge:boolean=false;
  trigger2:boolean=false;
  click:boolean=false;
  carreras:boolean=false;
  constructor(private servicio:CupoService){}  
  ngOnInit(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('cod_region');
    this.funcion_jquery(this);
    this.iniciar_mapa();
    Swal.fire({
   
     html:"<br/><i class='fas fa-3x fa-map-marked-alt'></i><hr/>Cargando Cartografía<hr/>",
     allowOutsideClick:false
    }) ;
Swal.showLoading();
    this.servicio.consultar_region(this.cupo).subscribe(
         resp=> {
           
            this.construir_layer_geometrico(this.map,resp);
            this.servicio.select_universidad(this.cupo).subscribe(resp=>{
              
              this.universidades=resp;
             
                 this.servicio.select_region(this.cupo).subscribe(resp=>{
                 this.regiones=resp;
                 
                  Swal.close();
                 })
                 
            });
            


         }
       );
  
  this.servicio.ayudamenu$.subscribe(r=>this.ayuda=r);
    
  }
  //armar los overlayer


   overlayer_geometrico(){
    Swal.fire({
   
      html:"<br/><i class='fas fa-3x fa-map-marked-alt'></i><hr/>Cargando Cartografía<hr/>",
      allowOutsideClick:false
     }) ;
 Swal.showLoading();
    if(this.Layer!=null)  this.map.removeLayer(this.Layer);
    this.servicio.consultar_region(this.cupo).subscribe(
      resp=> {
        if(resp=="no existe"){
          Swal.fire({
            icon:'error',
            html:'<hr/>No existen cupos para la carrera '+this.cupo.carrera+' en esta región<hr/>',
            allowOutsideClick:false
          });
        }else{
         this.construir_layer_geometrico(this.map,resp);
       if(this.change_region && this.cupo.universidad==null){
        
         this.servicio.select_universidad(this.cupo).subscribe(resp=>this.universidades=resp);
         
        }
       
         this.servicio.select_region(this.cupo).subscribe(resp=>{
          if(this.change_universidades && this.cupo.cod_region==null){
            
            this.regiones=resp;
            this.change_universidades=false; 
          
          }else if(this.change_region && this.cupo.cod_region==null){
           
            this.regiones=resp;
            this.change_region=false; 
          
          }

          if(this.cupo.carrera==null)Swal.close();
          else{ 
            //this.datos_campus();
           if(this.trigge==true){
            this.datos_carrera_campus();
            this.trigge=false;
          } else this.datos_carrera();
            
           } 
         
          });
      
        }

      }
    );


   }
   

   overlayer_puntos(){
   
    if(this.Layer!=null)  this.map.removeLayer(this.Layer);
    this.cupo.cod_region=localStorage.getItem("cod_region");
   if(this.cupo.cod_region=='null')this.cupo.cod_region=null; 
 
   if(this.trigger2==true){
        this.cupo.id_sede=localStorage.getItem("id");
        this.trigger2=false;
        
    } else this.cupo.id_sede=null;

   Swal.fire({
     
      html:"<br/><i class='fas fa-3x fa-map-marked-alt'></i><hr/>Cargando Cartografía<hr/>",
      allowOutsideClick:false
     }) ;
  Swal.showLoading();
 this.servicio.consultar_universidad(this.cupo).subscribe(resp=>{
      
      if(resp=="no existe"){
       
        Swal.fire({
          icon:'error',
          html:'<hr/>No existen cupos para la carrera '+this.cupo.carrera+' en esta región<hr/>',
          allowOutsideClick:false
        });
      }else{
      this.map.removeLayer(this.Layer);
       
      this.construir_layer(this.map,resp);
      this.servicio.select_universidad(this.cupo).subscribe(resp=>{
        if(this.change_region &&  this.cupo.universidad==null){
         
        this.universidades=resp;
        this.change_region=false;
      }
        this.servicio.select_region(this.cupo).subscribe(resp=>{
          if(this.change_universidades && this.cupo.cod_region==null){
          this.regiones=resp;
          this.change_region=false;

          }
          if(this.trigge==false && this.carreras==false)this.datos_campus();
          
          else if(this.trigge==true && this.cupo.id_sede!=null){ 
           
          this.datos_sede();
           this.trigge=false;
          }
          else if(this.trigge==true && this.cupo.id_sede==null){ 
           
            this.datos_campus();
             this.trigge=false;
            }
          else if(this.carreras==true && this.cupo.id_sede==null){ 
          
            this.datos_carrera();
             this.carreras=false;
            }
          });
        
        });
       }     
    })
  
     }


  iniciar_mapa(){
    this.mapOSM = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      minZoom: 4,
    
   
  });

  this.map = L.map("map", {
    zoom: 4,
    layers: [this.mapOSM],
    doubleClickZoom: false,

    
    

 }).setView([-39.3084824,-67.8595443], 4);
//botones


var lugar = L.Control.extend({
  options: {
      position: "topright"
  },
  onAdd: function(map) {
      var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
      container.style.backgroundColor = "white", 
      container.style.backgroundImage = "url(./assets/img/menu.png)"; 
      container.style.backgroundSize = "32px 32px"; 
      container.style.width = "32px"; 
      container.style.height = "32px";
      container.id = "lugar";
container.title = "Menu";
container.id = "menubar";

      return container;
  }

});


var datos = L.Control.extend({
  options: {
      position: "topright"
  },
  
  onAdd: function() {
      var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
      container.style.backgroundColor = "white", 
      container.style.backgroundImage = "url(./assets/img/data.png)"; 
      container.style.backgroundSize = "32px 32px"; 
      container.style.width = "32px"; 
      container.style.height = "32px";
    
      container.id = "datos";
container.title = "Filtrar datos";
 

      return container;
  }

});


this.map.addControl(new lugar);
//this.map.addControl(new datos); 
this.map.on("click", e => {
   
 
});




  }

  onMapReady() {
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }


    construir_layer(map:any,data:any){
    var geojson=data;

    geojson = {
"type": "FeatureCollection",
"features": []
};
    
    const fields = ["id","nombre","ciudad","campus","carrera","cupo","region","cosas"];
   
    //split data into features
var dataArray = data.split("¥ ;");
dataArray.pop();

  

dataArray.forEach(function(d){
d = d.split("¥ "); //split the data up into individual attribute values and the geometry
          
//feature object container
var feature = {
  "type": "Feature",
  "properties": {}, //properties object container
  "geometry": JSON.parse(d[fields.length]) //parse geometry
};

for (var i=0; i<fields.length; i++){
  if(i==fields.length-1) feature.properties[fields[i]]=fields[i];
   else feature.properties[fields[i]] = d[i];
  
                                
};

//add feature names to autocomplete list


geojson.features.push(feature);
            
});

this.Layer = new L.geoJson(geojson,{pointToLayer: function(feature,latlng){

  return L.marker(latlng, {
    icon: L.icon({
    iconUrl: './assets/leaflet/images/x_ve.png',
    iconSize: [32,32],
    iconAnchor: [12, 28],
    popupAnchor: [0, -25]
  })
}
        );
},
// funcion para cada punto
onEachFeature: function(feature, Layer){
 
  if (feature.properties) {
   
     Layer.on({
        
     click: function (e) {
       
         clickcambio(feature.properties.id);
         
           
       //map.setView(Layer.getBounds().getCenter(),15);
       //highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
     }
   });
   }
  
 }
   


});


map.addLayer(this.Layer);
map.fitBounds(this.Layer.getBounds());
this.Layer.on('click',e => {
  //this.sede.id_sede=localStorage.getItem("id");
  
  

   this.datos_sede();
});
return 0;
}

//funcion para tomar el valor el id de la universidad
datos_sede(){ 
  this.sede.id_sede=localStorage.getItem("id");  
  this.sede.carrera=this.cupo.carrera;
  this.sede.porcentaje=this.cupo.porcentaje;
  this.sede.anio=this.cupo.anio;
  let html='';
  Swal.fire({
    icon:'info',
    html:'<hr/><h1>Datos Cargando</h1><hr/>'+
    '<div style="font-size:100%; text-align:justify;" > Su consulta esta siendo procesada.</div>',
    allowOutsideClick: false
  });
  Swal.showLoading();

  this.servicio.consultar_sede(this.sede).subscribe(resp=>{
     
    this.datos=resp;
         this.cupo.universidad=this.datos[0].nombre;
          html='<hr/><h3 style="font-size:95%; text-align:center;">'+this.datos[0].nombre+'</h3><hr/>';
          html +='<h3 style="font-size:90%; text-align:center;">'+this.datos[0].campus+'</h3><hr/>';
          if(Object.keys(resp).length<=10){
            html +="<div style='width: 100%; height: 100%;'>";
          }else html +="<div style='width: 100%; height: 400px; overflow-y: scroll;'>";
          html += "<table class='table table-hover table-bordered'  ><thead style='font-size:80%; text-align:center;'><tr><th >Carrera</th><th>Cupos</th><th>URL</th></tr>"+
          "</thead>"+
          "<tbody style='font-size:80%; text-align:center; overflow:auto;'>";
         
          for(let i=0;i<Object.keys(resp).length;i++){
          
          html +="<tr><td>"+this.datos[i].carrera+"</td><td>"+this.datos[i].cupos+"</td><td><a href='"+this.datos[i].url+"' target='_blank'><i class='fab fa-2x fa-chrome'></i></a></td></tr>";
          }
          
          html +='</tbody></table></div>';
          Swal.fire({
            
             html:html,
            allowOutsideClick: false
          });
          this.map.setView([this.datos[0].latitud,this.datos[0].longitud], 15);          

        });
}

datos_campus(){
  
  
  let html='';
   
  this.servicio.consultar_campos(this.cupo).subscribe(resp=>{
     
    this.datos=resp;
     
          html='<hr/><h3>Región de '+this.datos[0].region+'</h3><hr/>';
          if(Object.keys(resp).length<=11){
            html +="<div   style='width: 100%; height: 100%; overflow-x: scroll;'>";
          }else html +="<div  style='width: 100%; height: 400px; overflow-y: scroll; overflow-x: scroll;'>";
          html += "<table id='campus' class='table table-hover table-bordered'  ><thead style='font-size:80%; text-align:center;'><tr><th >Establecimiento</th><th >Campus</th><th>Cupo</th></tr>"+
          "</thead>"+
          "<tbody style='font-size:70%; text-align:center; overflow:auto;'>";
         
          for (let i=0;i<Object.keys(resp).length;i++){
          
          html +="<tr id='"+this.datos[i].id_sede+"' style='cursor: pointer'><td>"+this.datos[i].nombre+"</td><td>"+this.datos[i].campus+"</td><td>"+this.datos[i].cupos+"</td></tr>";
          }
          
          html +='</tbody></table></div>';
          Swal.fire({
            
             html:html,
            allowOutsideClick: false
          });
  });



}

datos_carrera(){
     
  this.servicio.datos_carrera(this.cupo).subscribe(resp=>{
   let html='';     
  
          html='<hr/><h4>Carreras</h4><hr/>';
          
          
          if(Object.keys(resp).length<10){
           
            html +="<div   style='width: 100%; height: 100%; overflow-x: scroll;'>";
          }else{ 
            html +="<div  style='width: 100%; height: 400px; overflow-y: scroll; overflow-x: scroll;'>";
          }
          html += "<table id='carrera' class='table table-hover table-bordered'  ><thead style='font-size:80%; text-align:center;'><tr><th >id</th><th >Carreras</th></tr>"+
          "</thead>"+
          "<tbody style='font-size:70%; text-align:center; overflow:auto;'>";
         
         for(let i=0;i<Object.keys(resp).length;i++){
           let suma=i+1;
           html +="<tr id='"+resp[i].carrera+"'  style='cursor: pointer'><td>"+suma+"</td><td>"+resp[i].carrera+"</td></tr>"; 
         }
          
          html +='</tbody></table></div>';
          Swal.fire({
            
             html:html,
            allowOutsideClick: false
          });
  });



}

datos_carrera_campus(){
  let carrera=this.cupo.carrera;
  this.servicio.datos_campus(this.cupo).subscribe(resp=>{
   
    let html='';     
     this.lista_carrera=resp;
        
        console.log(Object.keys(resp).length);
           html='<hr/><h3>'+carrera+'</h3><hr/>';
           if(Object.keys(resp).length<10){
            
             html +="<div   style='width: 100%; height: 100%; overflow-x: scroll;'>";
           }else{ 
             html +="<div  style='width: 100%; height: 400px; overflow-y: scroll; overflow-x: scroll;'>";
           }
           html += "<table id='sede' class='table table-hover table-bordered'  ><thead style='font-size:80%; text-align:center;'><tr><th >id</th><th >Carreras</th><th>Region</th><th>Universidad</th><th>Campus</th></tr>"+
           "</thead>"+
           "<tbody style='font-size:70%; text-align:center; overflow:auto;'>";
          
           for (let i=0;i<Object.keys(resp).length;i++){
          resp[i].carrera;
           html +="<tr id='"+resp[i].id_sede+"'  style='cursor: pointer'><td>"+resp[i].id_sede+"</td><td>"+resp[i].carrera+"</td><td id="+resp[i].cod_region+">"+resp[i].region+"</td><td>"+resp[i].nombre+"</td><td>"+resp[i].campus+"</td></tr>";
           }
           
           html +='</tbody></table></div>';
           Swal.fire({
             
              html:html,
             allowOutsideClick: false
           });
   });
 
}
//layer geometrico
construir_layer_geometrico(map:any,data:any){
  //console.log(data);
 var geojson=data;

     geojson = {
 "type": "FeatureCollection",
 "features": []
};
     
     var fields = ["cod_region","nombre","cupos","otros"];
    
     //split data into features
var dataArray = data.split("¥ ;");
dataArray.pop();
 
  
dataArray.forEach(function(d){
 d = d.split("¥ "); //split the data up into individual attribute values and the geometry
           
 //feature object container
 var feature = {
   "type": "Feature",
   "properties": {}, //properties object container
   "geometry": JSON.parse(d[fields.length]) //parse geometry
 };

 for (var i=0; i<fields.length; i++){
   feature.properties[fields[i]] = d[i];
    
                                 
 };

 //add feature names to autocomplete list
 

 geojson.features.push(feature);
             
});


this.Layer = new L.geoJson(geojson,{
     
   
 style:function(feature){ 
return {
         pane: 'pane_chile0',
         opacity: 1,
 
         color: '#203878',
         dashArray: '',
         lineCap: 'butt',
         lineJoin: 'miter',
         weight: 1.0, 
         fillOpacity: 0.5,
         
     }
   },


onEachFeature: function (feature, layer) {
 if (feature.properties) {	 

 layer.on({
 
 click: function (e) {
 
   get_region(feature.properties.cod_region);
   map.fitBounds(e.target.getBounds());
          
   }
 
 });
 }
 }

}
);

map.addLayer(this.Layer);
map.fitBounds(this.Layer.getBounds());
this.Layer.on('click',e => {
  
   this.overlayer_puntos();

  //console.log(e.latlng); // get the coordinates
});
}

//cambio en la consulta

onChange(){
  this.change_region=true;
   
 this.cupo.id_sede=null;
 localStorage.removeItem('id');
 if(this.cupo.cod_region==null){
  this.cupo.universidad=null;
  this.overlayer_geometrico();
  //this.map.setView([-39.3084824,-67.8595443], 4);
 }else {
   get_region(this.cupo.cod_region);
   this.overlayer_puntos();
 }

 
}

onChange2(){
  this.change_universidades=true;
  if(this.cupo.universidad==null) localStorage.removeItem("id"); 
  if(this.cupo.cod_region==null){

    this.overlayer_geometrico();
    //this.map.setView([-39.3084824,-67.8595443], 4);
   }else {

     get_region(this.cupo.cod_region);
     this.overlayer_puntos();
   }
    
}

funcion_jquery(componente:MapaComponent){
  $(document).ready(function() {
   $(document).on("click", "#campus tbody tr", function() {
      localStorage.setItem("id", $(this).attr('id'));
      
      componente.datos_sede();

     
       
    }); 
    $(document).on("click", "#carrera tbody tr", function() {
      componente.cupo.carrera=''+$(this).attr('id');
      localStorage.removeItem("id");
      componente.cupo.id_sede=null;
      componente.trigge=true;
      componente.cupo.porcentaje='0.99',
      componente.onChangeSearch();
    
     
       
    });
    
    $(document).on("click", "#sede tbody tr", function() {
      localStorage.setItem("id", $(this).attr('id'));
      componente.cupo.id_sede=''+$(this).attr('id');
      localStorage.removeItem("cod_region");
    
      componente.trigger2=true;
      
    
     componente.servicio.datos_cupo(componente.cupo).subscribe(resp=>{
         
        componente.cupo.universidad=resp[0].nombre;
       
        localStorage.setItem("cod_region",resp[0].cod_region);
        componente.overlayer_puntos();    
       //componente.datos_sede();
       //Swal.close();
      });
     
       
    });  
});


}

onChangeSearch(){
  this.trigger2=true;
  
 
  if(this.cupo.cod_region==null){
    
    this.overlayer_geometrico();
    
    this.map.setView([-39.3084824,-67.8595443], 4);
   }else {
     get_region(this.cupo.cod_region);
     this.overlayer_puntos();
   }

}

busqueda(){
  this.carreras=true;
  this.cupo.carrera="";
 
  if(this.cupo.cod_region==null){
    this.carreras=false;
    this.overlayer_geometrico();
    
    this.map.setView([-39.3084824,-67.8595443], 4);
   }else {
     get_region(this.cupo.cod_region);
     this.overlayer_puntos();
   }

}

onkeyup(){
  
  this.cupo.porcentaje='0.2';
}

}





function clickcambio(id:string){
 
  localStorage.setItem("id",id);

}

function get_region(cod_region:string){
  if(cod_region==null) localStorage.removeItem("cod_region");
  localStorage.setItem("cod_region",cod_region);

}

