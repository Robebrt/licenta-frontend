import React from "react";
import '../style/register.css'
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import bcrypt from 'bcryptjs';

function Register() {
    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: ""
    });
    const [errors, setErrors] = useState({});
    const [createUserErrors, setCreateUserErrors] = useState("");
    const validateForm = () => {
        let valid = true;
        const newErrors = {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirm: ""
        };
        //Validare pentru câmpul de username
        if (!form.username) {
            newErrors.username = "Numele de utilizator este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z0-9]{3,16}$/.test(form.username)) {
            newErrors.username = "Folosiți doar litere și cifre.";
            valid = false;
        }

        //Validare pentru prenume
        if (!form.firstName) {
            newErrors.firstName = "Prenumele este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z]{2,50}$/.test(form.firstName)) {
            newErrors.firstName = "Folosiți doar litere pentru prenume";
            valid = false;
        }

        //Validare pentru prenume
        if (!form.lastName) {
            newErrors.lastName = "Numele este necesar.";
            valid = false;
        }
        else if (!/^[a-zA-Z]{2,50}$/.test(form.lastName)) {
            newErrors.lastName = "Folosiți doar litere pentru nume";
            valid = false;
        }

        // Validare pentru câmpul de e-mail
        if (!form.email) {
            newErrors.email = 'E-mailul este necesar.';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Te rog introdu o adresă de email validă.';
            valid = false;
        }

        // Validare pentru câmpul de parolă
        if (!form.password) {
            newErrors.password = 'Parola este necesară.';
            valid = false;
        }
        if (form.password.length > 20) {
            newErrors.password = 'Parola este prea lungă.';
            valid = false;
        }
        if (form.password.length < 5 && form.password) {
            newErrors.password = 'Parola este prea scurtă.';
            valid = false;
        }
        if (!form.confirm) {
            newErrors.confirm = 'Câmpul de confirm este necesar.';
            valid = false;
        }
        if (form.password !== form.confirm) {
            newErrors.confirm = "Câmpurile pentru parolă ar trebui să se potrivească.";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };
    const checkUsernameUniqueness = async (username) => {
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
    const checkEmailUniqueness = async (email) => {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            //vezi daca utilizatorul si emailul sunt unice
            const isUsernameUnique = await checkUsernameUniqueness(form.username);
            const isEmailUnique = await checkEmailUniqueness(form.email);
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
            try {
                const salt = bcrypt.genSaltSync(10);

                // Criptăm parola utilizând salt-ul generat
                const hashedPassword = bcrypt.hashSync(form.password, salt);
                // Trimiteți cererea către server cu parola criptată
                axios.post('http://localhost:3000/api/register', {
                    Nume_utilizator: form.username,
                    Parola: hashedPassword,
                    Nume: form.lastName,
                    Prenume: form.firstName,
                    Email: form.email,
                    Avatar: "none"
                })
                    .then(response => {
                        // Înregistrarea a fost realizată cu succes
                        setCreateUserErrors('Utilizator înregistrat!');
                        setForm({
                            username: "",
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            confirm: ""
                        });
                        // Efectuați orice acțiune suplimentară după înregistrare
                    })
                    .catch(error => {
                        // A apărut o eroare în înregistrare
                        setCreateUserErrors('Eroare în înregistrare!');
                    });
            }
            catch (error) {
                // Tratați erorile de criptare a parolei
                setCreateUserErrors('Eroare în înregistrare!');
            }

        }
    };
    return (
        <div className="register-page">
            <form className="register-form" onSubmit={handleSubmit}>
                <label
                    htmlFor="register-username"
                >
                    Nume de utilizator</label>
                <TextField
                    label="Nume de utilizator"
                    id="register-username"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type="text"
                    value={form.username}
                    onChange={e => {
                        setForm({
                            ...form,
                            username: e.target.value
                        });
                    }}
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <label
                    htmlFor="register-firstName"
                >
                    Prenume</label>
                <TextField
                    label="Prenume"
                    id="register-firstName"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type="text"
                    value={form.firstName}
                    onChange={e => {
                        setForm({
                            ...form,
                            firstName: e.target.value
                        });
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <label
                    htmlFor="register-lastName"
                >
                    Nume</label>
                <TextField
                    label="Nume"
                    id="register-lastName"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type="text"
                    value={form.lastName}
                    onChange={e => {
                        setForm({
                            ...form,
                            lastName: e.target.value
                        });
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <label
                    htmlFor="register-email"
                >
                    E-mail</label>
                <TextField
                    label="E-mail"
                    id="register-email"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type={"email"}
                    value={form.email}
                    onChange={e => {
                        setForm({
                            ...form,
                            email: e.target.value
                        });
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <label
                    htmlFor="register-password"
                >Parola</label>
                <TextField
                    label="Parola"
                    id="register-password"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type="password"
                    value={form.password}
                    onChange={e => {
                        setForm({
                            ...form,
                            password: e.target.value
                        });
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <label
                    htmlFor="confirm-register-password"
                >Confirmă parola</label>
                <TextField
                    label="Confirmă parola"
                    id="confirm-register-password"
                    variant="filled"
                    size="small"
                    margin="dense"
                    type="password"
                    value={form.confirm}
                    onChange={e => {
                        setForm({
                            ...form,
                            confirm: e.target.value
                        });
                    }}
                    error={!!errors.confirm}
                    helperText={errors.confirm}
                />
                <Button variant="contained" type="submit">Înregistrează-te</Button>
                {createUserErrors === "Utilizator înregistrat!" ?
                    <div className="status-text green-error">Utilizator înregistrat!</div>
                    : <div className="status-text red-error">{createUserErrors}</div>}
            </form>
        </div>
    )
}

export default Register;