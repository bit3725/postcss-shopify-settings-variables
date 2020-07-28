const postcss = require('postcss');

const plugin = require('./');

async function run(input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

describe('postcss-shopify-settings-variables', () => {
  it('replace single variable in value', async () => {
    await run(
      'a{ color: $(headline_color); }',
      'a{ color: {{ settings.headline_color }}; }',
      {},
    );
  });

  it('replace multiple variables in multiple values', async () => {
    await run(
      'a{ color: $(headline_color); background-color: $(healine_bg_color); }',
      'a{ color: {{ settings.headline_color }}; background-color: {{ settings.healine_bg_color }}; }',
      {},
    );
  });

  it('replace single variable in value with pixel unit', async () => {
    await run(
      'body{ font-size: $(headline_size)px; }',
      'body{ font-size: {{ settings.headline_size }}px; }',
      {},
    );
  });

  it('replace single variable in value with liquid filter', async () => {
    await run(
      'a{ font-size: $(headline_size | divided_by: 2)px; }',
      'a{ font-size: {{ settings.headline_size | divided_by: 2 }}px; }',
      {},
    );
  });

  it('replace single variable in value with liquid string filter', async () => {
    await run(
      "a{ font-family: $(font_family | replace: '+', ' '); }",
      "a{ font-family: {{ settings.font_family | replace: '+', ' ' }}; }",
      {},
    );
  });

  it('replace single variable in value which has multiple variables', async () => {
    await run(
      'a{ border-bottom: 1px dotted $(border_color); }',
      'a{ border-bottom: 1px dotted {{ settings.border_color }}; }',
      {},
    );
  });

  it('replace single variable in value when there is quotes', async () => {
    await run(
      'a{ font-family: "$(headline_google_webfont_font)"; }',
      'a{ font-family: "{{ settings.headline_google_webfont_font }}"; }',
      {},
    );
  });

  it('replace single variable in value when there is parenthesis', async () => {
    await run(
      'a{ background: rgba($(header_bg_color), 0.9); }',
      'a{ background: rgba({{ settings.header_bg_color }}, 0.9); }',
      {},
    );
  });

  describe('replace background url with asset_url filter', () => {
    it('no quote', async () => {
      await run(
        'a{ background: url(logo.png); }',
        'a{ background: url({{ "logo.png" | asset_url }}); }',
        {},
      );
    });

    it('with space', async () => {
      await run(
        'a{ background: url( logo.png ); }',
        'a{ background: url({{ "logo.png" | asset_url }}); }',
        {},
      );
    });

    it('single quote', async () => {
      await run(
        "a{ background: url('logo.png'); }",
        'a{ background: url({{ "logo.png" | asset_url }}); }',
        {},
      );
    });

    it('double quote', async () => {
      await run(
        'a{ background: url("logo.png"); }',
        'a{ background: url({{ "logo.png" | asset_url }}); }',
        {},
      );
    });

    it('only replace url', async () => {
      await run(
        'a{ background-image: url(logo.png) no-repeat; }',
        'a{ background-image: url({{ "logo.png" | asset_url }}) no-repeat; }',
        {},
      );
    });

    it('multiple url', async () => {
      await run(
        'a{ background: url("logo.png"), url(logo@2x.jpg); }',
        'a{ background: url({{ "logo.png" | asset_url }}), url({{ "logo@2x.jpg" | asset_url }}); }',
        {},
      );
    });

    it('not replace url with full path', async () => {
      await run(
        'a{ background: url("http://a.com/logo.png"); }',
        'a{ background: url("http://a.com/logo.png"); }',
        {},
      );
    });

    it('not replace url with data uri', async () => {
      await run(
        'a{ background: url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7); }',
        'a{ background: url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7); }',
        {},
      );
    });
  });

  it('replace variable and url together', async () => {
    await run(
      'a{ background: $(modal_background_color) url("newsletter_bg.png"); }',
      'a{ background: {{ settings.modal_background_color }} url({{ "newsletter_bg.png" | asset_url }}); }',
      {},
    );
  });

  describe('insert asset_url filter between background url and associated filters', () => {
    it('single url with filters', async () => {
      await run(
        'a{ background: url(logo.png | split: "?" | first); }',
        'a{ background: url({{ "logo.png" | asset_url | split: "?" | first }}); }',
        {},
      );
    });

    it('variable and single url with filters', async () => {
      await run(
        'a{ background: url(logo.png | split: "?" | first) $(modal_background_color); }',
        'a{ background: url({{ "logo.png" | asset_url | split: "?" | first }}) {{ settings.modal_background_color }}; }',
        {},
      );
    });

    it('multiple url with filters', async () => {
      await run(
        'a{ background: url(logo.png | split: "?" | first), url("logo@2x.png" | downcase); }',
        'a{ background: url({{ "logo.png" | asset_url | split: "?" | first }}), url({{ "logo@2x.png" | asset_url | downcase }}); }',
        {},
      );
    });

    it('one url with filters, another without filters', async () => {
      await run(
        "a{ background: url( logo.png ), url('logo@2x.png' | downcase); }",
        'a{ background: url({{ "logo.png" | asset_url }}), url({{ "logo@2x.png" | asset_url | downcase }}); }',
        {},
      );
    });
  });

  it('multiple settings on same line', async () => {
    await run(
      'a{ font-family: $(type_header_font_family.family), $(type_header_font_family.fallback_families); }',
      'a{ font-family: {{ settings.type_header_font_family.family }}, {{ settings.type_header_font_family.fallback_families }}; }',
      {},
    );
  });
});
