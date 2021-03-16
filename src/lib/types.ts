import { VisualisationSettings } from 'provviz';

export type PROVFileType = 'PROV-N' | 'Turtle' | 'PROV-XML' | 'TriG' | 'PROV-JSON'

export type PROVDocument = {
  name: string;
  updatedAt: Date;
  serialized: object;
  type: PROVFileType;
  fileContent: string;
  visualisationSettings?: VisualisationSettings;
}

export const EMPTY_SERIALIZED = {
  prefix: {
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    prov: 'http://www.w3.org/ns/prov#',
  },
};

export const EMPTY_PROV_FILE_CONTENT = {
  'PROV-JSON': JSON.stringify(EMPTY_SERIALIZED, null, '\t'),
  'PROV-N': 'document\n\nendDocument',
  'PROV-XML': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<prov:document xmlns:prov="http://www.w3.org/ns/prov#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns3="http://openprovenance.org/prov/extension#" xmlns:xsd="http://www.w3.org/2001/XMLSchema"/>',
  Turtle: '@prefix prov: <http://www.w3.org/ns/prov#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
  TriG: '@prefix prov: <http://www.w3.org/ns/prov#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
};
