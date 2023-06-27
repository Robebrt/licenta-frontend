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
} from "./viewsTypes.js";

export const updateMoviesSeriesData = (
  fullWatchedMovies,
  preferredMovies,
  fullWatchedSeries,
  preferredSeries,
  watchingSeries
) => {
  return {
    type: UPDATE_MOVIES_SERIES_DATA,
    payload: {
      fullWatchedMovies: fullWatchedMovies,
      preferredMovies: preferredMovies,
      fullWatchedSeries: fullWatchedSeries,
      preferredSeries: preferredSeries,
      watchingSeries: watchingSeries,
    },
  };
};
export const addFullWatchedMovie = (movie) => {
  return {
    type: ADD_FULLWATCHED_MOVIE,
    payload: {
      movie: movie,
    },
  };
};
export const addFullWatchedSerial = (serial) => {
  return {
    type: ADD_FULLWATCHED_SERIAL,
    payload: {
      serial: serial,
    },
  };
};
export const deleteMovie = (movieID) => {
  return {
    type: DELETE_MOVIE,
    payload: {
      movieID: movieID,
    },
  };
};
export const deleteSerial = (serialID) => {
  return {
    type: DELETE_SERIAL,
    payload: {
      serialID: serialID,
    },
  };
};
export const addPrefferedMovie = (movie) => {
  return {
    type: ADD_PREFERRED_MOVIE,
    payload: {
      movie: movie,
    },
  };
};
export const addPrefferedSerial = (serial) => {
  return {
    type: ADD_PREFERRED_SERIAL,
    payload: {
      serial: serial,
    },
  };
};
export const removePrefferedMovie = (movieID) => {
  return {
    type: REMOVE_PREFERRED_MOVIE,
    payload: {
      movieID: movieID,
    },
  };
};
export const removePrefferedSerial = (serialID) => {
  return {
    type: REMOVE_PREFERRED_SERIAL,
    payload: {
      serialID: serialID,
    },
  };
};
export const addToWatchSerial = (serial) => {
  return {
    type: ADD_TOWATCH_SERIAL,
    payload: {
      serial: serial,
    },
  };
};
export const removeToWatchSerial = (serial) => {
  return {
    type: REMOVE_TOWATCH_SERIAL,
    payload: {
      serial: serial,
    },
  };
};
