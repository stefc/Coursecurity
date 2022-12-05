import { Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginWithCredentials } from "../appstate/appSlice";


export default function LoginDialog() {
    const dispatch = useAppDispatch();

    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleLogin = () => dispatch(loginWithCredentials(credentials))

    const error = useAppSelector(state => state.app.error)

    const setUser = (value: string) => setCredentials({ ...credentials, username: value });

    const setPassword = (value: string) => setCredentials({ ...credentials, password: value });

    return (
        <Dialog maxWidth="sm" fullWidth open>
            <DialogTitle>
                User Login
            </DialogTitle>

            <DialogContent>
            <Collapse in={error!== undefined}>
                <Alert severity="error"  sx={{ mb: 2 }} 
                >
                    {error}
                </Alert>
            </Collapse>
                <Stack spacing={2} direction="column">
                    <TextField
                        variant="standard"
                        required
                        id="user"
                        label="User"
                        value={credentials.username}
                        onChange={e => setUser(e.target.value)}
                    />

                    <TextField
                        id="password"
                        label="Password"
                        name="Password"
                        placeholder="Password"
                        value={credentials.password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleLogin}>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

