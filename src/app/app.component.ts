import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule, ReactiveFormsModule],
  providers: [UserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  userForm: FormGroup;
  title = 'User Form';
  user: string = '';
  name: string = '';
  userId: string = '';
  successMessage: string | null = null;
  submittedData: any;
  editMode: any;

  constructor(private userService: UserService, private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      user: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userValues = this.userForm.value;
  
      // Check for duplicates before making the API call
      this.userService.checkForDuplicate(userValues.user).subscribe(
        response => {
          if (response.isDuplicate) {
            console.error('Duplicate user found:', response.user);
            this.successMessage = 'Error: Duplicate user. Please choose a different username.';
          } else {
            if (this.editMode) {
              this.userService.updateUser(this.submittedData.user, userValues).subscribe(
                (response) => {
                  console.log('User updated successfully:', response.message);
                  alert("Are you sure to save edited data");
                  this.successMessage = 'User updated successfully';
                  this.submittedData = userValues;
                  this.editMode = false;
                },
                (error) => {
                  console.error('Error updating user:', error);
                }
              );
            } else {
              this.userService.addUser(userValues).subscribe(
                (response) => {
                  console.log('User added successfully:', response);
                  this.successMessage = 'User added successfully';
                  this.submittedData = userValues;
                },
                (error) => {
                  console.error('Error adding user:', error);
                }
              );
            }
  
            this.clearForm();
          }
        },
        error => {
          console.error('Error checking for duplicate user:', error);
          this.successMessage = 'Error checking for duplicate user. Please try again.';
        }
      );
    }
  }
  

  clearForm(){
    this.userForm.reset();
  }

  onDelete() {
    alert("Are yor sure to delete the data");
    if (this.submittedData && this.submittedData.user) {
      const username = this.submittedData.user;
  
      this.userService.deleteUser(username).subscribe(
        (response) => {
          console.log('User deleted successfully:', response.message);
          this.successMessage = 'User deleted successfully';
          this.submittedData = null;
          this.clearForm();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
  onEdit() {
    this.editMode = true;
    this.userForm.setValue({
      user: this.submittedData.user,
      name: this.submittedData.name,
    });
  }
}
