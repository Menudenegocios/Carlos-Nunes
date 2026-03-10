import { supabaseService } from './services/supabaseService';

export const initUser = async () => {
  try {
    console.log("Initializing user creation...");
    await supabaseService.createMemberAsAdmin({
      businessName: 'Carlos Batida',
      email: 'carlosbatida@gmail.com',
      plan: 'freelancers', // Plano PRO
      points: 0,
      role: 'user'
    });
    console.log("User Carlos Batida created/updated successfully.");
  } catch (error) {
    console.error("Error creating user Carlos Batida:", error);
  }
};
