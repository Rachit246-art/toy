<?php
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';
if (!$slug) {
    // Fallback to normal index if no slug provided
    readfile('index.html');
    exit;
}

$backendUrl = 'https://darkgreen-kudu-992852.hostingersite.com/seo/product/' . urlencode($slug);

$context = stream_context_create([
    'http' => [
        'ignore_errors' => true // allow fetching content even on 404
    ]
]);

$html = @file_get_contents($backendUrl, false, $context);

// Forward the HTTP response code from the backend
if (isset($http_response_header)) {
    foreach ($http_response_header as $header) {
        if (preg_match('#^HTTP/#i', $header)) {
            header($header);
        }
    }
}

if ($html === false) {
    // Total failure fallback
    readfile('index.html');
    exit;
}

echo $html;
?>
