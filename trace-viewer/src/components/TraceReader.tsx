import {ChangeEvent, FC} from "react";
import useTraceContext from "@/context/TracesContext";
import {ACTIONS} from "@/context/TracesReducer";


const TraceReader: FC = () => {
    const {tracesState, tracesDispatcher} = useTraceContext();
    let fileReader: FileReader;

    const handleFileRead = () => {
        tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: fileReader.result}});
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