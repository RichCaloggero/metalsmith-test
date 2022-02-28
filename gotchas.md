# Metalsmith gotchas

## Collections

- realize that plugin order makes a difference
   + often want to collect output files, so be sure markdown appears before collections in plugin chain
- template blocks: examples don't include the surrounding html element
   + parent always processed first and blocks are overridden in children so surrounding html context will be output by the parent
- macros for nav menus
   +  a bit messy because need to use call / endcall blocks
   + menuItem generates button or link and button as trigger; link generates a link, and action generates button
   + all wrapped in list item
 
- workflow: can we write simple offline UI to modify files, then rebuild site

