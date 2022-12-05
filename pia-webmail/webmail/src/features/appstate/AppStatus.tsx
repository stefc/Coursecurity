import { Paper, styled, Typography } from "@mui/material";

import { useAppSelector } from "../../app/hooks";
import LoginDialog from "../logindialog/LoginDialog";
import Overview from "../overview/Overview";
import { selectStatus } from "./appSlice";

export function AppStatus() {
    const status = useAppSelector(selectStatus);

    const unknownStatus = <Typography variant="h5">Wrong Status</Typography>;

    switch (status) {
        case "loggedOut":
            return <LoginDialog />;
        
        case "mailer":
            return <Overview />;

        case "finish":
            return <Content>
                <Typography align="center" variant="h3">You finished successfully the challenge. Congratulations!</Typography>
            </Content>
        
        default:
            return unknownStatus;
    }
}

const Content = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(2.5),
    marginTop: theme.spacing(0),
    padding: theme.spacing(1),
  }));