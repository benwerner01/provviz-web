import { PROVDocument } from './types';

const examples: Omit<PROVDocument, 'updatedAt'>[] = [
  {
    name: 'Survey Results',
    type: 'PROV-N',
    fileContent: `document
    prefix ex <http://s11.no/survey4/>
    wasAttributedTo(ex:graph, ex:bob)
    wasAttributedTo(ex:dataset, ex:alice)
    wasAttributedTo(ex:response2, ex:patient7)
    wasAttributedTo(ex:response1, ex:patient4)
    wasAssociatedWith(ex:surveying,ex:alice,-)
    wasAssociatedWith(ex:analysis,ex:bob,-)
    wasDerivedFrom(ex:dataset, ex:response1)
    wasDerivedFrom(ex:graph, ex:dataset)
    wasDerivedFrom(ex:dataset, ex:response2)
    activity(ex:surveying,-,-)
    activity(ex:analysis,-,-)
    wasGeneratedBy(ex:graph,ex:surveying,-)
    wasGeneratedBy(ex:dataset,ex:surveying,-)
    agent(ex:bob)
    agent(ex:alice)
    agent(ex:patient4)
    agent(ex:patient7)
    entity(ex:graph)
    entity(ex:dataset)
    entity(ex:response2)
    entity(ex:response1)
    used(ex:surveying,ex:response1,-)
    used(ex:analysis,ex:dataset,-)
    used(ex:surveying,ex:response2,-)
    endDocument`,
    serialized: {
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
  {
    name: 'PROVBook',
    type: 'PROV-N',
    fileContent: `document
    prefix hendler <http://www.cs.rpi.edu/~hendler/>
    prefix dct <http://purl.org/dc/terms/>
    prefix bk <http://www.provbook.org/is/#>
    prefix foaf <http://xmlns.com/foaf/0.1/>
    prefix images <http://www.provbook.org/imgs/>
    prefix provapi <http://www.provbook.org/provapi/documents/>
    prefix provbook <http://www.provbook.org/>
    bundle provbook:provenance
    prefix hendler <http://www.cs.rpi.edu/~hendler/>
    prefix dct <http://purl.org/dc/terms/>
    prefix bk <http://www.provbook.org/is/#>
    prefix foaf <http://xmlns.com/foaf/0.1/>
    prefix images <http://www.provbook.org/imgs/>
    prefix provapi <http://www.provbook.org/provapi/documents/>
    prefix provbook <http://www.provbook.org/>
    
    wasAssociatedWith(bk:writeBook,provbook:Luc,-)
    wasAssociatedWith(bk:writeBook,provbook:Paul,-)
    specializationOf(provapi:d003.svg,provapi:d003)
    specializationOf(provapi:d003.jpg,provapi:d003)
    specializationOf(provapi:d000.jpg,provapi:d000)
    specializationOf(provapi:d000.svg,provapi:d000)
    specializationOf(provapi:d002.jpg,provapi:d002)
    specializationOf(provapi:d002.svg,provapi:d002)
    specializationOf(provapi:d001.jpg,provapi:d001)
    specializationOf(provapi:d001.svg,provapi:d001)
    wasAttributedTo(provbook:thebook, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provbook:thebook, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d000.svg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d000, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d000, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(images:bookcover.jpg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(images:bookcover.jpg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provbook:provenance, provbook:Luc)
    wasAttributedTo(images:bookstack.JPG, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provbook:provenance, provbook:Paul)
    wasAttributedTo(provapi:d000.jpg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d000.jpg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d000.svg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(images:bookstack.JPG, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001.svg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002.jpg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001.jpg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001.svg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d001.jpg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002.svg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002.svg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d002.jpg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003.jpg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003.jpg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003.svg, provbook:Paul,[prov:type = "prov:Creator" %% xsd:QName])
    wasAttributedTo(provapi:d003.svg, provbook:Luc,[prov:type = "prov:Creator" %% xsd:QName])
    wasGeneratedBy(provapi:d002.jpg,bk:writeBook,-)
    wasGeneratedBy(provapi:d003.svg,bk:writeBook,-)
    wasGeneratedBy(provapi:d002,bk:writeBook,-)
    wasGeneratedBy(provapi:d001.svg,bk:writeBook,-)
    wasGeneratedBy(provapi:d003.jpg,bk:writeBook,-)
    wasGeneratedBy(provapi:d003,bk:writeBook,-)
    wasGeneratedBy(provapi:d002.svg,bk:writeBook,-)
    wasGeneratedBy(provbook:thebook,bk:writeBook,-)
    wasGeneratedBy(provapi:d000,bk:writeBook,-)
    wasGeneratedBy(provapi:d000.jpg,bk:writeBook,-)
    wasGeneratedBy(provapi:d000.svg,bk:writeBook,-)
    wasGeneratedBy(provapi:d001,bk:writeBook,-)
    wasGeneratedBy(provapi:d001.jpg,bk:writeBook,-)
    entity(images:bookcover.jpg)
    entity(provapi:d000.svg)
    entity(provapi:d002.svg)
    entity(provapi:d000)
    entity(provapi:d001)
    entity(provbook:a-little-provenance-goes-a-long-way,[prov:value = "A little provenance goes a long way" %% xsd:string])
    entity(provapi:d002)
    entity(provapi:d003)
    entity(provapi:d001.jpg)
    entity(provapi:d000.jpg)
    entity(provbook:provenance,[prov:type = "prov:Bundle" %% xsd:QName])
    entity(images:bookstack.JPG)
    entity(provbook:thebook)
    entity(provapi:d001.svg)
    entity(hendler:LittleSemanticsWeb.html)
    entity(provapi:d003.jpg)
    entity(provapi:d003.svg)
    entity(provapi:d002.jpg)
    wasDerivedFrom(images:bookstack.JPG, provbook:thebook)
    wasDerivedFrom(provbook:thebook, provbook:a-little-provenance-goes-a-long-way)
    wasDerivedFrom(images:bookcover.jpg, provbook:thebook)
    wasDerivedFrom(provbook:thebook, provapi:d000,[prov:type = "dct:references" %% xsd:QName])
    wasDerivedFrom(provbook:thebook, provapi:d002,[prov:type = "dct:references" %% xsd:QName])
    wasDerivedFrom(provbook:thebook, provapi:d001,[prov:type = "dct:references" %% xsd:QName])
    wasDerivedFrom(provbook:a-little-provenance-goes-a-long-way, hendler:LittleSemanticsWeb.html)
    wasDerivedFrom(provbook:thebook, provapi:d003,[prov:type = "dct:references" %% xsd:QName])
    agent(provbook:Luc,[foaf:name = "Luc Moreau" %% xsd:string])
    agent(provbook:Paul,[foaf:name = "Paul Groth" %% xsd:string])
    activity(bk:writeBook,-,-)
    endBundle
    endDocument`,
    serialized: {
      prefix: {
        dct: 'http://purl.org/dc/terms/',
        hendler: 'http://www.cs.rpi.edu/~hendler/',
        provapi: 'http://www.provbook.org/provapi/documents/',
        bk: 'http://www.provbook.org/is/#',
        provbook: 'http://www.provbook.org/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        images: 'http://www.provbook.org/imgs/',
      },
      bundle: {
        'provbook:provenance': {
          wasAssociatedWith: {
            '_:wAW1': {
              'prov:activity': 'bk:writeBook',
              'prov:agent': 'provbook:Luc',
            },
            '_:wAW2': {
              'prov:activity': 'bk:writeBook',
              'prov:agent': 'provbook:Paul',
            },
          },
          specializationOf: {
            '_:sO8': {
              'prov:generalEntity': 'provapi:d003',
              'prov:specificEntity': 'provapi:d003.svg',
            },
            '_:sO7': {
              'prov:generalEntity': 'provapi:d003',
              'prov:specificEntity': 'provapi:d003.jpg',
            },
            '_:sO1': {
              'prov:generalEntity': 'provapi:d000',
              'prov:specificEntity': 'provapi:d000.jpg',
            },
            '_:sO2': {
              'prov:generalEntity': 'provapi:d000',
              'prov:specificEntity': 'provapi:d000.svg',
            },
            '_:sO5': {
              'prov:generalEntity': 'provapi:d002',
              'prov:specificEntity': 'provapi:d002.jpg',
            },
            '_:sO6': {
              'prov:generalEntity': 'provapi:d002',
              'prov:specificEntity': 'provapi:d002.svg',
            },
            '_:sO3': {
              'prov:generalEntity': 'provapi:d001',
              'prov:specificEntity': 'provapi:d001.jpg',
            },
            '_:sO4': {
              'prov:generalEntity': 'provapi:d001',
              'prov:specificEntity': 'provapi:d001.svg',
            },
          },
          wasAttributedTo: {
            '_:wAT3': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provbook:thebook',
            },
            '_:wAT4': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provbook:thebook',
            },
            '_:wAT10': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d000.svg',
            },
            '_:wAT5': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d000',
            },
            '_:wAT11': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d001',
            },
            '_:wAT6': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d000',
            },
            '_:wAT30': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provbook:a-little-provenance-goes-a-long-way',
            },
            '_:wAT31': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'images:bookcover.jpg',
            },
            '_:wAT32': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'images:bookcover.jpg',
            },
            '_:wAT1': {
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provbook:provenance',
            },
            '_:wAT33': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'images:bookstack.JPG',
            },
            '_:wAT2': {
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provbook:provenance',
            },
            '_:wAT7': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d000.jpg',
            },
            '_:wAT8': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d000.jpg',
            },
            '_:wAT9': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d000.svg',
            },
            '_:wAT17': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d002',
            },
            '_:wAT34': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'images:bookstack.JPG',
            },
            '_:wAT16': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d001.svg',
            },
            '_:wAT19': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d002.jpg',
            },
            '_:wAT18': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d002',
            },
            '_:wAT13': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d001.jpg',
            },
            '_:wAT12': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d001',
            },
            '_:wAT15': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d001.svg',
            },
            '_:wAT14': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d001.jpg',
            },
            '_:wAT21': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d002.svg',
            },
            '_:wAT22': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d002.svg',
            },
            '_:wAT20': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d002.jpg',
            },
            '_:wAT26': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d003.jpg',
            },
            '_:wAT25': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d003.jpg',
            },
            '_:wAT24': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d003',
            },
            '_:wAT23': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d003',
            },
            '_:wAT29': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provbook:a-little-provenance-goes-a-long-way',
            },
            '_:wAT28': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Paul',
              'prov:entity': 'provapi:d003.svg',
            },
            '_:wAT27': {
              'prov:type': {
                $: 'prov:Creator',
                type: 'xsd:QName',
              },
              'prov:agent': 'provbook:Luc',
              'prov:entity': 'provapi:d003.svg',
            },
          },
          wasGeneratedBy: {
            '_:wGB9': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d002.jpg',
            },
            '_:wGB13': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d003.svg',
            },
            '_:wGB8': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d002',
            },
            '_:wGB7': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d001.svg',
            },
            '_:wGB12': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d003.jpg',
            },
            '_:wGB11': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d003',
            },
            '_:wGB10': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d002.svg',
            },
            '_:wGB1': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provbook:thebook',
            },
            '_:wGB2': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d000',
            },
            '_:wGB3': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d000.jpg',
            },
            '_:wGB4': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d000.svg',
            },
            '_:wGB5': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d001',
            },
            '_:wGB6': {
              'prov:activity': 'bk:writeBook',
              'prov:entity': 'provapi:d001.jpg',
            },
          },
          entity: {
            'images:bookcover.jpg': {},
            'provapi:d000.svg': {},
            'provapi:d002.svg': {},
            'provapi:d000': {},
            'provapi:d001': {},
            'provbook:a-little-provenance-goes-a-long-way': {
              'prov:value': {
                $: 'A little provenance goes a long way',
                type: 'xsd:string',
              },
            },
            'provapi:d002': {},
            'provapi:d003': {},
            'provapi:d001.jpg': {},
            'provapi:d000.jpg': {},
            'provbook:provenance': {
              'prov:type': {
                $: 'prov:Bundle',
                type: 'xsd:QName',
              },
            },
            'images:bookstack.JPG': {},
            'provbook:thebook': {},
            'provapi:d001.svg': {},
            'hendler:LittleSemanticsWeb.html': {},
            'provapi:d003.jpg': {},
            'provapi:d003.svg': {},
            'provapi:d002.jpg': {},
          },
          prefix: {
            dct: 'http://purl.org/dc/terms/',
            hendler: 'http://www.cs.rpi.edu/~hendler/',
            provapi: 'http://www.provbook.org/provapi/documents/',
            bk: 'http://www.provbook.org/is/#',
            provbook: 'http://www.provbook.org/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            images: 'http://www.provbook.org/imgs/',
          },
          wasDerivedFrom: {
            '_:wDF7': {
              'prov:generatedEntity': 'images:bookstack.JPG',
              'prov:usedEntity': 'provbook:thebook',
            },
            '_:wDF6': {
              'prov:generatedEntity': 'provbook:thebook',
              'prov:usedEntity': 'provbook:a-little-provenance-goes-a-long-way',
            },
            '_:wDF8': {
              'prov:generatedEntity': 'images:bookcover.jpg',
              'prov:usedEntity': 'provbook:thebook',
            },
            '_:wDF1': {
              'prov:generatedEntity': 'provbook:thebook',
              'prov:type': {
                $: 'dct:references',
                type: 'xsd:QName',
              },
              'prov:usedEntity': 'provapi:d000',
            },
            '_:wDF3': {
              'prov:generatedEntity': 'provbook:thebook',
              'prov:type': {
                $: 'dct:references',
                type: 'xsd:QName',
              },
              'prov:usedEntity': 'provapi:d002',
            },
            '_:wDF2': {
              'prov:generatedEntity': 'provbook:thebook',
              'prov:type': {
                $: 'dct:references',
                type: 'xsd:QName',
              },
              'prov:usedEntity': 'provapi:d001',
            },
            '_:wDF5': {
              'prov:generatedEntity': 'provbook:a-little-provenance-goes-a-long-way',
              'prov:usedEntity': 'hendler:LittleSemanticsWeb.html',
            },
            '_:wDF4': {
              'prov:generatedEntity': 'provbook:thebook',
              'prov:type': {
                $: 'dct:references',
                type: 'xsd:QName',
              },
              'prov:usedEntity': 'provapi:d003',
            },
          },
          agent: {
            'provbook:Luc': {
              'foaf:name': {
                $: 'Luc Moreau',
                type: 'xsd:string',
              },
            },
            'provbook:Paul': {
              'foaf:name': {
                $: 'Paul Groth',
                type: 'xsd:string',
              },
            },
          },
          activity: {
            'bk:writeBook': {},
          },
        },
      },
    },
  },
];

export default examples;
