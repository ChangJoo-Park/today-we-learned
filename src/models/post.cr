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

  def markdown_content
    Autolink.auto_link(Markdown.to_html(body.not_nil!))
  end
end
