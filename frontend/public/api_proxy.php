<?php
// Target backend API base URL
$backendBaseUrl = 'https://darkgreen-kudu-992852.hostingersite.com/api/';

// Get the requested API path from the URL
$apiPath = isset($_GET['path']) ? $_GET['path'] : '';

// Build the full target URL
$targetUrl = $backendBaseUrl . $apiPath;

// Append query strings if they exist (excluding the 'path' parameter used by .htaccess)
$queryString = $_SERVER['QUERY_STRING'];
$queryStringParts = array();
parse_str($queryString, $queryStringParts);
unset($queryStringParts['path']);
$newQueryString = http_build_query($queryStringParts);
if (!empty($newQueryString)) {
    $targetUrl .= '?' . $newQueryString;
}

// Initialize cURL
$ch = curl_init($targetUrl);

// Forward the request method
$requestMethod = $_SERVER['REQUEST_METHOD'];
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod);

// Forward the request body for POST/PUT/PATCH
if ($requestMethod === 'POST' || $requestMethod === 'PUT' || $requestMethod === 'PATCH') {
    $requestBody = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
}

// Polyfill for getallheaders() on Nginx/PHP-FPM if necessary
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            } else if ($name == "CONTENT_TYPE") {
                $headers["Content-Type"] = $value;
            } else if ($name == "CONTENT_LENGTH") {
                $headers["Content-Length"] = $value;
            }
        }
        return $headers;
    }
}

// Forward request headers
$headers = array();
foreach (getallheaders() as $name => $value) {
    // Ignore headers that cause routing conflicts or are handled by cURL
    $nameLower = strtolower($name);
    if ($nameLower !== 'host' && $nameLower !== 'content-length' && $nameLower !== 'accept-encoding') {
        $headers[] = $name . ': ' . $value;
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Configure cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true); // We need headers to forward them back
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Prevent SSL verification issues on shared hosting
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute the request
$response = curl_exec($ch);

// Handle cURL errors
if (curl_errno($ch)) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('error' => 'Proxy Error: ' . curl_error($ch)));
    curl_close($ch);
    exit;
}

// Separate headers and body from the response
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

// Forward the HTTP status code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
http_response_code($httpCode);

curl_close($ch);

// Forward response headers back to the client
$headersArray = explode("\r\n", $responseHeaders);
foreach ($headersArray as $header) {
    if (!empty($header) && !preg_match('/^Transfer-Encoding:/i', $header)) {
        header($header, false); // Set false to allow multiple headers with the same name (like Set-Cookie)
    }
}

// Output the response body
echo $responseBody;
?>
