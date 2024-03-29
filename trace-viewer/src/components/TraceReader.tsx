import {FC, useMemo} from "react";
import useTraceContext, {traceFile} from "@/context/TracesContext";
import {ACTIONS} from "@/context/TracesReducer";
import {useDropzone, FileWithPath} from "react-dropzone";
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, styled} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';

const baseStyle = {
    flex: 1,
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    margin: '4px',
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

const Demo = styled('div')(({theme}) => ({
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

        // find the index of the file
        const fileIndex = tracesState.files.findIndex((f) => f.name === file.name);
        tracesDispatcher({type: ACTIONS.SELECT_FILE, payload: {fileIndex: fileIndex}});

        tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: file.content}});
    }

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop trace files here, or click to select files</p>
            </div>
            {tracesState.files &&
                (<Demo>
                    <List dense={true}>
                        {tracesState.files.map((file) => {
                                return (
                                    <ListItem key={file.name + '-list'}>
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

                                        </ListItemButton>
                                        <IconButton color="error"
                                                    onClick={() => tracesDispatcher(
                                                        {
                                                            type: ACTIONS.DELETE_FILE,
                                                            payload: {fileName: file.name}
                                                        })}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItem>
                                );
                            }
                        )
                        }
                    </List>
                </Demo>)
            }
        </div>
    )
        ;
}

export default TraceReader;