import { useState, useContext } from 'react';
import { Button, Dialog, DialogContent, List, ListItem, DialogTitle, Typography } from "@mui/material";
import { ProjectContext } from '../contexts';
import { generateUUID } from '../services';

export default function MaterialDialog(props) {
    const {materials, focusedMaterial} = useContext(ProjectContext);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    
    const handleClose = () => {
        props.open(false);
    };

    const handleNew = () => {
        const new_uuid = generateUUID();
        props.focus({
            createmode: true, id: new_uuid, 
            name: "", type: "", wpuv: "", moe: "", poisson: "",
            sccs: "", mts: "", mys: ""
        });
    };

    const handleShow = (e, i) => {
        // console.log(materials[selectedIdx])
        props.focus(materials[selectedIdx])
    };

    return (
        <Dialog
          hidden={focusedMaterial}
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogTitle sx={{fontWeight: "800"}}>Material Configuration</DialogTitle>
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
                        {materials.map((mat, i) => {
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
                                    >{mat.type}</Typography>{mat.name}
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
                    >Add Material</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                        onClick={handleShow}
                    >Edit / Show Material</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                    >Clone Material</Button>
                    <Button 
                        variant="outlined" 
                        sx={{
                            textTransform: "none", color: "black", 
                            backgroundColor: selectedIdx === -1 ? "white" : "#fcfdff"
                        }}
                        disabled={selectedIdx === -1}
                    >Delete Material</Button>
                    <Button 
                        variant="outlined" 
                        sx={{textTransform: "none", color: "black", backgroundColor: "#fcfdff"}}
                    >Import From Other Projects</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}