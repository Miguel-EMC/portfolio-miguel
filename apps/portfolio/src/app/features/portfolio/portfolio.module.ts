import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortafolioComponent } from './portfolio/portafolio.component';

@NgModule({
  imports: [
    SharedModule,
    PortfolioRoutingModule,
    PortafolioComponent
  ]
})
export class PortfolioModule { }