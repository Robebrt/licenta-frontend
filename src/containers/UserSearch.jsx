import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Paper, Avatar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserSearch = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState();
    const navigate = useNavigate();
    // Simulated user data
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/utilizatori');
                if (response.data) {
                    setUsers(response.data);

                }
            }
            catch (error) {
                console.error(error);
            }
        }
        getUsers();
    }, [])

    const handleSearchChange = (event, value) => {
        setSearchValue(value);
    };

    const handleUserSelect = (event, value) => {
        setSelectedUser(value);
    };


    const navigateToProfile = (id) => {
        navigate(`/profiles/${id}`);
    }
    return (
        <div style={{ display: "flex" }}>
            <Paper style={{ flex: 1, padding: "1rem", marginRight: "1rem" }}>
                <Autocomplete
                    options={users}
                    getOptionLabel={(user) => user.Nume_utilizator}
                    value={selectedUser}
                    sx={{ width: 180, marginBottom: 4 }}
                    onChange={handleUserSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search User"
                            variant="outlined"
                            onChange={handleSearchChange}
                        />
                    )}
                />
            </Paper>
            {selectedUser && (
                <Paper style={{ flex: 1, padding: "1rem", maxHeight: 100, display: "flex", flexDirection: "column", alignItems: "center", cursor:"pointer" }} 
                onClick={() => navigateToProfile(selectedUser.ID_Utilizator)}>
                    <Avatar src={selectedUser.Avatar} alt={selectedUser.Nume_utilizator} />
                    <h2>{selectedUser.Nume_utilizator}</h2>
                    {/* Additional user details or actions can be displayed here */}
                </Paper>
            )}
        </div>
    );
};

export default UserSearch;