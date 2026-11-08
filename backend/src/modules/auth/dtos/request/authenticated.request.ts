import type { Request } from 'express';
import type { JwtPayload } from '../../interfaces/index.js';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
