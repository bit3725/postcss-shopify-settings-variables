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

    describe('replace background url with asset_url filter', function () {
        it('no quote', function (done) {
            test('a{ background: url(logo.png); }',
                'a{ background: url({{ "logo.png" | asset_url }}); }',
                { }, done);
        });

        it('with space', function (done) {
            test('a{ background: url( logo.png ); }',
                'a{ background: url({{ "logo.png" | asset_url }}); }',
                { }, done);
        });

        it('single quote', function (done) {
            test('a{ background: url(\'logo.png\'); }',
                'a{ background: url({{ "logo.png" | asset_url }}); }',
                { }, done);
        });

        it('double quote', function (done) {
            test('a{ background: url("logo.png"); }',
                'a{ background: url({{ "logo.png" | asset_url }}); }',
                { }, done);
        });

        it('only replace url', function (done) {
            test('a{ background-image: url(logo.png) no-repeat; }',
                'a{ background-image: url({{ "logo.png" | asset_url }}) ' +
                    'no-repeat; }',
                { }, done);
        });

        it('multiple url', function (done) {
            test('a{ background: url("logo.png"), url(logo@2x.jpg); }',
                'a{ background: url({{ "logo.png" | asset_url }}), ' +
                    'url({{ "logo@2x.jpg" | asset_url }}); }',
                { }, done);
        });

        it('not replace url with full path', function (done) {
            test('a{ background: url("http://a.com/logo.png"); }',
                'a{ background: url("http://a.com/logo.png"); }',
                { }, done);
        });

        it('not replace url with data uri', function (done) {
            test('a{ background: url(data:image/gif;base64,' +
                'R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o' +
                '/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVIC' +
                'SOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhw' +
                'FUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7); }',
                'a{ background: url(data:image/gif;base64,' +
                'R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o' +
                '/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVIC' +
                'SOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhw' +
                'FUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7); }',
                { }, done);
        });
    });

    it('replace variable and url together',
        function (done) {
            test('a{ background: $(modal_background_color) ' +
                    'url("newsletter_bg.png"); }',
                'a{ background: {{ settings.modal_background_color }} ' +
                    'url({{ "newsletter_bg.png" | asset_url }}); }',
                { }, done);
        });

    describe('insert asset_url filter between background url and associated filters',
        function () {
            it('single url with filters', function(done) {
                test('a{ background: url(logo.png | split: "?" | first); }',
                    'a{ background: url({{ ' +
                        '"logo.png" | asset_url | split: "?" | first }}); }',
                    {}, done);
            });

            it('variable and single url with filters', function(done) {
                test('a{ background: url(logo.png | split: "?" | first)' +
                        ' $(modal_background_color); }',
                    'a{ background: url({{ ' +
                        '"logo.png" | asset_url | split: "?" | first }})' +
                        ' {{ settings.modal_background_color }}; }',
                    {}, done);
            });

            it('multiple url with filters', function(done) {
                test('a{ background: url(logo.png | split: "?" | first), ' +
                        'url("logo@2x.png" | downcase); }',
                    'a{ background: url({{ ' +
                        '"logo.png" | asset_url | split: "?" | first }}), ' +
                        'url({{ "logo@2x.png" | asset_url | downcase }}); }',
                    {}, done);
            });

            it('one url with filters, another without filters', function(done) {
                test('a{ background: url( logo.png ), ' +
                        'url(\'logo@2x.png\' | downcase); }',
                    'a{ background: url({{ ' +
                        '"logo.png" | asset_url }}), ' +
                        'url({{ "logo@2x.png" | asset_url | downcase }}); }',
                    {}, done);
            });
        });
});
