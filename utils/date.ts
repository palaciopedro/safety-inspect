import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const ctx = useAuthContext();

  const displayName = [ctx.profile?.first_name, ctx.profile?.last_name]
    .filter(Boolean)
    .join(' ') || ctx.user?.email || '';

  const isAuthenticated = !!ctx.session;

  return {
    ...ctx,
    displayName,
    isAuthenticated,
  };
};