import metalsmith from "metalsmith";
import collections from "@metalsmith/collections";
import autoCollections  from "metalsmith-auto-collections";
import layout from "@metalsmith/layouts";
import markdown from "@metalsmith/markdown";
import excerpts from "@metalsmith/excerpts";


export default function build () {
try {
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
console.log ("Build complete.");

} catch (e) {
console.error(e);
} // try
} // build

