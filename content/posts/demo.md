+++
title = "Creating a Hugo blog using Org"
author = ["James Hood-Smith"]
date = 2021-02-01
tags = ["hugo", "org"]
categories = ["emacs"]
draft = true
+++

In which we setup our working environment for creating blog posts as single page
Org files.


## Installation {#installation}

Install Hugo:

```bash
brew install hugo
```

Setup Org:

```elisp
;; Add to init.el
(use-package ox-hugo)
```


## Setup new blog {#setup-new-blog}

Create new site:

```bash
hugo new site blog
```

Add Org directory:

```bash
cd blog
mkdir content-org
```

Configure Org to automatically create markdown files:

```elisp
;; Save to .dir-locals.el in blog root
(("content-org/"
  . ((org-mode . ((eval . (org-hugo-auto-export-mode)))))))
```

Add a nice theme as a git sub module (I'm using [Harbor](https://github.com/matsuyoshi30/harbor)).

```bash
cd themes/
git submodule add https://github.com/alexandrevicenzi/harbor.git
```

Copy the configuration from the theme's [page in Hugo Themes](https://themes.gohugo.io/harbor/) into the file `config.toml`.


## New post template {#new-post-template}

Start each new Org file in `content-org` with the following snippet:

```md
#+title: Blog post title
#+date: YYYY-MM-DD
#+author: James Hood-Smith

#+hugo_base_dir: ../
#+hugo_tags: tag1 tag2
#+hugo_categories: category
#+hugo_draft: true
```

[//]: # "Exported with love from a post written in Org mode"
[//]: # "- https://github.com/kaushalmodi/ox-hugo"
