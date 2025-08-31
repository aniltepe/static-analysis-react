import { useState, useContext } from 'react';
import { Button, Dialog, DialogContent, List, ListItem, DialogTitle, Typography } from "@mui/material";
import { ProjectContext } from '../contexts';
import { generateUUID } from '../services';

export default function FrameDialog(props) {
    const {materials, frameSections, focusedFrame} = useContext(ProjectContext);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    
    const handleClose = () => {
        props.open(false);
    };

    const handleNew = () => {
        const new_uuid = generateUUID();
        props.focus({
            createmode: true, id: new_uuid, name: "", type: "",
            sectiontype: "", sectiondims: {}, material: "",
        });
    };

    const handleShow = (e, i) => {
        
    };

    return (
        <Dialog
          hidden={focusedFrame}
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogTitle sx={{fontWeight: "800"}}>Frame Section Properties</DialogTitle>
            <DialogContent sx={{
                display: "flex",
                justifyContent: "space-between",
                flexFlow: "column",
            }}>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    flexGrow: "1",
                    minHeight: "190px",
                    maxHeight: "190px"
                }}>
                    <List sx={{
                        border: "1px solid gray", overflowY: "auto", minHeight: "190px",
                        paddingTop: "0px", paddingBottom: "0px"}}
                    >
                        {frameSections.map((fs, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    selected={i === selectedIdx}
                                    onClick={() => setSelectedIdx(i)}
                                    sx={{
                                        height: "36px",
                                        display: "flex",
                                        // borderBottom: "1px solid #ddd",
                                        backgroundColor: i === selectedIdx ? "#e1ebee" : "unset",
                                        fontWeight: i === selectedIdx ? "600" : "unset",
                                    }}
                                >
                                    <Typography
                                        sx={{letterSpacing: "0px", fontSize: "8px", fontWeight: "100",
                                            textTransform: "uppercase", minWidth: "50px", lineHeight: "8px",
                                            borderRight: "1px solid gray", height: "10px", marginRight: "12px",
                                            display: "flex", alignItems: "end"
                                        }}
                                    >{fs.type}</Typography>{fs.name}
                                </ListItem>
                            )
                        })}
                    </List>
                </div>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    marginTop: "24px",
                    justifyContent: "space-evenly",
                    rowGap: "5px"
                }}>
                    <Button 
                        variant="outlined" 
                        sx={{textTransform: "none", color: "black", backgroundColor: "#fcfdff"}}
                        onClick={handleNew}
                    >Add Property</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                        onClick={handleShow}
                    >Edit / Show Property</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                    >Clone Property</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                    >Delete Property</Button>
                    <Button 
                        variant="outlined" 
                        sx={{textTransform: "none", color: "black", backgroundColor: "#fcfdff"}}
                    >Import From Other Projects</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}