
import { supabase } from './supabaseClient';

export const supabaseService = {
  // --- AUTH ---
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // --- PROFILES ---
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  // --- LEADS ---
  async getLeads(userId: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addLead(lead: any) {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead]);
    if (error) throw error;
    return data;
  },

  async updateLead(leadId: string, lead: any) {
    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', leadId);
    if (error) throw error;
    return data;
  },

  async deleteLead(leadId: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);
    if (error) throw error;
  },

  // --- SCHEDULE ---
  async getSchedule(userId: string) {
    const { data, error } = await supabase
      .from('schedule_items')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    if (error) throw error;
    return data;
  },

  async addScheduleItem(item: any) {
    const { data, error } = await supabase
      .from('schedule_items')
      .insert([item]);
    if (error) throw error;
    return data;
  },

  async updateScheduleItem(itemId: string, item: any) {
    const { data, error } = await supabase
      .from('schedule_items')
      .update(item)
      .eq('id', itemId);
    if (error) throw error;
    return data;
  },

  async deleteScheduleItem(itemId: string) {
    const { error } = await supabase
      .from('schedule_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;
  },

  // --- PROJECTS ---
  async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addProject(project: any) {
    console.log("Supabase insert project:", project);
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    if (error) {
      console.error("Error inserting project in Supabase:", error);
      throw error;
    }
    console.log("Project inserted successfully in Supabase:", data);
    return data;
  },

  async updateProject(projectId: string, project: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', projectId);
    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
  },

  // --- SWOT, SMART, CANVA ---
  async saveData(table: string, userId: string, data: any) {
    const { data: existing, error: fetchError } = await supabase
      .from(table)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (fetchError) throw fetchError;

    if (existing) {
      const { error } = await supabase
        .from(table)
        .update({ data })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from(table)
        .insert([{ user_id: userId, data }]);
      if (error) throw error;
    }
  },

  async getData(table: string, userId: string) {
    const { data, error } = await supabase
      .from(table)
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data?.data;
  }
};
