
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

function sendResponse (socket, handlerResponse, events) {
if (not(events)) return;

const result = {status: false, error: "", response: null};
if (typeof(handlerResponse) === "object") Object.assign(result, handlerResponse);
else Object.assign(result, {status: true, response: handlerResponse});

if (typeof(events) === "string") events = [events];
const [successEvent, failureEvent] = events;

if (result.status && successEvent) {
socket.emit(successEvent, result.response);
} else if (failureEvent) {
if (result.error) socket.emit("error", result.error);
else socket.emit(failureEvent, result.response);
} // if
} // sendResponse

function not (x) {return !Boolean(x);}

