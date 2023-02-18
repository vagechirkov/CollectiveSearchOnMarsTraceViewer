import {TracesState} from "@/context/TracesContext";

export const ACTIONS = {
    ADD_TRACE: 'ADD_TRACE',
}


const tracesReducer = (state: TracesState, action: any) => {
    switch (action.type) {
        case ACTIONS.ADD_TRACE:
            // parse the text file with traces
            // add the traces to the state
            console.log(action.payload.content)
            return {
                ...state
            }

        default:
            return state;
    }
}

export default tracesReducer;