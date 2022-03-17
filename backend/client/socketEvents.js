
export function registerSocketEvents (socket, descriptors) {
socket.onAny((event, ...args) => {
const descriptor = descriptors[event];
if (descriptor instanceof Function) {
// no response required, so just execute the handler
descriptor(socket, ...args);
} else if (descriptor instanceof Object && descriptor.handler) {
sendResponse(socket, descriptor.handler(socket, ...args), descriptor.response);
} // if
}); // connectAny
} // registerSocketEvents

function sendResponse (socket, handlerResponse, response) {
if (response) {
if (typeof(response) === "string" && handlerResponse) {
socket.emit(response, handlerResponse);
} else if (Array.isArray(response) && response.length > 0) {
const [success, failure] = response;
if (handlerResponse) socket.emit(success, handlerResponse);
else if(failure) socket.emit(failure);
} // if
} // if
} // sendResponse


