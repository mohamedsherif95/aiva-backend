import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (rolesIds: number[]) => SetMetadata(ROLES_KEY, rolesIds);
