
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const url = req.url.toLowerCase();

  const isAuthRequest =
    url.includes('/user/login') ||
    url.includes('/user/register');

  if (isAuthRequest) {
    return next(req);
  }

  const token = sessionStorage.getItem('accesstoken');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
