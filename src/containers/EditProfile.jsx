import { TextField, Button } from "@mui/material";
import '../style/register.css'
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { updateUserData } from "../actions/authActions";
import axios from "axios";
function EditProfile(props) {
    const profileAvatarDefault = '../../public/user-profile-avatar.jpg';
    const imgSrc = props.user.Avatar === "none" ? profileAvatarDefault : props.user.Avatar;
    const [form, setForm] = useState(props.user);
    const [errors, setErrors] = useState({});
    const [createUserErrors, setCreateUserErrors] = useState("");
    const isImageURL = async (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                resolve(true);
            };
            img.onerror = function () {
                resolve(false);
            };
            img.src = url;
        });
    }

    const validateForm = async () => {
        let valid = true;
        const newErrors = {
            Avatar: "",
            Email: "",
            Nume: "",
            Nume_utilizator: "",
            Prenume: ""
        };

        //Validare pentru field-ul Avatar
        if (form.Avatar !== "none") {
            const isImage = await isImageURL(form.Avatar);
            if (!isImage) {
                newErrors.Avatar = "URL-ul nu este o imagine";
                valid = false;
            }
        }

        //Validare pentru câmpul de username
        if (!form.Nume_utilizator) {
            newErrors.Nume_utilizator = "Numele de utilizator este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z0-9]{3,16}$/.test(form.Nume_utilizator)) {
            newErrors.Nume_utilizator = "Folosiți doar litere și cifre.";
            valid = false;
        }

        //Validare pentru prenume
        if (!form.Prenume) {
            newErrors.Prenume = "Prenumele este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z]{2,50}$/.test(form.Prenume)) {
            newErrors.Prenume = "Folosiți doar litere pentru prenume";
            valid = false;
        }

        //Validare pentru prenume
        if (!form.Nume) {
            newErrors.Nume = "Numele este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z]{2,50}$/.test(form.Nume)) {
            newErrors.Nume = "Folosiți doar litere pentru nume";
            valid = false;
        }

        // Validare pentru câmpul de e-mail
        if (!form.Email) {
            newErrors.Email = 'E-mailul este necesar.';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.Email)) {
            newErrors.Email = 'Te rog introdu o adresă de email validă.';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    }
    const checkUsernameUniqueness = async (username) => {
        if (username === props.user.Nume_utilizator) {
            return true;
        }
        else {
            try {
                const response = await axios.get(`http://localhost:3000/api/utilizatori/getByUsername/${username}`);
                if (response.status === 404) {
                    return true;
                }
            }
            catch (error) {
                return true;
            }
            return false;
        }
    }
    const checkEmailUniqueness = async (email) => {
        if (email === props.user.Email) {
            return true;
        }
        else {
            try {
                const response = await axios.get(`http://localhost:3000/api/utilizatori/getByEmail/${email}`);
                if (response.status === 404) {
                    return true;
                }
            }
            catch (error) {
                return true;
            }
            return false;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await validateForm()) {
            //vezi daca utilizatorul si emailul sunt unice
            const isUsernameUnique = await checkUsernameUniqueness(form.Nume_utilizator);
            const isEmailUnique = await checkEmailUniqueness(form.Email);
            if (!isUsernameUnique) {
                // Afisarea unei erori că numele de utilizator nu este unic
                setCreateUserErrors("Există un user cu acest username.")
                return;
            }
            if (!isEmailUnique) {
                // Afisarea unei erori că adresa de email nu este unică
                setCreateUserErrors("Există un user cu acest email.")
                return;
            }
            const response = await axios.put(`http://localhost:3000/api/utilizatori/${props.user.ID_Utilizator}`,
                {
                    Avatar: form.Avatar,
                    Email: form.Email,
                    Nume: form.Nume,
                    Nume_utilizator: form.Nume_utilizator,
                    Prenume: form.Prenume
                })
            if (response.data) {
                props.updateUserData(response.data);
                setCreateUserErrors('Utilizator actualizat!');
                setForm(response.data);
            }
        }
    }
    return (
        <>
            <div className="register-page">
                <form className="register-form"
                    onSubmit={handleSubmit}
                >
                    <img className="avatar-profile"
                        src={imgSrc}
                    >
                    </img>
                    <label
                        htmlFor="edit-avatar"
                    >
                        Avatar URL</label>
                    <TextField
                        defaultValue={form.Avatar}
                        margin="dense"
                        onChange={e => {
                            setForm({
                                ...form,
                                Avatar: e.target.value
                            });
                        }}
                        error={!!errors.Avatar}
                        helperText={errors.Avatar}
                    />
                    <label
                        htmlFor="edit-username"
                    >
                        Nume de utilizator</label>
                    <TextField
                        id="edit-username"
                        defaultValue={form.Nume_utilizator}
                        margin="dense"
                        onChange={e => {
                            setForm({
                                ...form,
                                Nume_utilizator: e.target.value
                            });
                        }}
                        error={!!errors.Nume_utilizator}
                        helperText={errors.Nume_utilizator}
                    />
                    <label
                        htmlFor="edit-email"
                    >
                        E-mail</label>
                    <TextField
                        id="edit-email"
                        defaultValue={form.Email}
                        margin="dense"
                        onChange={e => {
                            setForm({
                                ...form,
                                Email: e.target.value
                            });
                        }}
                        error={!!errors.Email}
                        helperText={errors.Email}
                    />
                    <label
                        htmlFor="edit-name"
                    >
                        Nume</label>
                    <TextField
                        defaultValue={form.Nume}
                        margin="dense"
                        onChange={e => {
                            setForm({
                                ...form,
                                Nume: e.target.value
                            });
                        }}
                        error={!!errors.Nume}
                        helperText={errors.Nume}
                    />
                    <label
                        htmlFor="edit-firstname"
                    >
                        Prenume</label>
                    <TextField
                        defaultValue={form.Prenume}
                        margin="dense"
                        onChange={e => {
                            setForm({
                                ...form,
                                Prenume: e.target.value
                            });
                        }}
                        error={!!errors.Prenume}
                        helperText={errors.Prenume}
                    />
                    <Button variant="contained" type="submit">Salvează</Button>
                    {createUserErrors === "Utilizator actualizat!" ?
                        <div className="status-text green-error">Utilizator actualizat!</div>
                        : <div className="status-text red-error">{createUserErrors}</div>}
                </form>
            </div>
        </>
    )
}
const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateUserData: (user) => dispatch(updateUserData(user))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);