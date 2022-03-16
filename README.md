# Metalsmith gotchas

## Collections

- plugin order makes a difference
   + often want to collect output files, so be sure markdown appears before collections in plugin chain
   + if metalsmith-auto-collections is to work, again needs to be first in chain, before markdown and @metalsmith/collections
- seems to supply full path so most likely need a leading slash
- need to run in a server environment; using file: URLs falls apart pretty quickly when you start to use hierarchical structure

## Running metalsmith

- started out using metalsmith.json
   + realized node.js module is more flexable and can be easily called from server code
   + call the build.js module whenever a file is change; very fast rebuild of the site


## template blocks

 - examples don't include the surrounding html element
   + parent always processed first and blocks are overridden in children so surrounding html context will be output by the parent
- don't need to duplicate blocks in child unless they need to be overridden

## macros for nav menus

-  a bit messy because need to use call / endcall blocks
- menu generates unordered lists and will generate leaf nodes based on collections automatically
- menuItem generates button or link and button as trigger; link generates a link, and action generates button

## backend

- using node.js and socket.io to handle file editing in the browser
   + for demonstration purposes I'm only showing files with .md extensions which live inside the source folder 
- I'm trapping the beforeunload event on the window to prevent accidental refreshes from closing the socket and logging out the user
- no fancy editing; just displays the markdown source in a textarea
- site is rebuilt on the fly whenever a file is updated


