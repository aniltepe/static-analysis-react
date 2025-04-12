import { Button, Dialog, DialogContent, List, ListItem, Typography } from "@mui/material";

function CustomButton(props) {
    return (
        <Button variant="outlined" sx={{textTransform: "none", color: "black"}}>{props.text}</Button>
    )
}

export default function Material(props) {
    const handleClose = () => {
        props.materialOpen(false);
    }

    return (
        <Dialog
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogContent sx={{
                display: "flex",
                justifyContent: "space-between",
                maxHeight: "240px"
            }}>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    flexGrow: "1"
                }}>
                    <Typography>Materials</Typography>
                    <List sx={{border: "1px solid gray", overflowY: "auto"}}>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                        <ListItem>FSEC1</ListItem>
                        <ListItem>FSEC2</ListItem>
                    </List>
                </div>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    marginLeft: "16px",
                    justifyContent: "space-evenly",
                    rowGap: "0px"
                }}>
                    <CustomButton text="New Material" />
                    <CustomButton text="Load Material" />
                    <CustomButton text="Clone Material" />
                    <CustomButton text="Modify/Show Material" />
                    <CustomButton text="Delete Material" />
                </div>
            </DialogContent>
        </Dialog>
    )
}