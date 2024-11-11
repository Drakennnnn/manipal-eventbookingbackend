import { db, auth } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const purchaseTicket = async (eventTitle: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const ticketRef = await addDoc(collection(db, 'tickets'), {
      eventTitle,
      userEmail: user.email,
      purchaseDate: new Date().toISOString(),
      userId: user.uid
    });

    return ticketRef.id;
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    throw error;
  }
};

export const getUserTickets = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw error;
  }
};