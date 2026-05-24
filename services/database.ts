import { supabase } from '../lib/supabase';
import { Inspection, Finding } from '../types';

export const db = {
  inspections: {
    list: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Inspection[];
    },
    
    create: async (inspection: Omit<Inspection, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('inspections')
        .insert(inspection)
        .select()
        .single();
      if (error) throw error;
      return data as Inspection;
    },
    
    update: async (id: string, updates: Partial<Inspection>) => {
      const { data, error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Inspection;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },
  
  findings: {
    listByInspection: async (inspectionId: string) => {
      const { data, error } = await supabase
        .from('findings')
        .select('*')
        .eq('inspection_id', inspectionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Finding[];
    },
    
    create: async (finding: Omit<Finding, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('findings')
        .insert(finding)
        .select()
        .single();
      if (error) throw error;
      return data as Finding;
    },
    
    delete: async (id: string) => {
      const { error } = await supabase
        .from('findings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  }
};