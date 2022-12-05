import { Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useState, useTransition } from "react";
import { useAppSelector } from "../../app/hooks";
import { Mail } from "../appstate/appSlice";


type WriteEMailDialogProps = {
    open?: boolean
    onClose: () => void
    onSend: (mail: Mail) => void
}

const WriteEMailDialog = ({open = false, onClose, onSend}: WriteEMailDialogProps) : JSX.Element => {
    
    
    const [mail, setMail] = useState({ subject: "", recipient: "", content: "" });
    
    const [showAlert, setShowAlert] = useState(false)
    
    useEffect(() => {
        if (showAlert) {
            const timeId = setTimeout(() => {
                onSend(mail)
                setShowAlert(false)
            }, 5000)
            
            return () => {
                clearTimeout(timeId)
            }
        } 
    }, [showAlert,mail,onSend])
    

    const setSubject = (value: string) => setMail({ ...mail, subject: value });
    const setRecipient = (value: string) => setMail({ ...mail, recipient: value });
    const setContent = (value: string) => setMail({ ...mail, content: value });

    const handleSend = () => setShowAlert(true)

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
            <DialogTitle>
                New E-Mail
            </DialogTitle>

            <DialogContent>
            <Collapse in={showAlert}>
                <Alert severity="success"  sx={{ mb: 2 }}>
                    EMail sended
                </Alert>
            </Collapse>
                <Stack spacing={2} direction="column">
                    <TextField
                        id="recipient"
                        variant="standard"
                        required
                        label="To"
                        placeholder="Enter here the email of the recipient"
                        value={mail.recipient}
                        onChange={e => setRecipient(e.target.value)}
                    />

                    <TextField
                        id="subject"
                        variant="standard"
                        required
                        label="Subject"
                        name="subject"
                        placeholder="Subject"
                        value={mail.subject}
                        onChange={e => setSubject(e.target.value)}
                    />
                    <Divider/>
                    <TextField
                        id="content"
                        variant="standard"
                        multiline
                        minRows={10}
                        label="Content"
                        name="content"
                        value={mail.content}
                        onChange={e => setContent(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSend}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WriteEMailDialog
