const postcss = require('postcss');

const bgUrlRegex = /url\([\s'"]?(.*?)[\s'"]?\)/g;
// eslint-disable-next-line security/detect-unsafe-regex
const protocolRegex = /(https?:)?\/\/|data:/g;

module.exports = postcss.plugin('postcss-shopify-settings-variables', () => {
  // Work with options here

  return (root) => {
    // Transform CSS AST here
    root.walk(function (node) {
      if (node.type === 'decl') {
        while (node.value.includes('$(')) {
          node.value = node.value.replace(
            /^([^$]*)(\$\()([^)]+)(\))(.*)$/,
            function (match, $1, $2, $3, $4, $5) {
              return $1 + '{{ settings.' + $3 + ' }}' + $5;
            },
          );
        }
        if (bgUrlRegex.test(node.value) && !protocolRegex.test(node.value)) {
          node.value = node.value.replace(bgUrlRegex, function (match, $1) {
            let urlAndFilters = $1.split('|');
            let newVal = 'url({{ "';
            urlAndFilters.forEach(function (current, index) {
              if (index === 0) {
                newVal += current.replace(/'|"/g, '').trim();
                newVal += '" | asset_url ';
              } else {
                newVal += '| ' + current.trim() + ' ';
              }
            });
            newVal += '}})';
            return newVal;
          });
        }
      }
    });
  };
});
