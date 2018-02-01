doctype html
html
  head
    title Today We Learned using Amber
    meta charset="utf-8"
    meta http-equiv="X-UA-Compatible" content="IE=edge"
    meta name="viewport" content="width=device-width, initial-scale=1"
    link rel="stylesheet" href="//cdn.jsdelivr.net/editor/0.1.0/editor.css"
    link rel="stylesheet" href="/dist/main.bundle.css"

  body
    == render(partial: "shared/_header.slang")
    == render(partial: "shared/_nav.slang")

    main
      == content

    script src="//cdn.jsdelivr.net/editor/0.1.0/editor.js"
    script src="//cdn.jsdelivr.net/editor/0.1.0/marked.js"
    script src="/dist/main.bundle.js"
