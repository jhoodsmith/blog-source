+++
title = "Tweaking a Hugo theme"
author = ["James Hood-Smith"]
summary = "In which I modify an existing Hugo theme to add a custom page element."
date = 2021-02-07
lastmod = 2021-02-08T11:08:37+00:00
tags = ["hugo", "org"]
categories = ["blogging"]
draft = true
weight = 2002
+++

## Motivation {#motivation}

In my [last post]({{< relref "creating-hugo-blog-post" >}}) I setup a new Hugo blog with an Org and GitHub Actions workflow.
I used an off-the-shelf theme, but now want a new, custom page element---a
short, one-or-two sentence summary that sits at the top of each post.


## Steps {#steps}


### Replace front-matter key {#replace-front-matter-key}

In line with the ox-hugo [instructions](https://ox-hugo.scripter.co/doc/replace-front-matter-keys/), we add the following to the top of our Org source:

```markdown
#+hugo_front_matter_key_replace: description>summary
```

This ensures that the value of the Hugo `.Summary` variable equates to the Org
`Descriptio` meta data.

In each post we specify the value of `Description` in its own drawer:

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

I place this straight after the `PROPERTIES` drawer.


### Inserting summary above content {#inserting-summary-above-content}

To combine your own site components with those from a theme, it's just a matter
of creating a file with the same name and directory structure as the file you
want to replace. In my case, I want to modify part of
`/themes/harbor/layouts/partials/toc.html`, which is where the theme author
inserts the page variable `.Content`. Hence, I put a copy of the file at
`/layouts/partials/toc.html` and modify that.

In the copy of `toc.html` I replace `{{ .Content }}` with the following.

```html
{{ if eq .Type "posts" }}
<div class="summary">
  {{ .Summary }}
</div>
{{ end }}
{{ .Content }}
```
