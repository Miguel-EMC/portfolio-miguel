import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeComponent } from './resume.component';

@NgModule({
  imports: [
    SharedModule,
    ResumeRoutingModule,
    ResumeComponent
  ]
})
export class ResumeModule { }