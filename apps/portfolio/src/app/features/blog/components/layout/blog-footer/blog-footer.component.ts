import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './blog-footer.component.html',
  styleUrls: ['./blog-footer.component.scss']
})
export class BlogFooterComponent {}
