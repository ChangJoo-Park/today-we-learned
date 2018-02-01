- if tag.errors
  ul.errors
  - tag.errors.each do |error|
    li = error.to_s

== form(action: "/tags/#{tag.id.to_s}", method: tag.id ? :patch : :post) do
  == csrf_tag
  div.form-group
    == text_field(name: "name", value: tag.name, placeholder: "Name", class: "form-control")
  div.form-group
    == text_field(name: "slug", value: tag.slug, placeholder: "Slug", class: "form-control")

  == submit("Submit", class: "btn btn-primary btn-xs")
  == link_to("back", "/tags", class: "btn btn-default btn-xs")
