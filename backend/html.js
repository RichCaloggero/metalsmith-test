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
errorResponse, htmlResponse,
head, body
};

