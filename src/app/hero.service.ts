import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  getHeroes() : Observable<Hero[]> {
    return of(HEROES);
  }

  getHero(id: number) : Observable<Hero> {
    this.messageService.add(`Hero being fetched: id=${id}`);
    const found = HEROES.find(hero => hero.id === id);
    if (found === undefined) throw new TypeError("Not possible!");
    return of(found);
  }

  constructor(private messageService : MessageService) { 

  }
}
