import { useState, useContext } from 'react';
import { ProjectContext } from '../contexts';
import { Button, Menu, MenuItem, Divider, Toolbar, Grow, Backdrop, ListItemIcon } from '@mui/material';
import { AccountCircle, ArrowRight, LibraryBooksOutlined, SettingsOutlined, LogoutOutlined, CircleNotifications } from '@mui/icons-material';

export default function AppBar(props) {
    const {loadedProject} = useContext(ProjectContext)
    const [anchorEl, setAnchorEl] = useState(undefined);
    const [menuOpen, setMenuOpen] = useState("");
    const [subAnchorEl, setSubAnchorEl] = useState(undefined);
    const [subMenuOpen, setSubMenuOpen] = useState("");
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(event.currentTarget.getAttribute("menu"));
    };
    const handleClose = (event, reason) => {
        setAnchorEl(undefined);
        setMenuOpen("");
        setSubMenuOpen("");
        if (reason === "backdropClick") {
            console.log(event)
        }
    };
    const handleExpand = (event) => {
        setSubAnchorEl(event.currentTarget);
        setSubMenuOpen(event.currentTarget.getAttribute("menu"))
    };
    const handleSubClose = () => {
        setSubAnchorEl(undefined);
        setSubMenuOpen("");
    };

    const action = (func) => {
      setAnchorEl(undefined);
      setMenuOpen("");
      setSubMenuOpen("");
      func(true);
    }

    return (
      <div>
          <Toolbar
            disableGutters
            variant='dense'
            sx={{
              height: "50px", 
              borderTop: "1px solid #7a8a95",
              borderLeft: "1px solid #7a8a95",
              borderRight: "1px solid #7a8a95",
              borderBottom: "1px solid #444444", 
              boxSizing: "border-box",
              backgroundColor: "#121f28",
              color: "white",
              fontWeight: "600",
            }}
          >
            {/* {loadedProject && (        */}
            <>
              <Button
                menu="0"
                onClick={handleClick}
                sx={{textTransform: "none", color: "inherit", fontWeight: "inherit"}}
              >
                  Project
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen === "0"}
                onClose={handleClose}
                TransitionComponent={Grow}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                slotProps={{paper: {sx: {left: "5px !important"}}}}
                slots={{backdrop: (<Backdrop open={true} onClick={(event) => console.log("test", event)} />)}}
              //   hideBackdrop
              >
                  <MenuItem onClick={() => action(props.createProject)}>New Project</MenuItem>
                  <MenuItem>Open Project</MenuItem>
                  <Divider />
                  <MenuItem disabled={!loadedProject}>Save Project</MenuItem>
                  <MenuItem disabled={!loadedProject}>Save as...</MenuItem>
                  <Divider />
                  <MenuItem>Import from file</MenuItem>
                  <MenuItem disabled={!loadedProject}>Export to a file</MenuItem>
                  <Divider />
                  <MenuItem disabled={!loadedProject}>Create Report</MenuItem>
                  <MenuItem disabled={!loadedProject}>Show Log Files</MenuItem>
                  <MenuItem disabled={!loadedProject}>Project Information</MenuItem>
                  <Divider />
                  <MenuItem disabled={!loadedProject}>Close Project</MenuItem>
              </Menu>
            
              <Button
                menu="1"
                disabled={!loadedProject}
                onClick={handleClick}
                sx={{textTransform: "none", color: "inherit", fontWeight: "inherit"}}
              >
                  Configure
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen === "1"}
                onClose={handleClose}
                TransitionComponent={Grow}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
              >
                  {/* <MenuItem onClick={() => action(props.materialDialog)}>Materials</MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={handleExpand}
                    menu="0"
                  >
                      Section Properties
                      <ArrowRight sx={{marginLeft: "auto"}} />
                  </MenuItem>
                  <Divider /> */}
                  <MenuItem onClick={() => action(props.coordSysDialog)}>Coordinate System</MenuItem>
                  <MenuItem onClick={() => action(props.unitDialog)}>Units</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => action(props.gridDialog)}>Grid</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => action(props.materialDialog)}>Materials</MenuItem>
                  <MenuItem onClick={() => action(props.frameDialog)}>Frame Sections</MenuItem>
                  <Divider />
                  <MenuItem>Displacements</MenuItem>
                  <Divider />
                  <MenuItem>Load Patterns</MenuItem>
                  <MenuItem>Load Cases</MenuItem>
                  <MenuItem>Load Combinations</MenuItem>
              </Menu>
              <Menu
                  anchorEl={subAnchorEl}
                  open={menuOpen === "1" && subMenuOpen === "0"}
                  onClose={handleSubClose}
                  TransitionComponent={Grow}
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'left'}}
                >
                    <MenuItem>Frame Sections</MenuItem>
                    <MenuItem>Tendon Sections</MenuItem>
                    <MenuItem>Cable Sections</MenuItem>
                    <Divider />
                    <MenuItem>Area Sections</MenuItem>
                    <Divider />
                    <MenuItem>Solid Properties</MenuItem>
                    <Divider />
                    <MenuItem>Hinge Properties</MenuItem>
              </Menu>
            
              <Button
                  menu="2"
                  disabled={!loadedProject}
                  onClick={handleClick}
                  sx={{textTransform: "none", color: "inherit", fontWeight: "inherit"}}
                >
                    Draw
              </Button>
              <Menu
                  anchorEl={anchorEl}
                  open={menuOpen === "2"}
                  onClose={handleClose}
                  TransitionComponent={Grow}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                >
                    <MenuItem>Special Joint</MenuItem>
                    <MenuItem>Frame/Cable/Tendon</MenuItem>
                    <MenuItem>Braces</MenuItem>
                    <MenuItem>Secondary Beams</MenuItem>
                    <Divider />
                    <MenuItem>Poly Area</MenuItem>
                    <MenuItem>Rectangular Area</MenuItem>
                    <Divider />
                    <MenuItem>Joint Link</MenuItem>
                    <MenuItem>Reference Point</MenuItem>
              </Menu>
            
              <Button
                  menu="3"
                  disabled={!loadedProject}
                  onClick={handleClick}
                  sx={{textTransform: "none", color: "inherit", fontWeight: "inherit"}}
                >
                    Assign
              </Button>
              <Menu
                  anchorEl={anchorEl}
                  open={menuOpen === "3"}
                  onClose={handleClose}
                  TransitionComponent={Grow}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                >
                    <MenuItem 
                      onClick={handleExpand}
                      menu="1"
                    >
                        Joint
                        <ArrowRight sx={{marginLeft: "auto"}} />
                    </MenuItem>
                    <MenuItem>Frame</MenuItem>
                    <MenuItem>Cable</MenuItem>
                    <MenuItem>Tendon</MenuItem>
                    <MenuItem>Area</MenuItem>
                    <MenuItem>Solid</MenuItem>
                    <MenuItem>Link/Support</MenuItem>
                    <Divider />
                    <MenuItem>Joint Loads</MenuItem>
                    <MenuItem>Frame Loads</MenuItem>
                    <MenuItem>Cable Loads</MenuItem>
                    <MenuItem>Tendon Loads</MenuItem>
                    <MenuItem>Area Loads</MenuItem>
                    <MenuItem>Solid Loads</MenuItem>
                    <MenuItem>Link/Support Loads</MenuItem>
                    <MenuItem>Poly Area</MenuItem>
                    <MenuItem>Rectangular Area</MenuItem>
                    <Divider />
                    <MenuItem>Joint Patterns</MenuItem>
                    <MenuItem>Assign to Group</MenuItem>
              </Menu>
              <Menu
                  anchorEl={subAnchorEl}
                  open={menuOpen === "3" && subMenuOpen === "1"}
                  onClose={handleSubClose}
                  TransitionComponent={Grow}
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'left'}}
                >
                    <MenuItem>Restraints</MenuItem>
                    <MenuItem>Constraints</MenuItem>
              </Menu>  
            </>       
              
            {/* )} */}
            {/* 
            <Typography>Analyze</Typography>
            <Typography>Help</Typography> */}
            <div style={{display: "flex", flexGrow: 1}}></div>

            <Button
                sx={{color: "inherit"}}
                menu="notifications"
                onClick={handleClick}>
              <CircleNotifications fontSize='large' />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen === "notifications"}
              onClose={handleClose}
              TransitionComponent={Grow}
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            >
            </Menu>

            <Button
                sx={{color: "inherit"}}
                menu="user"
                onClick={handleClick}>
              <AccountCircle fontSize='large' />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen === "user"}
              onClose={handleClose}
              TransitionComponent={Grow}
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            >
                <MenuItem>
                  <ListItemIcon>
                    <LibraryBooksOutlined fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <SettingsOutlined fontSize="small" />
                  </ListItemIcon> 
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => action(props.logout)}>
                  <ListItemIcon>
                    <LogoutOutlined fontSize="small" />
                  </ListItemIcon> 
                  Logout
                </MenuItem>
            </Menu>
          </Toolbar>
      </div>
    );
};