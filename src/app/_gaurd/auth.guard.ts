import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router=inject(Router) 
  const isToken= typeof window != 'undefined' && localStorage.getItem("token");
  if(!isToken){
    _router.navigateByUrl('/');
    return false;
  }

  return true;
};
