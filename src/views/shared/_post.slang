section
  article.post
    section
      div.post-content.copy
        h1.post-content-title
          == link_to("#{post.title}", "/posts/#{post.slug}")
        div.post-content-body == post.to_markdown
        footer
          div
            == link_to("#{post.user.username}", "/profile/#{post.user.id}")
          div = time_to_string(post.created_at.not_nil!)
      aside
          == link_to("##{post.tag.name}", "/tags/#{post.tag.slug}", class: "post-link, post-link-tag")
          == link_to("PERMALINK", "/posts/#{post.slug}", class: "post-link, post-link-permalink")
          == link_to("MARKDOWN", "/posts/#{post.slug}.txt", class: "post-link, post-link-text")