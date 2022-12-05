import { Box, Container, styled } from "@mui/material";

import Typography, { TypographyProps } from "@mui/material/Typography"

type AppProps = {
    children: JSX.Element;
};

export default function App({ children }: AppProps) {
    return (
        <Background maxWidth="lg">
            <Header>
                <Typography variant="h4">WebMail</Typography>
            </Header>
            <Main>
                {children}
            </Main>
        </Background>
    );
}

const Background = styled(Container)(({ theme }) => ({
    height: "100vh",
    backgroundColor: theme.palette.secondary.light,
    width: "100%",
    minHeight: "100%",
    overflow: "auto",
}));

const TypographyH3 = (inProps: TypographyProps ) => <Typography variant="h3" {...inProps} />

const Header = styled(TypographyH3)(({theme}) => ({
    borderRadius: theme.spacing(0,0,2,2),
    padding: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    borderWidth: theme.spacing(0.25),
    borderLeftStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    textAlign: "center",
    textTransform: "uppercase",
}))

const Main = styled(Box)(({ theme }) => ({
    margin: theme.spacing(4),
}));



