import {not, statusMessage} from "./utilities.js";
const eventMap = new Map();


export function registerSocketEvents (socket, eventHandlers) {
socket.onAny((event, ...args) => {
if (eventHandlers[event] instanceof Function) {
eventHandlers[event](...args);
console.log("handling socket event: ", eventHandlers[event], event, args);

} else {
if (eventHandlers[event]) statusMessage(`${event}: invalid handler registered; must be a function`);
else statusMessage(`Unrecognized socket event: ${event}.`);
} // if
}); //onAny
} // registerSocketEvents


export function registerDomEvents (eventDescriptors) {
console.log("registerDomEvents: ", Object.keys(eventDescriptors).length);
Object.keys(eventDescriptors).forEach(selector => {
const descriptor = eventDescriptors[selector];
const element = document.querySelector(selector);
if (element && descriptor && descriptor.handler) {
//console.log("- ", element, descriptor);

const eventTypes = Array.isArray(descriptor.type)? descriptor.type : [descriptor.type || "click"];

eventMap.set(element, {handler: descriptor.handler, type: eventTypes});
} // if
}); // keys
console.log(eventMap.size, " events registered");

document.addEventListener("click", handleEvents);
document.addEventListener("change", handleEvents);
document.addEventListener("focus", handleEvents);
} // initDomEvents

function handleEvents (e) {
//console.log("dom event: ", e.type, " on ", e.target);
const element = e.target;
const descriptor = eventMap.get(element);
if (descriptor && descriptor.type.includes(e.type)) {
console.log("executing: ", descriptor.type, ", ", descriptor.handler);
descriptor.handler(e);
} // if
} // handleEvents

