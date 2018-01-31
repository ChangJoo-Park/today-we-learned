require "../config/application.cr"

user = User.new
user.username = "ChangJoo Park"
user.email = "admin@example.com"
user.password = "password"
user.save
