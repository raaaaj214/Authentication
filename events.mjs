import { EventEmitter } from "events";

class MyEmitter extends EventEmitter{};
const myEmitter = new MyEmitter();
myEmitter.on("break" ,  ()=>{
    console.log(this)
    console.log("Mom scolds")
});
myEmitter.emit("break");
// console.log(myEmitter)