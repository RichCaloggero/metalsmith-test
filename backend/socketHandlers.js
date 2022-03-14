function loginHandler (socket) {
socket.emit("login", {
eMail: $(".eMail").value,
password: $(".password").value,
}));
