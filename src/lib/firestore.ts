
import { collection, doc, setDoc, updateDoc, getDoc, getDocs, query, where, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ClientDocument, ProjectDocument, TaskDocument, InvoiceDocument, DocumentDocument } from '@/types/firebase';

// Collection references
const clientsCollection = collection(db, 'clients');
const projectsCollection = collection(db, 'projects');
const tasksCollection = collection(db, 'tasks');
const invoicesCollection = collection(db, 'invoices');
const documentsCollection = collection(db, 'documents');

// Generic timestamp conversion helper
const withServerTimestamp = (data: any, isNew = false) => {
  const now = Timestamp.now();
  return {
    ...data,
    updatedAt: now,
    ...(isNew ? { createdAt: now } : {})
  };
};

// Clients
export const addClient = async (clientData: Omit<ClientDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newClientRef = doc(clientsCollection);
  const clientWithTimestamps = withServerTimestamp({ ...clientData }, true);
  await setDoc(newClientRef, clientWithTimestamps);
  return { id: newClientRef.id, ...clientWithTimestamps };
};

export const updateClient = async (clientId: string, clientData: Partial<Omit<ClientDocument, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const clientRef = doc(clientsCollection, clientId);
  const clientWithTimestamps = withServerTimestamp({ ...clientData });
  await updateDoc(clientRef, clientWithTimestamps);
  return { id: clientId, ...clientWithTimestamps };
};

export const getClient = async (clientId: string) => {
  const clientRef = doc(clientsCollection, clientId);
  const clientDoc = await getDoc(clientRef);
  if (!clientDoc.exists()) return null;
  return { id: clientDoc.id, ...clientDoc.data() } as ClientDocument;
};

export const getClients = async () => {
  const clientsSnapshot = await getDocs(clientsCollection);
  return clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClientDocument));
};

// Projects
export const addProject = async (projectData: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newProjectRef = doc(projectsCollection);
  const projectWithTimestamps = withServerTimestamp({ ...projectData }, true);
  await setDoc(newProjectRef, projectWithTimestamps);
  return { id: newProjectRef.id, ...projectWithTimestamps };
};

export const updateProject = async (projectId: string, projectData: Partial<Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const projectRef = doc(projectsCollection, projectId);
  const projectWithTimestamps = withServerTimestamp({ ...projectData });
  await updateDoc(projectRef, projectWithTimestamps);
  return { id: projectId, ...projectWithTimestamps };
};

export const getProject = async (projectId: string) => {
  const projectRef = doc(projectsCollection, projectId);
  const projectDoc = await getDoc(projectRef);
  if (!projectDoc.exists()) return null;
  return { id: projectDoc.id, ...projectDoc.data() } as ProjectDocument;
};

export const getProjects = async () => {
  const projectsSnapshot = await getDocs(projectsCollection);
  return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectDocument));
};

export const getProjectsByClient = async (clientId: string) => {
  const q = query(projectsCollection, where('clientId', '==', clientId));
  const projectsSnapshot = await getDocs(q);
  return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectDocument));
};

// Tasks
export const addTask = async (taskData: Omit<TaskDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newTaskRef = doc(tasksCollection);
  const taskWithTimestamps = withServerTimestamp({ ...taskData }, true);
  await setDoc(newTaskRef, taskWithTimestamps);
  return { id: newTaskRef.id, ...taskWithTimestamps };
};

export const updateTask = async (taskId: string, taskData: Partial<Omit<TaskDocument, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const taskRef = doc(tasksCollection, taskId);
  const taskWithTimestamps = withServerTimestamp({ ...taskData });
  await updateDoc(taskRef, taskWithTimestamps);
  return { id: taskId, ...taskWithTimestamps };
};

export const getTask = async (taskId: string) => {
  const taskRef = doc(tasksCollection, taskId);
  const taskDoc = await getDoc(taskRef);
  if (!taskDoc.exists()) return null;
  return { id: taskDoc.id, ...taskDoc.data() } as TaskDocument;
};

export const getTasks = async () => {
  const tasksSnapshot = await getDocs(tasksCollection);
  return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskDocument));
};

export const getTasksByProject = async (projectId: string) => {
  const q = query(tasksCollection, where('projectId', '==', projectId));
  const tasksSnapshot = await getDocs(q);
  return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskDocument));
};

// Invoices
export const addInvoice = async (invoiceData: Omit<InvoiceDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newInvoiceRef = doc(invoicesCollection);
  const invoiceWithTimestamps = withServerTimestamp({ ...invoiceData }, true);
  await setDoc(newInvoiceRef, invoiceWithTimestamps);
  return { id: newInvoiceRef.id, ...invoiceWithTimestamps };
};

export const updateInvoice = async (invoiceId: string, invoiceData: Partial<Omit<InvoiceDocument, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const invoiceRef = doc(invoicesCollection, invoiceId);
  const invoiceWithTimestamps = withServerTimestamp({ ...invoiceData });
  await updateDoc(invoiceRef, invoiceWithTimestamps);
  return { id: invoiceId, ...invoiceWithTimestamps };
};

export const getInvoice = async (invoiceId: string) => {
  const invoiceRef = doc(invoicesCollection, invoiceId);
  const invoiceDoc = await getDoc(invoiceRef);
  if (!invoiceDoc.exists()) return null;
  return { id: invoiceDoc.id, ...invoiceDoc.data() } as InvoiceDocument;
};

export const getInvoices = async () => {
  const invoicesSnapshot = await getDocs(invoicesCollection);
  return invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvoiceDocument));
};

export const getInvoicesByClient = async (clientId: string) => {
  const q = query(invoicesCollection, where('clientId', '==', clientId));
  const invoicesSnapshot = await getDocs(q);
  return invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvoiceDocument));
};

export const getInvoicesByProject = async (projectId: string) => {
  const q = query(invoicesCollection, where('projectId', '==', projectId));
  const invoicesSnapshot = await getDocs(q);
  return invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvoiceDocument));
};

// Documents
export const addDocument = async (documentData: Omit<DocumentDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newDocumentRef = doc(documentsCollection);
  const documentWithTimestamps = withServerTimestamp({ ...documentData }, true);
  await setDoc(newDocumentRef, documentWithTimestamps);
  return { id: newDocumentRef.id, ...documentWithTimestamps };
};

export const updateDocument = async (documentId: string, documentData: Partial<Omit<DocumentDocument, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const documentRef = doc(documentsCollection, documentId);
  const documentWithTimestamps = withServerTimestamp({ ...documentData });
  await updateDoc(documentRef, documentWithTimestamps);
  return { id: documentId, ...documentWithTimestamps };
};

export const getDocument = async (documentId: string) => {
  const documentRef = doc(documentsCollection, documentId);
  const documentDoc = await getDoc(documentRef);
  if (!documentDoc.exists()) return null;
  return { id: documentDoc.id, ...documentDoc.data() } as DocumentDocument;
};

export const getDocuments = async () => {
  const documentsSnapshot = await getDocs(documentsCollection);
  return documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentDocument));
};

export const getDocumentsByClient = async (clientId: string) => {
  const q = query(documentsCollection, where('clientId', '==', clientId));
  const documentsSnapshot = await getDocs(q);
  return documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentDocument));
};

export const getDocumentsByProject = async (projectId: string) => {
  const q = query(documentsCollection, where('projectId', '==', projectId));
  const documentsSnapshot = await getDocs(q);
  return documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentDocument));
};

// Common delete function
export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};
