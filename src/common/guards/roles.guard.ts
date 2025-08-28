import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RolesIDs } from '../types';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let hasAccess = false;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRolesIds = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (isPublic) {
      hasAccess = true;
    } else {
      if ([RolesIDs.ADMIN, RolesIDs.DEVELOPER].includes(user.roleId) || !requiredRolesIds) {
        hasAccess = true;
      } else {
        hasAccess = requiredRolesIds.some((roleId) => user.roleId === roleId);
      }
    }

    return hasAccess;
  }
}
