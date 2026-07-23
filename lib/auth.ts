import { supabase } from './supabase';

export const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error('Usuário não autenticado.');
  return session.user.id;
};