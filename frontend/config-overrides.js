/** Arquivo de configuracao para sobrescrever algumas configuracoes do babel */
const {addBabelPlugin, override} = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ])
);
