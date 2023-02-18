import {FC, useMemo} from "react";
import useTraceContext, {traceFile} from "@/context/TracesContext";
import {ACTIONS} from "@/context/TracesReducer";
import {useDropzone, FileWithPath} from "react-dropzone";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText, styled} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';

const baseStyle = {
    flex: 1,
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const TraceReader: FC = () => {
    const {tracesState, tracesDispatcher} = useTraceContext();
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone(
        {
            accept: {'text/txt': ['.txt'],},
            onDrop: (acceptedFiles) => {
                acceptedFiles.forEach((file: FileWithPath) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const text = reader.result;
                        const path = file.path;
                        tracesDispatcher({
                            type: ACTIONS.ADD_FILE,
                            payload: {file: {name: path, content: text} as traceFile}
                        });
                    }
                    reader.readAsText(file);
                });
            }
        }
    );

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const onFileClick = (event: any) => {
        if (!tracesState.files) return;
        // select file based on the click event
        const file = tracesState.files.find((file) => file.name === event.target.innerText);
        if (!file) return;

        tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: file.content}});
    }

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop trace files here, or click to select files</p>
            </div>
            {tracesState.files &&
               ( <Demo>
                    <List dense={true}>
                        {tracesState.files.map((file) => {
                                return (
                                    <ListItemButton
                                        key={file.name}
                                        onClick={onFileClick}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <DescriptionIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primaryTypographyProps={{noWrap: true}}
                                            primary={file.name}
                                            style={{overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}
                                        />
                                    </ListItemButton >
                                );
                            }
                            )
                        }
                    </List>
                </Demo>)
            }
        </div>
    );
}

export default TraceReader;