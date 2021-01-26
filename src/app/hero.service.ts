import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  getHeroes() : Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
              .pipe(tap(_ => this.log('fetched heroes')), 
                    catchError(this.handleError<Hero[]>('getHeroes', []))
                    );
  }

  getHero(id: number) : Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
            .pipe(tap(_ => this.log(`Hero being fetched: id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
            );
  }

  constructor(private messageService : MessageService, private http : HttpClient) { 

  }

  private log(message: string) : void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log error
      this.log(`${operation} failed: ${error.message}`); // log error for user consumption
      return of(result as T); // let app keep running
    };
  }

  updateHero(hero: Hero) : Observable<any> {
    return this.http.put<any>(this.heroesUrl, hero, this.httpOptions)
            .pipe(tap(_ => this.log(`Hero being updated: id=${hero.id}`)),
            catchError(this.handleError<any>(`updatehero id=${hero.id}`))
            );
  }

  addHero(hero: Hero) : Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
            .pipe(tap((newHero: Hero) => this.log(`Hero added: id=${hero.id}`)),
            catchError(this.handleError<Hero>(`AddHero error: id=${hero.id}`))
            );
  }

  deleteHero(hero: Hero) : Observable<Hero> {   
    return this.http.delete<Hero>(`${this.heroesUrl}/${hero.id}`, this.httpOptions)
            .pipe(tap(_ => this.log(`deleted hero ${hero.name}`)),
            catchError(this.handleError<Hero>(`deleteHero: name = ${hero.name}`))
            );
  }

  searchHeroes(term: string) : Observable<Hero[]> {
    if (!term.trim) return of([]); // returns nothing if search field empty
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(x => x.length ? this.log(`found heroes matching ${term}`) : this.log(`found heroes matching ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
  }
}
