+++
title = "Creating own theme using Tailwindcss"
author = ["James Hood-Smith"]
date = 2021-02-05
categories = ["blogging"]
draft = true
weight = 2002
toc = true
+++

## Tailwindcss {#tailwindcss}

In blog source root

```shell
$ hugo new theme jhs-tailwindcss
$ npm init
$ npm install --save-dev autoprefixer postcss postcss-cli postcss-import tailwindcss
```

In `config.toml`

```toml
...
theme = "jhs-tailwindcss"
```

In `themes/jhs-tailwindtheme/assets/css/postcss.config.js`

```js
const themeDir = __dirname + '/../../';

const purgecss = require('@fullhuman/postcss-purgecss')({
    // see https://gohugo.io/hugo-pipes/postprocess/#css-purging-with-postcss
    // and https://github.com/dirkolbrich/hugo-theme-tailwindcss-starter
    content: [
      './hugo_stats.json',
      themeDir + '/hugo_stats.json'
    ],
    defaultExtractor: (content) => {
      let els = JSON.parse(content).htmlElements;
      return els.tags.concat(els.classes, els.ids);
    }
})

module.exports = {
    plugins: [
      require('postcss-import')({
	  path: [themeDir]
      }),
      require('tailwindcss')(themeDir + 'assets/css/tailwind.config.js'),
      require('autoprefixer')({
	  path: [themeDir]
      }),
      ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : [])
    ]
}
```

In `themes/jhs-tailwindcss/assets/css/tailwind.config.js`

```js
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
```

In `themes/jhs-tailwindcss/assets/css/styles.scss`

```scss
@import "node_modules/tailwindcss/base";
@import "node_modules/tailwindcss/components";
@import "node_modules/tailwindcss/utilities";
```

In `themes/jhs-tailwind/layouts/partials/head.html`

```html
  ...
{{ $styles := resources.Get "css/styles.scss" | toCSS | postCSS (dict "config" "./assets/css/postcss.config.js") }}
{{ if .Site.IsServer }}
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}">
{{ else }}
  {{ $styles := $styles | minify | fingerprint | resources.PostProcess }}
  <link rel="stylesheet" href="{{ $styles.Permalink }}" integrity="{{ $styles.Data.Integrity }}">
{{ end }}
```


## Fontawesome {#fontawesome}

```shell
$ npm install --save @fortawesome/fontawesome-free
```

Add to `themes/jhs-tailwind/assets/js/index.js`

```js
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
```
