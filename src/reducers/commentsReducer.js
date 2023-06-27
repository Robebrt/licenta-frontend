import {
  UPDATE_COMMENTS,
  ADD_COMMENT,
  REMOVE_COMMENT,
  LIKE_COMMENT,
  REMOVE_LIKE_COMMENT,
} from "../actions/commentsTypes";

const initialState = {
  comments: [],
  likedComments: [],
  isLoading: true,
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
        likedComments: action.payload.likedComments,
        isLoading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [...state.comments, action.payload.comment],
      };
    case REMOVE_COMMENT:
      const updatedComments = state.comments.filter(
        (comment) => comment !== action.payload.comment
      );
      return {
        ...state,
        comments: updatedComments,
      };
    case LIKE_COMMENT:
      let likedComment = [];
      const likeComments = state.comments.map((comment) => {
        if (comment.ID_Comentariu === action.payload.commentID) {
          comment.Aprecieri += 1;
          likedComment.push(comment);
        }
        return comment;
      });
      return {
        ...state,
        comments: likeComments,
        likedComments: [...state.likedComments, likedComment],
      };
    case REMOVE_LIKE_COMMENT:
      const removeLikeComments = state.comments.map((comment) => {
        if (comment.ID_Comentariu === action.payload.commentID) {
          comment.Aprecieri -= 1;
        }
        return comment;
      });
      const updateLikedComments = state.likedComments.filter(
        (comment) => comment.ID_Comentariu !== action.payload.commentID
      );
      return {
        ...state,
        comments: removeLikeComments,
        likedComments: updateLikedComments,
      };
    default:
      return state;
  }
};

export default commentsReducer;
