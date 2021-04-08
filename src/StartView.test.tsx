import React from 'react';
import { render, cleanup } from '@testing-library/react';
import StartView, { StartViewProps } from './StartView';

afterEach(cleanup);

const defaultStartViewProps: StartViewProps = {
  openUploadDocumentDialog: jest.fn(),
  openCreateDocumentDialog: jest.fn(),
  openDocument: jest.fn(),
  generateUniqueDocumentName: jest.fn(),
  deleteDocument: jest.fn(),
};

test('StartView renders', () => {
  render(
    <StartView {...defaultStartViewProps} />,
  );
});
