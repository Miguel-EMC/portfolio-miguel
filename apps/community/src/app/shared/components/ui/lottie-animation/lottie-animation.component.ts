import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { DotLottie, Config } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-lottie-animation',
  standalone: true,
  template: `
    <div #lottieContainer class="lottie-container" [style.width]="width" [style.height]="height"></div>
  `,
  styles: [`
    .lottie-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .lottie-container canvas {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
    }
  `]
})
export class LottieAnimationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef<HTMLDivElement>;

  @Input() src: string = '';
  @Input() autoplay: boolean = true;
  @Input() loop: boolean = true;
  @Input() speed: number = 1;
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() mode: 'forward' | 'reverse' | 'bounce' | 'reverse-bounce' = 'forward';

  private dotLottie?: DotLottie;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser && this.src) {
      await this.loadAnimation();
    }
  }

  private async loadAnimation(): Promise<void> {
    try {
      const { DotLottie } = await import('@lottiefiles/dotlottie-web');

      const config: Config = {
        canvas: this.createCanvas(),
        src: this.src,
        autoplay: this.autoplay,
        loop: this.loop,
        speed: this.speed,
        mode: this.mode,
      };

      this.dotLottie = new DotLottie(config);
    } catch (error) {
      console.error('Error loading Lottie animation:', error);
    }
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.lottieContainer.nativeElement.appendChild(canvas);
    return canvas;
  }

  play(): void {
    this.dotLottie?.play();
  }

  pause(): void {
    this.dotLottie?.pause();
  }

  stop(): void {
    this.dotLottie?.stop();
  }

  setSpeed(speed: number): void {
    this.dotLottie?.setSpeed(speed);
  }

  ngOnDestroy(): void {
    if (this.dotLottie) {
      this.dotLottie.destroy();
    }
  }
}
