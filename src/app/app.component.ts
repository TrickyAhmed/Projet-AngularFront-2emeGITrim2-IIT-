import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) { }
  title = 'DoctorAngularFront';
 


  shouldDisplayRouterOutlet(): boolean {
    // Get the current route
    const currentRoute = this.router.url;

    // Define routes where you don't want to display the router outlet
    const excludedRoutes = ['/login', '/']; // Add more if needed

    // Check if the current route is in the excluded routes list
    const shouldDisplay = !excludedRoutes.includes(currentRoute);

    return shouldDisplay;
  }
}
