import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/MoviePage.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import { addFullWatchedMovie, addFullWatchedSerial } from '../actions/viewsActions';
import Modal from '../components/Modal';
import ListaEpisoade from '../components/ListaEpisoade';
import Comentarii from '../components/Comentarii';

function MoviePage({ isMovie, isAuthenticated, fullWatchedMovies, fullWatchedSeries, watchingSeries, addFullWatchedMovie, addFullWatchedSerial, user }) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingEpisoade, setLoadingEpisoade] = useState(true);
    const [episoade, setEpisoade] = useState(null);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        // Funcția de încărcare a datelor despre film/serial
        const fetchMovie = async () => {
            if (isMovie === true) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/filme/${id}`);
                    if (response.data) {
                        setMovie(response.data);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Eroare la încărcarea filmului/serialului:', error);
                };
            }
            else {
                try {
                    const response = await axios.get(`http://localhost:3000/api/seriale/${id}`);
                    if (response.data) {
                        setMovie(response.data);
                        setLoading(false);
                        try {
                            const responseEpisoade = await axios.get(`http://localhost:3000/api/seriale/${id}/episoade`);
                            if (responseEpisoade.data) {
                                setEpisoade(responseEpisoade.data);
                                setLoadingEpisoade(false);
                            }
                        }
                        catch (error) {
                            console.error("Eroare la incarcarea episoadelor");
                        }
                    }
                }
                catch (error) {
                    console.error('Eroare la încărcarea filmului/serialului:', error);
                }
            }
        }
        fetchMovie();
    }, [id]);
    const showButton = () => {
        if (loading === false) {
            if (isAuthenticated) {
                if (isMovie === true) {
                    return !(fullWatchedMovies.some(item => item.ID_Film === movie.ID_Film))
                }
                else if (isMovie === false) {
                    return fullWatchedSeries.some(item => item.ID_Serial === movie.ID_Serial) ? false : watchingSeries.some(item => item.ID_Serial === movie.ID_Serial) ? false : true
                }
            }
        }
        else {
            return false;
        }
    }
    const toShow = showButton();
    const modalMessage = isMovie === true ? "Filmul a fost adăugat" : "Serialul a fost adăugat";
    const addView = async () => {
        // Obține data curentă
        const currentDate = new Date();

        // Extrage anul, luna și ziua din data curentă
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Creează data în formatul MySQL
        const mysqlDate = `${year}-${month}-${day}`;
        let vision = {};
        if (isMovie === true) {
            vision = {
                "ID_Utilizator": user.user.ID_Utilizator,
                "ID_Film": movie.ID_Film,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": true,
                "Preferat": false
            }
        }
        else if (isMovie === false) {
            vision = {
                "ID_Utilizator": user.user.ID_Utilizator,
                "ID_Serial": movie.ID_Serial,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": true,
                "Preferat": false
            }
        }
        const isPosted = await postVisionData(vision);
        if (isPosted) {
            if (isMovie === true) {
                openModal();
                addFullWatchedMovie(movie);
            }
            else if (isMovie === false) {
                openModal();
                addFullWatchedSerial(movie);
            }
        }
        else {
        }

    }
    const postVisionData = async (vision) => {
        try {
            if (isMovie === true) {
                const response = await axios.post("http://localhost:3000/api/vizionari/movie", vision);
                if (response.status === 201) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (isMovie === false) {
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
    if (loading) {
        return <div className="loading">Se încarcă...</div>;
    }

    if (!movie) {
        return <div className="error">Nu s-a putut încărca filmul/serialul.</div>;
    }
    const displayEpisodes = () => {
        if (loadingEpisoade === false) {
            return (
                <ListaEpisoade
                    episoade={episoade}
                    serialID={id}
                    serial={movie}
                />
            )
        }
    }
    return (
        <>
            <div className="movie-page" >
                <div className='title-rating' style={{ backgroundImage: `url(${movie.Poster})` }}>
                    <div className='bg-text'>
                        <div className="title">{movie.Titlu}</div>
                        <div className="rating">Rating: {movie.IMDB_Rating}/10</div>
                        {toShow && <Button
                            onClick={addView}
                            variant='contained'>Adaugă la {isMovie === true ? "filmele" : "serialele"} mele vizionate</Button>}
                    </div>
                </div>
                <div className='info-coms'>
                    <div className='info'>
                        <p className="genre">Gen: {movie.Gen}</p>
                        <p>Regizor: {movie.Regizor || movie.Creator}</p>
                        <p className="description">Descriere: {movie.Descriere}</p>
                        <p className="description">Actori: {movie.Actori}</p>
                        <p className="release-year">An lansare: {movie.An_Lansare || movie.An_inceput}</p>
                    </div>
                    <div>
                        {displayEpisodes()}
                    </div>
                    <div className='comentarii-div'>
                        {isAuthenticated ? (<Comentarii
                            idFilmSerial={id}
                            isMovie={isMovie}
                            inViewing={watchingSeries.some((serial) => serial.ID_Serial === id) ? true : fullWatchedMovies.some((movie) => movie.ID_Film === id) ? false : true}
                        />)
                            : (<h3>Autentifică-te pentru a vedea și posta comentarii</h3>)
                        }
                    </div>
                </div>
                {isModalOpen && <Modal onCloseModal={closeModal} message={modalMessage} />}
            </div >
        </>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        fullWatchedMovies: state.views.fullWatchedMovies,
        fullWatchedSeries: state.views.fullWatchedSeries,
        watchingSeries: state.views.watchingSeries,
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addFullWatchedMovie: (movie) => dispatch(addFullWatchedMovie(movie)),
        addFullWatchedSerial: (serial) => dispatch(addFullWatchedSerial(serial))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);