h1 Show Post
p = post.title
p = post.body
p = post.slug
p = post.user.id
p
  == link_to("back", "/posts", class: "btn btn-success btn-xs")
  == link_to("edit", "/posts/#{post.id}/edit", class: "btn btn-success btn-xs")
  == link_to("delete", "/posts/#{post.id}?_method=delete&_csrf=#{csrf_token}", class: "btn btn-danger btn-xs", onclick: "return confirm('Are you sure?');")
