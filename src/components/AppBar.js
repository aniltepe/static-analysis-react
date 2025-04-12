import { useState, useContext } from 'react';
import { ProjectContext } from '../contexts';
import { Button, Menu, MenuItem, Divider, Toolbar, Grow, Backdrop, ListItemIcon } from '@mui/material';
import { AccountCircle, ArrowRight, LibraryBooksOutlined, SettingsOutlined, LogoutOutlined } from '@mui/icons-material';

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

    const materialMenu = () => {
      props.materialOpen(true);
      setAnchorEl(undefined);
      setMenuOpen("");
      setSubMenuOpen("");
    };

    return (
      <div>
          <Toolbar
            disableGutters
            variant='dense'
            sx={{
              height: "50px", 
              borderBottom: "1px solid #dddddd", 
              boxSizing: "border-box"
            }}
          >
            {/* {loadedProject && (        */}
            <>
              <Button
                menu="0"
                onClick={handleClick}
                sx={{textTransform: "none", color: "black"}}
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
                slots={{backdrop: (<Backdrop onClick={(event) => console.log("test", event)} />)}}
              //   hideBackdrop
              >
                  <MenuItem onClick={props.createProject}>New Project</MenuItem>
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
                sx={{textTransform: "none", color: "black"}}
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
                  <MenuItem onClick={materialMenu} >Materials</MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={handleExpand}
                    menu="0"
                  >
                      Section Properties
                      <ArrowRight sx={{marginLeft: "auto"}} />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={props.openGridDialog}>Grids</MenuItem>
                  <Divider />
                  <MenuItem>Groups</MenuItem>
                  <MenuItem>Section Cuts</MenuItem>
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
                  sx={{textTransform: "none", color: "black"}}
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
                  sx={{textTransform: "none", color: "black"}}
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
                <MenuItem>
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