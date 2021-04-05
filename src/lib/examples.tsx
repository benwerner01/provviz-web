import React, { ReactNode } from 'react';
import { defaultVisualisationSettings } from 'provviz';
import { PROVDocument } from './types';

type ExamplePROVDocument = Omit<PROVDocument, 'updatedAt'> & { description: ReactNode }

const examples: ExamplePROVDocument[] = [
  {
    name: 'Newspaper Article',
    description: (
      <>
        {'The example PROV document featured in the '}
        <a href="https://www.w3.org/TR/prov-primer/#the-complete-example" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          W3C PROV Model Primer
        </a>
      </>
    ),
    type: 'PROV-N',
    fileContent: `document
    prefix exc <http://s11.no/survey4/>
    prefix exn <http://s11.no/survey4/>
    prefix exb <http://s11.no/survey4/>
    prefix exg <http://s11.no/survey4/>
    prefix dcterms <http://purl.org/dc/terms/>
    prefix foaf <http://xmlns.com/foaf/0.1/>

    entity(exn:article, [dcterms:title="Crime rises in cities"])

    entity(exg:dataset1)
    entity(exc:regionList1)
    entity(exc:composition1)
    entity(exc:chart1)
    
    activity(exc:compile1)
    activity(exc:compile2)
    
    activity(exc:compose1)
    activity(exc:illustrate1)
    
    used(exc:compose1, exg:dataset1, -)
    used(exc:compose1, exc:regionList1, -)
    wasGeneratedBy(exc:composition1, exc:compose1, -)
    
    used(exc:illustrate1, exc:composition1, -)
    wasGeneratedBy(exc:chart1, exc:illustrate1, -)
    
    wasAssociatedWith(exc:compose1, exc:derek, -)
    wasAssociatedWith(exc:illustrate1, exc:derek, -)
    
    agent(exc:derek,
        [prov:type='prov:Person', foaf:givenName="Derek", 
        foaf:mbox="<mailto:derek@example.org>"])
    
    agent(exc:chartgen,
        [prov:type='prov:Organization',
        foaf:name="Chart Generators Inc"])
    actedOnBehalfOf(exc:derek, exc:chartgen)
    
    wasAttributedTo(exc:chart1, exc:derek)
    
    used(exc:compose1, exg:dataset1, -, [prov:role='exc:dataToCompose'])
    
    used(exc:compose1, exc:regionList1, -, [prov:role='exc:regionsToAggregateBy'])
    
    wasAssociatedWith(exc:compose1, exc:derek, -, [prov:role='exc:analyst'])
    wasGeneratedBy(exc:composition1, exc:compose1, -, [prov:role='exc:composedData'])
    
    entity(exg:dataset2)
    wasDerivedFrom(exg:dataset2, exg:dataset1, [prov:type='prov:Revision'])
    
    wasDerivedFrom(exc:chart2, exg:dataset2)
    
    entity(exc:chart2)
    wasDerivedFrom(exc:chart2, exc:chart1, [prov:type='prov:Revision'])
    
    agent(exg:edith, [prov:type='prov:Person'])
    entity(exg:instructions)
    
    wasAssociatedWith(exg:correct1, exg:edith, exg:instructions)
    wasGeneratedBy(exg:dataset2, exg:correct1, -)
    
    wasGeneratedBy(exc:chart1, exc:compile1,  2012-03-02T10:30:00)
    wasGeneratedBy(exc:chart2, exc:compile2, 2012-04-01T15:21:00)
    
    activity(exg:correct1, 2012-03-31T09:21:00, 2012-04-01T15:21:00)
    
    entity(exb:quoteInBlogEntry-20130326, prov:value="Smaller cities have more crime than larger ones")
    wasDerivedFrom(exb:quoteInBlogEntry-20130326, exn:article, [prov:type='prov:Quotation'])
    
    entity(exn:articleV1)
    specializationOf(exn:articleV1, exn:article)
    wasDerivedFrom(exb:articleV1, exb:dataset1)
    
    entity(exn:articleV2)
    
    specializationOf(exn:articleV2, exn:article)
    alternateOf(exn:articleV2, exn:articleV1)
    
    endDocument
    `,
    serialized: {
      wasGeneratedBy: {
        '_:wGB121': {
          'prov:entity': 'exc:composition1',
          'prov:activity': 'exc:compose1',
        },
        '_:wGB123': {
          'prov:entity': 'exc:composition1',
          'prov:role': {
            $: 'exc:composedData',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:activity': 'exc:compose1',
        },
        '_:wGB122': {
          'prov:entity': 'exc:chart1',
          'prov:activity': 'exc:illustrate1',
        },
        '_:wGB125': {
          'prov:time': '2012-03-02T10:30:00.000Z',
          'prov:entity': 'exc:chart1',
          'prov:activity': 'exc:compile1',
        },
        '_:wGB124': {
          'prov:entity': 'exc:dataset2',
          'prov:activity': 'exc:correct1',
        },
        '_:wGB126': {
          'prov:time': '2012-04-01T15:21:00.000Z',
          'prov:entity': 'exc:chart2',
          'prov:activity': 'exc:compile2',
        },
      },
      agent: {
        'exc:derek': {
          'prov:type': {
            $: 'prov:Person',
            type: 'prov:QUALIFIED_NAME',
          },
          'foaf:givenName': {
            $: 'Derek',
            type: 'xsd:string',
          },
          'foaf:mbox': {
            $: '\u003cmailto:derek@example.org\u003e',
            type: 'xsd:string',
          },
        },
        'exc:edith': {
          'prov:type': {
            $: 'prov:Person',
            type: 'prov:QUALIFIED_NAME',
          },
        },
        'exc:chartgen': {
          'foaf:name': {
            $: 'Chart Generators Inc',
            type: 'xsd:string',
          },
          'prov:type': {
            $: 'prov:Organization',
            type: 'prov:QUALIFIED_NAME',
          },
        },
      },
      activity: {
        'exc:compose1': {},
        'exc:correct1': {
          'prov:startTime': '2012-03-31T09:21:00.000Z',
          'prov:endTime': '2012-04-01T15:21:00.000Z',
        },
        'exc:compile2': {},
        'exc:illustrate1': {},
        'exc:compile1': {},
      },
      actedOnBehalfOf: {
        '_:aOBO21': {
          'prov:responsible': 'exc:chartgen',
          'prov:delegate': 'exc:derek',
        },
      },
      alternateOf: {
        '_:aO21': {
          'prov:alternate2': 'exc:articleV2',
          'prov:alternate1': 'exc:articleV1',
        },
      },
      prefix: {
        exb: 'http://s11.no/survey4/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        exn: 'http://s11.no/survey4/',
        prov: 'http://www.w3.org/ns/prov#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        dcterms: 'http://purl.org/dc/terms/',
        exg: 'http://s11.no/survey4/',
        exc: 'http://s11.no/survey4/',
      },
      wasAssociatedWith: {
        '_:wAW82': {
          'prov:agent': 'exc:derek',
          'prov:activity': 'exc:illustrate1',
        },
        '_:wAW83': {
          'prov:agent': 'exc:derek',
          'prov:role': {
            $: 'exc:analyst',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:activity': 'exc:compose1',
        },
        '_:wAW84': {
          'prov:plan': 'exc:instructions',
          'prov:agent': 'exc:edith',
          'prov:activity': 'exc:correct1',
        },
        '_:wAW81': {
          'prov:agent': 'exc:derek',
          'prov:activity': 'exc:compose1',
        },
      },
      wasDerivedFrom: {
        '_:wDF81': {
          'prov:type': {
            $: 'prov:Revision',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:generatedEntity': 'exc:dataset2',
          'prov:usedEntity': 'exc:dataset1',
        },
        '_:wDF83': {
          'prov:type': {
            $: 'prov:Revision',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:generatedEntity': 'exc:chart2',
          'prov:usedEntity': 'exc:chart1',
        },
        '_:wDF82': {
          'prov:generatedEntity': 'exc:chart2',
          'prov:usedEntity': 'exc:dataset2',
        },
        '_:wDF84': {
          'prov:type': {
            $: 'prov:Quotation',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:generatedEntity': 'exc:quoteInBlogEntry-20130326',
          'prov:usedEntity': 'exc:article',
        },
        '_:wDF85': {
          'prov:generatedEntity': 'exc:articleV1',
          'prov:usedEntity': 'exc:dataset1',
        },
      },
      used: {
        '_:u104': {
          'prov:entity': 'exc:dataset1',
          'prov:role': {
            $: 'exc:dataToCompose',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:activity': 'exc:compose1',
        },
        '_:u103': {
          'prov:entity': 'exc:composition1',
          'prov:activity': 'exc:illustrate1',
        },
        '_:u102': {
          'prov:entity': 'exc:regionList1',
          'prov:activity': 'exc:compose1',
        },
        '_:u101': {
          'prov:entity': 'exc:dataset1',
          'prov:activity': 'exc:compose1',
        },
        '_:u105': {
          'prov:entity': 'exc:regionList1',
          'prov:role': {
            $: 'exc:regionsToAggregateBy',
            type: 'prov:QUALIFIED_NAME',
          },
          'prov:activity': 'exc:compose1',
        },
      },
      wasAttributedTo: {
        '_:wAT21': {
          'prov:entity': 'exc:chart1',
          'prov:agent': 'exc:derek',
        },
      },
      entity: {
        'exc:instructions': {},
        'exc:dataset1': {},
        'exc:articleV1': {},
        'exc:regionList1': {},
        'exc:dataset2': {},
        'exc:article': {
          'dcterms:title': {
            $: 'Crime rises in cities',
            type: 'xsd:string',
          },
        },
        'exc:quoteInBlogEntry-20130326': {
          'prov:value': {
            $: 'Smaller cities have more crime than larger ones',
            type: 'xsd:string',
          },
        },
        'exc:chart2': {},
        'exc:composition1': {},
        'exc:articleV2': {},
        'exc:chart1': {},
      },
      specializationOf: {
        '_:sO42': {
          'prov:specificEntity': 'exc:articleV2',
          'prov:generalEntity': 'exc:article',
        },
        '_:sO41': {
          'prov:specificEntity': 'exc:articleV1',
          'prov:generalEntity': 'exc:article',
        },
      },
    },
  },
  {
    name: 'Survey Results',
    description: (
      <>
        {'The provenance of an example survey published to the '}
        <a href="https://openprovenance.org/store/documents/1478" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          Open Provenance ProvStore
        </a>
        {' by user '}
        <a href="https://openprovenance.org/store/users/soilandreyes" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          soilandreyes
        </a>
      </>
    ),
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
    description: (
      <>
        {'The provenance of the '}
        <a href="http://www.provbook.org/" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          <i>Provenance: An Introduction to PROV</i>
          {' book'}
        </a>
        {' published '}
        <a href="http://www.provbook.org/provapi/documents/bk.provn" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          here
        </a>
      </>
    ),
    visualisationSettings: {
      ...defaultVisualisationSettings,
      hideAllNodeAttributes: true,
    },
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
