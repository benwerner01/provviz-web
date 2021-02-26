import React from 'react';
import { PROVDocument } from '../../lib/types';

type LocalPROVDocument = Omit<PROVDocument, 'updatedAt'> & { updatedAt: string }

const tbdIsLocalPROVDocument = (document: any): document is LocalPROVDocument => (
  document.name !== undefined
  && typeof document.name === 'string'
  && document.updatedAt !== undefined
  && typeof document.updatedAt === 'string'
  && document.fileContent !== undefined
  && typeof document.fileContent === 'string'
);

export const getLocalStorageDocuments = () => {
  try {
    const stringifiedLocalDocuments = localStorage.getItem('documents');
    return stringifiedLocalDocuments
      ? JSON.parse(stringifiedLocalDocuments)
        .filter(tbdIsLocalPROVDocument)
        .map((d: LocalPROVDocument) => ({ ...d, updatedAt: new Date(d.updatedAt) }))
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
