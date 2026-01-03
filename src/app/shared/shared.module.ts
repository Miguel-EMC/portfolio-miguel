import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Layout Components
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavComponent } from './components/layout/nav/nav.component';

const SHARED_COMPONENTS = [
  FooterComponent,
  NavComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...SHARED_COMPONENTS
  ],
  exports: [
    CommonModule,
    RouterModule,
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }