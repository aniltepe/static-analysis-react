import {useState, useEffect} from 'react';
import { Button, Dialog, DialogContent, Typography,
    Select, MenuItem, DialogActions, TextField
 } from "@mui/material";

export default function NewMaterialDialog(props) {
    const [values, setValues] = useState({
        id: "",
        name: "",
        type: "",
        wpuv: "",
        moe: "",
        poisson: "",
        sccs: "",
        mys: "",
        mts: "",
    });

    const [errors, setErrors] = useState({
        name: false,
        type: false,
        wpuv: false,
        moe: false,
        poisson: false,
        sccs: false,
        mys: false,
        mts: false,
    });

    const [saveDisabled, setSaveDisabled] = useState(true);

    useEffect(() => {
        setValues(props.focused);
    }, [props.focused]);

    const handleChange = (e, key) => {
        const newValues = {...values, [key]: e.target.value};
        if (Object.keys(newValues)
            .filter(k => k != "id")
            .map(k => newValues[k])
            .filter(v => v != "")
            .length > 0) 
        {
            setSaveDisabled(false);    
        }
        else {
            setSaveDisabled(true);    
        }
        setValues(newValues);
    };

    const handleClose = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        props.open(false);
        props.setFocused(null);
    };

    const handleSave = () => {
        const [result, newErrors] = validate();
        if (!result) {
            setErrors(newErrors);
            return;
        }
        if (props.focused.createmode) {
            props.open(false);
            props.setFocused(null);
        }
        else {

        }
    };

    const validate = () => {
        let valid = true;    
        let newErrors = {...errors}    
        if (values.name === "") {
            newErrors.name = true;
            valid = false;
        }
        if (values.type === "") {
            newErrors.type = true;
            valid = false;
        }
        if (isNaN(parseFloat(values.wpuv))) {
            newErrors.wpuv = true;
            valid = false;
        }
        if (isNaN(parseFloat(values.moe))) {
            newErrors.moe = true;
            valid = false;
        }
        if (isNaN(parseFloat(values.poisson))) {
            newErrors.poisson = true;
            valid = false;
        }
        if (values.type === "concrete" && isNaN(parseFloat(values.sccs))) {
            newErrors.sccs = true;
            valid = false;
        }
        if (values.type === "steel" && isNaN(parseFloat(values.mys))) {
            newErrors.mys = true;
            valid = false;
        }
        if (values.type === "steel" && isNaN(parseFloat(values.mts))) {
            newErrors.mts = true;
            valid = false;
        }
        return [valid, newErrors];
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
                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", marginBottom: "20px",
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>General Data</div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Material Name</Typography>
                    <TextField 
                        error={errors.name}
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.name}
                        onChange={(e) => handleChange(e, "name")} />
                </div>
                
                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Material Type</Typography>
                    <Select
                        error={errors.type}
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.type}
                        onChange={(e) => handleChange(e, "type")}
                        disabled={!props.focused.createmode}
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
                }}>Weight and Mass</div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Weight per Unit Volume</Typography>
                    <TextField 
                        error={errors.wpuv}
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.wpuv}
                        onChange={(e) => handleChange(e, "wpuv")} />
                </div>

                <div style={{
                    display: "flex", flexGrow: 1, height: "14px", 
                    marginTop: "20px", marginBottom: "20px", 
                    paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                    textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                        -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                    borderBottom: "1px solid #bbb", lineHeight: "25px",
                }}>Isotropic Property Data</div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Modulus Of Elasticity, E</Typography>
                    <TextField 
                        error={errors.moe}
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.moe}
                        onChange={(e) => handleChange(e, "moe")} />
                </div>

                <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                    <Typography style={{minWidth: '200px'}}>Poisson, U</Typography>
                    <TextField 
                        error={errors.poisson}
                        sx={{flexGrow: 1}}
                        size='small'
                        value={values.poisson}
                        onChange={(e) => handleChange(e, "poisson")} />
                </div>

                {values.type == 'concrete' && <>
                    <div style={{
                        display: "flex", flexGrow: 1,  height: "14px", 
                        marginTop: "20px",  marginBottom: "20px", 
                        paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                        textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                            -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                        borderBottom: "1px solid #bbb", lineHeight: "25px",
                    }}>Other Properties For Concrete Materials</div>

                    <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                        <Typography style={{minWidth: '200px'}}>Specified Concrete<br></br>Compressive Strength, fc</Typography>
                        <TextField 
                            error={errors.sccs}
                            sx={{flexGrow: 1}}
                            size='small'
                            value={values.sccs}
                            onChange={(e) => handleChange(e, "sccs")} />
                    </div>
                </>}

                {values.type == 'steel' && <>
                    <div style={{
                        display: "flex", flexGrow: 1,  height: "14px", 
                        marginTop: "20px",  marginBottom: "20px", 
                        paddingLeft: "10px", fontSize: "14px", color: "#aaa",
                        textShadow: `-1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff, 1px 1px 1px #fff,
                            -2px -2px 1px #fff, 2px -2px 1px #fff, -2px 2px 1px #fff, 2px 2px 1px #fff`,
                        borderBottom: "1px solid #bbb", lineHeight: "25px",
                    }}>Other Properties For Steel Materials</div>

                    <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                        <Typography style={{minWidth: '200px'}}>Minimum Yield Stress</Typography>
                        <TextField 
                            error={errors.mys}
                            sx={{flexGrow: 1}}
                            size='small'
                            value={values.mys}
                            onChange={(e) => handleChange(e, "mys")} />
                    </div>

                    <div style={{display: "flex", flexFlow: "row", alignItems: "center", marginBottom: "10px"}}>
                        <Typography style={{minWidth: '200px'}}>Minimum Tensile Stress</Typography>
                        <TextField 
                            error={errors.mts}
                            sx={{flexGrow: 1}}
                            size='small'
                            value={values.mts}
                            onChange={(e) => handleChange(e, "mts")} />
                    </div>
                </>}

            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSave} disabled={saveDisabled}>
                    <Typography>Save</Typography>
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    <Typography>Cancel</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    )
}