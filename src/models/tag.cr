require "granite_orm/adapter/pg"

class Tag < Granite::ORM::Base
  adapter pg
  table_name tags

  # id : Int64 primary key is created for you
  field name : String
  timestamps
  
  has_many :posts
end
