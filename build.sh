#!/bin/sh
# Assemble src/ en un seul index.html
cd "$(dirname "$0")"
{ cat src/00_head.html; echo '<script>'; for f in src/*.js; do cat "$f"; echo; done; echo '</script></body></html>'; } > index.html
mkdir -p ../a-plume-perdue && cp index.html ../a-plume-perdue/index.html
echo "index.html: $(wc -c < index.html) octets"
