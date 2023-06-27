
import { Button } from '@mui/material';
import '../style/Movies.css';
import { useState } from 'react';
import axios from 'axios';
import {
    addFullWatchedMovie, addFullWatchedSerial, deleteMovie, deleteSerial,
    addPrefferedMovie, addPrefferedSerial, removePrefferedMovie, removePrefferedSerial,
    addToWatchSerial, removeToWatchSerial
} from '../actions/viewsActions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function MovieCard({ userID, id, movieOrSerial, title, poster, rating,
    genre, director, releaseYear, actors, description, isMovie, isFullWatched,
    isFavorite, addFullWatchedMovie, addFullWatchedSerial, deleteMovie, deleteSerial,
    onUserPage, endpoint, onOpenModal, addPrefferedMovie, addPrefferedSerial,
    removePrefferedMovie, removePrefferedSerial, addToWatchSerial, removeToWatchSerial, esteFilm }) {

    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const addView = async (event) => {
        event.stopPropagation();
        // Obține data curentă
        const currentDate = new Date();

        // Extrage anul, luna și ziua din data curentă
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Creează data în formatul MySQL
        const mysqlDate = `${year}-${month}-${day}`;
        let vision = {};
        if (isMovie === "movie") {
            vision = {
                "ID_Utilizator": userID,
                "ID_Film": id,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": true,
                "Preferat": false
            }
        }
        else if (isMovie === "serial") {
            vision = {
                "ID_Utilizator": userID,
                "ID_Serial": id,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": true,
                "Preferat": false
            }
        }
        const isPosted = await postVisionData(vision);
        if (isPosted) {
            if (isMovie === "movie") {
                onOpenModal();
                addFullWatchedMovie(movieOrSerial);
            }
            else if (isMovie === "serial") {
                onOpenModal();
                addFullWatchedSerial(movieOrSerial);
            }
        }
        else {
        }

    }
    const deleteView = async (event) => {
        event.stopPropagation();
        const isDeleted = await deleteVisionData(endpoint, id);
        if (isDeleted) {
            if (endpoint === "ByMovieID") {
                onOpenModal();
                deleteMovie(id);
            }
            else if (endpoint === "BySerialID") {
                onOpenModal();
                deleteSerial(id);
            }
        }
        else {
        }
    }
    const postVisionData = async (vision) => {
        try {
            if (isMovie === "movie") {
                const response = await axios.post("http://localhost:3000/api/vizionari/movie", vision);
                if (response.status === 201) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (isMovie === "serial") {
                const response = await axios.post("http://localhost:3000/api/vizionari/serial", vision);
                if (response.status === 201) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        catch (error) {
            console.error('Error post vision data:', error);
            return false;
            // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
        }
    }
    const deleteVisionData = async (endpoint, id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/vizionari/delete${endpoint}/${id}`);
            if (response.status === 204) {
                return true;
            }
        }
        catch (error) {
            console.error('Error delete vision data:', error);
            return false;
            // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
        }
    }
    const addToFavorite = async (event) => {
        event.stopPropagation()
        let value;

        if (isFavorite === "true") {
            value = false;

        }
        else if (isFavorite === "false") {
            value = true;

        }
        const option = { "Preferat": value };
        const isUpdated = await updatePrefferedOption(endpoint, id, option);
        if (isUpdated) {
            if (endpoint === "ByMovieID") {
                if (isFavorite === "false") {
                    addPrefferedMovie(movieOrSerial);
                }
                else if (isFavorite === "true") {
                    removePrefferedMovie(id);
                }
            }
            else if (endpoint === "BySerialID") {
                if (isFavorite === "false") {
                    addPrefferedSerial(movieOrSerial);
                }
                else if (isFavorite === "true") {
                    removePrefferedSerial(id);
                }
            }
        }
        else {
        }
    }
    const addToWatch = async (event) => {
        event.stopPropagation();
        let value;
        if (isFullWatched === "vazut") {
            value = false;
        }
        else if (isFullWatched === "false") {
            value = true;
        }
        const option = { "Vazut_complet": value };
        const isUpdated = await updatePrefferedOption(endpoint, id, option);
        if (isUpdated) {
            if (isFullWatched === "vazut") {
                addToWatchSerial(movieOrSerial);
            }
            else if (isFullWatched === "false") {
                removeToWatchSerial(movieOrSerial);
            }
        }
        else {
        }

    }
    const updatePrefferedOption = async (endpoint, id, option) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/vizionari/update${endpoint}/${userID}/${id}`, option);
            if (response.status === 200) {
                return true;
            }
        }
        catch (error) {
            console.error('Error update vision data:', error);
            return false;
            // Tratează eroarea în funcție de necesități (ex. afișează un mesaj de eroare)
        }
    }
    const displayOnHover = () => {
        return (
            <>
                <h2 className="movie-card__title">{title}</h2>
                <div className="movie-details">
                    <div>Regizor: {director}</div>
                    <div>An lansare: {releaseYear}</div>
                    <div>Actori: {actors}</div>
                    <div>Descriere: {description}</div>
                </div>
                <div className='movie-card-buttons'>
                    {isMovie && <Button
                        onClick={addView}
                        className='add-button'>Adaugă la {isMovie === "movie" ? "filmele" : "seriale"} mele vizionate</Button>}
                    {/* {isFullWatched && <Button onClick={addToWatch} className='add-button'>Adaugă la {isFullWatched === "vazut" ? "în vizionare" : "vizionat"}</Button>} */}
                    {isFavorite && <Button onClick={addToFavorite} className='add-button'>{isFavorite === "true" ? "Scoate de la favorite" : "Adaugă la favorite"}</Button>}
                    {(onUserPage && isFavorite === "false") && < Button className='add-button' onClick={deleteView}>Șterge</Button >}
                </div>
            </>
        )
    }
    const displayNormal = () => {
        return (
            <>
                <div className='image-container'>
                    <img
                        className="movie-card__image"
                        src={poster}
                    ></img>
                </div>
                <h2 className="movie-card__title">{title}</h2>
                <div className="movie-card__footer">
                    <span className="movie-card__rating">IMDB rating: {rating ? rating : "N/A"}</span>
                    <span className="movie-card__genre">Gen: {genre}</span>
                </div>
            </>
        )
    }
    const displayMoviePage = () => {
        if (esteFilm === true) {
            navigate(`/movies/${id}`);
        }
        else if (esteFilm === false) {
            navigate(`/series/${id}`);
        }
    }
    return (
        <div onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="movie-card"
            onClick={displayMoviePage}>
            {isHovered ? displayOnHover() : displayNormal()}
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        state: state
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addFullWatchedMovie: (movie) => dispatch(addFullWatchedMovie(movie)),
        addFullWatchedSerial: (serial) => dispatch(addFullWatchedSerial(serial)),
        deleteMovie: (movieID) => dispatch(deleteMovie(movieID)),
        deleteSerial: (serialID) => dispatch(deleteSerial(serialID)),
        addPrefferedMovie: (movie) => dispatch(addPrefferedMovie(movie)),
        addPrefferedSerial: (serial) => dispatch(addPrefferedSerial(serial)),
        removePrefferedMovie: (movieID) => dispatch(removePrefferedMovie(movieID)),
        removePrefferedSerial: (serialID) => dispatch(removePrefferedSerial(serialID)),
        addToWatchSerial: (serial) => dispatch(addToWatchSerial(serial)),
        removeToWatchSerial: (serial) => dispatch(removeToWatchSerial(serial))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MovieCard);