import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MoviesService } from '../../_services/movies/movies.service';

declare var bootstrap: any;
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.css'
})
export class StarterComponent {
  //global_DI
  private _toastr = inject(ToastrService);
  private _moviesService = inject(MoviesService);

  //global var
  allMovies: any[] = [];
  user_id: string | number = '';
  isAdded: boolean = false;
  model_type: string = 'Add';

  //form
  addMoviesForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    type: new FormControl(null, [Validators.required]),
    director: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    budget: new FormControl('', [Validators.required, Validators.min(0)]),
    location: new FormControl('', [Validators.maxLength(100)]),
    duration: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    year_or_time: new FormControl('', [Validators.maxLength(50)]),
    description: new FormControl('', [Validators.maxLength(1000)]),
    image_url: new FormControl('', []),
    user_id: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      const data = JSON.parse(userData);
      this.user_id = data.id;
      // this.addMoviesForm.patchValue({ user_id: data.id });
      this.getAllMovies();
    }
  }

  get f() {
    return this.addMoviesForm.controls;
  }


  AddMoviesModel: any;
  deleteModel: any;
  ngAfterViewInit() {
    //for_add_edit_model
    const modalElement = new bootstrap.Modal(document.getElementById('addMovieModal'));
    if (modalElement) {
      this.AddMoviesModel = modalElement
    }

    //for_delete_model
    const deleteModelElem = new bootstrap.Modal(document.getElementById('deleteModel'));
    if (deleteModelElem) {
      this.deleteModel = deleteModelElem
    }


  }

  openModal() {
    this.model_type = 'Add';
    this.addMoviesForm.reset();
    this.AddMoviesModel?.show();
    this.addMoviesForm.patchValue({ user_id: this.user_id })
  }

  closeModel() {
    this.addMoviesForm.reset();
    this.AddMoviesModel.hide();
  }

  handleAddMovies() {

    if (this.addMoviesForm.invalid) {
      this.addMoviesForm.markAllAsTouched();
      this._toastr.error("Please fill all required fields.", "Validation Errors!");
      return;
    }

    if (this.addMoviesForm.valid) {
      // console.log("working");
      this.addMoviesFun(this.addMoviesForm.value);
    }
  }

  imageFile: File | null = null;
  imageError: boolean = false;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = true;
        this.imageFile = null;
      } else {
        this.imageError = false;
        this.imageFile = file;

        this.addMoviesForm.patchValue({
          image_url: file.name
        });
      }
    }
  }

  addMoviesFun(data: any) {
    this.isAdded = true;
    this._moviesService.addMovies(data).subscribe((res) => {
      if (res.success && res.message) {
        this._toastr.success(res.message, "Suceess");
        this.getAllMovies()
        this.addMoviesForm.reset();
        this.addMoviesForm.patchValue({ user_id: this.user_id });
        this.AddMoviesModel.hide();
        this.isAdded = false;
      } else {
        this._toastr.error(res.message || "Something went wront on backend.", "Error!")
        this.isAdded = false;
      }
    },
      (err) => {
        this._toastr.error(err.error.message, "Error!");
        this.isAdded = false;
      }
    )
  }

  getAllMovies() {
    const data = {
      "user_id": this.user_id || 'N/A'
    }
    this._moviesService.getAllMovies(data).subscribe((res) => {
      if (res.success && res.message) {
        this.allMovies = res.data;
      } else {
        this._toastr.error(res.message || "Something went wront on backend.", "Error!")
      }
    },
      (err) => {
        this._toastr.error(err.error.message, "Error!");
      }
    )
  }
  editId: any = '';
  editMovieHandler(data: any) {
    this.model_type = 'Edit';
    if (!data) {
      this._toastr.error("Something went wront data not founded.", "Error!")
      return
    }
    this.editId = data.id;
    this.addMoviesForm.patchValue({
      title: data.title || "",
      type: data.type || "",
      director: data.director || "",
      budget: data.budget || "",
      location: data.location || "",
      duration: data.duration || "",
      year_or_time: data.year_or_time || "",
      description: data.description || "",
      image_url: data.image_url || "",
      user_id: data.user_id || "",
    })

    this.AddMoviesModel.show();

  }

  isEdited: boolean = false;
  handleEditMoviesBTN() {
    this.isEdited = true;
    const data = {
      ...this.addMoviesForm.value,
      id: this.editId
    }
    this._moviesService.editMovie(data).subscribe((res) => {
      if (res.success && res.message) {
        this._toastr.success(res.message, "Success");
        this.getAllMovies();
        this.isEdited = false;
        this.AddMoviesModel.hide();
        this.AddMoviesModel.reset();
      } else {
        this._toastr.error(res.message || "Something went wront on backend.", "Error!")
        this.isEdited = false;
      }
    },
      (err) => {
        this._toastr.error(err.error.message, "Error!");
        this.isEdited = false;
      }
    )
  }

  deleteMovieId: string | number = '';
  deleteMovieHandler(data: any) {
    this.deleteMovieId = data.id;
    this.deleteModel.show();
  }

  isDeleted:boolean=false;
  handleDeleteYesBTN() {
    this.isDeleted=true;
    const data = {
      id: this.deleteMovieId
    };

    this._moviesService.deleteMovie(data).subscribe(
      (res) => {
        if (res.success && res.message) {
          this._toastr.success(res.message, "Success");
          this.getAllMovies();
          this.isDeleted = false;
          this.deleteModel.hide();
        } else {
          this._toastr.error(res.message || "Something went wront on backend.", "Error!")
          this.isDeleted = false;
        }
      },
      (err) => {
        this._toastr.error(err.error.message, "Error!");
          this.isDeleted = false;
      }
    )
  }
}
