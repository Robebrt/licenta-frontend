import {
  UPDATE_COMMENTS,
  ADD_COMMENT,
  REMOVE_COMMENT,
  LIKE_COMMENT,
  REMOVE_LIKE_COMMENT,
} from "./commentsTypes";

export const updateComments = (comments, likedComments) => {
  return {
    type: UPDATE_COMMENTS,
    payload: {
      comments: comments,
      likedComments: likedComments,
    },
  };
};

export const addComment = (comment) => {
  return {
    type: ADD_COMMENT,
    payload: {
      comment: comment,
    },
  };
};

export const removeComment = (comment) => {
  return {
    type: REMOVE_COMMENT,
    payload: {
      comment: comment,
    },
  };
};

export const likeComment = (commentID) => {
  return {
    type: LIKE_COMMENT,
    payload: {
      commentID: commentID,
    },
  };
};

export const removeLikeComment = (commentID) => {
  return {
    type: REMOVE_LIKE_COMMENT,
    payload: {
      commentID: commentID,
    },
  };
};
