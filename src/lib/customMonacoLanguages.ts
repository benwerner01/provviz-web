/* eslint-disable no-useless-escape */
// eslint-disable-next-line import/no-unresolved
import { languages } from 'monaco-editor';
import { PROVFileType } from './types';

type CustomMonacoLanguage = {
  id: PROVFileType;
  configuration?: languages.LanguageConfiguration;
  language?: languages.IMonarchLanguage;
}

const CUSTOM_MONACO_LANGAUGES: CustomMonacoLanguage[] = [
  {
    id: 'PROV-N',
  },
  {
    id: 'PROV-XML',
    configuration: {
      comments: {
        blockComment: ['<!--', '-->'],
      },
      brackets: [['<', '>']],
      autoClosingPairs: [
        { open: '<', close: '>' },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
      ],
      surroundingPairs: [
        { open: '<', close: '>' },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
      ],
      onEnterRules: [
        {
          beforeText: new RegExp('<([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$', 'i'),
          afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
          action: {
            indentAction: languages.IndentAction.IndentOutdent,
          },
        },
        {
          beforeText: new RegExp('<(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$', 'i'),
          action: { indentAction: languages.IndentAction.Indent },
        },
      ],
    },
    language: {
      defaultToken: '',
      tokenPostfix: '.xml',

      ignoreCase: true,

      // Useful regular expressions
      // @ts-ignore
      qualifiedName: /(?:[\w\.\-]+:)?[\w\.\-]+/,

      tokenizer: {
        root: [
          [/[^<&]+/, ''],

          { include: '@whitespace' },

          // Standard opening tag
          [/(<)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'tag', next: '@tag' }]],

          // Standard closing tag
          [
            /(<\/)(@qualifiedName)(\s*)(>)/,
            [{ token: 'delimiter' }, { token: 'tag' }, { token: 'delimiter' }],
          ],

          // Meta tags - instruction
          [/(<\?)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'metatag', next: '@tag' }]],

          // Meta tags - declaration
          [/(<\!)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'metatag', next: '@tag' }]],

          // CDATA
          [/<\!\[CDATA\[/, { token: 'delimiter.cdata', next: '@cdata' }],

          [/&\w+;/, 'string.escape'],
        ],

        cdata: [
          [/[^\]]+/, ''],
          [/\]\]>/, { token: 'delimiter.cdata', next: '@pop' }],
          [/\]/, ''],
        ],

        tag: [
          [/[ \t\r\n]+/, ''],
          [
            /(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/,
            ['attribute.name', '', 'attribute.value'],
          ],
          [
            /(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/,
            ['attribute.name', '', 'attribute.value'],
          ],
          [
            /(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/,
            ['attribute.name', '', 'attribute.value'],
          ],
          [/@qualifiedName/, 'attribute.name'],
          [/\?>/, { token: 'delimiter', next: '@pop' }],
          [/(\/)(>)/, [{ token: 'tag' }, { token: 'delimiter', next: '@pop' }]],
          [/>/, { token: 'delimiter', next: '@pop' }],
        ],

        whitespace: [
          [/[ \t\r\n]+/, ''],
          [/<!--/, { token: 'comment', next: '@comment' }],
        ],

        comment: [
          [/[^<\-]+/, 'comment.content'],
          [/-->/, { token: 'comment', next: '@pop' }],
          [/<!--/, 'comment.content.invalid'],
          [/[<\-]/, 'comment.content'],
        ],
      },
    },
  },
  {
    id: 'TriG',
  },
  {
    id: 'Turtle',
  },
];

export default CUSTOM_MONACO_LANGAUGES;
