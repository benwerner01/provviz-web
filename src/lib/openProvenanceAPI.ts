import axios, { AxiosError } from 'axios';
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

export const translateSerializedToFile = async (
  serialized: object, type: PROVFileType, retryCounter?: number,
): Promise<string | null> => (type === 'PROV-JSON'
  ? JSON.stringify(serialized, null, '\t')
  : api
    .post<string | object>('documents2', serialized, {
      headers: {
        'Content-Type': mapPROVFileTypeToContentType('PROV-JSON'),
        accept: mapPROVFileTypeToContentType(type),
      },
    })
    .then(({ data }) => (typeof data === 'object'
      ? JSON.stringify(data, null, '\t')
      : data))
    .catch(({ response }: AxiosError) => (
      ((!retryCounter || retryCounter < 5) && response?.status === 404)
        ? translateSerializedToFile(document, type, (retryCounter || 0) + 1)
        : null))
);

export const translateToPROVJSON = (
  document: string, type: PROVFileType, retryCounter?: number,
): Promise<object | null> => api
  .post<object>('documents2', document, {
    headers: {
      'Content-Type': mapPROVFileTypeToContentType(type),
      accept: 'application/json',
    },
  })
  .then((res) => res.data)
  .catch(({ response }: AxiosError) => (
    ((!retryCounter || retryCounter < 5) && response?.status === 404)
      ? translateToPROVJSON(document, type, (retryCounter || 0) + 1)
      : null));
