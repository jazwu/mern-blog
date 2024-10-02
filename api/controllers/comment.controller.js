import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

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
  } catch (err) {
    next(err);
  }
};

export const editComment = async (req, res, next) => {
  const { content } = req.body;
  try {
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content },
      { new: true }
    );
    if (!editedComment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (editedComment.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "Unauthorized"));
    }
    res.status(200).json(editedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    if (!deletedComment) {
      return next(errorHandler(404, "Comment not found"));
    }
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: lastMonth } });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (err) {
    next(err);
  }
};
