import {FC} from "react";


interface IAgent {
    agentPositions: {x: number, y: number}
    agentColors: string

}

const Agent: FC<IAgent> = (props) => {
    const {
        agentPositions,
        agentColors="lightgray"
    } = props;
    return (
        <>
            <circle cx={agentPositions.x} cy={agentPositions.y} r="5" fill={agentColors}/>
        </>

)
}

export default Agent;

