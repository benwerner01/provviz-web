type ExampleDocument = {
  name: string;
  document: object;
}

const examples: ExampleDocument[] = [
  {
    name: 'Survey',
    document: {
      prefix: { ex: 'http://s11.no/survey4/' },
      wasAttributedTo: {
        '_:id1': { 'prov:agent': 'ex:bob', 'prov:entity': 'ex:graph' }, '_:id2': { 'prov:agent': 'ex:alice', 'prov:entity': 'ex:dataset' }, '_:id13': { 'prov:agent': 'ex:patient7', 'prov:entity': 'ex:response2' }, '_:id14': { 'prov:agent': 'ex:patient4', 'prov:entity': 'ex:response1' },
      },
      wasAssociatedWith: { '_:id3': { 'prov:activity': 'ex:surveying', 'prov:agent': 'ex:alice' }, '_:id4': { 'prov:activity': 'ex:analysis', 'prov:agent': 'ex:bob' } },
      wasDerivedFrom: { '_:id5': { 'prov:usedEntity': 'ex:response1', 'prov:generatedEntity': 'ex:dataset' }, '_:id6': { 'prov:usedEntity': 'ex:dataset', 'prov:generatedEntity': 'ex:graph' }, '_:id7': { 'prov:usedEntity': 'ex:response2', 'prov:generatedEntity': 'ex:dataset' } },
      activity: { 'ex:surveying': {}, 'ex:analysis': {} },
      wasGeneratedBy: { '_:id8': { 'prov:activity': 'ex:surveying', 'prov:entity': 'ex:graph' }, '_:id9': { 'prov:activity': 'ex:surveying', 'prov:entity': 'ex:dataset' } },
      agent: {
        'ex:bob': {}, 'ex:alice': {}, 'ex:patient4': {}, 'ex:patient7': {},
      },
      entity: {
        'ex:graph': {}, 'ex:dataset': {}, 'ex:response2': {}, 'ex:response1': {},
      },
      used: { '_:id10': { 'prov:activity': 'ex:surveying', 'prov:entity': 'ex:response1' }, '_:id11': { 'prov:activity': 'ex:analysis', 'prov:entity': 'ex:dataset' }, '_:id12': { 'prov:activity': 'ex:surveying', 'prov:entity': 'ex:response2' } },
    },
  },
];

export default examples;
