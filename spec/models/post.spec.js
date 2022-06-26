const mongoose = require("mongoose");

require("../mongodb_helper");
const Post = require("../../models/post");

describe("Post model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.posts.drop(() => {
      done();
    });
  });

  it("has a message", () => {
    const post = new Post({ message: "some message" });
    expect(post.message).toEqual("some message");
  });

  it("has a user id", () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const post = new Post({ message: "some message", user_id: mockUserId });
    expect(post.user_id).toBe(mockUserId);
  });

  it("has a picture", () => {
    const post = new Post({ post_picture: "www.picture.com" });
    expect(post.post_picture).toBe("www.picture.com");
  });

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
    });
  });

  it("can save a post", (done) => {
    const mockUserId = new mongoose.Types.ObjectId();
    const post = new Post({ message: "some message", user_id: mockUserId });

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        expect(posts[0]).toMatchObject({
          message: "some message",
          user_id: mockUserId,
        });
        done();
      });
    });
  });

  it("can save a post, wiht an empty array for comments", (done) => {
    const post = new Post({ message: "some message" });

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        const result = Array.from([...posts[0].comments]);
        expect(result).toMatchObject([]);
        done();
      });
    });
  });

  it("can list all posts in reverse chronological order", (done) => {
    const post1 = new Post({ message: "first message" });
    const post2 = new Post({ message: "second message" });

    post1.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        expect(posts[0]).toMatchObject({ message: "first message" });

        post2.save((err) => {
          expect(err).toBeNull();

          Post.find((err, posts) => {
            expect(err).toBeNull();

            expect(posts.reverse()).toMatchObject([
              { message: "second message" },
              { message: "first message" },
            ]);
            done();
          });
        });
      });
    });
  });

  it("updates the comments array with the coment id", (done) => {
    const post = new Post({ message: "some message" });
    const mockCommentId = new mongoose.Types.ObjectId();

    post.save((err) => {
      expect(err).toBeNull();

      const filter = { _id: post._id };
      const update = { $push: { comments: mockCommentId } };

      Post.findOneAndUpdate(
        filter,
        update,
        { new: true, useFindAndModify: false },
        (err, updatedResults) => {
          expect(err).toBeNull();
          expect(updatedResults.comments[0]).toEqual(mockCommentId);

          Post.find((err, posts) => {
            expect(err).toBeNull();

            const result = Array.from([...posts[0].comments]);
            expect(result).toEqual([mockCommentId]);
            done();
          });
        }
      );
    });
  });
});
