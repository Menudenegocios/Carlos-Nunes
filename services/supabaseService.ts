
import { db, auth } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { firebaseService } from './firebaseService';
import { Profile } from '../types';

// Helper to map Firestore docs to objects
const mapDoc = (doc: any) => ({ id: doc.id, ...doc.data() });

export const supabaseService = {
  // --- AUTH ---
  async signUp(email: string, password: string, data?: any) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (data?.full_name) {
      await updateAuthProfile(user, { displayName: data.full_name });
    }
    return { user, error: null };
  },

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  },

  async signOut() {
    await signOut(auth);
    return { error: null };
  },

  async getUser() {
    return auth.currentUser;
  },

  // --- PROFILES ---
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Profile;
      }
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  },

  async updateProfile(userId: string, profile: any) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, profile);
      return { data: profile, error: null };
    } catch (error) {
      // If document doesn't exist, create it (upsert-like behavior for profile update)
      try {
         const docRef = doc(db, 'users', userId);
         await setDoc(docRef, profile, { merge: true });
         return { data: profile, error: null };
      } catch (e) {
          console.error("Error updating profile:", error);
          throw error;
      }
    }
  },

  async upgradePlan(userId: string, plan: string) {
    return this.updateProfile(userId, { plan });
  },

  // --- LEADS ---
  async getLeads(userId: string) {
    const leads = await firebaseService.getLeads(userId);
    return leads;
  },

  async addLead(lead: any) {
    return firebaseService.addLead(lead);
  },

  async updateLead(leadId: string, lead: any) {
    return firebaseService.updateLead(leadId, lead);
  },

  async updateLeadStage(leadId: string, stage: string) {
    return firebaseService.updateLead(leadId, { stage } as any);
  },

  async deleteLead(leadId: string) {
    return firebaseService.deleteLead(leadId);
  },

  // --- CLIENTS ---
  async getClients(userId: string) {
    return firebaseService.getClients(userId);
  },

  async createClient(client: any) {
    return firebaseService.addClient(client);
  },

  async updateClient(clientId: string, client: any) {
    return firebaseService.updateClient(clientId, client);
  },

  async deleteClient(clientId: string) {
    return firebaseService.deleteClient(clientId);
  },

  // --- CRM TASKS ---
  async getCRMTasks(userId: string) {
    return firebaseService.getTasks(userId);
  },

  async createCRMTask(task: any) {
    return firebaseService.addTask(task);
  },

  async updateCRMTask(taskId: string, task: any) {
    return firebaseService.updateTask(taskId, task);
  },

  async deleteCRMTask(taskId: string) {
    return firebaseService.deleteTask(taskId);
  },

  // --- QUICK MESSAGES ---
  async getQuickMessages(userId: string) {
    return firebaseService.getQuickMessages(userId);
  },

  async createQuickMessage(message: any) {
    return firebaseService.addQuickMessage(message);
  },

  async updateQuickMessage(messageId: string, message: any) {
    return firebaseService.updateQuickMessage(messageId, message);
  },

  async deleteQuickMessage(messageId: string) {
    return firebaseService.deleteQuickMessage(messageId);
  },

  // --- FINANCIAL ENTRIES ---
  async getFinancialEntries(userId: string) {
    return firebaseService.getFinancialEntries(userId);
  },

  async createFinancialEntry(entry: any) {
    return firebaseService.addFinancialEntry(entry);
  },

  async deleteFinancialEntry(entryId: string) {
    return firebaseService.deleteFinancialEntry(entryId);
  },

  // --- SCHEDULE ---
  async getSchedule(userId: string) {
    return firebaseService.getSchedule(userId);
  },

  async addScheduleItem(item: any) {
    return firebaseService.addScheduleItem(item);
  },

  async updateScheduleItem(itemId: string, item: any) {
    // firebaseService doesn't have updateScheduleItem yet, implementing here
    const docRef = doc(db, 'schedule_items', itemId);
    await updateDoc(docRef, item);
  },

  async deleteScheduleItem(itemId: string) {
    return firebaseService.deleteScheduleItem(itemId);
  },

  // --- PROJETOS ---
  async getProjects(userId: string) {
    return firebaseService.getProjects(userId);
  },

  async createProject(project: any) {
    return firebaseService.addProject(project);
  },

  async updateProject(projectId: string, project: any) {
    return firebaseService.updateProject(projectId, project);
  },

  async deleteProject(projectId: string) {
    return firebaseService.deleteProject(projectId);
  },

  // --- EVENTS ---
  async getEvents() {
    try {
      const q = query(collection(db, 'platform_events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  },

  async createEvent(event: any) {
    const docRef = await addDoc(collection(db, 'platform_events'), event);
    return { id: docRef.id, ...event };
  },

  async updateEvent(eventId: string, event: any) {
    const docRef = doc(db, 'platform_events', eventId);
    await updateDoc(docRef, event);
  },

  async deleteEvent(eventId: string) {
    await deleteDoc(doc(db, 'platform_events', eventId));
  },

  // --- OFFERS ---
  async getOffers() {
    try {
      const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      console.error("Error getting offers:", error);
      return [];
    }
  },

  async createOffer(offer: any) {
    const docRef = await addDoc(collection(db, 'offers'), offer);
    return { id: docRef.id, ...offer };
  },

  async updateOffer(offerId: string, offer: any) {
    const docRef = doc(db, 'offers', offerId);
    await updateDoc(docRef, offer);
  },

  async deleteOffer(offerId: string) {
    await deleteDoc(doc(db, 'offers', offerId));
  },

  // --- PRODUTOS ---
  async getProducts(userId: string) {
    try {
      const q = query(collection(db, 'products'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  },

  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  },

  async createProduct(product: any) {
    const docRef = await addDoc(collection(db, 'products'), product);
    return { id: docRef.id, ...product };
  },

  async updateProduct(productId: string, product: any) {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, product);
  },

  async deleteProduct(productId: string) {
    await deleteDoc(doc(db, 'products', productId));
  },

  // --- CUPONS ---
  async getCoupons(userId: string) {
    // firebaseService didn't show coupons in the previous view either.
    try {
      const q = query(collection(db, 'coupons'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      console.error("Error getting coupons:", error);
      return [];
    }
  },

  async createCoupon(coupon: any) {
    const docRef = await addDoc(collection(db, 'coupons'), coupon);
    return { id: docRef.id, ...coupon };
  },

  async updateCoupon(couponId: string, coupon: any) {
    const docRef = doc(db, 'coupons', couponId);
    await updateDoc(docRef, coupon);
  },

  async deleteCoupon(couponId: string) {
    await deleteDoc(doc(db, 'coupons', couponId));
  },

  // --- PERFIS ---
  async getAllProfiles() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(mapDoc);
  },

  async getPublishedProfiles() {
    const q = query(collection(db, 'users'), where('isPublished', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: doc.id, // In Firestore users collection, doc.id IS the userId
        slug: data.slug,
        businessName: data.businessName,
        category: data.category,
        phone: data.phone,
        logoUrl: data.logoUrl,
        vitrineCategory: data.vitrineCategory,
        isPublished: data.isPublished,
        storeConfig: data.storeConfig
      };
    });
  },

  // --- BLOG ---
  async getBlogPosts() {
    try {
      const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      // If collection doesn't exist or error, return empty
      return [];
    }
  },

  // --- SWOT, SMART, CANVA ---
  async saveData(table: string, userId: string, data: any) {
    // This generic method is used by some components.
    // I'll implement generic logic here.
    const q = query(collection(db, table), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, table, docId), { data });
    } else {
      await addDoc(collection(db, table), { userId, data, createdAt: new Date().toISOString() });
    }
  },

  async getData(table: string, userId: string) {
    const q = query(collection(db, table), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().data;
    }
    return null;
  },

  // --- LOYALTY ---
  async getLoyaltyCards(userId: string) {
    try {
      const q = query(collection(db, 'loyalty_cards'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      return [];
    }
  },

  async stampLoyaltyCard(cardId: string) {
    const docRef = doc(db, 'loyalty_cards', cardId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentStamps = data.currentStamps || data.current_stamps || 0;
      const updatedData = { ...data, currentStamps: currentStamps + 1 };
      await updateDoc(docRef, { currentStamps: currentStamps + 1 });
      return { id: docSnap.id, ...updatedData } as any;
    }
    throw new Error('Card not found');
  },

  // --- QUOTES ---
  async getQuotes() {
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      return [];
    }
  },

  // --- NETWORKING ---
  async getNetworkingProfiles() {
    try {
      const querySnapshot = await getDocs(collection(db, 'networking_profiles'));
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      return [];
    }
  },

  async createNetworkingProfile(profile: any) {
    const docRef = await addDoc(collection(db, 'networking_profiles'), profile);
    return { id: docRef.id, ...profile };
  },

  async deleteNetworkingProfile(id: string) {
    await deleteDoc(doc(db, 'networking_profiles', id));
  },

  // --- POINTS HISTORY ---
  async getPointsHistory(userId: string) {
    try {
      const q = query(collection(db, 'points_history'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapDoc);
    } catch (error) {
      return [];
    }
  },

  // --- STORAGE ---
  async uploadImage(file: File, bucket: string = 'images') {
    // Mock implementation for now to avoid errors
    console.warn("Upload de imagem simulado (Firebase Storage não configurado)");
    return `https://picsum.photos/seed/${file.name}/300/300`;
  }
};
