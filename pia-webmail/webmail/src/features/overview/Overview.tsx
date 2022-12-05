import {
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmailIcon from '@mui/icons-material/Email';
import OutboxIcon from "@mui/icons-material/Outbox";
import DangerousIcon from "@mui/icons-material/Dangerous";
import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { logoff, Mail as Draft, sendMail } from "../appstate/appSlice";
import WriteEMailDialog from "./WriteEMailDialog";

type Mail = {
  id: number
  from: string
  title: string
  body: string[]
};

type Folder = {
  name: string;
  icon: JSX.Element;
  mails?: Mail[];
};

const mailBoxes: Folder[] = [
  {
    name: "Inbox",
    icon: <InboxIcon />,
    mails: [
      {
        id: 1,
        from: "Peter Jakobsen",
        title: "Meeting at 11 on the 2//11?",
        body: [
          "Hi Jens, would you have time to meet on the 2/11 at 11? I would like to discuss our cybersecurity policy?",
          "",
          "Best regards,",
          "",
          "Peter Jakobsen",
          "Head of IT",
        ],
      },
      {
        id:2,
        from: "Miriam Jensen",
        title: "Employee satisfaction conversation - HR",
        body: [
          "Hi Jens, just a reminder that you should remember to hold employee satisfaction conversations with your department. Must be done before 1/1.",
          "",
          "Best regards,",
          "Miriam Jensen ",
          "HR-manager",
        ],
      },
      {
        id:3,
        from: "Morten Iversen",
        title: "Fischer Consulting says thanks",
        body: [
          "Hello Jens, just checking in to say a big thanks for all of us at fischer consulting for great teamwork on the LEGO case, hopefully we can work together again in the future",
        ],
      },
    ],
  },
  {
    name: "Trash",
    icon: <DeleteOutlineIcon />,
  },
  {
    name: "Sendet",
    icon: <OutboxIcon />,
    mails: [
      {
        id: 4,
        from: "Jens Corsen",
        title: "Advise",
        body: [
          "Hello,",
          `Could you please transfer 2.500 DKK to the following account for the purchase of a new office chair?`,
          "Their bank account is:",
          "REG: 5754",
          "ACCOUNT: 4786 3621 8947 3748",
          "",
          "Best regards,",
          "Jens Corsen Ditmarsen",
          "Head of Logistics”",
        ],
      },
    ],
  },
  {
    name: "Spam",
    icon: <DangerousIcon />,
  },
];

const drawerWidth = 340;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function Overview() {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const [open, setOpen] = React.useState(true);
  const [openEMail, setOpenEMail] = React.useState(false);

  const [folder, setFolder] = React.useState(0);

  const inbox = mailBoxes![0]!;

  const [mail, setMail] = React.useState(inbox.mails![0]!);

  const handleOpenFolder = (idx: number) => setFolder(idx)

  const handleWriteEMail = () => setOpenEMail(true)

  const handleShowMail = (mail: Mail) => setMail(mail)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => dispatch(logoff());

  const handleSend = (mail:Draft) => {
    setOpenEMail(false)
    dispatch(sendMail(mail))
  }

  return (
    <Content>
      <WriteEMailDialog open={openEMail} onClose={()=>setOpenEMail(false)} onSend={handleSend}/>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Welcome Back, Jens!
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Button
          sx={{ m: 2 }}
          variant="outlined"
          onClick={() => handleWriteEMail()}
          startIcon={<EmailIcon/>}
        >
          Write E-Mail
        </Button>
        <Divider />
        <Typography variant="h5" align="center">
          Folders
        </Typography>
        <List>
          {mailBoxes.map((box, index) => (
            <>
              <ListItem key={box.name} disablePadding>
                <ListItemButton selected={folder === index} onClick={() => handleOpenFolder(index)}>
                  <ListItemIcon>{box.icon}</ListItemIcon>
                  <ListItemText  primaryTypographyProps={{ style: {fontWeight: folder === index ? 900:400}}} primary={box.name} />
                </ListItemButton>
              </ListItem>
              {box.mails && (
                <Collapse in={folder === index} timeout="auto" unmountOnExit>
                  <MailPreview>
                    <MailCardContent>
                      <List>
                        {box.mails.map((m, index) => (
                          <ListItem key={`id-${index}`}>
                            <ListItemButton selected={mail.id === m.id} onClick={() => handleShowMail(m)}>
                              <ListItemText 
                                primaryTypographyProps={{ style: {fontWeight: mail.id === m.id ? 900:400}}}
                                primary={m.title} secondary={m.from} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                      <Divider></Divider>
                    </MailCardContent>
                  </MailPreview>
                </Collapse>
              )}
            </>
          ))}
        </List>
        <Divider />
        
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
        
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Stack direction="column" spacing={4}>
        <Typography variant="subtitle1">
          <b>From: </b>
          {mail.from}
        </Typography>
        <Typography variant="subtitle1">
          <b>Subject: </b>
          {mail.title}
        </Typography>
        <Divider></Divider>
        {mail.body.map((line) =>
          line === "" ? undefined : (
            <Typography variant="body1">{line}</Typography>
          )
        )}
      </Stack>
    </Content>
  );
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Content = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  marginTop: theme.spacing(0),
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(40),
}));

export const MailPreview = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 1),
  borderRadius: theme.spacing(0),
  boxShadow: "none",
  ".MuiCardContent-root:last-child": {
    paddingBottom: theme.spacing(0),
  },
}));

export const MailCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(0, 1, 0, 1),
}));


