import { useState, useEffect } from 'react';
import ActionAreaCard from './ActionAreaCard';
import { Paper } from "@mui/material";
import { connect } from "react-redux";

function Sezon({ sezon, isSezonViewed, inVizionare, sezonVazutStateChanger, sezonInVizionareStateChanger, isAuthenticated, views, episoadeCheckStateChanger, episoadeCheckArray }) {

    const [isChecked, setIsChecked] = useState(isSezonViewed);
    const [episoade, setEpisoade] = useState(
        sezon.map((episod, index) => ({
            ID_Episod: episod.ID_Episod,
            numar: index,
            checked: isChecked
        }))
    );
    useEffect(() => {
        setIsChecked(isSezonViewed)
        if (inVizionare === true) {
            const updatedEpisoade = episoade.map(episod => {
                if (episoadeCheckArray.some(episodVazut => episodVazut.ID_Episod === episod.ID_Episod)) {
                    return {
                        ...episod,
                        checked: true
                    };
                }
                return episod;
            });

            setEpisoade(updatedEpisoade);
        }
        else if (isSezonViewed === true) {
            setEpisoade(sezon.map((episod, index) => ({
                ID_Episod: episod.ID_Episod,
                numar: index,
                checked: isSezonViewed
            })))
        }
        else {
            setEpisoade(sezon.map((episod, index) => ({
                ID_Episod: episod.ID_Episod,
                numar: index,
                checked: isSezonViewed
            })))
        }
    }, [isSezonViewed])


    useEffect(() => {
        const episoadeCheck = episoade.filter((episod) => episod.checked === true);
        if (episoadeCheck.length === 0) {
            episoadeCheckStateChanger(null);
        }
        else {
            episoadeCheckStateChanger(episoadeCheck);
        }
    }, [episoade])

    useEffect(() => {
        if (isAuthenticated) {
            const episoadeInSezon = views.fullWatchedSeries
                .flatMap((item) => item.episoade)
                .filter((episod) =>
                    sezon.some((sezonEpisod) => sezonEpisod.ID_Episod === episod)
                );
            episoade.map((episod) => {
                if (episoadeInSezon.some((ID_Episod) => episod.ID_Episod === ID_Episod)) {
                    episod.checked = true;
                }
            })
        }
    }, [])

    const handleEpisodCheckAll = (index) => {
        if (index === episoade.length - 1 && episoade[index].checked === false) {

            const newArray = [...episoade];
            newArray[index].checked = !episoade[index].checked;
            setEpisoade(newArray);

            sezonVazutStateChanger(true);
            sezonInVizionareStateChanger(false);
        }
        else if (index === episoade.length - 1 && episoade[index].checked === true) {

            const newArray = [...episoade];
            newArray[index].checked = !episoade[index].checked;
            setEpisoade(newArray);

            sezonVazutStateChanger(false);
            sezonInVizionareStateChanger(false);
        }
        else if (index === 0 && episoade[index].checked === true) {

            const updatedEpisoade = episoade.slice().map((episod, i) => {
                if (i >= index) {
                    return {
                        ...episod,
                        checked: false
                    };
                }
                return episod;
            });
            setEpisoade(updatedEpisoade);

            sezonVazutStateChanger(false);
            sezonInVizionareStateChanger(false);
        }
        else if (index === 0 && episoade[index].checked === false) {

            const newArray = [...episoade];
            newArray[index].checked = !episoade[index].checked;
            setEpisoade(newArray);

            sezonInVizionareStateChanger(true);
        }
        else if (episoade[index].checked === false) {

            const updatedEpisoade = episoade.slice().map((episod, i) => {
                if (i <= index) {
                    return {
                        ...episod,
                        checked: true
                    };
                }
                return episod;
            });
            setEpisoade(updatedEpisoade);
            sezonInVizionareStateChanger(true);
        }
        else if (episoade[index].checked === true) {
            const updatedEpisoade = episoade.slice().map((episod, i) => {
                if (i >= index) {
                    return {
                        ...episod,
                        checked: false
                    };
                }
                return episod;
            });
            setEpisoade(updatedEpisoade);
        }
    };

    return (
        <Paper style={{ width: "95%", overflowX: 'auto', overflowY: 'hidden', whiteSpace: "nowrap", padding: 8, margin: "auto" }}>
            {sezon.map((episod, index) => (
                <ActionAreaCard
                    key={episod.ID_Episod}
                    number={index + 1}
                    img={episod.Poster}
                    title={episod.Titlu}
                    description={episod.Descriere}
                    rating={episod.IMDB_Rating}
                    isViewed={episoade[index].checked}
                    onCheckAll={() => handleEpisodCheckAll(index)}
                />
            ))}
        </Paper>
    );
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        views: state.views
    }
}

export default connect(mapStateToProps, null)(Sezon);