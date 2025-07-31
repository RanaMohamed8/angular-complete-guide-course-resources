import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = Injectable(this.httpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places').pipe(tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces),
    }))
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update(prevPlaces => [...prevPlaces, place]);
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string){
    return this.httpClient.get<{places: Place[]}>(url).pipe(
        map((resData)=> resData.places)
      )
  }
}
