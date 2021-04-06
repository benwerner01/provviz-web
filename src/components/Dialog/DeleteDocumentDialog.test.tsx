import React from 'react';
import { render, cleanup } from '@testing-library/react';
import DeleteDocumentDialog, { DeleteDocumentDialogProps } from './DeleteDocumentDialog';
import { PROVDocument } from '../../lib/types';
import examples from '../../lib/examples';

afterEach(cleanup);

const document: PROVDocument = { ...examples[0], updatedAt: new Date() };

const defaultDeleteDocumentDialogProps: DeleteDocumentDialogProps = {
  open: true,
  document,
  onClose: jest.fn(),
  onDelete: jest.fn(),
};

test('Delete Document Dialog renders', () => {
  render(
    <DeleteDocumentDialog {...defaultDeleteDocumentDialogProps} />,
  );
});
