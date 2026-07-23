import { supabase } from '../lib/supabase';
import { getAuthenticatedUserId } from '../lib/auth';
import { Inspection, Finding } from '../types';

export const db = {
  inspections: {
    list: async () => {
      const userId = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Inspection[];
    },

    create: async (inspection: Omit<Inspection, 'id' | 'created_at'>) => {
      const userId = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('inspections')
        .insert({ ...inspection, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data as Inspection;
    },

    update: async (id: string, updates: Partial<Inspection>) => {
      const userId = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data as Inspection;
    },

    delete: async (id: string) => {
      const userId = await getAuthenticatedUserId();
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
    },

    getById: async (id: string) => {
      const userId = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data as Inspection;
    },
  },

  findings: {
    listByInspection: async (inspectionId: string) => {
      await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('findings')
        .select('*')
        .eq('inspection_id', inspectionId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Finding[];
    },

    create: async (finding: Omit<Finding, 'id' | 'created_at'>) => {
      await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('findings')
        .insert(finding)
        .select()
        .single();
      if (error) throw error;
      return data as Finding;
    },

    update: async (id: string, updates: Partial<Finding>) => {
      await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('findings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Finding;
    },

    delete: async (id: string) => {
      await getAuthenticatedUserId();
      const { error } = await supabase
        .from('findings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    getById: async (id: string) => {
      await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from('findings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Finding;
    },
  },
};