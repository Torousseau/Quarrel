import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => (AuthGuard as unknown as CanActivateFn)(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = {} as RouterStateSnapshot;
    const result = executeGuard(dummyRoute, dummyState);
    expect(result).toBeDefined(); // ou true/false selon le comportement attendu
  });
});
