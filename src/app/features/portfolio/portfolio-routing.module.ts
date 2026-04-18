import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortafolioComponent } from './portfolio/portafolio.component';

const routes: Routes = [
  {
    path: '',
    component: PortafolioComponent
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('./project-detail/project-detail.component').then(c => c.ProjectDetailComponent),
    title: 'Project Details'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }
