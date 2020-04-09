import { include } from 'named-urls';

export default include('/data', {
  root: '',
  virtualizations: include('virtualizations', {
    create: 'create',
    dataPermission: 'permission',
    import: 'import',
    list: '',
    virtualization: include(':virtualizationId', {
      metrics: 'metrics',
      root: '',
      sqlClient: 'sqlClient',
      versions: 'versions',
      views: include('views', {
        createView: include('createView', {
          root: '',
          selectName: 'selectName',
          selectSources: 'selectSources',
        }),
        edit: include(':viewDefinitionId', {
          criteria: 'criteria',
          groupBy: 'groupBy',
          join: 'join',
          properties: 'properties',
          root: '',
          sql: 'sql',
        }),
        importSource: include('importSource', {
          root: '',
          selectConnection: 'selectConnection',
          selectViews: 'selectViews',
        }),
        root: '',
      }),
    }),
  }),
});
