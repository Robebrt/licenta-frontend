import ActionAreaCard from "./ActionAreaCard";
import { Paper } from "@mui/material";
import { IconButton } from '@mui/material';
import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Sezon from "./Sezon";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import { addToWatchSerial, addFullWatchedSerial, deleteSerial, removeToWatchSerial } from "../actions/viewsActions";
import axios from "axios";
import Modal from "./Modal";


function ListaEpisoade({ episoade, serialID, isAuthenticated, views, serial, addToWatchSerial, user, addFullWatchedSerial, deleteSerial, removeToWatchSerial }) {

    // Găsim numărul maxim de sezoane în lista de episoade
    const numarMaximSezoane = Math.max(...episoade.map(episod => episod.Sezon));

    // Creăm un array gol pentru fiecare sezon
    const sezoane = Array.from({ length: numarMaximSezoane }, (_, index) => ({
        numarSezon: index + 1,
        episoade: []
    }));

    // Adăugăm fiecare episod în array-ul corespunzător sezonului său
    episoade.forEach(episod => {
        const { Sezon, ...rest } = episod;
        sezoane[Sezon - 1].episoade.push(rest);
    });

    const [divVisibleArray, setDivVisibleArray] = useState(Array(numarMaximSezoane).fill(false));
    const [sezonVazutArray, setSezonVazutArray] = useState(Array(numarMaximSezoane).fill(false));

    const [sezonInViewingArray, setSezonInViewingArray] = useState(Array(numarMaximSezoane).fill(false));
    const [sezonCuEpisoadeVazuteState, setSezonCuEpisoadeVazuteState] = useState();

    const [episoadeCheckArray, setEpisoadeCheckArray] = useState(Array(numarMaximSezoane).fill(null));

    const [allEpisodesViewed, setAllEpisodesViewed] = useState(false);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const getEpisoade = async () => {
        const response = await axios.get(`http://localhost:3000/api/vizionari/getBySerialID/${serialID}`);
        if (response.data) {
            const arrayID_Episod = response.data.map(vizionare => vizionare.ID_Episod);
            return arrayID_Episod;
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                if (views.fullWatchedSeries.some((serial) => serial.ID_Serial === serialID)) {
                    const episoadeVazute = await getEpisoade();
                    if (episoadeVazute) {
                        const sezoaneVizionate = sezoane.map((sezon) => {
                            const toateEpisoadeleVazute = sezon.episoade.every((episod) => episoadeVazute.includes(episod.ID_Episod));
                            return toateEpisoadeleVazute;
                        });
                        setSezonVazutArray(sezoaneVizionate);
                    }

                }
                else if (views.watchingSeries.some((serial) => serial.ID_Serial === serialID)) {
                    const episoadeVazute = await getEpisoade();
                    if (episoadeVazute) {
                        const sezoaneVizionate = sezoane.map((sezon) => {
                            const toateEpisoadeleVazute = sezon.episoade.every((episod) => episoadeVazute.includes(episod.ID_Episod));
                            return toateEpisoadeleVazute;
                        });
                        //
                        const indexSezonCuEpisoadeVazute = sezoaneVizionate.findIndex(vazut => vazut === false);
                        const episoadeSezon = sezoane[indexSezonCuEpisoadeVazute].episoade;
                        let elementeComune = [];
                        episoadeSezon.forEach(function (episod) {
                            episoadeVazute.forEach(function (episodVazut) {
                                if (episod.ID_Episod === episodVazut) {
                                    elementeComune.push(episod);
                                }
                            });
                        });
                        if (elementeComune.length > 0) {
                            const newEpisoadeCheck = episoadeCheckArray.map((val, index) => {
                                if (index <= indexSezonCuEpisoadeVazute - 1) {
                                    const sezonArray = sezoane[index].episoade;
                                    return sezonArray;
                                } else if (index === indexSezonCuEpisoadeVazute) {
                                    let sezonInView = [];
                                    for (let i = 0; i < elementeComune.length; i++) {
                                        if (sezoane[index].episoade[i].ID_Episod === elementeComune[i].ID_Episod) {
                                            sezonInView.push(elementeComune[i]);
                                        }
                                    }
                                    return sezonInView;
                                }
                                else {
                                    return val;
                                }
                            })
                            setEpisoadeCheckArray(newEpisoadeCheck);
                            const newArray = [...sezonInViewingArray];
                            newArray[indexSezonCuEpisoadeVazute] = true;
                            setSezonInViewingArray(newArray);
                        }
                        setSezonVazutArray(sezoaneVizionate);
                    }
                }
            }
        }
        fetchData();
    }, [views]);
    useEffect(() => {
        const episoadeFiltrate = episoadeCheckArray.filter((arrayEpisoade) => arrayEpisoade !== null);
        const contineToateEpisoadele = sezoane.every((sezon, index) => {
            const episoadeSezon = sezon.episoade;
            if (episoadeFiltrate[index] !== null && episoadeFiltrate.length > 0) {
                const episoadeFiltrateSezon = episoadeFiltrate[index];
                if (episoadeFiltrateSezon) {
                    return episoadeSezon.every((episod) => {
                        return episoadeFiltrateSezon.some(
                            (filtrat) => filtrat.ID_Episod === episod.ID_Episod
                        );
                    });
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });

        setAllEpisodesViewed(contineToateEpisoadele);
    }, [episoadeCheckArray])

    const toggleDiv = (numarSezon) => {
        const newArray = [...divVisibleArray];
        newArray[numarSezon] = !newArray[numarSezon];
        setDivVisibleArray(newArray);
    };
    const handleCheckboxChange = (numarSezon) => {

        if (sezonVazutArray[numarSezon] === false) {
            const newArray = sezonVazutArray.map((val, index) => {
                if (index <= numarSezon) {
                    return true; // Setăm toate valorile până la index pe true
                } else {
                    return val; // Păstrăm valorile existente pentru indexuri ulterioare
                }
            });
            setSezonVazutArray(newArray);
            const newEpisoadeCheck = episoadeCheckArray.map((val, index) => {
                if (index <= numarSezon) {
                    const sezonArray = sezoane[index].episoade;
                    return sezonArray;
                } else {
                    return val;
                }
            })
            setEpisoadeCheckArray(newEpisoadeCheck);
        }
        else {
            const newArray = sezonVazutArray.map((val, index) => {
                if (index >= numarSezon) {
                    return false; // Setăm toate valorile până la index pe true
                } else {
                    return val; // Păstrăm valorile existente pentru indexuri ulterioare
                }
            });
            setSezonVazutArray(newArray);
            const newEpisoadeCheck = episoadeCheckArray.map((val, index) => {
                if (index <= numarSezon) {
                    return null;
                } else {
                    return val;
                }
            })
            setEpisoadeCheckArray(newEpisoadeCheck);
        }
    }

    const saveOnClick = async () => {
        const currentDate = new Date();

        // Extrage anul, luna și ziua din data curentă
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Creează data în formatul MySQL
        const mysqlDate = `${year}-${month}-${day}`;
        let vision = {};
        if (allEpisodesViewed === true) {
            vision = {
                "ID_Utilizator": user.user.ID_Utilizator,
                "ID_Serial": serial.ID_Serial,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": true,
                "Preferat": false
            }
        }
        else {
            vision = {
                "ID_Utilizator": user.user.ID_Utilizator,
                "ID_Serial": serial.ID_Serial,
                "Data_vizionare": mysqlDate,
                "Vazut_complet": false,
                "Preferat": false
            };
        }
        const isPosted = await postVisionData(vision);
        if (isPosted) {
            if (allEpisodesViewed === true) {
                setModalMessage("Serialul adăugat la serialele tale vizionate")
                openModal();
                addFullWatchedSerial(serial);
                if (views.watchingSeries.some((serial) => serial.ID_Serial === serialID)) {
                    removeToWatchSerial(serial);
                }
            }
            else {
                setModalMessage("Serialul adăugat la serialele tale în vizionare");
                openModal();
                if (views.watchingSeries.some((serial) => serial.ID_Serial === serialID)) {
                    removeToWatchSerial(serial)
                }
                addToWatchSerial(serial);
                if (views.fullWatchedSeries.some((serial) => serial.ID_Serial === serialID)) {
                    deleteSerial(serialID);
                }
            }
        }
    }
    const postVisionData = async (vision) => {
        if (allEpisodesViewed === false) {
            const episoadeFiltrate = episoadeCheckArray.filter((arrayEpisoade) => arrayEpisoade !== null);
            episoadeFiltrate.forEach((arrayEpisoade) => {
                arrayEpisoade.forEach((episod) => {
                    const episodData = {
                        "ID_Episod": episod.ID_Episod,
                        "ID_Serial": vision.ID_Serial,
                        "Data_vizionare": vision.Data_vizionare,
                        "ID_Utilizator": vision.ID_Utilizator,
                        "Vazut_complet": false,
                        "Preferat": false
                    };

                    axios.post('http://localhost:3000/api/vizionari/serialOnWatch', episodData)
                        .then((response) => {
                        })
                        .catch((error) => {
                            console.error('Cerere POST cu eroare pentru episod:', episod.ID_Episod)
                            axios.delete(`http://localhost:3000/api/vizionari/deleteBySerialID/${vision.ID_Serial}`);
                            return false;
                            // gestionează eroarea aici
                        });
                });
            });
            return true;

        }
        else {
            axios.delete(`http://localhost:3000/api/vizionari/deleteBySerialID/${serialID}`);
            const response = await axios.post("http://localhost:3000/api/vizionari/serial", vision);
            if (response.status === 201) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    // Returnăm lista de episoade pentru fiecare sezon
    return (
        <div>
            {sezoane.map((sezon, index) => (
                <div key={sezon.numarSezon}>
                    <div style={{ display: "flex" }}>
                        <h2>Sezon {sezon.numarSezon} </h2>
                        {isAuthenticated && <FormControlLabel
                            control={<Checkbox
                                checked={sezonVazutArray[sezon.numarSezon - 1]}
                                onChange={() => handleCheckboxChange(sezon.numarSezon - 1)}
                            />}
                            label="Vizionat"
                            labelPlacement="start"
                        />}
                        {isAuthenticated && <FormControlLabel
                            disabled
                            control={<Checkbox
                                checked={sezonInViewingArray[sezon.numarSezon - 1]}
                            />}
                            label="In vizionare"
                            labelPlacement="start"
                        />}
                        <IconButton
                            onClick={() => toggleDiv(sezon.numarSezon - 1)}
                        >
                            {!divVisibleArray[sezon.numarSezon - 1] && <KeyboardArrowDownIcon />}
                            {divVisibleArray[sezon.numarSezon - 1] && <KeyboardArrowRightIcon />}
                        </IconButton>
                    </div>{
                        divVisibleArray[index] &&
                        <Sezon
                            sezonCuEpisoadeVazute={sezonCuEpisoadeVazuteState}
                            sezon={sezon.episoade}
                            isSezonViewed={sezonVazutArray[index]}
                            sezonVazutStateChanger={(newValue) => {
                                const newArray = [...sezonVazutArray];
                                newArray[index] = newValue;
                                setSezonVazutArray(newArray);
                            }}
                            sezonInVizionareStateChanger={(newValue) => {
                                const newArray = [...sezonInViewingArray];
                                newArray[index] = newValue;
                                setSezonInViewingArray(newArray);
                            }}
                            inVizionare={sezonInViewingArray[index]}
                            episoadeCheckStateChanger={(newValue) => {
                                const newArray = [...episoadeCheckArray];
                                newArray[index] = newValue;
                                setEpisoadeCheckArray(newArray);
                            }
                            }
                            episoadeCheckArray={episoadeCheckArray[index]}
                        />
                    }
                </div>
            ))}
            {isAuthenticated && <Button variant='contained' onClick={() => { saveOnClick() }}>Salvează</Button>}
            {isModalOpen && <Modal onCloseModal={closeModal} message={modalMessage} />}
        </div>
    );
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        views: state.views,
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addToWatchSerial: (serial) => dispatch(addToWatchSerial(serial)),
        addFullWatchedSerial: (serial) => dispatch(addFullWatchedSerial(serial)),
        deleteSerial: (serialID) => dispatch(deleteSerial(serialID)),
        removeToWatchSerial: (serial) => dispatch(removeToWatchSerial(serial))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListaEpisoade);