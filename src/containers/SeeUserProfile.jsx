import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { connect } from "react-redux";


function SeeUserProfile(props) {
    const { id } = useParams();
    const [userData, setUserData] = useState();
    const profileAvatarDefault = '../../public/user-profile-avatar.jpg';
    const [isLoading, setIsLoading] = useState(true);
    const [views, setViews] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        if (props.user.user) {
            if (id == props.user.user.ID_Utilizator) {
                navigate('/user-profile');
            }
        }

        const getUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/utilizatori/${id}`);
                if (response.data) {
                    setUserData(response.data)
                }
            } catch (error) {
                console.error('Error getting user data:', error);
                // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
            }
        };
        getUserData();

    }, [id, props.user, navigate]);
    useEffect(() => {

        if (userData) {
            const userID = userData.ID_Utilizator;
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

                            setViews(
                                {
                                    fullWatchedMovies: fullWatchedMovies,
                                    preferredMovies: preferredMovies,
                                    fullWatchedSeries: fullWatchedSeries,
                                    preferredSeries: preferredSeries,
                                    watchingSeries: watchingSeries
                                }
                            )
                            setIsLoading(false);
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
    }, [userData])
    useEffect(() => {
    }, [isLoading])

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

    const displayMovies = (movies) => {
        if (!isLoading) {
            return (
                <div className="scrollable-div ">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.ID_Film}
                            poster={movie.Poster}
                            title={movie.Titlu}
                            genre={movie.Gen}
                            rating={movie.IMDB_Rating}
                            director={movie.Regizor}
                            releaseYear={movie.An_Lansare}
                            actors={movie.Actori}
                            description={movie.Descriere}
                            id={movie.ID_Film}
                            endpoint="ByMovieID"
                            movieOrSerial={movie}
                            esteFilm={true}
                        />))
                    }
                </div>
            )
        }
    }
    const displaySeries = (series) => {
        if (!isLoading) {
            return (
                <div className="scrollable-div ">
                    {series.map((serial) => (
                        <MovieCard
                            key={serial.ID_Serial}
                            poster={serial.Poster}
                            title={serial.Titlu}
                            genre={serial.Gen}
                            rating={serial.IMDB_Rating}
                            director={serial.Creator}
                            releaseYear={serial.An_inceput}
                            actors={serial.Actori}
                            description={serial.Descriere}
                            id={serial.ID_Serial}
                            endpoint="BySerialID"
                            movieOrSerial={serial}
                            esteFilm={false}
                        />))

                    }
                </div>
            )
        }
    }

    return (

        <div className="user-profile-box">
            {userData && (
                <div className="user-data">
                    <img className="avatar-profile"
                        src={userData.Avatar === "none" ? profileAvatarDefault : userData.Avatar}
                    >
                    </img>
                    <p className="user-name">
                        {userData.Nume_utilizator}
                    </p>

                </div>
            )}
            <div className="vision-data">
                {views && (<>
                    {
                        views.fullWatchedMovies.length > 0 &&
                        <div>
                            <h2>Filme vizionate</h2>
                            {displayMovies(views.fullWatchedMovies)}
                        </div>
                    }
                    {views.preferredMovies.length > 0 &&
                        <div>
                            <h2>Filme favorite</h2>
                            {displayMovies(views.preferredMovies)}
                        </div>
                    }
                    {views.fullWatchedSeries.length > 0 &&
                        <div>
                            <h2>Seriale vizionate</h2>
                            {displaySeries(views.fullWatchedSeries)}
                        </div>
                    }
                    {views.preferredSeries.length > 0 &&
                        < div >
                            <h2>Seriale favorite</h2>
                            {displaySeries(views.preferredSeries)}
                        </div>
                    }
                    {views.watchingSeries.length > 0 &&
                        <div>
                            <h2>Seriale în vizionare</h2>
                            {displaySeries(views.watchingSeries)}
                        </div>
                    }
                </>
                )}
            </div>
        </div >
    )
}
const mapStateToProps = state => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(SeeUserProfile);