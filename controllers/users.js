const User = require("../models/user");

const UsersController = {
  Index: (req, res) => {
    User.find()
      .exec((err, users) => {
        if (err) {
          throw err;
        }
        let reversedUsers = users.reverse();

        const result = reversedUsers.filter((user) => {
          return user._id != req.session.user._id
        });

        result.forEach((user) => {
          user.friended = user.friends.includes(req.session.user._id);
        });
        
        res.render("users/index", {
          session: req.session.user,
          users: result,
        });
      })
  },

  New: (req, res) => {
    res.render("users/new", {
      session: req.session.user,
      error: req.flash("error"),
    });
  },
  Create: (req, res) => {
    const user = new User(req.body);

    user
      .save()
      .then(() => {
        res.status(201).redirect("/sessions/new");
      })
      
      .catch((err) => {
        if (err.code === 11000) req.flash("error", "Email already exists");

        res.redirect("/users/new");

      });
  },

  AddFriend: (req, res) => {
  
      const filter = { _id: req.body.user_id };
      const update = {$push: {friends: req.session.user._id}};

      User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false}, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

      const filter2 = { _id: req.session.user._id };
      const update2 = {$push: {friends: req.body.user_id}};

      User.findOneAndUpdate(filter2, update2, {new: true, useFindAndModify: false}, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

        res.status(201).redirect(`/profile/${req.session.user._id}`);
      });
    });
  },    
};

module.exports = UsersController;
