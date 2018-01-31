require "./spec_helper"

def post_hash
  {"title" => "Fake", "body" => "Fake", "slug" => "Fake", "user_id" => "1"}
end

def post_params
  params = [] of String
  params << "title=#{post_hash["title"]}"
  params << "body=#{post_hash["body"]}"
  params << "slug=#{post_hash["slug"]}"
  params << "user_id=#{post_hash["user_id"]}"
  params.join("&")
end

def create_post
  model = Post.new(post_hash)
  model.save
  model
end

class PostControllerTest < GarnetSpec::Controller::Test
  getter handler : Amber::Pipe::Pipeline

  def initialize
    @handler = Amber::Pipe::Pipeline.new
    @handler.build :web do
      plug Amber::Pipe::Error.new
      plug Amber::Pipe::Session.new
      plug Amber::Pipe::Flash.new
    end
    @handler.prepare_pipelines
  end
end

describe PostControllerTest do
  subject = PostControllerTest.new

  it "renders post index template" do
    Post.clear
    response = subject.get "/posts"

    response.status_code.should eq(200)
    response.body.should contain("Posts")
  end

  it "renders post show template" do
    Post.clear
    model = create_post
    location = "/posts/#{model.id}"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Show Post")
  end

  it "renders post new template" do
    Post.clear
    location = "/posts/new"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("New Post")
  end

  it "renders post edit template" do
    Post.clear
    model = create_post
    location = "/posts/#{model.id}/edit"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Edit Post")
  end

  it "creates a post" do
    Post.clear
    response = subject.post "/posts", body: post_params

    response.headers["Location"].should eq "/posts"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "updates a post" do
    Post.clear
    model = create_post
    response = subject.patch "/posts/#{model.id}", body: post_params

    response.headers["Location"].should eq "/posts"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "deletes a post" do
    Post.clear
    model = create_post
    response = subject.delete "/posts/#{model.id}"

    response.headers["Location"].should eq "/posts"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end
end
