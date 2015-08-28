# PostCSS Shopify Settings Variables [![Build Status][ci-img]][ci]

[PostCSS] plugin for variable of theme setting in shopify css file.
It's common to use code like `{{ settings.headline_color }}` as value of css property in css file of shopify theme. It cause some annoying issues since it's a invalid value of css. For exmaple, your code editor will lost syntax highlighting.
With this simple plugin, you can use code like `$(headline_color)` instead. It will be transformed to the syntax shopify support.

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

```css
.foo {
    color: {{ settings.headline_color }};
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
