+++
title = "Tweaking a Hugo theme"
author = ["James Hood-Smith"]
summary = "In which I modify an existing Hugo theme to add a custom page element."
date = 2021-02-08
tags = ["hugo", "org"]
categories = ["blogging"]
draft = false
weight = 2002
+++

## Motivation {#motivation}

In my [last post]({{< relref "creating-hugo-blog-post" >}}) I setup a new Hugo blog with an Org and GitHub Actions workflow.
I used an off-the-shelf theme, but now want a new, custom page element---a
short, one-or-two sentence summary that sits at the top of each post.


## Steps {#steps}


### Overwriting the Hugo .Summary page variable {#overwriting-the-hugo-dot-summary-page-variable}

The Hugo page variable `.Summary` is used in index pages and contains a
shortened or summarised version of a post. If not set explicitly, Hugo will
equate it to the first 70 words of the page content. I have decided to always
set it explicitly, and I want it inserted at the top of each post (as is
done on this page you are reading).

I start by adding the following to the top of my Org source:

```markdown
#+hugo_front_matter_key_replace: description>summary
```

As explained [here](https://ox-hugo.scripter.co/doc/replace-front-matter-keys/), this ensures that the value of the Hugo `.Summary` variable
is matched to the Org meta data `Description`.

In my Org source I can then add a  `Description` drawer to each post.

```org
** TODO Tweaking a Hugo theme                                      :hugo:org:
:PROPERTIES:
:EXPORT_FILE_NAME: modify-hugo-theme
:EXPORT_DATE: 2021-02-07
:END:

#+begin_description
In which I modify an existing Hugo theme to add a custom page element.
#+end_description

*** Motivation
In my [[*Hugo blog with Org and GitHub Actions][last post]] I setup a
new Hugo blog ...
```


### Modifying theme layout file {#modifying-theme-layout-file}

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
