import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, SearchResult } from '../../services/api.service';
import { Observable, Subject, merge, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.scss'
})
export class SearchModal implements OnInit, AfterViewInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  searchForm: FormGroup;
  results$!: Observable<SearchResult[]>;
  // backendUrl = 'https://localhost:3000';
   backendUrl = environment.apiUrl;

  // Internal helpers
  private manualSearch$ = new Subject<string>(); 
  loading = false;
  private sub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    const typed$ = this.searchForm.get('query')!.valueChanges.pipe(
      map((v: any) => (v || '').toString().trim()),
      debounceTime(250),
      distinctUntilChanged(),
      filter((q: string) => q.length > 0)
    );

    const manual$ = this.manualSearch$.pipe(
      map(v => (v || '').toString().trim()),
      filter(q => q.length > 0)
    );

    // Merge typed (debounced) and manual (immediate) searches into one pipeline
    const searchPipeline$ = merge(typed$, manual$).pipe(
      tap(() => { this.loading = true; }),
      switchMap((query: string) =>
        this.apiService.search(query).pipe(
          catchError(err => {
            console.error('Search error', err);
            return of([] as SearchResult[]);
          })
        )
      ),
      tap(() => { this.loading = false; })
    );

    this.results$ = searchPipeline$;

    // Optional: subscribe to results$ if you need side-effects (analytics / scroll)
    const s = this.results$.subscribe(results => {
      if (results && results.length > 0) {
        setTimeout(() => {
          document.querySelector('.modal-popover')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      }
    });
    this.sub.add(s);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelector('.modal-popover')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.querySelector<HTMLInputElement>('.search-bar-with-btn input, .search-bar input');
      input?.focus();
    }, 50);
  }

  onSearch(): void {
    const query = this.searchForm.get('query')!.value;
    if (query && query.toString().trim().length > 0) {
      this.manualSearch$.next(query.toString().trim());
    } else {
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.manualSearch$.complete();
  }
}
