import {useState, useEffect, useContext} from 'react';
import { Button, Dialog, DialogContent, Typography,
    Select, MenuItem, DialogActions, TextField
 } from "@mui/material";
 import { ProjectContext } from '../contexts';

export default function NewFrameDialog(props) {
    const {materials} = useContext(ProjectContext);
    const [values, setValues] = useState({
        id: "",
        name: "",
        type: "",
        sectiontype: "",
        sectiondims: {},
        material: ""
    });

    const [saveDisabled, setSaveDisabled] = useState(true);
    const [page, setPage] = useState(0);
    const [selectedCS, setSelectedCS] = useState();
    const dimensions = {
        wideflange: [{n: "Depth", c: "d"}, {n: "Flange Width", c: "bf"}, {n: "Flange Thickness", c: "tf"}, {n: "Web Thickness", c: "tw"}, {n: "Corner Radius", c: "ra"}],
        channel: [{n: "Depth", c: "d"}, {n: "Flange Width", c: "bf"}, {n: "Flange Thickness", c: "tf"}, {n: "Web Thickness", c: "tw"}, {n: "Corner Radius", c: "ra"}, {n: "Corner Radius", c: "ri"}],
        rectangular: [{n: "Depth", c: "d"}, {n: "Width", c: "w"}],
        circular: [{n: "Radius", c: "r"}],
    }

    useEffect(() => {
        setValues(props.focused);
    }, [props.focused]);

    const handleChange = (e, key) => {
        setValues((v) => {return {...v, [key]: e.target.value}})
    };

    const handleClose = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        props.open(false);
        props.setFocused(null);
    };

    const handleBack = (e) => {
        setPage(0);
        setValues({...values, material: ""});
    };

    const handleApply = () => {
        props.open(false);
        props.setFocused(null);
    };

    const dimensionChange = (e, code) => {
        setValues((v) => {return {...v, sectiondims: {...v.sectiondims, code: e.target.value}}})
    };

    return (
        <Dialog
          open
          fullWidth
          onClose={handleClose}
        >
            {(props.focused.createmode && page === 0) && <DialogContent sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", marginBottom: "20px",
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>Select Property Type</div>
                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '250px'}}>Frame Section Property Type</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={values.type}
                      onChange={(e) => handleChange(e, "type")}
                    >
                        <MenuItem value="concrete">Concrete</MenuItem>
                        <MenuItem value="steel">Steel</MenuItem>
                    </Select>
                </div>
                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", 
                    marginTop: "20px", marginBottom: "20px", 
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>Select Section</div>
                <div style={{
                    display: "flex", flexFlow: "row", flexWrap: "wrap",
                    marginBottom: "10px", marginTop: "10px",
                    columnGap: "48px", rowGap: "24px"}}
                >
                    <div onClick={() => setSelectedCS("wideflange")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'wideflange' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="30,25 30,29 48,29 48,71 30,71 30,75 70,75 70,71 52,71 52,29 70,29 70,25 30,25" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Wide Flange</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("channel")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'channel' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="38,25 38,75 62,75 62,71 42,71 42,29 62,29 62,25 38,25" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Channel</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("tee")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'tee' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="30,30 30,34 48,34 48,70 52,70 52,34 70,34 70,30 30,30" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Tee</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("angle")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'angle' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="30,30 30,70 70,70 70,66 34,66 34,30 30,30" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Angle</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("doubleangle")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'doubleangle' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="24,36 24,40 45,40 45,64 49,64 49,36 24,36" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                          <polyline points="52,36 52,64 56,64 56,40 76,40 76,36 52,36" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Double Angle</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("doublechannel")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'doublechannel' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="24,25 24,29 45,29 45,71 24,71 24,75 49,75 49,25 24,25" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                          <polyline points="52,25 52,75 77,75 77,71 56,71 56,29 77,29 77,25 52,25" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Double Channel</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("pipe")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'pipe' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="25" stroke="grey" strokeWidth="2" fill="lightgray" />
                          <circle cx="50" cy="50" r="21" stroke="grey" strokeWidth="2" fill={selectedCS == 'pipe' ? "#d9f3ff" : "white"} />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Pipe</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("tube")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'tube' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" x="30" y="30" fill="lightgray" strokeWidth="1" stroke="black" />
                          <rect width="32" height="32" x="34" y="34" fill={selectedCS == 'tube' ? "#d9f3ff" : "white"} strokeWidth="1" stroke="black" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Tube</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("rectangular")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'rectangular' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="50" x="30" y="25" stroke="black" strokeWidth="1" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Rectangular</Typography>
                    </div>
                    <div onClick={() => setSelectedCS("circular")} style={{
                        display: "flex", flexFlow: "column", alignItems: "center", cursor: "pointer", 
                        backgroundColor: selectedCS == 'circular' ? "#d9f3ff" : "white"
                      }}
                    >
                        <svg style={{border: "1px solid #aaa"}} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="25" stroke="grey" strokeWidth="2" fill="lightgray" />
                        </svg>
                        <Typography sx={{marginTop: "-18px", fontSize: "12px"}}>Circular</Typography>              
                    </div>
                </div>
            </DialogContent>}

            {(!props.focused.createmode || page === 1) && <DialogContent sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
            }}>                
                
                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", marginBottom: "20px",
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>General Data</div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Section Name</Typography>
                    <TextField 
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.name}
                        onChange={(e) => handleChange(e, "name")} />
                </div>

                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", 
                    marginTop: "20px", marginBottom: "20px", 
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>Dimensions</div>

                <div style={{display: "flex", justifyContent: "space-between", gap: "15px"}}>
                    <div>
                        {dimensions[selectedCS] && dimensions[selectedCS].map((d, i) => {
                            return (
                                <div key={i} style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                                    <Typography style={{minWidth: '180px'}}>{d.n + ", " + d.c}</Typography>
                                    <TextField 
                                        sx={{flexGrow: 1}}
                                        size='small'
                                        value={values.sectiondims[d.c]}
                                        onChange={(e) => dimensionChange(e, d.c)} />
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        {selectedCS == 'wideflange' && <svg style={{border: "1px solid #aaa"}} width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 40 30 V 50 H 80 C 85 50, 90 55, 90 60 V 140 C 90 145, 85 150, 80 150 H 40 V 170 H 160 V 150 H 120 C 115 150, 110 145, 110 140 V 60 C 110 55, 115 50, 120 50 H 160 V 30 Z" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10"
                              refX="5" refY="5" markerWidth="6"
                              markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                          </defs>
                          <line x1="32" y1="32" x2="32" y2="168" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="18" y="100" fontSize="12px">d</text>
                          <line x1="60" y1="16" x2="60" y2="28" stroke="black" markerEnd="url(#arrow)" />
                          <line x1="60" y1="30" x2="60" y2="50" stroke="#666" />
                          <line x1="60" y1="64" x2="60" y2="52" stroke="black" markerEnd="url(#arrow)" />
                          <text x="46" y="66" fontSize="12px">tf</text>
                          <line x1="76" y1="90" x2="88" y2="90" stroke="black" markerEnd="url(#arrow)" />
                          <line x1="90" y1="90" x2="110" y2="90" stroke="#666" />
                          <line x1="124" y1="90" x2="112" y2="90" stroke="black" markerEnd="url(#arrow)" />
                          <text x="118" y="84" fontSize="12px">tw</text>
                          <line x1="126" y1="134" x2="115" y2="145" stroke="black" markerEnd="url(#arrow)" />
                          <text x="125" y="130" fontSize="12px">ra</text>
                          <line x1="42" y1="178" x2="158" y2="178" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="94" y="194" fontSize="12px">bf</text>
                        </svg>}
                        {selectedCS == 'channel' && <svg style={{border: "1px solid #aaa"}} width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 50 30 V 170 H 150 C 150 165, 145 155, 140 155 H 70 C 65 155, 60 150, 60 145 V 55 C 60 50, 65 45, 70 45 H 140 C 145 45, 150 35, 150 30 Z" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10"
                              refX="5" refY="5" markerWidth="6"
                              markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                          </defs>
                          <line x1="27" y1="32" x2="27" y2="168" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="13" y="100" fontSize="12px">d</text>
                          <line x1="90" y1="16" x2="90" y2="28" stroke="black" markerEnd="url(#arrow)" />
                          <line x1="90" y1="30" x2="90" y2="50" stroke="#666" />
                          <line x1="90" y1="59" x2="90" y2="47" stroke="black" markerEnd="url(#arrow)" />
                          <text x="76" y="61" fontSize="12px">tf</text>
                          <line x1="36" y1="100" x2="48" y2="100" stroke="black" markerEnd="url(#arrow)" />
                          <line x1="50" y1="100" x2="60" y2="100" stroke="#666" />
                          <line x1="74" y1="100" x2="62" y2="100" stroke="black" markerEnd="url(#arrow)" />
                          <text x="68" y="94" fontSize="12px">tw</text>
                          <line x1="76" y1="137" x2="65" y2="148" stroke="black" markerEnd="url(#arrow)" />
                          <text x="75" y="133" fontSize="12px">ra</text>
                          <line x1="52" y1="178" x2="148" y2="178" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="94" y="194" fontSize="12px">bf</text>
                          <line x1="156" y1="55" x2="146" y2="45" stroke="black" markerEnd="url(#arrow)" />
                          <text x="158" y="64" fontSize="12px">ri</text>
                        </svg>}
                        {selectedCS == 'rectangular' && <svg style={{border: "1px solid #aaa"}} width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 50 30 V 170 H 150 V 30 Z" 
                            stroke="black" strokeWidth="1" fill="lightgray" />
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10"
                              refX="5" refY="5" markerWidth="6"
                              markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                          </defs>
                          <line x1="100" y1="32" x2="100" y2="98" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="104" y="70" fontSize="12px">d</text>
                          <line x1="52" y1="101" x2="98" y2="101" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="71" y="113" fontSize="12px">w</text>
                        </svg>}
                        {selectedCS == 'circular' && <svg style={{border: "1px solid #aaa"}} width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="100" cy="100" r="60" stroke="grey" strokeWidth="2" fill="lightgray" />
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10"
                              refX="5" refY="5" markerWidth="6"
                              markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                          </defs>
                          <line x1="100" y1="42" x2="100" y2="98" stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                          <text x="104" y="75" fontSize="12px">r</text>
                        </svg>}
                    </div>
                </div>
                        
                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", 
                    marginTop: "20px", marginBottom: "20px", 
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>Material</div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '120px'}}>Material</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={values.material}
                      onChange={(e) => handleChange(e, "material")}
                    >
                        {materials.filter(m => m.type == values.type).map((m, i) => {
                            return (
                                <MenuItem key={i}
                                    value={m.id}
                                >{m.name}</MenuItem>
                            )
                        })}
                    </Select>
                    <Button 
                        variant="outlined" 
                        sx={{textTransform: "none", color: "black", marginLeft: "10px"}}
                    >Create New</Button>
                </div>

            </DialogContent>}

            <DialogActions sx={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    {(props.focused.createmode && page == 1) && 
                        <Button variant="contained" onClick={handleBack}>
                            <Typography>Back</Typography>
                        </Button>
                    }
                </div>
                <div>
                    {(!props.focused.createmode || page == 1) && 
                        <Button variant="contained" onClick={handleApply} disabled={saveDisabled}>
                            <Typography>Save</Typography>
                        </Button>
                    }
                    {(props.focused.createmode && page == 0) && 
                        <Button variant="contained" onClick={() => setPage(1)} disabled={!selectedCS || values.type == ""}>
                            <Typography>Next</Typography>
                        </Button>
                    }
                    <Button sx={{marginLeft: "8px"}} variant="contained" onClick={handleClose}>
                        <Typography>Cancel</Typography>
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}