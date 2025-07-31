import { Component, signal } from '@angular/core';

//import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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
  private placesService = inject(PlacesService); 
  private destoryRef = inject(DestoryRef);

  // alternatively we can use a constructor:
  // constructor(private httpClient: HttpClient){}

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
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
  onSelectPlace(selectedPlace: Place){
    this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData) => console.log(resData), 
    });
     this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
 