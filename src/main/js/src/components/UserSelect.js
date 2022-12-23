import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function UserSelect({users, func}) {
    return (
        <FormControl fullWidth>
            <InputLabel id="user-label">Użytkownik</InputLabel>
            <Select
                label="Użytkownik"
                labelId="user-label"
                onChange={event => func(event.target.value)}
            >
                <MenuItem value="" selected>Brak</MenuItem>
                {users && users.map(user => (
                    <MenuItem key={user.userName} value={user.userName}>{user.userName}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default UserSelect;