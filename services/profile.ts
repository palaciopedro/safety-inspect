import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const BUCKET = 'company-logos';

const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error('Usuário não autenticado.');
  return session.user.id;
};

const getLogoPath = (userId: string) => `${userId}/logo.jpg`;

export const profileService = {
  get: async (): Promise<Profile> => {
    const userId = await getAuthenticatedUserId();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  update: async (updates: Partial<Pick<Profile, 'first_name' | 'last_name' | 'company_name' | 'company_logo_path'>>): Promise<Profile> => {
    const userId = await getAuthenticatedUserId();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  pickLogo: async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return null;
    return result.assets[0];
  },

  uploadLogo: async (asset: ImagePicker.ImagePickerAsset): Promise<string> => {
    const userId = await getAuthenticatedUserId();
    const path = getLogoPath(userId);

    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, fileData, {
        contentType: 'image/jpeg',
        upsert: true, 
      });

    if (error) throw error;
    return path;
  },

  getLogoUrl: async (path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600); 
    if (error) throw error;
    return data.signedUrl;
  },
};