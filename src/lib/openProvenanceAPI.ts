import axios, { AxiosError } from 'axios';
import { PROVDocument, PROVFileType } from './types';

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

export const translatePROVJSONDocumentToFile = async (
  document: PROVDocument, type: PROVFileType, retryCounter?: number,
): Promise<string | null> => (type === 'PROV-JSON'
  ? api
    .post<string | object>('documents2', document.serialized, {
      headers: {
        'Content-Type': mapPROVFileTypeToContentType(document.type),
        accept: mapPROVFileTypeToContentType(type),
      },
    })
    .then(({ data }) => (typeof data === 'object'
      ? JSON.stringify(data)
      : data))
    .catch(({ response }: AxiosError) => (
      ((!retryCounter || retryCounter < 5) && response?.status === 404)
        ? translatePROVJSONDocumentToFile(document, type, (retryCounter || 0) + 1)
        : null))
  : JSON.stringify(document.serialized));

export const translateToPROVJSON = (
  document: string, type: PROVFileType,
) => api.post<object>('documents2', document, {
  headers: {
    'Content-Type': mapPROVFileTypeToContentType(type),
    accept: 'application/json',
  },
}).then((res) => res.data);
