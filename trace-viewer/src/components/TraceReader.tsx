import {ChangeEvent, FC} from "react";


const TraceReader: FC = () => {
    let fileReader: FileReader;

    const handleFileRead = () => {
        const content = fileReader.result;
        console.log(content)
        // … do something with the 'content' …
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    {
        // prevent default action (open as link for some elements)
        if (e.target.files === null) return;
        e.preventDefault();
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(e.target.files[0]);
    }

    return (
        <input
            type="file"
            accept='.txt'
            onChange={e => handleChange(e)}
        />
    )
}

export default TraceReader;