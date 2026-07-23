# ==========================================
# Stage 1: Build-Umgebung (Node.js)
# ==========================================
FROM node:22-alpine AS builder

# pnpm aktivieren
RUN corepack enable pnpm

WORKDIR /app

# Schreibrechte fuer numerischen Non-Root User sicherstellen
RUN chown -R 1000:1000 /app
USER 1000:1000

# Lockfiles + .npmrc zuerst fuer bessere Layer-Caching
COPY --chown=1000:1000 package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=secret,id=github_token,env=PACKAGE_TOKEN \
    pnpm config set "//npm.pkg.github.com/:_authToken" "$PACKAGE_TOKEN" && \
    pnpm install --frozen-lockfile

# Restlicher Quellcode + Build
COPY --chown=1000:1000 . .
RUN pnpm run build
RUN mkdir -p /app/dist/licenses && \
    cp LICENSE COPYING COPYING.LESSER NOTICE /app/dist/ && \
    cp node_modules/@fontsource-variable/geist/LICENSE /app/dist/licenses/Geist-OFL-1.1.txt && \
    cp node_modules/@fontsource/open-sans/LICENSE /app/dist/licenses/Open-Sans-OFL-1.1.txt

# ==========================================
# Stage 2: Produktions-Umgebung (Nginx non-root)
# ==========================================
FROM nginxinc/nginx-unprivileged:alpine

LABEL org.opencontainers.image.licenses="LGPL-3.0-or-later" \
      org.opencontainers.image.source="https://github.com/csi-FOXBYTE/Regensburg_DigitalerEnergieZwilling_Frontend"

# Wichtig: In nginx.conf muss "listen 8080;" stehen (nicht 80)
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf

# Statische Build-Artefakte kopieren
COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html

# Numerischer Non-Root User
USER 101:101

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
