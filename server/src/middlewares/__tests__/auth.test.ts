import { Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../auth';
import { generateToken } from '../../utils/jwt';
import { Role } from '../../models/User';

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('requireAuth', () => {
  it('rejects a request with no cookie', () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an invalid token', () => {
    const req = { headers: { cookie: 'token=not-a-real-jwt' } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts a valid token and attaches req.user', () => {
    const token = generateToken('user123', Role.BORROWER);
    const req = { headers: { cookie: `token=${token}` } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'user123', role: Role.BORROWER });
  });

  it('finds the token cookie among several cookies', () => {
    const token = generateToken('user456', Role.ADMIN);
    const req = { headers: { cookie: `theme=dark; token=${token}; lang=en` } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user?.id).toBe('user456');
  });
});

describe('requireRole', () => {
  it('rejects when req.user is missing', () => {
    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireRole([Role.ADMIN])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows a role that is in the list', () => {
    const req = { user: { id: '1', role: Role.SANCTION } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireRole([Role.ADMIN, Role.SANCTION])(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('rejects with 403 a role that is not in the list', () => {
    const req = { user: { id: '1', role: Role.BORROWER } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireRole([Role.ADMIN, Role.SANCTION])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('does not implicitly let ADMIN through a list that excludes it', () => {
    // requireRole trusts the route's own list; each staff route lists ADMIN explicitly
    const req = { user: { id: '1', role: Role.ADMIN } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    requireRole([Role.BORROWER])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
