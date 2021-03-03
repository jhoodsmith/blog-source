+++
title = "Hugo blog with Org and GitHub Actions"
author = ["James Hood-Smith"]
summary = """
  In which I setup a working environment for writing a Hugo blog in Org with
  automatic deployment using GitHub Actions.
  """
date = 2021-02-05
tags = ["hugo", "org"]
categories = ["blogging"]
draft = false
weight = 2001
toc = true
+++

## Motivation {#motivation}

Like many dyed-in-the-wool Emacs users, I use [Org Mode](https://orgmode.org) for much of my writing. I
want a blog that I can deploy and write posts for in Org with minimum fuss.
Having heard good things about it, I want to give [Hugo](https://gohugo.io) a try. I also want to
have automatic deployment with [GitHub Actions](https://github.com/features/actions).


## Steps {#steps}


### Installation {#installation}

1.  Install Hugo:

    ```shell
    $ brew install hugo
    ```

2.  Setup [ox-hugo](https://ox-hugo.scripter.co), the Org exporter backend that exports Org to Hugo-compatible
    Markdown.

    In my case, I use [use-package](https://github.com/jwiegley/use-package), and so add the following to `init.el`.

    ```elisp
    (use-package ox-hugo)
    ```


### Setup blog with first post {#setup-blog-with-first-post}

1.  Create new site:

    ```shell
    $ hugo new site blog
    ```

2.  Configure Emacs to automatically create markdown files after saving the org source:

    This is accomplished by adding the following Emacs Lisp expression to
    `.dir-locals.el` in the project root.

    ```elisp
    ((org-mode . ((eval . (org-hugo-auto-export-mode)))))
    ```

3.  Add a nice theme as a git sub-module (I'm using [Harbor](https://github.com/matsuyoshi30/harbor)).

    ```shell
    $ cd themes/
    $ git submodule add https://github.com/alexandrevicenzi/harbor.git
    ```

    I want to use my blog straight away---hence my use of someone else's theme.
    In a subsequent post I look at creating a new theme from scratch, but for the
    time being I use Harbor with its default settings, hence I copy the
    configuration from the theme's [home page in Hugo Themes](https://themes.gohugo.io/harbor/) to `config.toml`.

4.  Add `blog.org` to the root of the blog directory and create your first blog post

    ```org
    #+hugo_base_dir: ./
    #+hugo_weight: auto
    #+author: James Hood-Smith

    * Blogging                                                        :@blogging:
    All posts in here will have the category set to /blogging/.
    ** DONE Hugo blog with Org and GitHub Actions                      :hugo:org:
    :PROPERTIES:
    :EXPORT_FILE_NAME: creating-hugo-blog-post
    :EXPORT_DATE: 2021-02-03
    :EXPORT_HUGO_CUSTOM_FRONT_MATTER: :toc true
    :END:

    #+begin_description
    In which I setup a working environment for writing a Hugo blog in Org with
    automatic deployment using GitHub Actions.
    #+end_description

    *** Motivation
    Like many dyed-in-the-wool Emacs users, I use [[https://orgmode.org][Org Mode]] ...
    ```

    To ensure things are working well run the Hugo development server

    ```shell
    $ hugo server -D --navigateToChange
    ```

    View the blog at `http://localhost:1313`.


### Making change to theme {#making-change-to-theme}


#### Overwriting the Hugo .Summary page variable {#overwriting-the-hugo-dot-summary-page-variable}

Notice in the blog post source above that I made use of the Org meta data
`Description` variable. I would like this to be used in place of the Hugo page
variable `.Summary`.  To achive this I need to add the following to the top of my
Org source

```markdown
#+hugo_front_matter_key_replace: description>summary
```

As explained [here](https://ox-hugo.scripter.co/doc/replace-front-matter-keys/), this swaps the Hugo front-matter variable with the Org meta
data variable.


#### Modifying theme layout file {#modifying-theme-layout-file}

To change an aspect of a Hugo theme, it's just a matter of creating a file with
the same name and directory structure as the layout file you want to replace. In
my case, I want to modify part of `/themes/harbor/layouts/partials/toc.html`,
which is where the theme author inserts the page variable `.Content`. Hence, I
copy the file to `/layouts/partials/toc.html`.

In the copy of `toc.html`, I then replace `{{ .Content }}` with the following.

```html
{{ if eq .Type "posts" }}
<div class="summary">
  {{ .Summary }}
</div>
{{ end }}
{{ .Content }}
```

This ensures that all content files of type "posts" will have their content
prefaced with the value of `.Summary`. Following the theme author's
instructions, I have added my custom CSS to `/static/css/custom.css`.


### Automatic deployment to GitHub pages {#automatic-deployment-to-github-pages}

1.  Go to GitHub and create a repository for the source code and a repository for
    the deployed site. In my case the repositories are `blog-source` and
    `jhoodsmith.github.io`.

2.  Add a basic `.gitignore` file to the blog directory root

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

3.  Update the `baseurl` property in `config.toml` to the URL of the blog.

    ```toml
    baseurl = "https://jhoodsmith.github.io/"
    ```

4.  In your account settings in GitHub, create a new personal access token (PAT)
    with read and write access to your repositories. (Skip this step if you
    already have a suitable PAT).

5.  Store the PAT in the `Secrets` setting of the `blog-source` repository with
    key name `PERSONAL_TOKEN`.

6.  Create a new GitHub Actions workflow in `.github/workflows/deploy.yml`

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
		    run: hugo --minify

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
