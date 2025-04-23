import {useContext, useState, useEffect, useRef} from 'react';
import {UserContext} from '../contexts';
import {auth, login, signup} from '../services';
import {Background} from '../components';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Button, TextField, Tabs, Tab, FormControlLabel, Checkbox
 } from '@mui/material'


export default function Auth() {
    const {loggedUser, setLoggedUser} = useContext(UserContext)
    const [mode, setMode] = useState("signin")
    const defaultErrors = {
        username: {error: false, helper: ""},
        password: {error: false, helper: ""},
        email: {error: false, helper: ""},
        confirm: {error: false, helper: ""},
        terms: {error: false, helper: ""},
    }
    const [errors, setErrors] = useState(defaultErrors)
    const [signupSuccessful, setSignupSuccessful] = useState(false)
    const authPosted = useRef(false)

    const passwordKeyDown = (evt) => {
        if (mode === "signin" && evt.key === "Enter") {
          handleSubmit()
        }
      }

    useEffect(() => {
        setErrors(defaultErrors)
    }, [mode])

    useEffect(() => {
        console.log("Auth.js checking localstorage")
        const token = localStorage.getItem("token")
        if (token === null) {
            console.log("no token in storage, returning")
            return
        }
        else {
            console.log("token is valid")
        }
        if (authPosted.current) {
            console.log("already posted, returning")
            return
        }
        authPosted.current = true
        auth({token: token})
            .then(response => {
                console.log("auth request", response.data.success)
                if (response.data.success) {
                    setLoggedUser(response.data.user)
                    localStorage.setItem("token", response.headers["x-auth"])
                }
                else {
                    localStorage.removeItem("token")
                }
            })
            .catch(error => {
                console.log(error)
                localStorage.removeItem("token")
            })
    }, [])

    const handleSubmit = () => {
        let newErrors = structuredClone(defaultErrors)
        let allClear = true
        const username = document.getElementById("form-username")
        const password = document.getElementById("form-password")
        const remember = document.getElementById("form-remember")
        const email = document.getElementById("form-email")
        const confirm = document.getElementById("form-confirm")
        const terms = document.getElementById("form-terms")
        if (mode === "signin") {
            if (username.value === "") {
                newErrors.username = {error: true, helper: "You must enter a username."}
                allClear = false
            }
            if (password.value === "") {
                newErrors.password = {error: true, helper: "You must enter a password."}
                allClear = false
            }
        }
        else if (mode === "signup") {
            if (username.value === "") {
                newErrors.username = {error: true, helper: "You must enter a username."}
                allClear = false
            }
            if (email.value === "") {
                newErrors.email = {error: true, helper: "You must enter an email address."}
                allClear = false
            }
            else if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value))) {
                newErrors.email = {error: true, helper: "You must enter a valid email address."}
                allClear = false
            }
            if (password.value === "") {
                newErrors.password = {error: true, helper: "You must enter a password."}
                allClear = false
            }
            if (confirm.value === "") {
                newErrors.confirm = {error: true, helper: "You must enter a password."}
                allClear = false
            }
            if (password.value !== "" && confirm.value !== "" && password.value !== confirm.value) {
                newErrors.password = {error: true, helper: "Passwords do not match."}
                newErrors.confirm = {error: true, helper: "Passwords do not match."}
                allClear = false
            }
            if (terms.checked !== true) {
                newErrors.terms = {error: true, helper: ""}
                allClear = false
            }
        }
        if (!allClear) {
            setErrors(newErrors)
        }

        if (allClear) {
            const data = {
                username: username.value,
                password: password.value
            }
            let svc;
            if (mode === "signin") {
                data["remember"] = remember.checked
                svc = login
            }
            else if (mode === "signup") {
                data["email"] = email.value
                svc = signup
            }
            svc(data)
                .then(response => {
                  if (response.data.success) {
                    if (mode === "signin") {
                        console.log(response.data.user)
                        setLoggedUser(response.data.user)
                        localStorage.setItem("token", response.headers["x-auth"])
                    }
                    else if (mode === "signup") {
                        setSignupSuccessful(true)
                    }
                  }
                })
                .catch(error => {
                    if (error.status === 401) {
                        for (let i = 0; i < error.response.data.errors.length; i++) {
                            const err = error.response.data.errors[i]
                            newErrors[Object.keys(err)[0]] = {error: true, helper: Object.values(err)[0]}
                        }
                        setErrors(newErrors)
                    }
                })
        }
    }

    return (
        <div>
            <Background />
            <Dialog open fullWidth>
                <Tabs
                    value={mode}
                    onChange={(e, val) => setMode(val)}
                    variant="fullWidth"
                >
                    <Tab label="Log in" value="signin" />
                    <Tab label="Sign up" value="signup" />
                </Tabs>
                <DialogContent>
                    <TextField 
                      fullWidth
                      error={errors.username.error}
                      id="form-username"
                      sx={{margin: "15px 0px"}}
                      variant="outlined"
                      helperText={errors.username.helper}
                      label="Username" />
                    {mode === "signup" && (
                        <TextField
                          fullWidth
                          error={errors.email.error}
                          id="form-email"
                          sx={{margin: "15px 0px"}}
                          variant="outlined"
                          helperText={errors.email.helper}
                          label="E-mail" />
                    )}
                    <TextField 
                      fullWidth
                      error={errors.password.error}
                      id="form-password"
                      sx={{margin: "15px 0px"}}
                      variant="outlined"
                      helperText={errors.password.helper}
                      label="Password"
                      type="password"
                      onKeyDown={passwordKeyDown} />
                    {mode === "signup" && (
                        <TextField
                          fullWidth
                          error={errors.confirm.error}
                          id="form-confirm"
                          sx={{margin: "15px 0px"}}
                          variant="outlined"
                          helperText={errors.confirm.helper}
                          label="Confirm Password"
                          type="password" />
                    )}
                    {mode === "signin" && (
                        <div 
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap"}}
                        >
                            <FormControlLabel control={<Checkbox id="form-remember"/>} label="Keep me logged in" />
                            <p style={{textDecoration: "underline", cursor: "pointer"}}>
                                Forgot password?
                            </p>
                        </div>                        
                    )}
                    {mode === "signup" && (
                        <FormControlLabel
                            sx={errors.terms.error ? {color: "#d32f2f"} : {}}
                            control={<Checkbox id="form-terms" sx={{color: errors.terms.error ? '#d32f2f' : ''}}/>}
                            label={(
                                <span>I have read and accepted&nbsp;
                                    <span
                                        style={{textDecoration: "underline"}}
                                        onClick={(e) => {e.preventDefault()}}
                                    >
                                        the terms and conditions
                                    </span>.
                                </span>
                            )}
                        />                 
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" fullWidth onClick={handleSubmit}>
                        {mode === "signin" ? "Log in" : "Sign up"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={signupSuccessful} onClose={() => window.location.reload()}>
                <DialogTitle>Thanks for signing up.</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please check your email to verify your account.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" fullWidth onClick={() => window.location.reload()}>Log in</Button>
                </DialogActions>
            </Dialog>      
        </div>
    )
}