import {
  UPDATE_MOVIES_SERIES_DATA,
  ADD_FULLWATCHED_MOVIE,
  ADD_FULLWATCHED_SERIAL,
  DELETE_MOVIE,
  DELETE_SERIAL,
  ADD_PREFERRED_MOVIE,
  ADD_PREFERRED_SERIAL,
  REMOVE_PREFERRED_MOVIE,
  REMOVE_PREFERRED_SERIAL,
  ADD_TOWATCH_SERIAL,
  REMOVE_TOWATCH_SERIAL,
} from "../actions/viewsTypes";
const initialState = {
  fullWatchedMovies: [],
  preferredMovies: [],
  fullWatchedSeries: [],
  preferredSeries: [],
  watchingSeries: [],
  isLoading: true,
};

const viewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MOVIES_SERIES_DATA:
      return {
        ...state,
        fullWatchedMovies: action.payload.fullWatchedMovies,
        preferredMovies: action.payload.preferredMovies,
        fullWatchedSeries: action.payload.fullWatchedSeries,
        preferredSeries: action.payload.preferredSeries,
        watchingSeries: action.payload.watchingSeries,
        isLoading: false,
      };
    case ADD_FULLWATCHED_MOVIE:
      return {
        ...state,
        fullWatchedMovies: [...state.fullWatchedMovies, action.payload.movie],
      };
    case ADD_FULLWATCHED_SERIAL:
      return {
        ...state,
        fullWatchedSeries: [...state.fullWatchedSeries, action.payload.serial],
      };
    case DELETE_MOVIE:
      const updatedMovies = state.fullWatchedMovies.filter(
        (movie) => movie.ID_Film !== action.payload.movieID
      );
      return {
        ...state,
        fullWatchedMovies: updatedMovies,
      };
    case DELETE_SERIAL:
      const updatedSeries = state.fullWatchedSeries.filter(
        (serial) => serial.ID_Serial !== action.payload.serialID
      );
      const updatedSeriesToWatch = state.watchingSeries.filter(
        (serial) => serial.ID_Serial !== action.payload.serialID
      );
      return {
        ...state,
        fullWatchedSeries: updatedSeries,
        watchingSeries: updatedSeriesToWatch,
      };
    case ADD_PREFERRED_MOVIE:
      return {
        ...state,
        preferredMovies: [...state.preferredMovies, action.payload.movie],
      };
    case ADD_PREFERRED_SERIAL:
      return {
        ...state,
        preferredSeries: [...state.preferredSeries, action.payload.serial],
      };
    case REMOVE_PREFERRED_MOVIE:
      const updatedPrefferedMovies = state.preferredMovies.filter(
        (movie) => movie.ID_Film !== action.payload.movieID
      );
      return {
        ...state,
        preferredMovies: updatedPrefferedMovies,
      };
    case REMOVE_PREFERRED_SERIAL:
      const updatedPrefferedSeries = state.preferredSeries.filter(
        (serial) => serial.ID_Serial !== action.payload.serialID
      );
      return {
        ...state,
        preferredSeries: updatedPrefferedSeries,
      };
    case ADD_TOWATCH_SERIAL:
      const updateFullWatchedSeries = state.fullWatchedSeries.filter(
        (serial) => serial.ID_Serial !== action.payload.serial.ID_Serial
      );
      return {
        ...state,
        fullWatchedSeries: updateFullWatchedSeries,
        watchingSeries: [...state.watchingSeries, action.payload.serial],
      };
    case REMOVE_TOWATCH_SERIAL:
      const updateWatchingSeries = state.watchingSeries.filter(
        (serial) => serial.ID_Serial !== action.payload.serial.ID_Serial
      );
      return {
        ...state,
        watchingSeries: updateWatchingSeries,
      };
    default:
      return state;
  }
};

export default viewsReducer;
