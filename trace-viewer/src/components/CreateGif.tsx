import {Box, FormControl, FormLabel, FormGroup, FormControlLabel, Button} from "@mui/material";
import html2canvas from "html2canvas";
import {FC, useCallback, useEffect, useState} from "react";
import {saveAs} from "file-saver";
// const GifEncoder = require('gif-encoder-2');
// const { writeFile } = require('fs');
const path = require('path');
// const { createCanvas } = require('canvas')
const GIF = require('gif.js');
import {workerStr} from './workerStr';

interface ICreateGif {
    changeTime: (newTime: number) => void;
    currentTime: number;
    gifLength?: number;
    speed?: number;
    filename?: string;
}

const CreateGif: FC<ICreateGif> = ({changeTime, currentTime = 0, gifLength = 30, speed = 5, filename = 'noname'}) => {
    // state with the object urls of the blobs
    const [nFrames, setNFrames] = useState<number>(gifLength);
    const [blobs, setBlobs] = useState<string[]>([]);
    const [startCreatingGif, setStartCreatingGif] = useState<boolean>(false);
    const [fileSaved, setFileSaved] = useState<boolean>(false);
    const [screenshotsDone, setScreenshotsDone] = useState<boolean>(true);

    useEffect(() => {
        if (startCreatingGif && screenshotsDone && nFrames >= 0) {
            setScreenshotsDone(false);
            const newTime = currentTime + speed;
            takeScreenshot(newTime);

            if (nFrames > 0) {
                setNFrames(nFrames - 1);
            } else {
                setStartCreatingGif(false);
                createGif();
            }
        }
    }, [startCreatingGif, nFrames, screenshotsDone]);

    useEffect(() => {
        if (fileSaved) {
            // reset blobs
            setBlobs([]);
            // reset fileSaved
            setFileSaved(false);
            // reset nFrames
            setNFrames(gifLength);

            // screenshot done
            setScreenshotsDone(true);

            setStartCreatingGif(false);
        }
    }, [fileSaved]);


    const takeScreenshot = useCallback((nextTime: number) => {
        html2canvas(document.getElementById('arena') as HTMLElement).then(
            function (canvas) {
                // document.body.appendChild(canvas);
                canvas.toBlob(
                    function (blob) {
                        if (blob !== null) {
                            const imgUrl = URL.createObjectURL(blob);
                            setBlobs([...blobs, imgUrl]);

                        }
                    }
                );
            }
        ).then(() => {
            console.log('screenshot taken');
            setScreenshotsDone(true);
            changeTime(nextTime);
        });
    }, [blobs])

    const createGif = useCallback(() => {
        const workerBlob = new Blob([workerStr], {
            type: 'application/javascript'
        });

        const gif = new GIF({
            workers: 2,
            workerScript: URL.createObjectURL(workerBlob),
            quality: 10,
            width: 1100,
            height: 1100,
            debug: false,
        });

        blobs.forEach(imgUrl => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(imgUrl);
            };
            img.src = imgUrl;

            // add image element to body but hidden
            img.style.display = 'none';
            document.body.appendChild(img);

            gif.addFrame(img, {copy: false, delay: 100});
        });

        gif.on('finished', (blob: Blob) => {
            // save gif
            saveAs(blob, `${filename}-${((currentTime - gifLength * speed)/600).toFixed(2)}-speed-${speed}.gif`);

            // remove images from body
            blobs.forEach(imgUrl => {
                const img = document.querySelector(`img[src="${imgUrl}"]`) as HTMLImageElement;
                img.remove();
            });

            setFileSaved(true);
        });

        gif.render();
    }, [blobs, fileSaved]);


    // enter time interval and press create gif button
    return (
        <Box>
            <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                <FormLabel component="legend">gif</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Button onClick={() => setStartCreatingGif(true)} variant={"contained"}>
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