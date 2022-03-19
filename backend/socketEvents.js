
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
if (response) {
if (typeof(response) === "string" && handlerResponse) {
socket.emit(response, handlerResponse);
console.log("response sent: ", response, handlerResponse);
} else if (Array.isArray(response) && response.length > 0) {
const [success, failure] = response;
if (handlerResponse) {
socket.emit(success, handlerResponse);
console.log("- sent success: ", response, handlerResponse);
} else if(failure) {
socket.emit(failure);
console.log("- sent failure: ", response, handlerResponse);
} // if
} // if
} // if
} // sendResponse


