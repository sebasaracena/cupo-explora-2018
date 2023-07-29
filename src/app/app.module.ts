import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modulos/dashboard/pagina/dashboard.component';
import { MapaComponent } from './modulos/dashboard/components/mapa/mapa.component';
import { NavegadorComponent } from './pagina/navegador/navegador.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SobreComponent } from './pagina/sobre/sobre.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { TablaComponent } from './modulos/dashboard/components/tabla/tabla.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PivotComponent } from './modulos/dashboard/components/pivot/pivot.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapaComponent,
    NavegadorComponent,
    SobreComponent,
    PreguntasComponent,
    TablaComponent,
    PivotComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
