import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Router } from 'express';
import { Observable } from 'rxjs';

import { UsuariosService } from './usuarios/services/usuarios.service';

@Injectable({
  providedIn: 'root'
})

export class CanActivateGuard implements CanActivate {

  constructor(private router: Router, private usuariosService: UsuariosService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuariosService.isLoggedIn(state.url)) {
      return true;
    }
    this.router.navigate(['login'])
    return false;
  }
}