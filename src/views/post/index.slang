- posts.each do |post|
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
          == link_to("##{post.tag.name}", "/tags/#{post.tag.slug}", class: "post-link, post-link-tag")
          == link_to("PERMALINK", "/posts/#{post.slug}", class: "post-link, post-link-permalink")
          == link_to("MARKDOWN", "/posts/#{post.slug}.txt", class: "post-link, post-link-text")