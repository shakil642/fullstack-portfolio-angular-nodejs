import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AdminView = 'overview' | 'projects' | 'skills' | 'blogs' | 'reviews' | 'messages';

@Injectable({
  providedIn: 'root'
})
export class AdminViewService {
  // A BehaviorSubject holds the current value and broadcasts it to subscribers
  private readonly _currentView = new BehaviorSubject<AdminView>('overview');

  // A public observable that components can subscribe to
  public readonly currentView$ = this._currentView.asObservable();

  constructor() { }

  // A public method to change the current view
  changeView(view: AdminView): void {
    this._currentView.next(view);
  }
}