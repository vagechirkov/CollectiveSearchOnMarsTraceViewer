import {Box, FormControl, FormLabel, FormGroup, FormControlLabel, Button} from "@mui/material";
import html2canvas from "html2canvas";
import {useEffect, useState} from "react";


const CreateGif = () => {
    // state with the object urls of the blobs
    const [blobs, setBlobs] = useState<string[]>([]);

    useEffect(() => {
        console.log(blobs);
    }, [blobs]);

    const takeScreenshot = () => {
        const arena = document.getElementById('arena') as HTMLElement;
        html2canvas(document.body).then(canvas =>
            canvas.toBlob(
                (blob) => setBlobs([...blobs, URL.createObjectURL(blob ? blob : new Blob())])
            )
        );
    }

    // enter time interval and press create gif button
    return (
        <Box>
            <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                <FormLabel component="legend">gif</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Button onClick={takeScreenshot}>
                                Create GIF
                            </Button>
                        }
                        label=""
                    />
                </FormGroup>

            </FormControl>
        </Box>
    )
}


export default CreateGif;