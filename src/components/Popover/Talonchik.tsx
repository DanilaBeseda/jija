import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];


export interface ConfirmationDialogRawProps {
    setNumber: (n: number) => void
    open: boolean
    setOpen:  (open: boolean) => void
    services: string[]
}

export function TalonchikModal({open, setOpen, services, setNumber}: ConfirmationDialogRawProps) {
    const [value, setValue] = React.useState(services[0]);
    const radioGroupRef = React.useRef<HTMLElement>(null);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleClose = () => {
        setOpen(false)
    }

    const hancleOk = () => {
        setNumber(Math.round(Math.random()*10))
        setOpen(false)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, background: "#312f2f;" } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle  style={{color: "#FFF"}}>Выберите услугу</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={value}
                    onChange={handleChange}
                >
                    {services.map((s) => (
                        <FormControlLabel
                            style={{color: "#FFF"}}
                            value={s}
                            key={s}
                            control={<Radio />}
                            label={s}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} style={{color: "#FFF"}}>
                    Cancel
                </Button>
                <Button onClick={hancleOk} style={{color: "#FFF"}}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}