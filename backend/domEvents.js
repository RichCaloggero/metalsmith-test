import {not, statusMessage} from "./domUtilities.js";
const eventMap = new Map();


export function registerDomEvents (eventDescriptors) {
//console.log("registerDomEvents: ", Object.keys(eventDescriptors).length);
Object.keys(eventDescriptors).forEach(selector => {
const descriptor = eventDescriptors[selector];
const element = document.querySelector(selector);
if (element && descriptor && descriptor.handler) {
//console.log("- ", element, descriptor);

const eventTypes = Array.isArray(descriptor.type)? descriptor.type : [descriptor.type || "click"];

eventMap.set(element, {handler: descriptor.handler, type: eventTypes});
} // if
}); // keys
//console.log(eventMap.size, " events registered");

document.addEventListener("click", handleEvents);
document.addEventListener("change", handleEvents);
document.addEventListener("focus", handleEvents);
} // initDomEvents

function handleEvents (e) {
//console.log("dom event: ", e.type, " on ", e.target);
const element = e.target;
const descriptor = eventMap.get(element);
if (descriptor && descriptor.type.includes(e.type)) {
statusMessage("");
//console.log("executing: ", descriptor.type, ", ", descriptor.handler);
descriptor.handler(e);
} // if
} // handleEvents

