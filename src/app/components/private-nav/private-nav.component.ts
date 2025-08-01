import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private-nav',
  standalone: true,
  imports: [RouterLink,RouterOutlet,RouterLinkActive],
  templateUrl: './private-nav.component.html',
  styleUrl: './private-nav.component.css'
})
export class PrivateNavComponent {

  private _router =inject(Router);

  handleLogout(){
    localStorage.clear();
    this._router.navigate(['/'])
  }
}
