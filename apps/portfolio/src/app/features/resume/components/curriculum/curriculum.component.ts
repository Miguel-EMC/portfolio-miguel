import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { experiences } from '../../../../core/data/experience.data';
@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss'],
})
export class CurriculumComponent {
  readonly experiences = experiences;
}
