import axios, { AxiosResponse } from 'axios';
import { PROVFileType } from './types';

const api = axios.create({
  baseURL: 'https://openprovenance.org/services/provapi/',
});

const mapPROVFileTypeToContentType = (type: PROVFileType) => {
  if (type === 'PROV-JSON') return 'application/json';
  if (type === 'PROV-XML') return 'application/rdf+xml';
  if (type === 'TriG') return 'application/trig';
  if (type === 'Turtle') return 'text/turtle';
  return 'text/provenance-notation';
};

export const translateToPROVJSON = (
  document: string, type: PROVFileType,
) => api.post<object>('documents2', document, {
  headers: {
    accept: 'application/json',
    'Content-Type': mapPROVFileTypeToContentType(type),
  },
}).then((res) => res.data);
