# js_code_highlighter
Really basic code highlighter because all the other ones are too 
complicated while also not featured enough. Written completely in
Vanilla JS. MIT license.

# Features
* No dependencies.
* Simple implementation.
* Easy to understand and modify.
* Highlighter rules included for C.
* Trivial to write new highlighter rules.
* Selecting the code in the browser works properly.
* Block and inline options.
* Line number offsets
* Optional title bar
* Preserves existing HTML tags inside the target code.

# Performance
Who cares? Discord takes a gig of ram to do what IRC clients did in a few K and nobody batts an eye. 

# Usage
* `<pre> your code </pre>` Will turn into a highlighted block element with line numbers.
* `<pre ln="5"> your code </pre>` Will turn into a highlighted block element with line numbers starting at 5.
* `<pre title="foo.c"> your code </pre>` Adds a title bar with "foo.c"
* `<ipre> your code </ipre>` Will turn into a single-line highlighted inline-block element without line numbers.
* `<ipre ln="5"> your code </ipre>` Will turn into a single-line highlighted inline-block element with a line number of 5.

# Bugs
If you forget a closing tag, it may lock up your browser. This appears to be within the browser's 
regex engine, not directly within my code.
