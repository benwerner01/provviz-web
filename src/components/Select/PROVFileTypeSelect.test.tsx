import React from 'react';
import { render, cleanup } from '@testing-library/react';
import PROVFileTypeSelect, { PROVFileTypeSelectProps } from './PROVFileTypeSelect';

afterEach(cleanup);

const defaultPROVFileTypeSelectProps: PROVFileTypeSelectProps = {
  value: 'PROV-N',
  onChange: jest.fn(),
};

test('PROVFileTypeSelect component renders', () => {
  render(
    <PROVFileTypeSelect {...defaultPROVFileTypeSelectProps} />,
  );
});
