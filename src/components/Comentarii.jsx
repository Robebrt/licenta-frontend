import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Comentariu from './Comentariu';
import { Button, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { addComment, updateComments } from '../actions/commentsActions'
import Modal from './Modal';

function Comentarii({ idFilmSerial, isMovie, isAuthenticated, userID, inViewing, avatar, addComment, removeComment, updateComments, comments,
    isLoadingComments, user, fullWatchedSeries, fullWatchedMovies, views }) {

    const [noulComentariu, setNoulComentariu] = useState('');
    const [toShow, setToShow] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    // Funcție pentru a obține comentariile din API
    const fetchComentarii = async () => {
        if (isMovie === true) {
            try {
                const response = await axios.get(`http://localhost:3000/api/comentarii/getByMovieID/${idFilmSerial}`);
                if (response.data) {

                    const usersDetails = await Promise.all(response.data.map(comentariu => getAvatarAndUsername(comentariu.ID_Utilizator)));
                    const combinedArray = response.data.map((obj1, index) => {
                        const obj2 = usersDetails[index];
                        return { ...obj1, ...obj2 };
                    });
                    const likedComments = await Promise.all(response.data.map(comentariu => getLikedComments(comentariu.ID_Comentariu)));

                    updateComments(combinedArray, likedComments);
                }
            } catch (error) {
                console.error('Eroare la obținerea comentariilor:', error);
            }
        }
        else if (isMovie === false) {
            try {
                const response = await axios.get(`http://localhost:3000/api/comentarii/getBySerialID/${idFilmSerial}`);
                if (response.data) {

                    const usersDetails = await Promise.all(response.data.map(comentariu => getAvatarAndUsername(comentariu.ID_Utilizator)));
                    const combinedArray = response.data.map((obj1, index) => {
                        const obj2 = usersDetails[index];
                        return { ...obj1, ...obj2 };
                    });
                    const likedComments = await Promise.all(response.data.map(comentariu => getLikedComments(comentariu.ID_Comentariu)));
                    updateComments(combinedArray, likedComments);
                }
            } catch (error) {
                console.error('Eroare la obținerea comentariilor:', error);
            }
        }
    };
    const getAvatarAndUsername = async (iduser) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/utilizatori/${iduser}`);

            if (response.data) {
                return { Nume_utilizator: response.data.Nume_utilizator, Avatar: response.data.Avatar };
            }
        } catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
        }
    }
    const getLikedComments = async (idcomment) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/comentarii/${idcomment}/aprecieri`)
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
        }
    }
    // Funcție pentru a posta un comentariu
    const postComentariu = async () => {
        const currentDate = new Date();
        // Extrage anul, luna și ziua din data curentă
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Creează data în formatul MySQL
        const mysqlDate = `${year}-${month}-${day}`;
        if (isMovie === true) {
            try {
                const response = await axios.post("http://localhost:3000/api/comentarii", {
                    "ID_Utilizator": userID,
                    "Comentariu": noulComentariu,
                    "ID_Film": idFilmSerial,
                    "Data_Postare": mysqlDate,
                    "Aprecieri": 0
                });

                if (response.status === 201) {
                    const usersDetails = { "Avatar": user.Avatar, "Nume_utilizator": user.Nume_utilizator };
                    const combinedObject = Object.assign({}, response.data, usersDetails);
                    addComment(combinedObject);
                    setNoulComentariu('');
                } else {
                    console.error('Eroare la postarea comentariului:', response.statusText);
                }
            } catch (error) {
                console.error('Eroare la postarea comentariului:', error);
            }
        }
        else if (isMovie === false) {
            try {
                const response = await axios.post("http://localhost:3000/api/comentarii", {
                    "ID_Utilizator": userID,
                    "Comentariu": noulComentariu,
                    "ID_Serial": idFilmSerial,
                    "Data_Postare": mysqlDate,
                    "Aprecieri": 0
                });

                if (response.status === 201) {
                    const usersDetails = { "Avatar": user.Avatar, "Nume_utilizator": user.Nume_utilizator };
                    const combinedObject = Object.assign({}, response.data, usersDetails);
                    addComment(combinedObject);
                    setNoulComentariu('');
                } else {
                    console.error('Eroare la postarea comentariului:', response.statusText);
                }
            } catch (error) {
                console.error('Eroare la postarea comentariului:', error);
            }
        }
    };

    // Apelează funcția pentru a obține comentariile când componenta este montată
    useEffect(() => {
        fetchComentarii();
        const toShowComments = fullWatchedSeries.some((serial) => serial.ID_Serial === idFilmSerial) ? true : fullWatchedMovies.some((movie) => movie.ID_Film === idFilmSerial) ? true : false;
        setToShow(toShowComments);
    }, []);


    useEffect(() => {
        const toShowComments = fullWatchedSeries.some((serial) => serial.ID_Serial === idFilmSerial) ? true : fullWatchedMovies.some((movie) => movie.ID_Film === idFilmSerial) ? true : false;
        setToShow(toShowComments);
    }, [views])

    const display = () => {

        if (!isLoadingComments) {
            if (comments.length === 0) {
                return (
                    <p>Nu există comentarii.</p>
                )
            }
            else {
                return (<div style={{ width: "95%", padding: "10px" }}>
                    {comments.map((comentariu, index) =>
                        <Comentariu
                            key={comentariu.ID_Comentariu}
                            comentariu={comentariu}
                            userLogedInID={userID}
                            onOpenModal={openModal}
                        />
                    )}
                </div>)
            }
        }
    }

    const showVariant = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <h3>Se pare că nu ai vazut {isMovie === true ? "filmul" : "serialul complet"}, este posibil să vezi spoilere. Dorești totuși să continui?</h3>
                <Button variant='contained' sx={{ maxWidth: "30px" }} onClick={() => { setToShow(true) }}>Da</Button>
            </div>
        )
    }

    return (
        <div style={{ borderTop: "1px solid black", marginTop: "30px", width: "100%" }}>
            <h2>{comments.length} comentarii</h2>
            {toShow ?
                (
                    <>
                        <div style={{ display: 'flex', width: "80%", margin: "12px 0 12px 0" }}>
                            <Avatar alt="Avatar" src={avatar} sx={{ marginRight: "6px" }} />
                            <TextField
                                style={{ textAlign: 'left', width: "80%", borderRadius: "20px" }}
                                label="Alătură-te conversației"
                                value={noulComentariu}
                                onChange={e => { setNoulComentariu(e.target.value) }}
                                multiline
                                rows={2}
                            />
                            <Button onClick={() => postComentariu()} variant='contained'>Postează</Button>
                        </div>
                        {display()}
                    </>
                )
                : showVariant()
            }
            {isModalOpen && <Modal onCloseModal={closeModal} message="Comentariul a fost șters" />}
        </div>
    );
};
const mapStateToProps = state => {
    return {
        userID: state.user.user.ID_Utilizator,
        user: state.user.user,
        avatar: state.user.user.Avatar,
        comments: state.comments.comments,
        isLoadingComments: state.comments.isLoading,
        fullWatchedSeries: state.views.fullWatchedSeries,
        fullWatchedMovies: state.views.fullWatchedMovies,
        views: state.views,
        likedComments: state.comments.likedComments
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addComment: (comment) => dispatch(addComment(comment)),
        removeComment: (comment) => dispatch(removeComment(comment)),
        updateComments: (comments, likedComments) => dispatch(updateComments(comments, likedComments))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Comentarii);