import { Component, Input } from '@angular/core';
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
  @Input() compact = false;
  readonly experiences = experiences;
  get visibleExperiences() {
    return this.compact ? this.experiences.slice(0, 3) : this.experiences;
  }
}
