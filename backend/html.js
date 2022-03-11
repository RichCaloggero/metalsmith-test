/// simple html generator

function errorResponse (error) {
return `${head("error")}
${body(error)}
`;
} // errorResponse

function htmlResponse (title, content) {
return `${head(title)}
${body(content)}
`;
} // content

function editForm (content) {
return `<form method="post" action="#">
<textarea  autofocus name="content" rows=30 cols="80">
${content}
</textarea>
<hr>
<input type="submit" name="submit">
</form>
`;
} // editContent

function head (title) {
return `<head>
<meta utf-8>
<title>${title}</title>
</head>
`;
} // head

function body (content) {
return `<body>
${content}
</body>
</html>
`;
} // body

/// exports

module.exports = {
errorResponse, htmlResponse, editForm,
head, body
};

