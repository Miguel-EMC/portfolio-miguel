import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  EmailService,
  ContactFormData,
} from '../../../core/services/email.service';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgIf, FormsModule, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  private emailService = inject(EmailService);
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  async onSubmit(form: NgForm): Promise<void> {
    if (this.isSubmitting) return;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    const data: ContactFormData = {
      from_name: form.value.name.trim(),
      from_email: form.value.email.trim(),
      subject: form.value.subject,
      message: form.value.message.trim(),
    };
    try {
      if (await this.emailService.sendContactForm(data)) {
        this.showSuccessMessage = true;
        form.resetForm();
      } else this.showErrorMessage = true;
    } catch {
      this.showErrorMessage = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
