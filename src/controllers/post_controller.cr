class PostController < ApplicationController
  def index
    posts = Post.all("ORDER BY created_at DESC")
    render("index.slang")
  end

  def show
    if post = Post.find_by :slug, params["id"]
      render("show.slang")
    else
      flash["warning"] = "Post with ID #{params["id"]} Not Found"
      redirect_to "/"
    end
  end

  def new
    post = Post.new
    render("new.slang")
  end

  def create
    post = Post.new(post_params.validate!)

    if (current_user = context.current_user)
      post.user_id = current_user.id
    end

    if post.valid? && post.save
      flash["success"] = "Created Post successfully."
      redirect_to "/"
    else
      flash["danger"] = "Could not create Post!"
      render("new.slang")
    end
  end

  def edit
    if post = Post.find_by :slug, params["id"]
      render("edit.slang")
    else
      flash["warning"] = "Post with ID #{params["id"]} Not Found"
      redirect_to "/"
    end
  end

  def update
    if post = Post.find_by :slug, params["id"]
      post.set_attributes(post_params.validate!)
      if post.valid? && post.save
        flash["success"] = "Updated Post successfully."
        redirect_to "/"
      else
        flash["danger"] = "Could not update Post!"
        render("edit.slang")
      end
    else
      flash["warning"] = "Post with ID #{params["id"]} Not Found"
      redirect_to "/"
    end
  end

  def destroy
    if post = Post.find_by :slug, params["id"]
      post.destroy
    else
      flash["warning"] = "Post with ID #{params["id"]} Not Found"
    end
    redirect_to "/"
  end

  def random
    if post = Post.first("ORDER BY random()")
      render("random.slang")
    else
      redirect_to "/"
    end
  end

  def post_params
    params.validation do
      required(:title) { |f| !f.nil? }
      required(:body) { |f| !f.nil? }
      required(:slug) { |f| !f.nil? }
      required(:tag_id) { |f| !f.nil? }
    end
  end
end
