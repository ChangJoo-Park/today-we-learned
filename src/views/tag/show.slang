h2 style="text-align: center;"
  == "#{tag.posts.size}"
  == tag.posts.size > 1 ? "posts" : "post"
  | about
  == "#{tag.name}"

- tag.posts.each do |post|
  == render(partial: "shared/_post.slang")
