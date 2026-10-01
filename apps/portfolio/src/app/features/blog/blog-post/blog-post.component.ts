import { LanguageService } from '../../../shared/services/language.service';
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ViewEncapsulation,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil, switchMap, combineLatest } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { BlogService } from '../../../core/services/blog.service';
import { SeoService } from '../../../core/services/seo.service';
import {
  BlogPost,
  BlogPostMeta,
  BLOG_CATEGORIES,
} from '../../../interfaces/blog.interface';

interface TocItem {
  id: string;
  text: string;
  level: number;
  active: boolean;
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogPostComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private seoService = inject(SeoService);
  private language = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);
  private pendingTimers = new Set<ReturnType<typeof setTimeout>>();
  private schedule(
    callback: () => void,
    delay: number,
  ): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      this.pendingTimers.delete(id);
      callback();
    }, delay);
    this.pendingTimers.add(id);
    return id;
  }
  private clearPendingTimers(): void {
    this.pendingTimers.forEach((id) => clearTimeout(id));
    this.pendingTimers.clear();
  }
  private observer?: IntersectionObserver;

  post = signal<BlogPost | null>(null);
  relatedPosts = signal<BlogPostMeta[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  imageError = signal(false);
  relatedImageErrors = signal<{ [slug: string]: boolean }>({});
  readingProgress = signal(0);
  toc = signal<TocItem[]>([]);
  reactions = signal<Record<string, boolean>>({});
  private chartRoots: import('@amcharts/amcharts5').Root[] = [];
  lightboxSvg = signal<SafeHtml | null>(null);
  lightboxZoom = signal(1);
  readonly reactionTypes = [
    { id: 'insightful', emoji: '💡', label: 'Insightful' },
    { id: 'helpful', emoji: '🙌', label: 'Útil' },
    { id: 'love', emoji: '🔥', label: 'Me encantó' },
  ];

  onImageError(): void {
    this.imageError.set(true);
  }

  onRelatedImageError(slug: string): void {
    this.relatedImageErrors.update((errors) => ({ ...errors, [slug]: true }));
  }

  ngOnInit(): void {
    // Listen to window scroll event for reading progress bar
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }

    combineLatest([this.route.paramMap, this.language.currentLanguage$])
      .pipe(
        switchMap(([params]) => {
          const slug = params.get('slug');
          if (!slug) {
            this.error.set('Post not found');
            this.isLoading.set(false);
            return [];
          }
          this.clearPendingTimers();
          this.isLoading.set(true);
          this.error.set(null);
          // Reset image error, reading states, and TOC when routing between posts
          this.imageError.set(false);
          this.relatedImageErrors.set({});
          this.readingProgress.set(0);
          this.toc.set([]);
          this.disposeCharts();
          this.closeDiagramLightbox();

          if (this.observer) {
            this.observer.disconnect();
          }

          return this.blogService.getPostBySlug(slug);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (post) => {
          if (post) {
            this.post.set(post);
            this.updateSeo(post);
            this.loadRelatedPosts(post.slug);
            this.loadReactions(post.slug);
            this.addCopyButtons();
            this.buildToc();
            this.renderMermaidDiagrams();
            this.renderCharts();
          } else {
            this.error.set('Post not found');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load post:', err);
          this.error.set('Failed to load post');
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.clearPendingTimers();
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up scroll listener
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
    }

    // Clean up intersection observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.disposeCharts();
    this.closeDiagramLightbox();
  }

  private disposeCharts(): void {
    this.chartRoots.forEach((root) => root.dispose());
    this.chartRoots = [];
  }

  private onScroll = (): void => {
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      this.readingProgress.set(percentage);
    } else {
      this.readingProgress.set(0);
    }
  };

  private loadRelatedPosts(currentSlug: string): void {
    this.blogService
      .getRelatedPosts(currentSlug, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe((posts) => this.relatedPosts.set(posts));
  }

  private updateSeo(post: BlogPost): void {
    this.seoService.updateForBlogPost({
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      author: post.author,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      category: post.category,
      tags: post.tags,
      slug: post.slug,
    });
  }

  getCategoryInfo(categoryId: string) {
    return BLOG_CATEGORIES.find((c) => c.id === categoryId);
  }

  // Deterministic color per tag (same tag = same color everywhere), pulled
  // from the existing blog category palette — variety without randomness.
  private readonly tagPalette = [
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#06B6D4',
  ];

  getTagColor(tag: string): string {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    }
    return this.tagPalette[hash % this.tagPalette.length];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat(
      this.language.getCurrentLanguage() === 'es' ? 'es-EC' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    ).format(new Date(date));
  }

  shareOnTwitter(): void {
    const post = this.post();
    if (!post) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp(): void {
    const post = this.post();
    if (!post) return;
    const text = `${post.title} — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  private loadReactions(slug: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const state: Record<string, boolean> = {};
    this.reactionTypes.forEach(({ id }) => {
      state[id] = localStorage.getItem(`blog-reaction-${slug}-${id}`) === '1';
    });
    this.reactions.set(state);
  }

  toggleReaction(id: string): void {
    const post = this.post();
    if (!post || !isPlatformBrowser(this.platformId)) return;
    const key = `blog-reaction-${post.slug}-${id}`;
    const active = !this.reactions()[id];
    if (active) {
      localStorage.setItem(key, '1');
    } else {
      localStorage.removeItem(key);
    }
    this.reactions.update((r) => ({ ...r, [id]: active }));
  }

  get feedbackMailto(): string {
    const post = this.post();
    const subject = encodeURIComponent(
      `Sugerencia sobre: ${post?.title ?? 'el blog'}`,
    );
    const body = encodeURIComponent(
      `Hola Miguel,\n\nTengo una sugerencia sobre el artículo "${post?.title ?? ''}"${isPlatformBrowser(this.platformId) ? ' (' + window.location.href + ')' : ''}:\n\n`,
    );
    return `mailto:eduardomuzo123456@gmail.com?subject=${subject}&body=${body}`;
  }

  scrollToHeading(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  private buildToc(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait slightly to make sure the markdown innerHTML is fully rendered in the DOM
    this.schedule(() => {
      const postContentEl = document.querySelector('.post-content');
      if (!postContentEl) return;

      const headings = postContentEl.querySelectorAll('h2, h3');
      const tocItems: TocItem[] = [];

      headings.forEach((heading, index) => {
        let id = heading.getAttribute('id');
        if (!id) {
          // Generate a safe unique ID based on the text contents
          const slug = heading.textContent
            ?.trim()
            .toLowerCase()
            .normalize('NFD') // remove accents
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''); // remove leading/trailing dashes

          id = `toc-${index}-${slug}`;
          heading.setAttribute('id', id);
        }

        tocItems.push({
          id: id,
          text: heading.textContent?.trim() || '',
          level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3,
          active: false,
        });
      });

      this.toc.set(tocItems);
      this.setupIntersectionObserver();
    }, 400);
  }

  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    const headingElements: Element[] = [];
    this.toc().forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) headingElements.push(el);
    });

    if (headingElements.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      // Find the first intersecting entry
      const intersectingEntry = entries.find((entry) => entry.isIntersecting);
      if (intersectingEntry) {
        const id = intersectingEntry.target.getAttribute('id');
        if (id) {
          this.toc.update((items) =>
            items.map((item) => ({
              ...item,
              active: item.id === id,
            })),
          );
        }
      }
    }, options);

    headingElements.forEach((el) => this.observer?.observe(el));
  }

  private addCopyButtons(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait for the next tick to ensure the DOM is updated via innerHTML
    this.schedule(() => {
      const postContentEl = document.querySelector('.post-content');
      if (!postContentEl) return;

      const preElements = postContentEl.querySelectorAll<HTMLPreElement>(
        'pre:not(.mermaid-source):not(.chart-spec)',
      );
      preElements.forEach((pre) => {
        // Prevent duplicate copy buttons
        if (pre.querySelector('.copy-code-btn')) return;

        // Relative position container for absolute position of copy button
        pre.style.position = 'relative';

        // Create button
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.type = 'button';
        button.setAttribute('aria-label', 'Copy code');
        button.innerHTML = '<i class="bi bi-clipboard"></i><span>Copy</span>';

        // Retrieve code content to copy
        const codeEl = pre.querySelector('code');
        const codeText = codeEl ? codeEl.innerText : '';

        // Add click listener
        button.addEventListener('click', () => {
          navigator.clipboard
            .writeText(codeText)
            .then(() => {
              button.innerHTML =
                '<i class="bi bi-check2"></i><span>Copied!</span>';
              button.classList.add('copied');

              this.schedule(() => {
                button.innerHTML =
                  '<i class="bi bi-clipboard"></i><span>Copy</span>';
                button.classList.remove('copied');
              }, 2000);
            })
            .catch((err) => {
              console.error('Could not copy code text: ', err);
            });
        });

        pre.appendChild(button);
      });
    }, 200);
  }

  private renderMermaidDiagrams(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.schedule(async () => {
      const postContentEl = document.querySelector('.post-content');
      if (!postContentEl) return;

      const containers = Array.from(
        postContentEl.querySelectorAll<HTMLElement>('.mermaid-diagram'),
      );
      if (containers.length === 0) return;

      // Wait for webfonts to load first — mermaid measures label text at render
      // time, and measuring against a fallback font produces boxes too narrow
      // for the real (wider) Inter glyphs, clipping the label permanently.
      // document.fonts.ready alone isn't enough: it only tracks fonts that
      // have already been requested by something on the page, and nothing
      // else may have asked for this exact family/weight yet — so force the
      // load explicitly first.
      if ('fonts' in document) {
        const fontSet = (document as Document & { fonts: FontFaceSet }).fonts;
        try {
          await Promise.all([
            fontSet.load('400 16px Inter'),
            fontSet.load('700 16px Inter'),
          ]);
          await fontSet.ready;
        } catch {
          /* ignore */
        }
      }

      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        securityLevel: 'strict',
        startOnLoad: false,
        theme: 'dark',
        fontFamily: 'Inter, sans-serif',
        flowchart: { htmlLabels: true, padding: 16 },
        themeVariables: {
          primaryColor: 'rgba(52, 211, 153, 0.12)',
          primaryTextColor: '#f0f0f0',
          primaryBorderColor: '#34D399',
          lineColor: '#34D399',
          secondaryColor: '#22262f',
          tertiaryColor: '#1a1d24',
          background: '#1a1d24',
          mainBkg: '#22262f',
          nodeBorder: '#34D399',
          clusterBkg: '#1a1d24',
          edgeLabelBackground: '#1a1d24',
        },
      });

      for (const [index, container] of containers.entries()) {
        const source =
          container.querySelector('.mermaid-source')?.textContent ?? '';
        if (!source.trim()) continue;

        try {
          const { svg } = await mermaid.render(
            `mermaid-diagram-${index}`,
            source.trim(),
          );
          container.innerHTML = svg;
          container.classList.add('rendered');

          const expandBtn = document.createElement('button');
          expandBtn.type = 'button';
          expandBtn.className = 'diagram-expand-btn';
          expandBtn.setAttribute('aria-label', 'Ver diagrama en grande');
          expandBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
          expandBtn.addEventListener('click', () =>
            this.openDiagramLightbox(svg),
          );
          container.appendChild(expandBtn);
        } catch (err) {
          console.error('Mermaid render failed:', err);
          container.innerHTML =
            '<p class="rich-content-error">No se pudo renderizar el diagrama.</p>';
        }
      }
    }, 400);
  }

  private fitZoom = 1.75;

  openDiagramLightbox(svg: string): void {
    this.lightboxSvg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
    this.fitZoom = this.computeFitZoom(svg);
    this.lightboxZoom.set(this.fitZoom);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeDiagramLightbox(): void {
    this.lightboxSvg.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  zoomDiagram(delta: number): void {
    this.lightboxZoom.update((z) =>
      Math.min(8, Math.max(0.5, +(z + delta).toFixed(2))),
    );
  }

  resetDiagramZoom(): void {
    this.lightboxZoom.set(this.fitZoom);
  }

  // Flowcharts tend to be wide and short (a handful of boxes in a row).
  // Fitting to viewport WIDTH keeps them looking small and lost in a
  // fullscreen modal — there's plenty of unused vertical space either
  // way. Fit to HEIGHT instead so the diagram actually reads as "big";
  // the viewport scrolls horizontally (it's overflow:auto) for the rest.
  private computeFitZoom(svg: string): number {
    if (!isPlatformBrowser(this.platformId)) return 2.5;

    const match = svg.match(/viewBox="[\d.\-]+\s[\d.\-]+\s([\d.]+)\s([\d.]+)"/);
    if (!match) return 2.5;

    const naturalHeight = parseFloat(match[2]);
    if (!naturalHeight) return 2.5;

    const availableHeight = (window.innerHeight - 140) * 0.9;
    const zoom = availableHeight / naturalHeight;

    return Math.min(6, Math.max(1.5, +zoom.toFixed(2)));
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.lightboxSvg()) this.closeDiagramLightbox();
  }

  private renderCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.schedule(async () => {
      const postContentEl = document.querySelector('.post-content');
      if (!postContentEl) return;

      const containers = Array.from(
        postContentEl.querySelectorAll<HTMLElement>('.chart-container'),
      );
      if (containers.length === 0) return;

      const [am5, am5xy, am5themesAnimated] = await Promise.all([
        import('@amcharts/amcharts5'),
        import('@amcharts/amcharts5/xy'),
        import('@amcharts/amcharts5/themes/Animated'),
      ]);

      containers.forEach((container, index) => {
        const specText =
          container.querySelector('.chart-spec')?.textContent ?? '';
        let spec: {
          type: string;
          title?: string;
          data: { label: string; value: number; unit?: string }[];
        };
        try {
          spec = JSON.parse(specText);
        } catch (err) {
          console.error('Invalid chart spec:', err);
          container.innerHTML =
            '<p class="rich-content-error">Gráfico inválido.</p>';
          return;
        }

        const chartId = `amchart-${index}-${Date.now()}`;
        const chartDiv = document.createElement('div');
        chartDiv.id = chartId;
        chartDiv.className = 'amchart-canvas';
        container.innerHTML = '';
        if (spec.title) {
          const titleEl = document.createElement('p');
          titleEl.className = 'chart-title';
          titleEl.textContent = spec.title;
          container.appendChild(titleEl);
        }
        container.appendChild(chartDiv);

        const root = am5.Root.new(chartId);
        root.setThemes([am5themesAnimated.default.new(root)]);

        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: 'none',
            wheelY: 'none',
            layout: root.verticalLayout,
            paddingLeft: 0,
          }),
        );

        const xRenderer = am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
        });
        xRenderer.labels.template.setAll({ fill: am5.color(0xa0a0a0) });
        xRenderer.grid.template.set('visible', false);

        const xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: 'label',
            renderer: xRenderer,
          }),
        );
        xAxis.data.setAll(spec.data);

        const yRenderer = am5xy.AxisRendererY.new(root, {});
        yRenderer.labels.template.setAll({ fill: am5.color(0xa0a0a0) });
        yRenderer.grid.template.setAll({
          stroke: am5.color(0xffffff),
          strokeOpacity: 0.06,
        });

        const yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: yRenderer,
          }),
        );

        const series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            xAxis,
            yAxis,
            valueYField: 'value',
            categoryXField: 'label',
            tooltip: am5.Tooltip.new(root, {
              labelText: `{valueY}${spec.data[0]?.unit ?? ''}`,
            }),
          }),
        );

        series.columns.template.setAll({
          fill: am5.color(0x34d399),
          stroke: am5.color(0x34d399),
          cornerRadiusTL: 8,
          cornerRadiusTR: 8,
          width: am5.percent(50),
        });

        series.data.setAll(spec.data);
        series.appear(600);
        chart.appear(600, 100);

        // Free amCharts license requires keeping attribution visible — do not remove root._logo.
        this.chartRoots.push(root);
      });
    }, 400);
  }
}
