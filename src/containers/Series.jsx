import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { TextField, Autocomplete } from "@mui/material";
import MovieCard from "../components/MovieCard";
import '../style/Movies.css'
import { connect } from "react-redux";
import Modal from "../components/Modal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Skeleton from "@mui/material/Skeleton";
import Box from '@mui/material/Box';

const Series = (props) => {
    const [series, setSeries] = useState([]);
    const [userID, setUserID] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredSeries, setFiltredSeries] = useState([]);
    const [serialOptions, setMovieOptions] = useState([]);
    const [serialGenreOptions, setMovieGenreOptions] = useState([]);
    const [searchOptions, setSearchOptions] = useState(
        {
            Titlu: "",
            Gen: "",
            Value: "",
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
        getSeries();
        if (props.isAuthenticated) {
            setUserID(props.user.user.ID_Utilizator);
        }
    }, [])
    useEffect(() => {
        const filteredSeries = setSeriesList(searchOptions.Value);
        setFiltredSeries(filteredSeries);
    }, [searchOptions])
    const setSeriesList = (order) => {
        const filteredSeries = series.filter((serial) => {
            const { Titlu, Gen } = searchOptions;

            // Verificăm dacă titlul și genul sunt goale sau se potrivesc cu filmul curent
            const matchesTitle = Titlu === "" || serial.Titlu.includes(Titlu);
            const matchesGenre = Gen === "" || serial.Gen.includes(Gen);

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
        filteredSeries.sort(comparatie);
        return filteredSeries;
    }
    const getSeries = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/seriale');
            setSeries(response.data);
            setLoading(false);
            const updatedOptions = response.data
                .map((serial) => serial.Titlu)
                .filter((title, index, array) => array.indexOf(title) === index);;
            const updateMovieGenreOptions = response.data.reduce((acc, serial) => {
                const serialGenres = serial.Gen.split(',').map((genre) => genre.trim());
                serialGenres.forEach((genre) => {
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
    const displaySeries = () => {
        if (filteredSeries.length > 0) {
            return (
                <div className="movie-list">
                    {filteredSeries.map((serial) => (
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
                            isMovie={props.isAuthenticated ?
                                (props.fullWatchedSeries.some(item => item.ID_Serial === serial.ID_Serial) || props.watchingSeries.some(item => item.ID_Serial === serial.ID_Serial)) ? false : "serial" : false}
                            userID={userID}
                            id={serial.ID_Serial}
                            movieOrSerial={serial}
                            onOpenModal={openModal}
                            esteFilm={false}
                        />
                    ))}
                </div>
            )
        }
        else {
            return (
                <div className="movie-list">
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
                            isMovie={props.isAuthenticated ?
                                (props.fullWatchedSeries.some(item => item.ID_Serial === serial.ID_Serial) || props.watchingSeries.some(item => item.ID_Serial === serial.ID_Serial)) ? false : "serial" : false}
                            userID={userID}
                            id={serial.ID_Serial}
                            movieOrSerial={serial}
                            onOpenModal={openModal}
                            esteFilm={false}
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
                    options={serialOptions}
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
                        label="Serial"

                    />}
                />
                <label
                    htmlFor="combo-box-demo"
                >Gen</label>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={serialGenreOptions}
                    sx={{ width: 250}}
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
            {loading ? displayMovieSkeleton() : displaySeries()}
            {isModalOpen && <Modal onCloseModal={closeModal} message="Serialul a fost adăugat." />}
        </div>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        fullWatchedSeries: state.views.fullWatchedSeries,
        watchingSeries: state.views.watchingSeries,
        user: state.user
    }
}
export default connect(mapStateToProps)(Series);