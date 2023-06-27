import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { TextField, Autocomplete } from "@mui/material";
import MovieCard from "../components/MovieCard";
import '../style/Movies.css';
import { connect } from "react-redux";
import Modal from "../components/Modal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Skeleton from "@mui/material/Skeleton";
import Box from '@mui/material/Box';
const Movie = (props) => {

    const [movies, setMovies] = useState([]);
    const [userID, setUserID] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredMovies, setFiltredMovies] = useState([]);
    const [movieOptions, setMovieOptions] = useState([]);
    const [movieGenreOptions, setMovieGenreOptions] = useState([]);
    const [searchOptions, setSearchOptions] = useState(
        {
            Titlu: "",
            Gen: "",
            Value: ""
        }
    )
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        getMovies();
        if (props.isAuthenticated) {
            setUserID(props.user.user.ID_Utilizator);
        }
    }, [])
    useEffect(() => {
        const filteredMovies = setMoviesList(searchOptions.Value);
        setFiltredMovies(filteredMovies);
    }, [searchOptions]);
    const setMoviesList = (order, sortBy) => {
        const filteredMovies = movies.filter((movie) => {
            const { Titlu, Gen } = searchOptions;

            // Verificăm dacă titlul și genul sunt goale sau se potrivesc cu filmul curent
            const matchesTitle = Titlu === "" || movie.Titlu.includes(Titlu);
            const matchesGenre = Gen === "" || movie.Gen.includes(Gen);

            // Returnăm true dacă filmul se potrivește cu condițiile de filtrare
            return matchesTitle && matchesGenre;
        });
        const comparatie = (filmA, filmB) => {
            if (filmA.IMDB_Rating < filmB.IMDB_Rating) {
                return order === "asc" ? -1 : 1;
            } else if (filmA.IMDB_Rating > filmB.IMDB_Rating) {
                return order === "desc" ? -1 : 1;
            }
            return 0;
        };
        filteredMovies.sort(comparatie);
        return filteredMovies;
    }

    const getMovies = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/filme');
            setMovies(response.data);
            setLoading(false);
            const updatedOptions = response.data
                .map((movie) => movie.Titlu)
                .filter((title, index, array) => array.indexOf(title) === index);
            const updateMovieGenreOptions = response.data.reduce((acc, movie) => {
                const movieGenres = movie.Gen.split(',').map((genre) => genre.trim());
                movieGenres.forEach((genre) => {
                    if (!acc.includes(genre)) {
                        acc.push(genre);
                    }
                });
                return acc;
            }, []);
            setMovieGenreOptions(updateMovieGenreOptions);
            setMovieOptions(updatedOptions);
        } catch (error) {
        }
    };
    const displayMovieSkeleton = () => {
        const boxes = [];
        for (let i = 0; i < 20; i++) {
            boxes.push(
                <Box key={i} sx={{ margin: "10px" }}>
                    <Skeleton variant="rounded" width={230} height={349} />
                    <Skeleton variant="text" sx={{ fontSize: '1.8rem' }} />
                    <Skeleton variant="rectangular" width={230} height={51} />
                </Box>
            )
        }
        return (
            <div className="movie-list">
                {boxes}
            </div>
        )
    }
    const displayMovies = () => {
        if (filteredMovies.length > 0) {
            return (
                <div className="movie-list">
                    {filteredMovies.map((movie) => (
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
                            isMovie={props.isAuthenticated ? props.fullWatchedMovies.some(item => item.ID_Film === movie.ID_Film) ? false : "movie" : false}
                            userID={userID}
                            id={movie.ID_Film}
                            movieOrSerial={movie}
                            onOpenModal={openModal}
                            esteFilm={true}
                        />
                    ))}
                </div>
            )
        }
        else {
            return (
                <div className="movie-list">
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
                            isMovie={props.isAuthenticated ? props.fullWatchedMovies.some(item => item.ID_Film === movie.ID_Film) ? false : "movie" : false}
                            userID={userID}
                            id={movie.ID_Film}
                            movieOrSerial={movie}
                            onOpenModal={openModal}
                            esteFilm={true}
                        />
                    ))}
                </div>
            )
        }
    }
    return (
        <div className="movies-box">
            <div className="search-options">
                <label
                    htmlFor="combo-box-demo"
                >Titlu</label>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={movieOptions}
                    sx={{ width: 250 }}
                    value={searchOptions.Titlu}
                    onChange={(event, newValue) => {
                        setSearchOptions({
                            ...searchOptions,
                            Titlu: newValue || ""
                        });
                    }}
                    renderInput={(params) => <TextField {...params}
                        variant="filled"
                        size="small"
                        margin="dense"
                        label="Film"

                    />}
                />
                <label
                    htmlFor="combo-box-demo"
                >Gen</label>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={movieGenreOptions}
                    sx={{ width: 250 }}
                    value={searchOptions.Gen}
                    onChange={(event, newValue) => {
                        setSearchOptions({
                            ...searchOptions,
                            Gen: newValue || ""
                        });
                    }}
                    renderInput={(params) => <TextField {...params}
                        variant="filled"
                        size="small"
                        margin="dense"
                        label="Gen"
                    />}
                />
                <FormControl>
                    <label id="demo-controlled-radio-buttons-group">IMDB Rating</label>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={searchOptions.Value}
                        onChange={(event, newValue) => {
                            setSearchOptions({
                                ...searchOptions,
                                Value: newValue || ""
                            });
                        }}
                    >
                        <FormControlLabel value="asc" control={<Radio />} label="Crescator" />
                        <FormControlLabel value="desc" control={<Radio />} label="Descrescator" />
                    </RadioGroup>
                </FormControl>
            </div>
            {loading ?
                displayMovieSkeleton()
                : displayMovies()}
            {isModalOpen && <Modal onCloseModal={closeModal} message="Filmul a fost adăugat." />}
        </div>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        fullWatchedMovies: state.views.fullWatchedMovies,
        user: state.user
    }
}
export default connect(mapStateToProps)(Movie);