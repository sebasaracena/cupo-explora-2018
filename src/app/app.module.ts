import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modulos/dashboard/dashboard.component';
import { MapaComponent } from './modulos/dashboard/mapa/mapa.component';
import { NavegadorComponent } from './pagina/navegador/navegador.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SobreComponent } from './pagina/sobre/sobre.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapaComponent,
    NavegadorComponent,
    SobreComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
