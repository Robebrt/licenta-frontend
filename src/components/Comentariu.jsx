import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActions } from '@mui/material';
import { IconButton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { likeComment, removeLikeComment, removeComment } from "../actions/commentsActions";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/comentariu.css'

function Comentariu({ comentariu, userLogedInID, likeComment, removeLikeComment, removeComment, onOpenModal, likedComments }) {
    const [liked, setIsLiked] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {

        if (likedComments.some((likedArray) => likedArray.some((likedComment) => likedComment.ID_Utilizator === userLogedInID && likedComment.ID_Comentariu === comentariu.ID_Comentariu))) {
            setIsLiked(true);
        }
    }, [])
    const clickLikeComment = async () => {
        const isUpdated = await updateLike(!liked);
        if (isUpdated === true) {
            if (liked) {
                let idApreciere = null;

                for (const aprecieriGrupate of likedComments) {
                    const apreciere = aprecieriGrupate.find(
                        (apreciere) => apreciere.ID_Utilizator === userLogedInID && apreciere.ID_Comentariu === comentariu.ID_Comentariu
                    );

                    if (apreciere) {
                        idApreciere = apreciere.ID_Apreciere;
                        break;
                    }
                }
                const deletedLike = await deleteLike(idApreciere);
                if (deletedLike) {
                    removeLikeComment(comentariu.ID_Comentariu);
                }
            }
            else {
                const toLike = await postLike();
                if (toLike) {
                    likeComment(comentariu.ID_Comentariu);
                }
            }
        }
        setIsLiked(!liked);
    }

    const updateLike = async (toLike) => {
        const number = toLike ? comentariu.Aprecieri + 1 : comentariu.Aprecieri - 1;
        try {
            const response = await axios.put(`http://localhost:3000/api/comentarii/${comentariu.ID_Comentariu}`, {
                "Aprecieri": number
            });
            if (response.data) {
                return true;
            }
        } catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
            return false;
        }
    }
    const postLike = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/comentarii/${comentariu.ID_Comentariu}/aprecieri`, { idUtilizator: userLogedInID });
            if (response.data) {
                return true;
            }
        }
        catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
            return false;
        }
    }
    const deleteLike = async (idapreciere) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/comentarii/${comentariu.ID_Comentariu}/aprecieri/${idapreciere}`);
            if (response.status === 204) {
                return true;
            }
        }
        catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
            return false;
        }
    }
    const clickRemoveComment = async () => {
        const isDeleted = await deleteComment();
        if (isDeleted === true) {
            onOpenModal();
            removeComment(comentariu);
        }
    }

    const deleteComment = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/comentarii/${comentariu.ID_Comentariu}`);
            if (response.status === 204) {
                return true;
            }
        }
        catch (error) {
            console.error('Eroare la obținerea comentariilor:', error);
            return false;
        }
    }

    const displayComment = (comentariu) => {
        const currentDate = new Date();

        const sqlDate = comentariu.Data_Postare;
        // Date to subtract (example: June 1, 2023)
        const subtractedDate = new Date(sqlDate);

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = currentDate - subtractedDate;

        // Convert the difference to days
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        let message = "";
        switch (differenceInDays) {
            case 0:
                message = "Astăzi";
                break;
            case 1:
                message = "Ieri";
                break;
            default:
                message = "Acum " + differenceInDays + " zile";
                break;
        }
        const navigateToProfile = (id) => {
            navigate(`/profiles/${id}`);
        }
        return (
            <>
                <Card sx={{ marginBottom: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <CardHeader 
                        className="class"
                            onClick={() => navigateToProfile(comentariu.ID_Utilizator)}
                            avatar={
                                <Avatar alt="Avatar" src={comentariu.Avatar} />

                            }
                            title={comentariu.Nume_utilizator}
                            subheader={message}
                        />
                        {comentariu.ID_Utilizator === userLogedInID &&
                            <RemoveCircleIcon
                                onClick={clickRemoveComment}
                            />
                        }
                    </div>
                    <CardContent>
                        <Typography variant="body2" color="text.primary">
                            {comentariu.Comentariu}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={clickLikeComment}>
                            {liked ? (<ThumbUpAltIcon />) : (<ThumbUpOffAltIcon />)}
                            {comentariu.Aprecieri}
                        </IconButton>
                    </CardActions>
                </Card>

            </>
        )

    }

    return (
        <>
            {displayComment(comentariu)}
        </>
    )

}
const mapStateToProps = state => {
    return {
        likedComments: state.comments.likedComments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        likeComment: (commentID) => dispatch(likeComment(commentID)),
        removeLikeComment: (commentID) => dispatch(removeLikeComment(commentID)),
        removeComment: (comment) => dispatch(removeComment(comment))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comentariu);