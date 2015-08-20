var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-shopify-settings-variables', function () {

    /* Write tests here */

    it('replace single variable in value', function () {
        test('a{ color: $headline_color; }',
            'a{ color: {{ settings.headline_color}}; }');
    });

    it('replace multiple variables in multiple values', function () {
        test('a{ color: $headline_color; ' +
                'background-color: $healine_bg_color; }',
             'a{ color: {{ settings.headline_color}}; ' +
                'background-color: {{ settings.healine_bg_color }}; }');
    });

    describe('ignore $ elsewhere', function() {
        it('ignore $ in property', function () {
            test('a{ $color: headline_color; }',
                'a{ $color: headline_color; }');
        });

        it('ignore $ in middle of  value', function () {
            test('a{ $color: headline_$color; }',
                'a{ $color: headline_$color; }');
        });
    });

});
