import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactsComponent } from './contacts/contacts.component';
import { AboutMeComponent } from './about-me/about-me.component';

@NgModule({
  imports: [
    SharedModule,
    ContactRoutingModule,
    ContactsComponent,
    AboutMeComponent
  ]
})
export class ContactModule { }