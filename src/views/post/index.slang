div.row
  div.col-sm-11
    h2 Posts
  div.col-sm-1
    a.btn.btn-success.btn-xs href="/posts/new" New
div.table-responsive
  table.table.table-striped
    thead
      tr
        th Title
        th Body
        th Slug
        th User
        th Actions
    tbody
    - posts.each do |post|
      tr
        td = post.title
        td = post.body
        td = post.slug
        td = post.user.id
        td
          span
            == link_to("read", "/posts/#{post.id}", class: "btn btn-success btn-xs")
            == link_to("edit", "/posts/#{post.id}/edit", class: "btn btn-success btn-xs")
            == link_to("delete", "/posts/#{ post.id }?_method=delete&_csrf=#{csrf_token}", class: "btn btn-danger btn-xs", onclick: "return confirm('Are you sure?');")
