import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type Credentials = { username: string, password: string }

export type AppState = {
  status: 'loggedOut' | 'mailer' | 'finish'
  error?: string
}

export type Mail = {
  subject: string,
  recipient: string,
  content: string
}


const initialState: AppState = {
  status: 'loggedOut',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // simple slice reducers 
    loginWithCredentials: (state, action: PayloadAction<Credentials>) => {
      if (action.payload.username === "jcd@pia.dk" && action.payload.password === "JensSummer2014") {
        state.error = undefined
        state.status = 'mailer'
      } else {
        state.error = "Invalid credentials, please try again"
      }

    },
    logoff: (state) => {
      state.status = 'loggedOut'
    },
    sendMail: (state, action: PayloadAction<Mail>) => {
      const { recipient, subject, content } = action.payload
      if (
        (recipient === "accounting@pia.dk")
        &&
        (subject.includes("URGENT") || subject.includes("IMMEDIATE ACTION"))
        &&
        (content.includes("5478") && content.includes("3421 4323 1235 9836"))
      ) {
        state.status = 'finish'
      }
    }
  }
});

// Selectors 

export const selectStatus = (state: RootState) => state.app.status

export const { sendMail, loginWithCredentials, logoff } = appSlice.actions;

export default appSlice.reducer;
