import {useState, useEffect} from 'react';
import { Button, Dialog, DialogContent, Typography,
    Select, MenuItem, DialogActions, TextField
 } from "@mui/material";

export default function NewMaterialDialog(props) {
    const [values, setValues] = useState({
        force: "",
        length: "",
        temperature: "",
    });

    const force = [
        {display: "Pound, lbf", val: "lbf", conv: 0},
        {display: "Kilopound, kip", val: "kip", conv: 1},
        {display: "Kilogram-force, kgf", val: "kgf", conv: 0},
        {display: "Ton-force, tonf", val: "tonf", conv: 0},
        {display: "Newton, N", val: "N", conv: 0},
        {display: "Kilonewton, kN", val: "kN", conv: 0},
    ];

    const length = [
        {display: "Inch, in", val: "in", conv: 0},
        {display: "Feet, ft", val: "ft", conv: 1},
        {display: "Millimeter, mm", val: "mm", conv: 0},
        {display: "Centimeter, cm", val: "cm", conv: 0},
        {display: "Meter, m", val: "m", conv: 0},
    ];

    const temperature = [
        {display: "Fahrenheit, F", val: "F", conv: 1},
        {display: "Celcius, C", val: "C", conv: 0},
        {display: "Kelvin, K", val: "K", conv: 0},
    ];

    const [applyDisabled, setApplyDisabled] = useState(true);

    useEffect(() => {
        setValues(props.units);
    }, [props.units]);

    const handleChange = (e, key) => {
        setValues((v) => {return {...v, [key]: e.target.value}})
    };

    const handleClose = (e) => {
        props.open(false);
    };

    const handleApply = () => {
        props.open(false);
    };

    return (
        <Dialog
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogContent sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
            }}>
                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Force</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={values.force}
                      onChange={(e) => handleChange(e, "force")}
                    >
                        {force.map((u, i) => {
                            return (
                                <MenuItem key={i}
                                    value={u.val}
                                >{u.display}</MenuItem>
                            )
                        })}
                    </Select>
                </div>
                
                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Length</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={values.length}
                      onChange={(e) => handleChange(e, "length")}
                    >
                        {length.map((u, i) => {
                            return (
                                <MenuItem key={i}
                                    value={u.val}
                                >{u.display}</MenuItem>
                            )
                        })}
                    </Select>
                </div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Temperature</Typography>
                    <Select
                      sx={{flexGrow: 1}}
                      size='small'
                      value={values.temperature}
                      onChange={(e) => handleChange(e, "temperature")}
                    >
                        {temperature.map((u, i) => {
                            return (
                                <MenuItem key={i}
                                    value={u.val}
                                >{u.display}</MenuItem>
                            )
                        })}
                    </Select>
                </div>

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