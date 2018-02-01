- if post.errors
  ul.errors
  - post.errors.each do |error|
    li = error.to_s

== form(action: "/posts/#{post.id.to_s}", method: post.id ? :patch : :post) do
  == csrf_tag
  div.form-group
    == text_field(name: "title", value: post.title, placeholder: "Title", class: "form-control", autofocus: "true")
  div.form-group
    == text_area(name: "body", content: post.body, placeholder: "Using Markdown :)", class: "form-control", size: "30x10")
  div.form-group
    == select_field(name: "tag_id", collection: Tag.all("ORDER BY name").map{|tag| [tag.id, tag.name]}, selected: post.tag_id, class: "form-control")	
  div.form-group
    == text_field(name: "slug", value: post.slug, placeholder: "Slug", class: "form-control")
  == submit("Submit", class: "btn btn-primary")
  == link_to("back", "/", class: "btn btn-default")
