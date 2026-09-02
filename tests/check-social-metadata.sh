#!/bin/sh
set -eu

page="${1:-index.html}"

assert_contains() {
    pattern="$1"
    description="$2"

    if ! grep -Fq "$pattern" "$page"; then
        echo "FAIL: falta $description" >&2
        exit 1
    fi
}

assert_contains '<link rel="canonical" href="https://pactoarquitectura.com/">' 'la URL canónica HTTPS'
assert_contains '<meta property="og:type" content="website">' 'og:type'
assert_contains '<meta property="og:locale" content="es_MX">' 'og:locale'
assert_contains '<meta property="og:site_name" content="PACTO arquitectura">' 'og:site_name'
assert_contains '<meta property="og:title" content="PACTO arquitectura — Oaxaca, México">' 'og:title'
assert_contains '<meta property="og:description" content="PACTO arquitectura — Estudio de diseño arquitectónico en Oaxaca, México. Diseñamos espacios construidos alrededor de cómo vives realmente.">' 'og:description'
assert_contains '<meta property="og:url" content="https://pactoarquitectura.com/">' 'og:url'
assert_contains '<meta property="og:image" content="https://pactoarquitectura.com/assets/casa-ns-12.jpg">' 'og:image con URL absoluta'
assert_contains '<meta property="og:image:type" content="image/jpeg">' 'el tipo de imagen social'
assert_contains '<meta property="og:image:width" content="2400">' 'el ancho de la imagen social'
assert_contains '<meta property="og:image:height" content="1260">' 'el alto de la imagen social'
assert_contains '<meta property="og:image:alt" content="Proyecto residencial diseñado por PACTO arquitectura en Oaxaca, México">' 'el texto alternativo de la imagen social'
assert_contains '<meta name="twitter:card" content="summary_large_image">' 'la tarjeta grande de Twitter/X'
assert_contains '<meta name="twitter:title" content="PACTO arquitectura — Oaxaca, México">' 'twitter:title'
assert_contains '<meta name="twitter:description" content="PACTO arquitectura — Estudio de diseño arquitectónico en Oaxaca, México. Diseñamos espacios construidos alrededor de cómo vives realmente.">' 'twitter:description'
assert_contains '<meta name="twitter:image" content="https://pactoarquitectura.com/assets/casa-ns-12.jpg">' 'twitter:image'
assert_contains '<meta name="twitter:image:alt" content="Proyecto residencial diseñado por PACTO arquitectura en Oaxaca, México">' 'twitter:image:alt'

test -f assets/casa-ns-12.jpg || {
    echo 'FAIL: no existe la imagen social' >&2
    exit 1
}

echo 'PASS: metadatos sociales completos'
