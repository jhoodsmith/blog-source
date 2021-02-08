+++
title = "Hugo blog with Org and GitHub Actions"
author = ["James Hood-Smith"]
summary = """
  In which I setup a working environment for writing a Hugo blog in Org with
  automatic deployment using GitHub Actions.
  """
date = 2021-02-02
lastmod = 2021-02-08T23:18:41+00:00
tags = ["hugo", "org"]
categories = ["blogging"]
draft = false
weight = 2001
+++

## Motivation {#motivation}

Like many dyed-in-the-wool Emacs users, I use [Org Mode](https://orgmode.org) for much of my writing. I
want a blog that I can deploy and write posts for in Org with minimum fuss.
Having heard good things about it, I want to give [Hugo](https://gohugo.io) a try. I also want to
have automatic deployment with [GitHub Actions](https://github.com/features/actions).


## Steps {#steps}


### Installation {#installation}

1.  Install Hugo:

    ```bash
    brew install hugo
    ```

2.  Setup [ox-hugo](https://ox-hugo.scripter.co), the Org exporter backend that exports Org to Hugo-compatible
    Markdown.

    In my case, I use [use-package](https://github.com/jwiegley/use-package), and so add the following to `init.el`.

    ```elisp
    (use-package ox-hugo)
    ```


### Setup blog with first post {#setup-blog-with-first-post}

1.  Create new site:

    ```bash
    hugo new site blog
    ```

2.  Configure Emacs to automatically create markdown files after saving the org source:

    This is accomplished by adding the following Emacs Lisp expression to
    `.dir-locals.el` in the project root.

    ```elisp
    ((org-mode . ((eval . (org-hugo-auto-export-mode)))))
    ```

3.  Add a nice theme as a git sub-module (I'm using [Harbor](https://github.com/matsuyoshi30/harbor)).

    ```bash
    cd themes/
    git submodule add https://github.com/alexandrevicenzi/harbor.git
    ```

    I want to use my blog straight away---hence my use of someone else's theme.
    In a subsequent post I look at modifying the theme, but for the time
    being I use the theme as is, and copy the configuration from the theme's
    [home page in Hugo Themes](https://themes.gohugo.io/harbor/) to `config.toml`.

4.  Add `blog.org` to the root of the blog directory and create your first blog post

    ```org
    #+hugo_base_dir: ./
    #+hugo_weight: auto
    #+hugo_auto_set_lastmod: t
    #+author: James Hood-Smith

    * Emacs                                                              :@emacs:
    All posts in here will have the category set to /emacs/.
    ** TODO Writing Hugo blog posts in Org                             :hugo:org:
    :PROPERTIES:
    :EXPORT_FILE_NAME: creating-hugo-blog-post
    :EXPORT_DATE: 2021-02-02
    :END:
    In which we setup our working environment for creating blog posts as sub-trees
    in a single org file.

    *** Installation
    ...
    ```

    To ensure things are working well run the Hugo development server

    ```bash
    hugo server -D --navigateToChange
    ```

    View the blog at `http://localhost:1313`.


### Automatic deployment to GitHub pages {#automatic-deployment-to-github-pages}

1.  Go to GitHub and create a repository for the source code and a repository for
    the deployed site. In my case the repositories are `blog-source` and
    `jhoodsmith.github.io`.

2.  In the "GitHub Pages" section of the settings page of the
    `jhoodsmith.github.io` repository, set the source to the `main` branch.

3.  Add a basic `.gitignore` file to the blog directory root

    ```text
    # Hugo default output directory
    /public

    ## OS Files
    # Windows
    Thumbs.db
    ehthumbs.db
    Desktop.ini
    $RECYCLE.BIN/

    # OSX
    .DS_Store
    ```

4.  Update the `baseurl` property in `config.toml` to the URL of the blog.

    ```toml
    baseurl = "https://jhoodsmith.github.io/"
    ```

5.  In your account settings in GitHub, create a new personal access token (PAT)
    with read and write access to your repositories. (Skip this step if you
    already have a suitable PAT).

6.  Store the PAT in the `Secrets` setting of the `blog-source` repository with
    key name `PERSONAL_TOKEN`.

7.  Create a new GitHub Actions workflow in `.github/workflows/blog_deploy.yml`

    ```yaml
    name: hugo CI

    on:
      push:
        branches: [ main ]

    jobs:
      build:
        runs-on: ubuntu-latest

        steps:
    ​      - uses: actions/checkout@v2
       with:
         submodules: true
         fetch-depth: 1

          - name: Setup Hugo
       uses: peaceiris/actions-hugo@v2
       with:
         hugo-version: 'latest'

          - name: Build
       run: hugo

          - name: Deploy
       uses: peaceiris/actions-gh-pages@v3
       with:
         personal_token: ${{ secrets.PERSONAL_TOKEN }}
         external_repository: jhoodsmith/jhoodsmith.github.io
         publish_branch: main
         publish_dir: ./public
    ```

If all has gone well, then the blog should automatically be deployed to your
GitHub pages site each time you push to the `main` branch of `blog-source`.
