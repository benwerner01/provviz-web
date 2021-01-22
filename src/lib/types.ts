export type PROVFileType = 'PROV-N' | 'Turtle' | 'PROV-XML' | 'TriG' | 'PROV-JSON'

export type PROVDocument = {
  name: string;
  type: PROVFileType;
  serialized: object;
}
