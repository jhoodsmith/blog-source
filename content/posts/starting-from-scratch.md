+++
title = "Starting from scratch"
author = ["James Hood-Smith"]
summary = """
  In which I describe the starter projects for the languages and frameworks I work
  with. These currently comprise Ruby (non Rails), Ruby on Rails, Python and Hugo
  """
date = 2021-02-25
categories = ["general"]
draft = false
weight = 2001
toc = true
+++

## Motiviation {#motiviation}

"How do I start this again?" I often ask myself this when I start a new project.
What are the external libraries I need? What tools do I need for test-driven
development? How do I get things to play nice with my [Emacs configuration](https://github.com/jhoodsmith/.emacs.d)?


## Ruby (non Rails) {#ruby--non-rails}

Create project directory

```shell
$ mkdir new-project-name
$ cd new-project-name
```

Install [Bundler](https://bundler.io)

```shell
$ gem install bundler
```

Specify dependencies in a `Gemfile`

```ruby
source 'https://rubygems.org'
gem 'pry'
gem 'pry-doc'
gem 'rspec'
gem 'rubocop', require: false
```

Install and initialise [RSpec](https://rspec.info)

```shell
$ bundle install
$ rspec --init
```

Add an appropriate `.gitignore` file from <https://gitignore.io>


## Python {#python}

Assuming [pyenv](https://github.com/pyenv/pyenv) is installed, remind yourself of what versions are available on the local system

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
jedi
pytest

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
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'factory_bot_rails'
  gem 'pry-byebug'
  gem 'pry-doc'
  gem 'rspec-rails'
  gem 'rails-controller-testing'
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
```


## Hugo {#hugo}

```shell
$ hugo new site new-project
```

Setup Tailwind CSS theme and JavaScript, as described in my [previous post]({{< relref "custom-theme-with-tailwindcss" >}}).
