import React from 'react';
import Layout from './layout/Layout';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Movie from './containers/Movie';
import Home from './containers/Home';
import Register from './containers/Register';
import Login from './containers/Login';
import Series from './containers/Series';
import MoviePage from './containers/MoviePage';
import './style/App.css';
import UserProfile from './containers/UserProfile';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { updateUserData } from './actions/authActions';
import Cookies from 'js-cookie';
import axios from 'axios';
import { updateMoviesSeriesData } from './actions/viewsActions';
import EditProfile from './containers/EditProfile';
import SeeUserProfile from './containers/SeeUserProfile';
import UserSearch from './containers/UserSearch';
import WatchingStatistics from './containers/WatchingStatistics';

const App = (props) => {

  useEffect(() => {

    const getUserData = async () => {
      try {
        const token = Cookies.get("token");;
        const response = await axios.get('http://localhost:3000/api/getUserByToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },);
        const userData = response.data;
        // Actualizează starea Redux cu datele despre utilizator
        props.updateUserData(userData);
      } catch (error) {
        console.error('Error getting user data:', error);
        // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
      }
    };

    // Apelăm funcția pentru a obține datele despre utilizator la fiecare randare a componentei
    getUserData();
  }, []);
  useEffect(() => {
    if (props.user) {
      const userID = props.user.ID_Utilizator;
      const getVisionData = async () => {
        if (userID) {
          try {
            const response = await axios.get(`http://localhost:3000/api/vizionari/getByUserID/${userID}`);
            if (response.data && response.data.movies) {
              const movies = response.data.movies;
              const series = response.data.series;

              let fullWatchedMovies = [];
              let preferredMovies = [];
              for (const movie of movies) {
                if (movie.Vazut_complet === true) {
                  const fullWatchedMovie = await getMovieData(movie.movie_ID);
                  fullWatchedMovies.push(fullWatchedMovie);
                }
                if (movie.Preferat === true) {
                  const preferredMovie = await getMovieData(movie.movie_ID);
                  preferredMovies.push(preferredMovie);
                }

              }
              let fullWatchedSeries = [];
              let preferredSeries = [];
              let watchingSeries = [];
              for (const serial of series) {
                if (serial.Vazut_complet === true) {
                  const fullWatchedSerial = await getSerialData(serial.series_ID);
                  fullWatchedSerial.episoade = serial.episoade;
                  fullWatchedSeries.push(fullWatchedSerial);
                }
                if (serial.Preferat === true) {
                  const preferredSerial = await getSerialData(serial.series_ID);
                  preferredSerial.episoade = serial.episoade;
                  preferredSeries.push(preferredSerial);
                }
                if (serial.Vazut_complet === false) {
                  const watchingSerial = await getSerialData(serial.series_ID);
                  watchingSerial.episoade = serial.episoade;
                  watchingSeries.push(watchingSerial);
                }
              }
              props.updateMoviesSeriesData(fullWatchedMovies, preferredMovies, fullWatchedSeries, preferredSeries, watchingSeries);

            } else {
              console.error('Invalid response data:', response.data);
              // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
            }
          } catch (error) {
            console.error('Error getting user data:', error);
            // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
          }
        };
      }
      getVisionData();
    }
  }, [props.user])
  const getMovieData = async (movieID) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/filme/${movieID}`);
      const movie = response.data;
      return movie;
    }
    catch (error) {
      console.error('Error getting user data:', error);
      // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
    }
  }

  const getSerialData = async (seriesID) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/seriale/${seriesID}`);
      const serial = response.data;
      return serial;
    }
    catch (error) {
      console.error('Error getting user data:', error);
      // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
    }
  }
  return (
    <div className='app-box'>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" />} /> {/* Redirecționează către ruta /home */}
            <Route path="/home" element={<Home />} />
            <Route path='/movies' element={<Movie />} />
            <Route path='/series' element={<Series />} />
            <Route path='/register' element={<Register />} />
            <Route path='/edit-profile' element={((props.isAuthenticated) ? <EditProfile /> : <Navigate to="/login" />)} />
            <Route path='/login'
              element={((props.isAuthenticated) ? <Navigate to="/user-profile" /> : <Login />)} />
            <Route path='/user-profile'
              element={((props.isAuthenticated) ? <UserProfile /> : <Navigate to="/login" />)} />
            <Route path="/movies/:id" element={<MoviePage isMovie={true} />} />
            <Route path="/series/:id" element={<MoviePage isMovie={false} />} />
            <Route path="/profiles/:id" element={<SeeUserProfile />} />
            <Route path='/search-users' element={<UserSearch />} />
            <Route path="/user-statistics" element={((props.isAuthenticated) ? <WatchingStatistics /> : <Navigate to="/login" />)} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUserData: (userData) => dispatch(updateUserData(userData)),
    updateMoviesSeriesData: (fullWatchedMovies, preferredMovies, fullWatchedSeries, preferredSeries, watchingSeries) => dispatch(updateMoviesSeriesData(fullWatchedMovies, preferredMovies, fullWatchedSeries, preferredSeries, watchingSeries)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
