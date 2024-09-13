import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;

  if (userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const newComment = new Comment({ content, postId, userId });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};
