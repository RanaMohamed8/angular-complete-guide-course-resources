import { Component, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';
@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');

  // this is how we request a service 
  // we're requesting the shared instance we'll operate on throughout the application.
  constructor(private tasksService: TasksService){}
  onAddTask(title: string, description: string) {
    this.tasksService.addTask({title: title, description: description});
    this.formEl()?.nativeElement.reset();
  }
}
