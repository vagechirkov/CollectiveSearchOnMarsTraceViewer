import {agentTrace, TracesState} from "@/context/TracesContext";

export const ACTIONS = {
    ADD_TRACE: 'ADD_TRACE',
}

const tracesReducer = (state: TracesState, action: any) => {
    switch (action.type) {
        case ACTIONS.ADD_TRACE:
            // parse the text file with traces
            const agents = parseTrace(action.payload.content);
            return {
                ...state
            }

        default:
            return state;
    }
}

const parseTrace = (trace: string) => {
    const lines = trace.split('\n');
    let agentTraces: agentTrace[] = [];

    // const vars = lines[0].split(' ');
    lines.forEach((line, index) => {
            if (index === 0) {
                // vars
            } else {
                // time, id, x, z, y, signaling, score
                const values = line.split(' ');

                // find agentTrace with id
                const agentTrace = agentTraces.find(agentTrace => agentTrace.id === parseInt(values[1]));

                // if agent trace does not exist, create it
                if (agentTrace === undefined) {
                    agentTraces.push({
                        id: parseInt(values[1]),
                        time: [],
                        x: [],
                        z: [],
                        y: [],
                        signaling: [],
                        score: []
                    })
                }

                // add values to agentTrace
                agentTraces[agentTraces.length - 1].time.push(parseInt(values[0]));
                agentTraces[agentTraces.length - 1].x.push(parseInt(values[2]));
                agentTraces[agentTraces.length - 1].z.push(parseInt(values[3]));
                agentTraces[agentTraces.length - 1].y.push(parseInt(values[4]));
                agentTraces[agentTraces.length - 1].signaling.push(parseInt(values[5]));
                agentTraces[agentTraces.length - 1].score.push(parseInt(values[6]));
            }
        }
    )
    return agentTraces;
}

export default tracesReducer;