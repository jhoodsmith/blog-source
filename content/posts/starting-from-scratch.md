+++
title = "Starting from scratch"
author = ["James Hood-Smith"]
summary = """
  In which I describe the starter projects for the languages and frameworks I work
  with. These currently comprise Ruby (non Rails), Ruby on Rails, Python and Hugo
  """
date = 2021-05-15
categories = ["general"]
draft = false
weight = 2001
toc = true
+++

## Motiviation {#motiviation}

"How do I start this again?" I often ask myself this when I start a new project.
What are the external libraries I need? What tools do I need for test-driven
development? How do I get things to play nice with my [Emacs configuration](https://github.com/jhoodsmith/.emacs.d)?


## Ruby GEM with simple CLI (non Rails) {#ruby-gem-with-simple-cli--non-rails}

Create directory structure

```shell
$ bundler gem --exe --test=rspec --ci=github my_app
```

This will create a new directory called `my_app` containing a skeleton directory
structure for a new project.

Next you will need to update the `.gemspec` file located in the root of the
directory. It is especially important to update any field whose value starts
with "TODO", otherwise the Gem will not build.

Add `pry` and `pry-byebug` to `Gemfile` and uncomment the two lines in
`/bin/console` that refer to Pry.


## Simple Ruby program (not a Gem) {#simple-ruby-program--not-a-gem}

Create project directory

```shell
$ mkdir new-project-name
$ cd new-project-name
$ mkdir lib
```

Initialise `Gemfile` with RSpec

```ruby
source 'https://rubygems.org'

gem 'rspec'
```

Next run `bundle` with added bin directory

```shell
$ gem bundle install --binstubs
```

And setup RSpec

```shell
$ bin/rpsec --init
```

Create your files in `lib`, as this directory is automatically added to the Ruby
`LOAD_PATH` when running RSpec.


## Python {#python}

Assuming [pyenv](https://github.com/pyenv/pyenv) is installed, remind yourself of what versions are available on
the local system

```shell
$ pyenv versions
```

Create a new virtual environment for the your chosen python version

```shell
$ pyenv virtualenv 3.7.5 new-project-name
```

Create project directory

```shell
$ mkdir new-project-name
$ cd new-project-name
```

Create `.python-version`

```shell
$ echo new-project-name > .python-version
```

Specifiy development dependencies in `requirements.txt`

```text
###### Working environment ######
ipython
pytest
python-language-server[all]

###### Frequently used ######
numpy
pandas
requests
scikit-learn
scipy
```

Install packages

```shell
$ pip install -r requirements.txt
```

Add an appropriate `.gitignore` file from <https://gitignore.io>


## Ruby on Rails 6 {#ruby-on-rails-6}

The assumption here is that there will be a [PostgreSQL](https://www.postgresql.org) database, and that [Devise](https://github.com/heartcombo/devise)
will be used for authentication.

```shell
$ rails new -d postgresql new-project
```

```ruby
# ...
group :development, :test do
  # ...
  gem 'factory_bot_rails'
  gem 'pry-byebug'
  gem 'pry-doc'
  gem 'rspec-rails'
  gem 'rails-controller-testing'
  gem 'solargraph'
end

group :development do
  gem 'rubocop-rails'
end

gem 'devise'
gem 'devise_invitable'
gem 'tailwindcss-rails'
```

```shell
$ yarn add @fortawesome/fontawesome-free
```

Add to `app/javascript/packs/application.js`

```js
import "@fortawesome/fontawesome-free/css/all"
```

```shell
$ rails tailwindcss:install
$ rails db:create
$ rails g devise:install
$ rails g devise_invitable User
$ rails g devise:views
$ rails g rspec:install
```

To make Devise happy add the following to `config/environments/development.rb`

```ruby
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```


## Hugo {#hugo}

```shell
$ hugo new site new-project
```

I'll assume we are using PostCSS as our preprocessor. In this case, we need to
execute the following from within project directory.

```shell
$ # this can be skipped if we are not using tailwindcss
$ npm init
$ npm install --save-dev autoprefixer postcss postcss-cli postcss-import tailwindcss
```

In `/assets/css/postcss.config.js`

```js
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [ './hugo_stats.json' ],
    defaultExtractor: (content) => {
      let els = JSON.parse(content).htmlElements;
      return els.tags.concat(els.classes, els.ids);
    }
});

module.exports = {
    plugins: [
      require('postcss-import')({
	  path: ["assets/css"]
      }),
      require('tailwindcss')('assets/css/tailwind.config.js'),
      require('autoprefixer'),
      ...(process.env.HUGO_ENVIRONMENT === 'production' ? [ purgecss ] : [])
    ]
};
```

In `/assets/css/main.scss`

```scss
@import "node_modules/tailwindcss/base";
@import "node_modules/tailwindcss/components";
@import "node_modules/tailwindcss/utilities";
```

In `/config.toml`

```toml
baseURL = "https://www.example.co.uk"
languageCode = "en-gb"
title = "New Web Site"

[build]
writeStats = true
```

```shell
$ npx tailwindcss init
$ mv tailwind.config.js assets/css
```

```shell
$ npm install --save @fortawesome/fontawesome-free alpinejs
```

Then add the following to `/assets/js/index.js`

```js
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'

import 'alpinejs'
```

In `/layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="en-gb">
  {{- partial "head.html" . -}}
  <body>
    {{- partial "header.html" . -}}
    {{- block "main" . }}{{- end }}
    {{- partial "footer.html" . -}}
  </body>
</html>
```

In `/layouts/partials/head.html`:

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ .Site.Title -}}</title>

  <meta name="description" content="">
  <meta name="robots" content="index,follow">
  <meta name="googlebot" content="index,follow">
  <meta name="google" content="nositelinkssearchbox">

  {{ $styles := resources.Get "css/main.scss" | toCSS | postCSS (dict "config" "./assets/css/postcss.config.js") }}
  {{ if .Site.IsServer }}
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}">
  {{ else }}
  {{ $styles := $styles | minify | fingerprint | resources.PostProcess  }}
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}">
  {{ end }}

  {{- $scripts := resources.Get "js/index.js" | js.Build | minify | fingerprint }}
  <script type="text/javascript" src ="{{ $scripts.RelPermalink }}"></script>
</head>
```

Create blank `/layouts/index.html`

```html
{{ define "main" }}
Hello World
{{ end }}
```

Finally, create empty header and footer

```shell
$ touch layouts/partials/footer.html
$ touch layouts/partials/header.html
```
