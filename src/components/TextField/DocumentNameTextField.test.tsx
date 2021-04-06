import React from 'react';
import { render, cleanup } from '@testing-library/react';
import DocumentNameTextField, { DocumentNameTextFieldProps } from './DocumentNameTextField';

afterEach(cleanup);

const defaultDocumentNameTextFieldProps: DocumentNameTextFieldProps = {
  name: 'Document Name',
  documentNameIsUnique: jest.fn(),
  onChange: jest.fn(),
};

test('DocumentNameTextField renders', () => {
  render(
    <DocumentNameTextField {...defaultDocumentNameTextFieldProps} />,
  );
});
