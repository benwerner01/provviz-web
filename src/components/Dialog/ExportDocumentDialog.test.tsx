import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ExportDocumentDialog, { ExportDocumentDialogProps } from './ExportDocumentDialog';
import { PROVDocument } from '../../lib/types';
import examples from '../../lib/examples';

afterEach(cleanup);

const document: PROVDocument = { ...examples[0], updatedAt: new Date() };

const defaultExportDocumentDialogProps: ExportDocumentDialogProps = {
  open: true,
  document,
  onClose: jest.fn(),
};

test('Export Document Dialog renders', () => {
  render(
    <ExportDocumentDialog {...defaultExportDocumentDialogProps} />,
  );
});
