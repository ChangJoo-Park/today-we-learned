section
  article.post
    section
      div.post-content.copy
        h1.post-content-title
          == link_to("#{post.title}", "/posts/#{post.id}")
        div == post.markdown_content
        footer
          div = post.user.username
          div = post.created_at
      aside
        == link_to("##{post.tag.name}", "/#{post.tag.name}")
        == link_to("read", "/posts/#{post.id}", class: "btn btn-success btn-xs")
        == link_to("edit", "/posts/#{post.id}/edit", class: "btn btn-success btn-xs")
        == link_to("delete", "/posts/#{ post.id }?_method=delete&_csrf=#{csrf_token}", class: "btn btn-danger btn-xs", onclick: "return confirm('Are you sure?');")