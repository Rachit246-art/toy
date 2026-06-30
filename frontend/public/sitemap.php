<?php
// Set the correct Content-Type for XML
header('Content-Type: application/xml; charset=utf-8');

// The backend URL where the dynamic sitemap is generated
$backendSitemapUrl = 'https://darkgreen-kudu-992852.hostingersite.com/sitemap.xml';

// Fetch the XML from the backend and print it
$xml = @file_get_contents($backendSitemapUrl);

if ($xml === false) {
    // Fallback if backend is unreachable
    header('HTTP/1.1 500 Internal Server Error');
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Could not load sitemap</error>';
    exit;
}

echo $xml;
?>
