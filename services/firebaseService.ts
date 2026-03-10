import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, secondaryAuth, storage } from '../firebase';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  Project, 
  Lead, 
  Client, 
  CRMTask, 
  QuickMessageTemplate, 
  FinancialEntry, 
  ScheduleItem, 
  Product, 
  StoreCategory, 
  Coupon,
  PlatformEvent,
  SWOTAnalysis,
  SMARTGoal,
  BusinessCanva,
  Profile,
  BlogPost,
  B2BOffer,
  B2BTransaction,
  CommunityPost,
  VitrineComment,
  Offer,
  Media
} from '../types';

const isMockUser = (userId: string) => {
  return !userId || 
         userId === 'de30de30-0000-4000-a000-000000000000' || 
         userId === 'carlos-batida-123' || 
         userId === 'admin-123' || 
         userId.startsWith('mock_');
};

export const firebaseService = {
  // --- MEDIA ---
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  getMedia: async (): Promise<Media[]> => {
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Media));
    } catch (error) {
      console.error("Error getting media:", error);
      return [];
    }
  },

  createMedia: async (mediaData: Omit<Media, 'id' | 'createdAt'>): Promise<Media> => {
    try {
      const docRef = await addDoc(collection(db, 'media'), {
        ...mediaData,
        createdAt: Date.now()
      });
      return { id: docRef.id, ...mediaData, createdAt: Date.now() } as Media;
    } catch (error) {
      console.error("Error creating media:", error);
      throw error;
    }
  },

  updateMedia: async (id: string, mediaData: Partial<Media>): Promise<void> => {
    try {
      const docRef = doc(db, 'media', id);
      await updateDoc(docRef, mediaData);
    } catch (error) {
      console.error("Error updating media:", error);
      throw error;
    }
  },

  deleteMedia: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'media', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  },

  // --- LOYALTY ---
  getLoyaltyCards: async (userId: string): Promise<any[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'loyalty_cards'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting loyalty cards:", error);
      return [];
    }
  },

  stampLoyaltyCard: async (id: string): Promise<any> => {
    try {
      const docRef = doc(db, 'loyalty_cards', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newStamps = (data.stamps || 0) + 1;
        await updateDoc(docRef, { stamps: newStamps, updatedAt: serverTimestamp() });
        return { id, ...data, stamps: newStamps };
      }
      return null;
    } catch (error) {
      console.error("Error stamping loyalty card:", error);
      throw error;
    }
  },

  // --- PLANS ---
  upgradePlan: async (userId: string, plan: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { plan, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error upgrading plan:", error);
      throw error;
    }
  },

  // --- POINTS ---
  getPointsHistory: async (userId: string): Promise<any[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'points_history'), where('userId', '==', userId), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting points history:", error);
      return [];
    }
  },

  // --- QUOTES ---
  getQuotes: async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting quotes:", error);
      return [];
    }
  },

  // --- NETWORKING ---
  getNetworkingProfiles: async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'networking_profiles'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting networking profiles:", error);
      return [];
    }
  },

  createNetworkingProfile: async (profile: any): Promise<any> => {
    try {
      const docRef = await addDoc(collection(db, 'networking_profiles'), { ...profile, createdAt: serverTimestamp() });
      return { id: docRef.id, ...profile };
    } catch (error) {
      console.error("Error creating networking profile:", error);
      throw error;
    }
  },

  deleteNetworkingProfile: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'networking_profiles', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting networking profile:", error);
      throw error;
    }
  },
  getEvents: async (): Promise<PlatformEvent[]> => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlatformEvent));
    } catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  },

  createEvent: async (event: Omit<PlatformEvent, 'id'>): Promise<PlatformEvent> => {
    try {
      const docRef = await addDoc(collection(db, 'events'), event);
      return { id: docRef.id, ...event };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  updateEvent: async (id: string, event: Partial<PlatformEvent>): Promise<void> => {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, event);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'events', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // --- MARKETPLACE ---
  getAllProducts: async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  },

  getOffers: async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting offers:", error);
      return [];
    }
  },

  createProduct: async (product: any): Promise<void> => {
    try {
      await addDoc(collection(db, 'products'), { ...product, createdAt: serverTimestamp() });
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, product: any): Promise<void> => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, product);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  createOffer: async (offer: any): Promise<any> => {
    try {
      const docRef = await addDoc(collection(db, 'offers'), { ...offer, createdAt: serverTimestamp() });
      return { id: docRef.id, ...offer };
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  },

  updateOffer: async (id: string, offer: any): Promise<void> => {
    try {
      const docRef = doc(db, 'offers', id);
      await updateDoc(docRef, offer);
    } catch (error) {
      console.error("Error updating offer:", error);
      throw error;
    }
  },

  deleteOffer: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'offers', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting offer:", error);
      throw error;
    }
  },

  getMyOffers: async (userId: string): Promise<Offer[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'offers'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
    } catch (error) {
      console.error("Error getting my offers:", error);
      return [];
    }
  },

  getProducts: async (userId: string): Promise<Product[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'products'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  },

  getCoupons: async (): Promise<Coupon[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
    } catch (error) {
      console.error("Error getting coupons:", error);
      return [];
    }
  },

  createCoupon: async (coupon: Omit<Coupon, 'id' | 'createdAt'> & { offerId: string }): Promise<Coupon> => {
    try {
      const data = { ...coupon, createdAt: Date.now() };
      const docRef = await addDoc(collection(db, 'coupons'), data);
      return { id: docRef.id, ...data } as Coupon;
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw error;
    }
  },

  updateCoupon: async (id: string, userId: string, coupon: Partial<Coupon>): Promise<void> => {
    try {
      const docRef = doc(db, 'coupons', id);
      await updateDoc(docRef, coupon);
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  },

  deleteCoupon: async (id: string, userId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'coupons', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      throw error;
    }
  },

  updateBlogPost: async (id: string, post: Partial<BlogPost>): Promise<void> => {
    try {
      const docRef = doc(db, 'blog_posts', id);
      await updateDoc(docRef, post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'blog_posts', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  },

  redeemCoupon: async (userId: string, couponId: string, points: number): Promise<void> => {
    try {
      // 1. Add points to user
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentPoints = userSnap.data().points || 0;
        await updateDoc(userRef, { points: currentPoints + points });
      }

      // 2. Add to points history
      await addDoc(collection(db, 'points_history'), {
        userId,
        points,
        description: `Cupom resgatado: ${couponId}`,
        date: new Date().toISOString(),
        category: 'engajamento'
      });
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      throw error;
    }
  },
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const q = query(collection(db, 'blog_posts'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      console.error("Error getting blog posts:", error);
      return [];
    }
  },

  addBlogPost: async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    try {
      const docRef = await addDoc(collection(db, 'blog_posts'), post);
      return { id: docRef.id, ...post };
    } catch (error) {
      console.error("Error adding blog post:", error);
      throw error;
    }
  },

  // --- PROFILE ---
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
    } catch (error) {
      console.error("Error getting all profiles:", error);
      return [];
    }
  },

  getPublishedProfiles: async (): Promise<Profile[]> => {
    try {
      const q = query(collection(db, 'users'), where('isPublished', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
    } catch (error) {
      console.error("Error getting published profiles:", error);
      return [];
    }
  },
  getProfile: async (identifier: string): Promise<Profile | null> => {
    try {
      // Try by ID first
      const docRef = doc(db, 'users', identifier);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Profile;
      }
      
      // Try by slug
      const q = query(collection(db, 'users'), where('slug', '==', identifier));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Profile;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  },

  createMemberAsAdmin: async (memberData: any, password?: string): Promise<string> => {
    try {
      const email = memberData.email.toLowerCase();
      console.log("Creating/Updating member:", email);
      
      // Check if user already exists in Firestore by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      let newUserId: string;
      
      if (!querySnapshot.empty) {
        console.log("User found in Firestore:", querySnapshot.docs[0].id);
        newUserId = querySnapshot.docs[0].id;
      } else {
        console.log("User not found in Firestore, creating in Auth...");
        try {
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password || '123456');
          newUserId = userCredential.user.uid;
          console.log("User created in Auth:", newUserId);
          await signOut(secondaryAuth);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            console.log("User exists in Auth. Trying to sign in to get UID...");
            try {
              // Tentativa de login com a senha fornecida para recuperar o UID
              const userCredential = await signInWithEmailAndPassword(secondaryAuth, email, password || '123456');
              newUserId = userCredential.user.uid;
              console.log("User signed in successfully. UID:", newUserId);
              await signOut(secondaryAuth);
            } catch (signInError: any) {
              console.error("Error signing in existing user:", signInError);
              throw new Error("Este e-mail já está cadastrado no sistema de autenticação. Para criar o perfil, a senha fornecida deve corresponder à senha atual do usuário, ou o usuário deve fazer login primeiro.");
            }
          } else {
            throw authError;
          }
        }
      }

      // Now create/update the profile document in Firestore
      const { setDoc } = await import('firebase/firestore');
      console.log("Creating/Updating Firestore document for UID:", newUserId);
      await setDoc(doc(db, 'users', newUserId), {
        ...memberData,
        email: email,
        userId: newUserId,
        createdAt: serverTimestamp(),
        points: memberData.points || 0,
        role: memberData.role || 'user',
        plan: memberData.plan || 'profissionais'
      }, { merge: true });
      console.log("Firestore document created/updated successfully.");
      return newUserId;
    } catch (error: any) {
      console.error("Error creating member as admin:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    }
  },

  updateProfile: async (userId: string, profile: Partial<Profile>): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { ...profile, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  saveProfile: async (userId: string, profile: Partial<Profile>): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId);
      const { id, ...profileData } = profile;
      await updateDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }).catch(async (err) => {
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(docRef, { ...profileData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        } else {
          throw err;
        }
      });
    } catch (error) {
       try {
         const { setDoc } = await import('firebase/firestore');
         const docRef = doc(db, 'users', userId);
         const { id, ...profileData } = profile;
         await setDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
       } catch (innerError) {
         console.error("Error saving profile:", innerError);
         throw innerError;
       }
    }
  },
  // --- PROJECTS ---
  getProjects: async (userId: string): Promise<Project[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'projects'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error("Error getting projects:", error);
      return [];
    }
  },

  addProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...project,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...project, createdAt: new Date().toISOString() };
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<void> => {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, project);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  // --- LEADS ---
  getLeads: async (userId: string): Promise<Lead[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'leads'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
    } catch (error) {
      console.error("Error getting leads:", error);
      return [];
    }
  },

  addLead: async (lead: Omit<Lead, 'id'>): Promise<Lead> => {
    try {
      const docRef = await addDoc(collection(db, 'leads'), {
        ...lead,
        createdAt: Date.now()
      });
      return { id: docRef.id, ...lead, createdAt: Date.now() };
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  },

  updateLead: async (id: string, lead: Partial<Lead>): Promise<void> => {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  },

  deleteLead: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  },

  // --- CLIENTS ---
  getClients: async (userId: string): Promise<Client[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'clients'), where('userId', '==', userId), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    } catch (error) {
      console.error("Error getting clients:", error);
      return [];
    }
  },

  addClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        ...client,
        createdAt: Date.now()
      });
      return { id: docRef.id, ...client, createdAt: Date.now() };
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  },

  updateClient: async (id: string, client: Partial<Client>): Promise<void> => {
    try {
      const docRef = doc(db, 'clients', id);
      await updateDoc(docRef, client);
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  },

  // --- TASKS ---
  getTasks: async (userId: string): Promise<CRMTask[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', userId), orderBy('dueDate', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CRMTask));
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  },

  addTask: async (task: Omit<CRMTask, 'id' | 'createdAt'>): Promise<CRMTask> => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: Date.now()
      });
      return { id: docRef.id, ...task, createdAt: Date.now() };
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },

  updateTask: async (id: string, task: Partial<CRMTask>): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, task);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // --- QUICK MESSAGES ---
  getQuickMessages: async (userId: string): Promise<QuickMessageTemplate[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'quick_messages'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuickMessageTemplate));
    } catch (error) {
      console.error("Error getting quick messages:", error);
      return [];
    }
  },

  addQuickMessage: async (message: Omit<QuickMessageTemplate, 'id'>): Promise<QuickMessageTemplate> => {
    try {
      const docRef = await addDoc(collection(db, 'quick_messages'), message);
      return { id: docRef.id, ...message };
    } catch (error) {
      console.error("Error adding quick message:", error);
      throw error;
    }
  },

  updateQuickMessage: async (id: string, message: Partial<QuickMessageTemplate>): Promise<void> => {
    try {
      const docRef = doc(db, 'quick_messages', id);
      await updateDoc(docRef, message);
    } catch (error) {
      console.error("Error updating quick message:", error);
      throw error;
    }
  },

  deleteQuickMessage: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'quick_messages', id));
    } catch (error) {
      console.error("Error deleting quick message:", error);
      throw error;
    }
  },

  // --- FINANCIAL ENTRIES ---
  getFinancialEntries: async (userId: string): Promise<FinancialEntry[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'financial_entries'), where('userId', '==', userId), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinancialEntry));
    } catch (error) {
      console.error("Error getting financial entries:", error);
      return [];
    }
  },

  addFinancialEntry: async (entry: Omit<FinancialEntry, 'id'>): Promise<FinancialEntry> => {
    try {
      const docRef = await addDoc(collection(db, 'financial_entries'), entry);
      return { id: docRef.id, ...entry };
    } catch (error) {
      console.error("Error adding financial entry:", error);
      throw error;
    }
  },

  updateFinancialEntry: async (id: string, entry: Partial<FinancialEntry>): Promise<void> => {
    try {
      const docRef = doc(db, 'financial_entries', id);
      await updateDoc(docRef, entry);
    } catch (error) {
      console.error("Error updating financial entry:", error);
      throw error;
    }
  },

  deleteFinancialEntry: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'financial_entries', id));
    } catch (error) {
      console.error("Error deleting financial entry:", error);
      throw error;
    }
  },

  // --- SMART GOALS ---
  getSmartGoals: async (userId: string): Promise<SMARTGoal[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'smart_goals'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SMARTGoal));
    } catch (error) {
      console.error("Error getting SMART goals:", error);
      return [];
    }
  },

  saveSmartGoal: async (userId: string, data: any): Promise<void> => {
    try {
      // Check if exists
      const q = query(collection(db, 'smart_goals'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'smart_goals', docId), data);
      } else {
        await addDoc(collection(db, 'smart_goals'), { userId, ...data, createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Error saving SMART goal:", error);
      throw error;
    }
  },

  // --- SWOT ANALYSIS ---
  getSwotAnalysis: async (userId: string): Promise<SWOTAnalysis | null> => {
    if (isMockUser(userId)) return null;
    try {
      const q = query(collection(db, 'swot_analysis'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as SWOTAnalysis;
      }
      return null;
    } catch (error) {
      console.error("Error getting SWOT analysis:", error);
      return null;
    }
  },

  saveSwotAnalysis: async (userId: string, data: any): Promise<void> => {
    try {
      const q = query(collection(db, 'swot_analysis'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'swot_analysis', docId), data);
      } else {
        await addDoc(collection(db, 'swot_analysis'), { userId, ...data, createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Error saving SWOT analysis:", error);
      throw error;
    }
  },

  // --- BUSINESS CANVA ---
  getBusinessCanva: async (userId: string): Promise<BusinessCanva | null> => {
    if (isMockUser(userId)) return null;
    try {
      const q = query(collection(db, 'business_canva'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as BusinessCanva;
      }
      return null;
    } catch (error) {
      console.error("Error getting Business Canva:", error);
      return null;
    }
  },

  saveBusinessCanva: async (userId: string, data: any): Promise<void> => {
    try {
      const q = query(collection(db, 'business_canva'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'business_canva', docId), data);
      } else {
        await addDoc(collection(db, 'business_canva'), { userId, ...data, createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Error saving Business Canva:", error);
      throw error;
    }
  },

  // --- SCHEDULE ---
  getSchedule: async (userId: string): Promise<ScheduleItem[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'schedule_items'), where('userId', '==', userId), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleItem));
    } catch (error) {
      console.error("Error getting schedule:", error);
      return [];
    }
  },

  addScheduleItem: async (item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> => {
    try {
      const docRef = await addDoc(collection(db, 'schedule_items'), item);
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error adding schedule item:", error);
      throw error;
    }
  },

  deleteScheduleItem: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'schedule_items', id));
    } catch (error) {
      console.error("Error deleting schedule item:", error);
      throw error;
    }
  },

  // --- B2B MATCH ---
  getB2BOffers: async (): Promise<B2BOffer[]> => {
    try {
      const q = query(collection(db, 'b2b_offers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as B2BOffer));
    } catch (error) {
      console.error("Error getting B2B offers:", error);
      return [];
    }
  },

  createB2BOffer: async (offer: Omit<B2BOffer, 'id' | 'createdAt'>): Promise<B2BOffer> => {
    try {
      const data = { ...offer, createdAt: Date.now() };
      const docRef = await addDoc(collection(db, 'b2b_offers'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data } as B2BOffer;
    } catch (error) {
      console.error("Error creating B2B offer:", error);
      throw error;
    }
  },

  getB2BTransactions: async (userId: string): Promise<B2BTransaction[]> => {
    if (isMockUser(userId)) return [];
    try {
      // Get transactions where user is either buyer or seller
      const qBuyer = query(collection(db, 'b2b_transactions'), where('buyerId', '==', userId));
      const qSeller = query(collection(db, 'b2b_transactions'), where('sellerId', '==', userId));
      
      const [buyerSnap, sellerSnap] = await Promise.all([getDocs(qBuyer), getDocs(qSeller)]);
      
      const transactions = [
        ...buyerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as B2BTransaction)),
        ...sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as B2BTransaction))
      ];

      // Sort by date (descending)
      return transactions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
      console.error("Error getting B2B transactions:", error);
      return [];
    }
  },

  createB2BTransaction: async (transaction: Omit<B2BTransaction, 'id' | 'status' | 'createdAt'>): Promise<B2BTransaction> => {
    try {
      const data = { 
        ...transaction, 
        status: 'pending', 
        createdAt: Date.now()
      };
      const docRef = await addDoc(collection(db, 'b2b_transactions'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data } as B2BTransaction;
    } catch (error) {
      console.error("Error creating B2B transaction:", error);
      throw error;
    }
  },

  updateB2BTransactionStatus: async (id: string, status: 'confirmed' | 'rejected'): Promise<void> => {
    try {
      const docRef = doc(db, 'b2b_transactions', id);
      await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating B2B transaction status:", error);
      throw error;
    }
  },

  // --- RANKING ---
  getRanking: async (limitCount: number = 10): Promise<any[]> => {
    try {
      const q = query(
        collection(db, 'users'), 
        orderBy('points', 'desc'), 
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        name: doc.data().businessName || 'Membro',
        business: doc.data().businessName || 'Negócio',
        pts: doc.data().points || 0,
        avatar: doc.data().logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.data().businessName}`
      }));
    } catch (error) {
      console.error("Error getting ranking:", error);
      return [];
    }
  },

  // --- COMMUNITY ---
  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    try {
      const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
    } catch (error) {
      console.error("Error getting community posts:", error);
      return [];
    }
  },

  createCommunityPost: async (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>): Promise<CommunityPost> => {
    try {
      const data = {
        ...post,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: Date.now()
      };
      const docRef = await addDoc(collection(db, 'community_posts'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data } as CommunityPost;
    } catch (error) {
      console.error("Error creating community post:", error);
      throw error;
    }
  },

  likePost: async (postId: string, userId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'community_posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const likedBy = data.likedBy || [];
        if (!likedBy.includes(userId)) {
          await updateDoc(docRef, {
            likes: (data.likes || 0) + 1,
            likedBy: [...likedBy, userId]
          });
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  // --- VITRINE ---
  getStoreCategories: async (userId: string): Promise<StoreCategory[]> => {
    if (isMockUser(userId)) return [];
    try {
      const q = query(collection(db, 'store_categories'), where('userId', '==', userId), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoreCategory));
    } catch (error) {
      console.error("Error getting store categories:", error);
      return [];
    }
  },

  addStoreCategory: async (category: Omit<StoreCategory, 'id'>): Promise<StoreCategory> => {
    try {
      const docRef = await addDoc(collection(db, 'store_categories'), category);
      return { id: docRef.id, ...category };
    } catch (error) {
      console.error("Error adding store category:", error);
      throw error;
    }
  },

  deleteStoreCategory: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'store_categories', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting store category:", error);
      throw error;
    }
  },

  getVitrineComments: async (vitrineUserId: string): Promise<VitrineComment[]> => {
    try {
      const q = query(collection(db, 'vitrine_comments'), where('vitrineUserId', '==', vitrineUserId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VitrineComment));
    } catch (error) {
      console.error("Error getting vitrine comments:", error);
      return [];
    }
  },

  addVitrineComment: async (comment: Omit<VitrineComment, 'id' | 'createdAt'>): Promise<VitrineComment> => {
    try {
      const data = { ...comment, createdAt: Date.now() };
      const docRef = await addDoc(collection(db, 'vitrine_comments'), data);
      return { id: docRef.id, ...data } as VitrineComment;
    } catch (error) {
      console.error("Error adding vitrine comment:", error);
      throw error;
    }
  },

  addLeads: async (leads: Omit<Lead, 'id'>[]): Promise<void> => {
    try {
      const batch = leads.map(lead => addDoc(collection(db, 'leads'), { ...lead, createdAt: Date.now() }));
      await Promise.all(batch);
    } catch (error) {
      console.error("Error adding leads:", error);
      throw error;
    }
  }
};
