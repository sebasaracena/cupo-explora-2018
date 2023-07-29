import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SobreComponent } from './pagina/sobre/sobre.component';
import { DashboardComponent } from './modulos/dashboard/pagina/dashboard.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'mapa',
  pathMatch: 'full'
},

{
  path: 'mapa',
  component: DashboardComponent,
},
  {
    path: 'about',
    component: SobreComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
