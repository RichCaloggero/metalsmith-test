# Metalsmith gotchas

## Collections

- realize that plugin order makes a difference
   + often want to collect output files, so be sure markdown appears before collections in plugin chain
- seems to supply full path so most likely need a leading slash
- need to run in a server environment; using file: URLs falls apart pretty quickly when you start to use hierarchical structure


## template blocks

 - examples don't include the surrounding html element
   + parent always processed first and blocks are overridden in children so surrounding html context will be output by the parent
- don't need to duplicate blocks in child unless they need to be overridden

## macros for nav menus

-  a bit messy because need to use call / endcall blocks
- menuItem generates button or link and button as trigger; link generates a link, and action generates button
- all wrapped in list item

## workflow

- can we write simple offline UI to modify files, then rebuild site

