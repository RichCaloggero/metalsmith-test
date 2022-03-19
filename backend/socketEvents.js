
export default function registerSocketEvents (socket, descriptors) {
socket.onAny((event, ...args) => {
const descriptor = descriptors[event];
if (!descriptor) return;
console.log("received event ", event);
if (descriptor instanceof Function) {
// no response required, so just execute the handler
descriptor(socket, ...args);
} else if (descriptor instanceof Object && descriptor.handler) {
console.log("- response required: ", descriptor.response);
sendResponse(socket, descriptor.handler(socket, ...args), descriptor.response);
} // if
}); // connectAny
} // registerSocketEvents

function sendResponse (socket, handlerResponse, response) {
if (not(response)) return;

if (typeof(response) === "string" && handlerResponse) {
socket.emit(response, handlerResponse);
console.log("response sent: ", response, handlerResponse);
} else if (Array.isArray(response) && response.length > 0) {
const [successEvent, failureEvent] = response;

// these two lines allow returning an object from handler with status and/or response properties
// if status exists and is truthy then use it, otherwise use use handlerResponse
// if success is falsey and failureEvent is defined then pass back failureResponse with the event
const success = handlerResponse && typeof(handlerResponse) === "object" && handlerResponse.hasOwnProperty("status")? handlerResponse.status : handlerResponse;
const failureResponse = handlerResponse && typeof(handlerResponse) === "object" && handlerResponse.hasOwnProperty("response")? handlerResponse.response : null;

if (success) {
socket.emit(successEvent, handlerResponse);
console.log("- sent success: ", handlerResponse);
} else if(failureEvent) {
socket.emit(failureEvent, failureResponse);
console.log("- sent failure: ", failureResponse);
} // if
} // if
} // sendResponse

function not (x) {return !Boolean(x);}

