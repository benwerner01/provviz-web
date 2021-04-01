import { useState } from 'react';
import { INVALID_DOCUMENT_NAMES } from './util';

type DocumentNameTextFieldHookReturn = {
  documentName: string,
  setDocumentName: (documentName: string) => void,
  documentNameIsValid: boolean,
}

const useDocumentNameTextField = (
  initialDocumentName: string,
  documentNameIsUnique: (name: string) => boolean,
): DocumentNameTextFieldHookReturn => {
  const [documentName, setDocumentName] = useState<string>(initialDocumentName);

  const isUnique = documentNameIsUnique(documentName);

  const isInvalidName = INVALID_DOCUMENT_NAMES.includes(documentName);

  const documentNameIsValid = documentName !== '' && isUnique && !isInvalidName;

  return {
    documentName,
    setDocumentName,
    documentNameIsValid,
  };
};

export default useDocumentNameTextField;
