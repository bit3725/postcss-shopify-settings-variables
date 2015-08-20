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

    it('replace single variable in value', function (done) {
        test('a{ color: $(headline_color); }',
            'a{ color: {{ settings.headline_color }}; }', { }, done);
    });

    it('replace multiple variables in multiple values', function (done) {
        test('a{ color: $(headline_color); ' +
                'background-color: $(healine_bg_color); }',
             'a{ color: {{ settings.headline_color }}; ' +
                'background-color: {{ settings.healine_bg_color }}; }',
                { }, done);
    });

    it('replace single variable in value with pixel unit', function (done) {
        test('body{ font-size: $(headline_size)px; }',
             'body{ font-size: {{ settings.headline_size }}px; }', { }, done);
    });

    it('replace single variable in value with liquid filter', function (done) {
        test('a{ font-size: $(headline_size | divided_by: 2)px; }',
             'a{ font-size: {{ settings.headline_size | divided_by: 2 }}px; }',
                { }, done);
    });

    it('replace single variable in value with liquid string filter',
        function (done) {
            test('a{ font-family: $(font_family | replace: \'+\', \' \'); }',
                'a{ font-family: {{ settings.font_family ' +
                    '| replace: \'+\', \' \' }}; }',
                { }, done);
    });

    it('replace single variable in value which has multiple variables',
        function (done) {
            test('a{ border-bottom: 1px dotted $(border_color); }',
                'a{ border-bottom: 1px dotted {{ settings.border_color }}; }',
                { }, done);
    });

    it('replace single variable in value when there is quotes',
        function (done) {
            test('a{ font-family: "$(headline_google_webfont_font)"; }',
                'a{ font-family: ' +
                    '"{{ settings.headline_google_webfont_font }}"; }',
                { }, done);
    });

    it('replace single variable in value when there is parenthesis',
        function (done) {
            test('a{ background: rgba($(header_bg_color), 0.9); }',
                'a{ background: rgba({{ settings.header_bg_color }}, 0.9); }',
                { }, done);
    });


});
