import React from 'react';
import '../style/navbar.css'
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout, }) => {
    const navigate = useNavigate();
    const logo = "../../public/logo.png";
    const displayButtons = () => {
        return (
            <div>
                {(isAuthenticated) ? (
                    <div>
                        <Button variant="contained" onClick={logout}> Deconectează-te</Button>
                        <Link to="/user-profile">
                            <Button variant='contained'>Profilul meu</Button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link to="/register">
                            <Button variant="contained">Înregistrează-te</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="contained">Conectează-te</Button>
                        </Link>
                    </div>
                )
                }
            </div>
        )
    }

    return (
        <>
            <div className='navbar'>
                <img className='logo' src={logo} onClick={() => { navigate('/home') }} />
                <Link to="/search-users">
                    <Button variant="contained">Utilizatori</Button>
                </Link>
                <Link to="/movies">
                    <Button variant="contained">Filme</Button>
                </Link>
                <Link to="/series">
                    <Button variant="contained">Seriale</Button>
                </Link>
                {displayButtons()}
            </div>
        </>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
    }
};
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);