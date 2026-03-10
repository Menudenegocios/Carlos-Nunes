import { firebaseService } from './services/firebaseService';

export const initUser = async () => {
  try {
    console.log("Initializing user creation...");
    await firebaseService.createMemberAsAdmin({
      businessName: 'Carlos Batida',
      email: 'carlosbatida@gmail.com',
      plan: 'freelancers', // Plano PRO
      points: 0,
      role: 'user'
    }, 'Diamante2020$');
    console.log("User Carlos Batida created/updated successfully.");
  } catch (error) {
    console.error("Error creating user Carlos Batida:", error);
  }
};
