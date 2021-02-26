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
