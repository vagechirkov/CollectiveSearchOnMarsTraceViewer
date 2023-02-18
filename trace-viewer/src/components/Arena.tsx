import {FC} from "react";


interface IArena {
    children: React.ReactNode
}

const Arena: FC<IArena>= (props) => {
    const { children } = props;
    return (
        <svg width="700" height="700" viewBox="0 0 100 100">
            <g>
                {children}
            </g>
        </svg>
    )
}

export default Arena;