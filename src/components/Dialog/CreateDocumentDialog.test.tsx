import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CreateDocumentDialog, { CreateDocumentDialogProps } from './CreateDocumentDialog';

afterEach(cleanup);

const defaultCreateDocumentDialogProps: CreateDocumentDialogProps = {
  open: true,
  onClose: jest.fn(),
  documentNameIsUnique: jest.fn(),
  generateUniqueDocumentName: () => 'Unique Document Name',
  openDocument: jest.fn(),
};

test('Create Document Dialog renders', () => {
  render(
    <CreateDocumentDialog {...defaultCreateDocumentDialogProps} />,
  );
});
