import '../style/register.css';
import { Button, TextField } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authActions';

function Login({ isLoading, error, loginRequest, isAuthenticated, state }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState("");
    const validateForm = () => {
        let valid = true;
        const newErrors = {
            email: '',
            password: ''
        };

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

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await loginRequest(form.email, form.password);
            if (isAuthenticated) {
                navigate('/user-profile');
            }
            else{
                
            }
        }
    };

    return (
        <>
            <div className="register-page">
                <form className="register-form" onSubmit={handleSubmit}>
                    <label
                        htmlFor="login-email"
                    >
                        E-mail</label>
                    <TextField
                        label="E-mail"
                        id="login-email"
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
                    < label
                        htmlFor="login-password"
                    > Parola</label>
                    <TextField
                        label="Parola"
                        id="login-password"
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
                        helperText={errors.password} />
                    <Button variant='contained' type="submit">Conectează-te</Button>
                    {error && <div className="status-text red-error">{error}</div>}
                </form>
            </div >
        </>
    )
}
const mapStateToProps = state => {
    return {
        isLoading: state.user.isLoading,
        error: state.user.error,
        isAuthenticated: state.user.isAuthenticated,
        state: state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginRequest: (email, password) => dispatch(loginRequest(email, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);