import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext} from '../contexts';

import { Button, Card, CardContent, CardHeader, List, ListItem, ListItemText, Typography } from '@mui/material';
import { NoteAdd, FindInPage, UploadFile, AutoAwesome, Schedule, PushPin } from '@mui/icons-material';

export default function Landing(props) {    
    const {loadedProject, setLoadedProject} = useContext(ProjectContext)

    const handleNewProject = () => {
        setLoadedProject({
            name: "Untitled0", 
        })
    }

    return (
        <div style={{
            display: "flex", 
            flexFlow: "column",
            justifyContent: "space-evenly",
            width: "100dvw",
            height: "calc(100dvh - 50px)"
            // backgroundImage: "url(auth_bg.png)",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "100% 100%"
        }}>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <Button onClick={props.createProject}>
                    <Card sx={{ width: "30dvw" }}>
                      <CardContent>
                        <Typography>
                          New Project
                        </Typography>                
                        <NoteAdd sx={{fontSize:"50px"}} />
                      </CardContent>
                    </Card>
                </Button>
                <Button>
                    <Card sx={{ width: "30dvw" }}>
                      <CardContent>
                        <Typography>
                          Open Project
                        </Typography>                
                        <FindInPage sx={{fontSize:"50px"}} />
                      </CardContent>
                    </Card>
                </Button>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <Button>
                    <Card sx={{ width: "30dvw" }}>
                      <CardContent>
                        <Typography>
                          Import from File
                        </Typography>                
                        <UploadFile sx={{fontSize:"50px"}} />
                      </CardContent>
                    </Card>
                </Button>
                <Button>
                    <Card sx={{ width: "30dvw" }}>
                      <CardContent>
                        <Typography>
                          Explore
                        </Typography>                
                        <AutoAwesome sx={{fontSize:"50px"}} />
                      </CardContent>
                    </Card>
                </Button>
            </div>                
            <div style={{display: "flex", flexGrow: 0.5, justifyContent: "space-evenly"}}>
                <Card sx={{ width: "30dvw" }}>
                    <CardHeader
                    avatar={ <Schedule fontSize="large" /> }
                    title={
                        <Typography fontSize="large">
                          Recent Projects
                        </Typography>
                    }
                    />
                    <CardContent>
                      <List>
                          <ListItem>
                              <ListItemText primary="Untitled0" secondary="4 hours ago"/>
                          </ListItem>
                          <ListItem>
                              <ListItemText primary="Untitled1" secondary="6 hours ago"/>
                          </ListItem>
                      </List>
                    </CardContent>
                </Card>
                <Card sx={{ width: "30dvw" }}>
                    <CardHeader
                    avatar={ <PushPin fontSize="large" /> }
                    title={
                        <Typography fontSize="large">
                          Pinned Projects
                        </Typography>
                    }
                    />
                    <CardContent>
                      <List>
                          <ListItem>
                              <ListItemText primary="Untitled0" secondary=""/>
                          </ListItem>
                          <ListItem>
                              <ListItemText primary="Untitled1" secondary=""/>
                          </ListItem>
                      </List>
                    </CardContent>
                </Card>
            </div>
        </div>        
    )
}