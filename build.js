const metalsmith = require("metalsmith"),
collections = require("@metalsmith/collections"),
autoCollections = require("metalsmith-auto-collections"),
layout = require("@metalsmith/layouts"),
markdown = require("@metalsmith/markdown"),
excerpts = require("@metalsmith/excerpts");

const siteTitle = "My Metalsmith-powered Static Site";
const source = "./source";
const destination = "./site";
const backend = "./backend";

metalsmith(process.cwd())
.source(source)
.destination(destination)
.metadata({
author: "rjc",
site: "http://localhost:8000",
siteTitle: siteTitle,
description: "Experimenting with metalsmith."
})
.use(markdown({gfm: true}))
.use(excerpts())
.use(autoCollections({}))
.use(collections({}))
.use(layout({default: "njk", directory: "layouts"}))
.build(function(err) {     
if (err) throw new Error(err);
});
