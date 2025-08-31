import {useState, useEffect} from 'react';
import { Button, Dialog, DialogContent, Typography,
    Select, MenuItem,
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
    const [applyDisabled, setApplyDisabled] = useState(true);

    useEffect(() => {
        if (!props.values) {
            return;
        }
        const x_spac = props.values.spacing[props.coordSystem.x.toLowerCase()];
        const y_spac = props.values.spacing[props.coordSystem.y.toLowerCase()];
        const z_spac = props.values.spacing[props.coordSystem.z.toLowerCase()];
        setSpacing({
            x: Number.isInteger(x_spac) ? x_spac.toFixed(1) : x_spac, 
            y: Number.isInteger(y_spac) ? y_spac.toFixed(1) : y_spac,
            z: Number.isInteger(z_spac) ? z_spac.toFixed(1) : z_spac
        });
        setCount({
            x: (props.values.count[props.coordSystem.x.toLowerCase()] + 1).toString(),
            y: (props.values.count[props.coordSystem.y.toLowerCase()] + 1).toString(),
            z: (props.values.count[props.coordSystem.z.toLowerCase()] + 1).toString()
        })
    }, [props.values]);

    useEffect(() => {
        if ((spacing.x === 0 && spacing.y === 0 && spacing.z === 0) ||
            (count.x === 0 && count.y === 0 && count.z === 0)) {
            return;
        }
        const [newstep, newcount] = transform();
        if (props.values.spacing.x === newstep.x && 
            props.values.spacing.y === newstep.y &&
            props.values.spacing.z === newstep.z &&
            props.values.count.x === newcount.x &&
            props.values.count.y === newcount.y &&
            props.values.count.z === newcount.z) {
            setApplyDisabled(true);
        }
        else {
            setApplyDisabled(false);
        }
    }, [spacing, count]);

    const modeChange = (evt) => {
        setMode(evt.target.value);
    };  

    const basicShapeChange = (evt) => {
        setBasicShape(evt.target.value);
    }; 

    const basicTypeChange = (evt) => {
        setBasicType(evt.target.value);
    };

    const handleClose = () => {
        props.open(false);
    };

    const transform = () => {
        const newstep = {
            x: parseFloat(spacing[props.coordSystem.x.toLowerCase()]),
            y: parseFloat(spacing[props.coordSystem.y.toLowerCase()]),
            z: parseFloat(spacing[props.coordSystem.z.toLowerCase()])
        };
        const newcount = {
            x: parseInt(count[props.coordSystem.x.toLowerCase()]) - 1,
            y: parseInt(count[props.coordSystem.y.toLowerCase()]) - 1,
            z: parseInt(count[props.coordSystem.z.toLowerCase()]) - 1
        };
        return [newstep, newcount];
    };

    const handleApply = () => {
        const invalid = validateApply();
        if (invalid) {
            return;
        }
        const [newstep, newcount] = transform();
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
                <Button variant="contained" onClick={handleApply} disabled={applyDisabled}>
                    <Typography>Apply</Typography>
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    <Typography>Discard</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    )
}