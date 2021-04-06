import React from 'react';
import { render, cleanup } from '@testing-library/react';
import UploadDocumentDialog, { UploadDocumentDialogProps } from './UploadDocumentDialog';

afterEach(cleanup);

const defaultUploadDocumentDialogProps: UploadDocumentDialogProps = {
  open: true,
  onClose: jest.fn(),
  openDocument: jest.fn(),
  documentNameIsUnique: jest.fn(),
  generateUniqueDocumentName: jest.fn(),
};

test('Upload Document Dialog renders', () => {
  render(
    <UploadDocumentDialog {...defaultUploadDocumentDialogProps} />,
  );
});
