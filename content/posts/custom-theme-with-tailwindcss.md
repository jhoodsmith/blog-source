+++
title = "Creating custom Hugo theme with Tailwind CSS"
author = ["James Hood-Smith"]
summary = """
  In which I create a new Hugo theme using Tailwind CSS and Hugo Pipes, and upgrade
  my GitHub Actions workflow to use NPM.
  """
date = 2021-02-20
tags = ["hugo", "org", "tailwindcss"]
categories = ["blogging"]
draft = false
weight = 2002
toc = true
+++

## Motivation {#motivation}

In my [previous post]({{< relref "creating-hugo-blog-post" >}}) I created a blog using [Hugo](https://gohugo.io) with post creation done in
[Org Mode](https://orgmode.org). I used a theme from another developer, but now I want to create
something of my own. I want to use [Tailwind CSS](https://tailwindcss.com), which I currently use for
other projects.


## Install Tailwind CSS {#install-tailwind-css}

In the blog's root directory, instruct Hugo to create a new, blank theme
template and install the relevant npm packages.

```shell
$ hugo new theme jhs-tailwindcss
$ npm init
$ npm install --save-dev autoprefixer postcss postcss-cli postcss-import tailwindcss
```

Next, edit `config.toml` to set the site's theme to be the one just created.

```toml
# ...
theme = "jhs-tailwindcss"
```

I will use Hugo Pipes to process the CSS files with [PostCSS](https://postcss.org). The configuration
for this is in `themes/jhs-tailwindtheme/assets/css/postcss.config.js`, so
open it up and add the following:

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

Next create a minimal Tailwind CSS configuration in
`themes/jhs-tailwindcss/assets/css/tailwind.config.js`

```js
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
```

Then in `themes/jhs-tailwindcss/assets/css/styles.scss` add tailwind's `base`,
`components` and `utilities` styles.

```scss
@import "node_modules/tailwindcss/base";
@import "node_modules/tailwindcss/components";
@import "node_modules/tailwindcss/utilities";
```

We'll now set up Hugo Pipes. This is done in `themes/jhs-tailwind/layouts/partials/head.html`

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

At this point, the Tailwind CSS setup is complete, so we can use Tailwind CSS
classes in the layout files of our new Hugo theme. See the blog's [repo](https://github.com/jhoodsmith/blog-source) for full
details of the Tailwind CSS classes I used for the theme.


## Tailwind Typography and Org Export {#tailwind-typography-and-org-export}

The [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography) plugin provides good typographic styling for unstyled HTML,
and so is perfect for a blog whose content is exported from Org Mode.

Start by installing the plugin's npm package:

```shell
$ npm install @tailwindcss/typography
```

To customise the plugin's default look-and-full, you need to edit
`themes/jhs-tailwindcss/assets/css/tailwind.config.js`, and specify changes
using [CSS-in-JS](https://tailwindcss.com/docs/plugins#css-in-js-syntax) syntax.

This blog has various edits to `tailwind.config.js`, but the following are the
important ones needed to make the exported Org Mode code blocks look right.

```js
module.exports = {
    theme: {
      extend: {
	  typography: {
	      DEFAULT: {
		  css: {
		      color: '#9CA3AF',
		      code: {
			  color: '#E5E7EB',
			  backgroundColor: '#374151',
			  borderRadius: '4px',
			  padding: '2px 3px'
		      },
		      'code::before': {
			  display: 'none'
		      },
		      'code::after': {
			  display: 'none'
		      },
		      // ...
		  },
	      },
	  }
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ]
}
```

It should be noted that I also add the following to `styles.scss`.

```scss
pre {
    background-color: #374151 !important;
}
```

Again, see the blog's [repo](https://github.com/jhoodsmith/blog-source) for full details.


## Font Awesome {#font-awesome}

You don't need to install Font Awesome using npm. However, I expect I will need
additional JavaScript libraries in future, so want a good JS bundler setup.

Start by installing the Font Awesome package:

```shell
$ npm install --save @fortawesome/fontawesome-free
```

Then add the following to `themes/jhs-tailwind/assets/js/index.js`

```js
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
```

The Hugo Pipes work is, again, done in `themes/jhs-tailwind/layouts/partials/head.html`:

```html
{{- $scripts := resources.Get "js/index.js" | js.Build | minify | fingerprint }}
<script type="text/javascript" src = '{{ $scripts.RelPermalink }}'></script>
```


## Extending GitHub Actions Workflow {#extending-github-actions-workflow}

The following is my complete GitHub Actions workflow, found in
`.github/workflows/deploy.yml`. After I push the to the `main` branch, the
workflow will install dependencies using npm and then build the site using Hugo.

```yaml
name: hugo CI

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true 
          fetch-depth: 1   

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: '12.x'

      - name: Cache dependencies
        uses: actions/cache@v1
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: npm ci
      - run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }}
          external_repository: jhoodsmith/jhoodsmith.github.io
          publish_branch: main
          publish_dir: ./public

```
