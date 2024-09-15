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

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.likes.includes(req.user.id)) {
      comment.numberOfLikes -= 1;
      comment.likes = comment.likes.filter((id) => id !== req.user.id);
    } else {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch(err) {
    next(err);
  }
}