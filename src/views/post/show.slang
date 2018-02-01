section
  article.post
    section
      div.post-content.copy
        h1.post-content-title
          == link_to("#{post.title}", "/posts/#{post.slug}")
        div == post.markdown_content
        footer
          div = post.user.username
          div = time_to_string(post.created_at.not_nil!)
      aside
        == link_to("##{post.tag.name}", "/tags/#{post.tag.slug}")
        == link_to("read", "/posts/#{post.slug}", class: "btn btn-success btn-xs")
        == link_to("edit", "/posts/#{post.slug}/edit", class: "btn btn-success btn-xs")
        == link_to("delete", "/posts/#{ post.slug }?_method=delete&_csrf=#{csrf_token}", class: "btn btn-danger btn-xs", onclick: "return confirm('Are you sure?');")