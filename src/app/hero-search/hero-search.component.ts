import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit{
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {

  }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // Ignore all the events in the incoming observable until 300ms passes
      // since the last taken event.
      debounceTime(300),
      // Ignore new term if same as previous term
      distinctUntilChanged(),
      // Generate a new search observable each time the term changes.
      // The prior non-finished HTTP request results are discarded.
      // The cancelling of the non-finished HTTP requests is not implemented as of Angular 16.
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
