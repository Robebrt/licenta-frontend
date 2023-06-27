import { connect } from "react-redux";
import '../style/profile.css';
import MovieCard from "../components/MovieCard";
import Modal from "../components/Modal";
import { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";


function UserProfile(props) {
    const profileAvatarDefault = '../../public/user-profile-avatar.jpg';
    const imgSrc = props.user.Avatar === "none" ? profileAvatarDefault : props.user.Avatar;
    // useEffect(() => {

    // }, [props.fullWatchedMovies])
    // useEffect(() => {

    // }, [props.fullWatchedSeries])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const displayMovies = (movies) => {
        if (!props.isLoadingViews) {
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
                            isFavorite={props.preferredMovies.some(item => item.ID_Film === movie.ID_Film) ? "true" : "false"}
                            id={movie.ID_Film}
                            userID={props.user.ID_Utilizator}
                            onUserPage={true}
                            endpoint="ByMovieID"
                            onOpenModal={openModal}
                            movieOrSerial={movie}
                            esteFilm={true}
                        />))
                    }
                </div>
            )
        }
    }
    const displaySeries = (series) => {
        if (!props.isLoadingViews) {
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
                            isFavorite={props.preferredSeries.some(item => item.ID_Serial === serial.ID_Serial) ? "true" : "false"}
                            isFullWatched={props.fullWatchedSeries.some(item => item.ID_Serial === serial.ID_Serial) ? "vazut" : "false"}
                            onUserPage={true}
                            userID={props.user.ID_Utilizator}
                            id={serial.ID_Serial}
                            endpoint="BySerialID"
                            onOpenModal={openModal}
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
            <div className="user-data">
                <img className="avatar-profile"
                    src={imgSrc}
                >
                </img>
                <p className="user-name">
                    {props.user.Nume_utilizator}
                </p>
                <Link to='/edit-profile'>
                    <Button variant="contained">Editează profilul</Button>
                </Link>
                <Link to='/user-statistics'>
                    <Button variant="contained">Vezi statistici</Button>
                </Link>
            </div>
            <div className="vision-data">
                {props.fullWatchedMovies.length > 0 &&
                    <div>
                        <h2>Filme vizionate</h2>
                        {displayMovies(props.fullWatchedMovies)}
                    </div>
                }
                {props.preferredMovies.length > 0 &&
                    <div>
                        <h2>Filme favorite</h2>
                        {displayMovies(props.preferredMovies)}
                    </div>
                }
                {props.fullWatchedSeries.length > 0 &&
                    <div>
                        <h2>Seriale vizionate</h2>
                        {displaySeries(props.fullWatchedSeries)}
                    </div>
                }
                {props.preferredSeries.length > 0 &&
                    < div >
                        <h2>Seriale favorite</h2>
                        {displaySeries(props.preferredSeries)}
                    </div>
                }
                {props.watchingSeries.length > 0 &&
                    <div>
                        <h2>Seriale în vizionare</h2>
                        {displaySeries(props.watchingSeries)}
                    </div>
                }
                {isModalOpen && <Modal onCloseModal={closeModal} message="Elementul a fost șters" />}
            </div>
        </div >
    )
}
const mapStateToProps = state => {
    return {
        user: state.user.user,
        fullWatchedMovies: state.views.fullWatchedMovies,
        preferredMovies: state.views.preferredMovies,
        fullWatchedSeries: state.views.fullWatchedSeries,
        preferredSeries: state.views.preferredSeries,
        watchingSeries: state.views.watchingSeries,
        isLoadingViews: state.views.isLoading,
        state: state,
    };
};



export default connect(mapStateToProps)(UserProfile);