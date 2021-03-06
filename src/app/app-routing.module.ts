import { NgModule } from '@angular/core/';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { HomeComponent } from './components/home/home.component';
import { GameroomComponent } from './components/gameroom/gameroom.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'game/:id', component: GameroomComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }
]

@NgModule({
    declarations: [],
    providers: [AuthGuard, NotAuthGuard],
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }