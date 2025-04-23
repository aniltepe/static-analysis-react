import {useContext, useState, useEffect, useRef} from 'react';
import { Button, Dialog, DialogContent, List, ListItem, Typography,
    InputLabel, Select, MenuItem,
    DialogActions,
    TextField,
    DialogTitle
 } from "@mui/material";

export default function GridDialog(props) {
    const [mode, setMode] = useState("basic");
    const [basicShape, setBasicShape] = useState("rectangle");
    const [basicType, setBasicType] = useState("basic");

    const [spacing, setSpacing] = useState({x:0, y:0, z:0});
    const [count, setCount] = useState({x:0, y:0, z:0});
    const [error, setError] = useState({
        s:{x:false, y:false, z:false},
        c:{x:false, y:false, z:false}
    });

    useEffect(() => {
        if (!props.values) {
            return;
        }
        setSpacing({
            x: Number.isInteger(props.values.spacing.x) ? props.values.spacing.x.toFixed(1) : props.values.spacing.x, 
            y: Number.isInteger(props.values.spacing.z) ? props.values.spacing.z.toFixed(1) : props.values.spacing.z,
            z: Number.isInteger(props.values.spacing.y) ? props.values.spacing.y.toFixed(1) : props.values.spacing.y
        });
        setCount({
            x: (props.values.count.x + 1).toString(),
            y: (props.values.count.z + 1).toString(),
            z: (props.values.count.y + 1).toString()
        })
    }, [props.values]);

    const modeChange = (evt) => {
        setMode(evt.target.value);
    }   

    const basicShapeChange = (evt) => {
        setBasicShape(evt.target.value);
    }  

    const basicTypeChange = (evt) => {
        setBasicType(evt.target.value);
    } 

    const handleClose = () => {
        props.open(false);
    }

    const handleApply = () => {
        const invalid = validateApply();
        if (invalid) {
            return;
        }
        const newstep = {
            x: parseFloat(spacing.x),
            y: parseFloat(spacing.z),
            z: parseFloat(spacing.y)
        };
        const newcount = {
            x: parseInt(count.x) - 1,
            y: parseInt(count.z) - 1,
            z: parseInt(count.y) - 1
        };
        props.change(
            {step: props.values.spacing, count: props.values.count},
            {step: newstep, count: newcount}
        );
        props.grid(newstep, newcount);
        props.open(false);
    }
    
    const validateApply = () => {
        let err = false;
        if (spacing.x === "" || parseFloat(spacing.x) === 0) {
            setError({...error, s: {...error.s, x: true}});
            err = true;
        }
        if (spacing.y === "" || parseFloat(spacing.y) === 0) {
            setError({...error, s: {...error.s, y: true}});
            err = true;
        }
        if (spacing.z === "" || parseFloat(spacing.z) === 0) {
            setError({...error, s: {...error.s, z: true}});
            err = true;
        }
        if (count.x === "" || parseInt(count.x) === 0) {
            setError({...error, c: {...error.c, x: true}});
            err = true;
        }
        if (count.y === "" || parseInt(count.y) === 0) {
            setError({...error, c: {...error.c, y: true}});
            err = true;
        }
        if (count.z === "" || parseInt(count.z) === 0) {
            setError({...error, c: {...error.c, z: true}});
            err = true;
        }
        return err;
    }

    const handleNumberChange = (evt, axis) => {
        const regex = /^\s*\d*\s*$/;
        if (regex.test(evt.target.value)) {
            setCount({...count, [axis]: evt.target.value.trim()});
        }
    }

    const handleDecimalChange = (evt, axis) => {
        const regex = /^\s*\d*\.?\d*\s*$/;
        if (regex.test(evt.target.value)) {
            setSpacing({...spacing, [axis]: evt.target.value.trim()});
        }
    }

    return (
        <Dialog
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogTitle sx={{fontWeight: "800"}}>Grid Configuration</DialogTitle>
            <DialogContent sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
            }}>
                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '150px'}}>Configuration Type</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={mode}
                      onChange={modeChange}
                    >
                        <MenuItem value="basic">Basic</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                </div>
                
                { mode == "basic" && (
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                        <Typography style={{minWidth: '150px'}}>Grid Shape</Typography>
                        <Select
                          sx={{flexGrow: 1}}
                          size='small'
                          value={basicShape}
                          onChange={basicShapeChange}
                        >
                            <MenuItem value="rectangle">Rectangle</MenuItem>
                            <MenuItem value="circle">Circle</MenuItem>
                        </Select>
                    </div>
                )}

                { mode == "basic" && basicShape == "rectangle" && (
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                        <Typography style={{minWidth: '150px'}}>Adjustment</Typography>
                        <Select
                          sx={{flexGrow: 1}}
                          size='small'
                          value={basicType}
                          onChange={basicTypeChange}
                        >
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </div>
                )}

                { mode == "basic" && basicShape == "rectangle" && basicType == "basic" && (
                    <>
                        <table style={{marginTop: "20px"}}>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td style={{textAlign: "center", fontWeight: "800"}}>X</td>
                                    <td style={{textAlign: "center", fontWeight: "800"}}>Y</td>
                                    <td style={{textAlign: "center", fontWeight: "800"}}>Z</td>
                                </tr>
                                <tr>
                                    <td style={{width: "200px", fontWeight: "800"}}>Number of Lines</td>
                                    <td><TextField error={error.c.x} value={count.x} onChange={(e) => handleNumberChange(e, 'x')} size='small'/></td>
                                    <td><TextField error={error.c.y} value={count.y} onChange={(e) => handleNumberChange(e, 'y')} size='small'/></td>
                                    <td><TextField error={error.c.z} value={count.z} onChange={(e) => handleNumberChange(e, 'z')} size='small'/></td>
                                </tr>
                                <tr>
                                    <td style={{width: "200px", fontWeight: "800"}}>Spacing</td>
                                    <td><TextField error={error.s.x} value={spacing.x} onChange={(e) => handleDecimalChange(e, 'x')} size='small'/></td>
                                    <td><TextField error={error.s.y} value={spacing.y} onChange={(e) => handleDecimalChange(e, 'y')} size='small'/></td>
                                    <td><TextField error={error.s.z} value={spacing.z} onChange={(e) => handleDecimalChange(e, 'z')} size='small'/></td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleApply}>
                    <Typography>Apply</Typography>
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    <Typography>Discard</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    )
}