#!/bin/sh
set -eu

# Choose listen port from $PORT with a default fallback
PORT_VALUE="${PORT:-8080}"

cat >/etc/nginx/conf.d/default.conf <<EOF
server {
  listen ${PORT_VALUE};
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  access_log /dev/stdout;
  error_log  /dev/stderr info;

  # Simple health endpoint for platform probes
  location = /healthz {
    access_log off;
    default_type text/plain;
    return 200 'ok';
  }

  location / {
    # SPA routing: serve requested file if exists, else index.html
    try_files \$uri /index.html;
  }

  # 确保 HTML 不被浏览器缓存，避免新构建未即时生效
  location ~* \.html$ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
    expires -1;
  }

  # Graceful handling for missing favicon to avoid fallback loops
  location = /favicon.ico {
    access_log off;
    try_files /favicon.ico =204;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
    expires 7d;
    add_header Cache-Control "public";
  }
}
EOF

exec nginx -g "daemon off;"
