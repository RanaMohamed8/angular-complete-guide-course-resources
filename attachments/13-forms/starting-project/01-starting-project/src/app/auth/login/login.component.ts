// import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl){
  if (control.value.includes('?')){
    return null; 
  }

  return { doesnNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl){
  if (control.value !== 'test@example.com'){
    return of(null);
  }
   return of({notUnique: true});
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm){
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email; 
}


@Component({
  selector: 'app-login',
  standalone: true,
  // imports: [FormsModule],
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{

  // private form = viewChild.required<NgForm>('form');
  // private destroyRef = inject(DestroyRef);


  // constructor() {
  //   afterNextRender(() => {
  //     const savedForm = window.localStorage.getItem('saved-login-form');
  //     if (savedForm){
  //       const loadedFormData = JSON.parse(savedForm);
  //       const savedEmail = loadedFormData.email; 
       
  //       setTimeout(() => {
  //          this.form().controls['email'].setValue(savedEmail);
  //       }, 1);
  //     }

  //     const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe(
  //       {
  //         next: (value) => window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email})),
  //       }); 
  //       this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  //   });
  // }
  // onSubmit(formData: NgForm){

  //   if (formData.form.invalid){
  //     return; 
  //   }
  //   const enteredEmail = formData.form.value.email;
  //   const enteredPassword = formData.form.value.password;

  //   console.log(formData.form);
  //   console.log(enteredEmail, enteredPassword);

  //   formData.form.reset();
    
  // }

  private destroyRef = inject(DestroyRef);  
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [ Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [ Validators.required, Validators.minLength(6), mustContainQuestionMark], 
    })
  });

  get emailIsInvalid(){
    return (this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid);
  }

  get passwordIsInvalid(){
    return (this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid);
  }

  ngOnInit() {
      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next: value => {
          window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email}));
        }
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit(){
    console.log(this.form);
    const enteredEmail = this.form.controls.email; 
    const enteredPassword = this.form.controls.password; 
    console.log(enteredEmail, enteredPassword)
  }

}

