import {Box, FormControl, FormLabel, FormGroup, FormControlLabel, Button} from "@mui/material";


const CreateGif = () => {
    // enter time interval and press create gif button
    return (
        <Box>
            <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                <FormLabel component="legend">gif</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Button> Create GIF </Button>
                        }
                        label=""
                    />
                </FormGroup>

            </FormControl>
        </Box>
    )
}


export default CreateGif;