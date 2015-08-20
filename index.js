var postcss = require('postcss');

module.exports = postcss.plugin('postcss-shopify-settings-variables',
  function (opts) {
    opts = opts || {};

    // Work with options here

    return function (css) {

        // Transform CSS AST here
        css.eachInside(function (node) {
            if ( node.type === 'decl' ) {
                if ( node.value.toString().indexOf('$(') >= 0 ) {
                    node.value = node.value
                        .replace(/^([^\$]*)(\$\()([^\)]+)(\))(.*)$/,
                            function(match, $1, $2, $3, $4, $5) {
                                return $1 + '{{ settings.' + $3 + " }}" + $5;
                            });
                }
            }
        });
    };
});