import React from 'react';
import { PROVDocument } from '../../lib/types';

export const getLocalStorageDocuments = () => {
  try {
    const stringifiedLocalDocuments = localStorage.getItem('documents');
    return stringifiedLocalDocuments
      ? JSON.parse(stringifiedLocalDocuments)
        .map((d: Omit<PROVDocument, 'updatedAt'> & { updatedAt: string }) => ({ ...d, updatedAt: new Date(d.updatedAt) }))
      : [];
  } catch {
    return [];
  }
};

export const setLocalStorageDocuments = (
  documents: PROVDocument[],
) => localStorage.setItem('documents', JSON.stringify(documents));

export type LocalDocumentContext = {
  localDocuments: PROVDocument[];
  setLocalDocuments: (documents: PROVDocument[]) => void;
  setLocalDocument: (document: PROVDocument) => void;
}

export default React.createContext<LocalDocumentContext>({
  localDocuments: [],
  setLocalDocuments: (documents: PROVDocument[]) => undefined,
  setLocalDocument: (document: PROVDocument) => undefined,
});
