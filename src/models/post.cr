require "granite_orm/adapter/pg"
require "markdown"
require "autolink"

class Post < Granite::ORM::Base
  adapter pg
  table_name posts

  belongs_to :user
  belongs_to :tag

  # id : Int64 primary key is created for you
  field title : String
  field body : String
  field slug : String
  timestamps

  validate(:title, "required.", ->(post : self) {
    (post.title != nil && post.title != "")
  })

  validate(:body, "required.", ->(post : self) {
    (post.body != nil && post.body != "")
  })

  validate(:slug, "required.", ->(post : self) {
    (post.slug != nil && post.slug != "")
  })

  # validate(:slug, "duplicated", ->(post : self) {
  #   (exists = Post.find_by :slug, post.slug) ? false : true
  # })

  def markdown_content
    Autolink.auto_link(Markdown.to_html(body.not_nil!))
  end

  def to_text
"----------------------------------------
title      : #{title}
created_at : #{created_at}
written_by : #{user.username}
tag        : #{tag.name}
----------------------------------------

#{body}"
  end
end
