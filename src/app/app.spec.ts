import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@/auth/services/authService';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should return false without redirecting when the user has no token', (done) => {
    service.checkStatus().subscribe((result) => {
      expect(result).toBeFalse();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      done();
    });
  });
});
