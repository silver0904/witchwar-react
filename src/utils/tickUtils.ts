type TickFunction = (tick: number) => void;
const FPS = 60;
export const tick: (func: TickFunction)=> void = (func) =>{
    const frame = 1000/FPS;
    setInterval(()=>func(frame), frame);
}