require "granite_orm/adapter/pg"

class Tag < Granite::ORM::Base
  adapter pg
  table_name tags

  # id : Int64 primary key is created for you
  field name : String
  field slug : String
  timestamps

  has_many :posts

  validate(:slug, "required.", ->(tag : self) {
    (tag.slug != nil && tag.slug != "")
  })

  validate(:slug, "duplicated", ->(tag : self) {
    (exists = Tag.find_by :slug, tag.slug) ? false : true
  })

end
