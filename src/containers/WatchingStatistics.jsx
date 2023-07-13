import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import { connect } from 'react-redux';
import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import "../style/statistics.css"
import { Paper } from "@mui/material";

function WatchingStatistics(props) {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const [totalMinutesSeries, setTotalMinutesSeries] = useState(0);
    const [daysSeries, setDaysSeries] = useState(0);
    const [hoursSeries, setHoursSeries] = useState(0);
    const [minutesSeries, setMinutesSeries] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const { fullWatchedMovies, fullWatchedSeries, watchingSeries } = props;
    const profileAvatarDefault = '../../public/user-profile-avatar.jpg';
    const imgSrc = props.user.Avatar === "none" ? profileAvatarDefault : props.user.Avatar;
    // Calculate movie genres count
    // Calculate movie genres count
    const movieGenresCount = fullWatchedMovies.reduce((genreCount, movie) => {
        const genres = movie.Gen.split(", "); // Split the genres string into an array
        genres.forEach((genre) => {
            if (genreCount[genre]) {
                genreCount[genre]++;
            } else {
                genreCount[genre] = 1;
            }
        });
        return genreCount;
    }, {});

    // Calculate series genres count
    const seriesGenresCount = fullWatchedSeries.reduce((genreCount, series) => {
        const genres = series.Gen.split(", "); // Split the genres string into an array
        genres.forEach((genre) => {
            if (genreCount[genre]) {
                genreCount[genre]++;
            } else {
                genreCount[genre] = 1;
            }
        });
        return genreCount;
    }, {});

    // Prepare data for movie genres pie chart
    const movieGenresData = {
        labels: Object.keys(movieGenresCount),
        datasets: [
            {
                data: Object.values(movieGenresCount),
                backgroundColor: generateRandomColors(Object.keys(movieGenresCount).length), // Generate random colors for each genre slice
                weight: 1
            },
        ],
    };

    // Prepare data for series genres pie chart
    const seriesGenresData = {
        labels: Object.keys(seriesGenresCount),
        datasets: [
            {
                data: Object.values(seriesGenresCount),
                backgroundColor: generateRandomColors(Object.keys(seriesGenresCount).length), // Generate random colors for each genre slice
                weight: 1
            },
        ],
    };

    // Generate random colors for the chart slices
    function generateRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        return colors;
    }

    // Calculează numărul total de minute pentru a urmări filmele
    const totalMinutes = fullWatchedMovies.reduce((total, movie) => {
        const duration = parseInt(movie.Durata.split(" ")[0]); // Extrage numărul de minute din proprietatea "tip" a filmului
        return total + duration;
    }, 0);

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const calculateTotalMinutes = async () => {
        let totalMinutesSeries = 0;
        const allSeries = [...fullWatchedSeries, ...watchingSeries];
        for (let i = 0; i < allSeries.length; i++) {
            const series = allSeries[i];
            if (series.episoade) {
                for (const episodeId of series.episoade) {
                    const response = await axios.get(`http://localhost:3000/api/episoade/${episodeId}`);
                    if (response.data) {
                        const episodeDuration = parseInt(response.data.Durata.split(" ")[0]);
                        if (!isNaN(episodeDuration)) {
                            totalMinutesSeries += episodeDuration;
                        }
                    }
                }
                const progress = ((i + 1) / allSeries.length) * 100;
                setProgress(progress);
            }
        }

        setTotalMinutesSeries(totalMinutesSeries);
        setDaysSeries(Math.floor(totalMinutesSeries / (60 * 24)));
        setHoursSeries(Math.floor((totalMinutesSeries % (60 * 24)) / 60));
        setMinutesSeries(totalMinutesSeries % 60);
        setIsLoading(false);
    };
    const calculateTotalEpisodes = () => {
        let episodesCount = 0;
        const allSeries = [...fullWatchedSeries, ...watchingSeries];
        for (const series of allSeries) {
            if (series.episoade) {
                episodesCount += series.episoade.length;
            }
        }

        setTotalEpisodes(episodesCount);
    };
    useEffect(() => {
        calculateTotalMinutes();
        calculateTotalEpisodes();
    }, [fullWatchedSeries]);

    const data = {
        labels: ["Filme", "Seriale"],
        datasets: [
            {
                data: [fullWatchedMovies.length, fullWatchedSeries.length],
                backgroundColor: ["#FF6384", "#36A2EB"],
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }} >
                        <h1>Se încarcă...</h1>
                        <CircularProgress variant="determinate" value={progress} />
                    </div >
                )
                    : (
                        <div className="user-profile-box">
                            <div className="user-data">
                                <img className="avatar-profile"
                                    src={imgSrc}
                                >
                                </img>
                                <p className="user-name">
                                    {props.user.Nume_utilizator}
                                </p>
                            </div>
                            <div className="stats">

                                <>
                                    <Paper sx={{ height: "fit-content", padding: 2, display: "flex", marginBottom: "30px" }}>
                                        <div className="pie">
                                            <h2 className="align-text">Genuri filme (vizionate)</h2>

                                            <Pie data={movieGenresData} options={options} />
                                        </div>

                                        <div className="pie">
                                            <h2 className="align-text">Genuri seriale (vizionate)</h2>
                                            <Pie data={seriesGenresData} options={options} />
                                        </div>
                                        <div className="pie">
                                            <h2 className="align-text">Procent filme/seriale</h2>
                                            <Pie data={data} options={options} />
                                        </div>
                                    </Paper>
                                    <Paper sx={{ height: "fit-content", padding: 2 }}>
                                        <div>
                                            <h2 className="align-text">Total timp de vizionare filme</h2>
                                            <p className="align-text">{`${days} zile ${hours} ore ${minutes} minute`}</p>
                                        </div>

                                        <div>
                                            <h2 className="align-text">Total timp de vizionare seriale</h2>{totalMinutesSeries > 0 &&
                                                <p className="align-text">{`${daysSeries} zile ${hoursSeries} ore ${minutesSeries} minute`}</p>
                                            }
                                        </div>
                                        <div>
                                            <h2 className="align-text">Total de episoade vizionate</h2>
                                            <p className="align-text">{totalEpisodes} episoade</p>
                                        </div>
                                    </Paper>
                                </>

                            </div>
                        </div>
                    )}
        </>
    );
};
const mapStateToProps = (state) => {
    return {
        fullWatchedMovies: state.views.fullWatchedMovies,
        fullWatchedSeries: state.views.fullWatchedSeries,
        watchingSeries: state.views.watchingSeries,
        user: state.user.user
    };
};

export default connect(mapStateToProps)(WatchingStatistics);
