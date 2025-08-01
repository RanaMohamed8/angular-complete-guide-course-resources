import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
}) 
export class TasksComponent {
  userId  = input.required<string>();
  order = signal<'asc'|'desc'>('desc');
  //order?: 'asc' | 'desc'; 
  private tasksService = inject(TasksService);
  userTasks = computed(()=> this.tasksService.allTasks().filter((task) => task.userId === this.userId()).sort((a,b)=> {
    if (this.order()==='desc'){
      return a.id >  b.id? -1:1 ; 
    } else{
      return a.id > b.id ? 1:-1 ; 
    }
  }));
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void{
    const subscription = this.activatedRoute.queryParams.subscribe({
      next: (paramMap) => (this.order.set(paramMap['order'])),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
