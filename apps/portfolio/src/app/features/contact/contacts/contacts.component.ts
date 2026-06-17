import { Component, inject, NgZone } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmailService, ContactFormData } from '../../../core/services/email.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgIf, FormsModule, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  private ngZone = inject(NgZone);
  private emailService = inject(EmailService);
  
  email: string = 'eduardomuzo123456&#64;gmail.com';
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showErrorMessage = true;
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.showErrorMessage = false;
          });
        }, 3000);
      });
      return;
    }

    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    const formData: ContactFormData = {
      from_name: `${form.value.firstName} ${form.value.lastName}`,
      from_email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    };

    try {
      const success = await this.emailService.sendContactForm(formData);
      
      if (success) {
        this.showSuccessMessage = true;
        form.resetForm();
        
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.showSuccessMessage = false;
            });
          }, 5000);
        });
      } else {
        this.showErrorMessage = true;
      }
    } catch (error) {
      this.showErrorMessage = true;
    } finally {
      this.isSubmitting = false;
      
      if (this.showErrorMessage) {
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.showErrorMessage = false;
            });
          }, 5000);
        });
      }
    }
  }
}