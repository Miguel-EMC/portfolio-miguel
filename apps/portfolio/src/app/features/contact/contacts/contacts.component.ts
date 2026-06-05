import { Component } from '@angular/core';
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
  email: string = 'eduardomuzo123456&#64;gmail.com';
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private emailService: EmailService) {
    console.log('🔵 ContactsComponent loaded successfully!');
    console.log('🔵 If you see this, the component is working');
    alert('🔵 CONSTRUCTOR EJECUTADO - El componente se cargó');
  }

  testButton() {
    alert('🧪 ¡BOTÓN DE PRUEBA FUNCIONA!');
    console.log('🧪 Test button clicked - TypeScript is working');
  }

  async onSubmit(form: NgForm) {
    console.log('🚀 BUTTON CLICKED!');
    console.log('Form valid:', form.valid);
    console.log('Form invalid:', form.invalid);
    console.log('Form values:', form.value);
    console.log('Form errors:', form.errors);
    
    // Show immediate feedback
    alert('¡Botón presionado! Revisa la consola del navegador (F12)');
    
    if (form.invalid) {
      console.log('❌ Form is invalid, stopping here');
      this.showErrorMessage = true;
      setTimeout(() => this.showErrorMessage = false, 3000);
      return;
    }

    console.log('✅ Form is valid, proceeding with submission');
    
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
      console.log('📧 Calling email service with data:', formData);
      const success = await this.emailService.sendContactForm(formData);
      console.log('📨 Email service result:', success);
      
      if (success) {
        this.showSuccessMessage = true;
        alert('¡EMAIL ENVIADO EXITOSAMENTE! 🎉');
        form.resetForm();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      } else {
        this.showErrorMessage = true;
        alert('❌ Error al enviar email');
      }
    } catch (error) {
      console.error('💥 Error in component:', error);
      this.showErrorMessage = true;
      alert('❌ Error crítico: ' + error);
    } finally {
      this.isSubmitting = false;
      
      // Hide error message after 5 seconds
      if (this.showErrorMessage) {
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 5000);
      }
    }
  }
}