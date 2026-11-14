#!/usr/bin/env bash
# Monta o protótipo em um único HTML a partir das partes em ./parts
set -e
cd "$(dirname "$0")"
OUT=climatizacao-prototipo.html
{
  cat parts/00-head.html
  echo '<style>'; cat parts/*.css; echo '</style>'
  echo '</head>'; echo '<body>'
  echo '<div id="app"><div style="max-width:560px;margin:80px auto;padding:24px;font:16px/1.5 Arial,sans-serif;color:#1D2433;text-align:center"><b>Protótipo · gestão de climatização</b><br>Se esta mensagem não sumir em alguns segundos, abra este arquivo no <b>Chrome</b> ou no <b>Edge</b>.</div></div>'
  echo '<script>'; echo "'use strict';"; cat parts/[2-9]*.js; echo '</script>'
  echo '</body>'; echo '</html>'
} > "$OUT"
sed -n '/^<script>$/,/^<\/script>$/p' "$OUT" | sed '1d;$d' > .check.js
node --check .check.js && rm -f .check.js && echo "OK · $(wc -c < "$OUT") bytes · $(wc -l < "$OUT") linhas"
