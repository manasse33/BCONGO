import type { Role, User } from '@/types';

export type AppRole = 'reader' | 'auteur' | 'editeur' | 'admin' | 'superadmin';

const ROLE_ID_MAP: Record<number, AppRole> = {
  1: 'reader',
  2: 'auteur',
  3: 'editeur',
  4: 'admin',
  5: 'superadmin',
};

const normalizeRoleName = (value: string): AppRole | null => {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (['reader', 'lecteur', 'user', 'utilisateur'].includes(normalized)) {
    return 'reader';
  }

  if (['auteur', 'author'].includes(normalized)) {
    return 'auteur';
  }

  if (['editeur', 'editeur(trice)', 'editor', 'publisher'].includes(normalized)) {
    return 'editeur';
  }

  if (['administrateur', 'admin', 'administrator'].includes(normalized)) {
    return 'admin';
  }

  if (['superadmin', 'super admin', 'super_admin', 'super-admin', 'super administrator'].includes(normalized)) {
    return 'superadmin';
  }

  return null;
};

const extractRoleName = (role: Role | string | null | undefined): AppRole | null => {
  if (!role) {
    return null;
  }

  if (typeof role === 'string') {
    return normalizeRoleName(role);
  }

  if (typeof role.name === 'string') {
    return normalizeRoleName(role.name);
  }

  if (typeof role.label === 'string') {
    return normalizeRoleName(role.label);
  }

  return null;
};

export const getUserRoles = (user: User | null): AppRole[] => {
  if (!user) {
    return [];
  }

  const roles = new Set<AppRole>();

  const primaryRole = extractRoleName(user.role ?? user.role_name);
  if (primaryRole) {
    roles.add(primaryRole);
  }

  if (Array.isArray(user.roles)) {
    user.roles
      .map((role) => extractRoleName(role))
      .filter((role): role is AppRole => role !== null)
      .forEach((role) => roles.add(role));
  }

  // Fallback to role_id mapping when textual role is not available.
  if (roles.size === 0 && typeof user.role_id === 'number' && ROLE_ID_MAP[user.role_id]) {
    roles.add(ROLE_ID_MAP[user.role_id]);
  }

  if (roles.size === 0) {
    roles.add('reader');
  }

  return [...roles];
};

export const hasAnyRole = (user: User | null, expectedRoles: AppRole[]): boolean => {
  const userRoles = getUserRoles(user);
  return expectedRoles.some((role) => userRoles.includes(role));
};

export const canAccessAuthorSpace = (user: User | null): boolean =>
  hasAnyRole(user, ['auteur', 'admin', 'superadmin']);

export const canAccessAdminSpace = (user: User | null): boolean =>
  hasAnyRole(user, ['admin', 'superadmin']);
