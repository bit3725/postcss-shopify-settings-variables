# PostCSS Shopify Settings Variables [![Build Status][ci-img]][ci]

[PostCSS] plugin to allow use of Shopify specific theme variables in Shopify css files.

It's common in a Shopify theme css file to use code such as `{{ settings.headline_color }}` as a value of `css property`. Sadly, this will cause some annoying issues such as your code editor will loose syntax highlighting, and more. This happens because such values are invalid form of css.

With this simple [PostCSS](https://github.com/postcss/postcss) plugin, you can safely use code like `$(headline_color)` instead. This code will be transformed to the syntax Shopify parsers support.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/bit3725/postcss-shopify-settings-variables.svg
[ci]:      https://travis-ci.org/bit3725/postcss-shopify-settings-variables

```css
.foo {
    color: $(headline_color);
    font-family: $(regular_websafe_font | replace: '+', ' ');
    font-size: $(regular_font_size)px;
    border: 1px solid $(border_color);
    background: rgba($(settings.header_bg_color), 0.9);
    background: url(logo.png);
}
```

Will be transformed to:

```css
.foo {
    color: {{ settings.headline_color }}; /* Shopify friendly values */
    font-family: {{ settings.regular_websafe_font | replace: '+', ' ' }};
    font-size: {{ settings.regular_font_size }}px;
    border: 1px solid {{ settings.border_color ));
    background: rgba({{ settings.header_bg_color }}, 0.9);
    background: url({{ "logo.png" | asset_url }});
}
```

## Usage

```js
postcss([ require('postcss-shopify-settings-variables') ])
```

See [PostCSS] docs for examples for your environment.
