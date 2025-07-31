import { Component, signal } from '@angular/core';
import {map} from 'rxjs';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Plac e[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpCleint = inject(HttpClient); 
  private destoryRef = inject(DestoryRef);

  // alternatively we can use a constructor:
  // constructor(private httpClient: HttpClient){}

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.httpCleint.get<{places: Place[]}>('http://localhost:3000/places').pipe(
      map((resData)=> resData.places)
    ).subscribe({
    // by default the get here returns an oversable so i need to subscribe.
    next: (places) => {
      //console.log(resData.places);
      this.places.set(places);
    }, 
    error: (error) => {
      console.log(error.message);
      this.error.set("Something webt wrong fetching the available places. Please try again later. ");
    },
    complete: () => {
      this.isFetching.set(false);
    }
  });
    this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // we could also pipe the resData to map it to the places so that instead of calling resData.places, we just call places. 
  onSelectPlace(selectedPlace: Place)
}
