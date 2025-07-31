import { Component } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
 // places = signal<Plac e[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private PlacesService = inject(PlacesService); 
  private destoryRef = inject(DestoryRef);
  places = this.PlacesService.loadedUserPlaces;
  
  
  ngOnInit(){
      this.isFetching.set(true);
      const subscription = this.PlacesService.loadedUserPlaces().subscribe({
      // by default the get here returns an oversable so i need to subscribe.
      // next: (places) => {
      //   //console.log(resData.places);
      //   this.places.set(places);
      // }, 
      error: (error) => {
        console.log(error.message);
        this.error.set("Something webt wrong fetching your favourite places. Please try again later. ");
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });
      this.destoryRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
