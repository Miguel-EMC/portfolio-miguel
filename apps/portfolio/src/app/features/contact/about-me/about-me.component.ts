import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SkillsComponent } from '../../resume/components/skills/skills.component';
@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [TranslateModule, RouterLink, SkillsComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
})
export class AboutMeComponent {}
