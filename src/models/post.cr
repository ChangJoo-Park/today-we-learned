require "granite_orm/adapter/pg"

class Post < Granite::ORM::Base
  adapter pg
  table_name posts

  belongs_to :user

  # id : Int64 primary key is created for you
  field title : String
  field body : String
  field slug : String
  timestamps
end
