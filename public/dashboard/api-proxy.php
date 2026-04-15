<?php
/**
 * Jeff Cline Agency Dashboard - DataForSEO API Proxy
 * Solves CORS by routing browser requests through your own server.
 * 
 * Test this file: visit https://jeff-cline.com/dashboard/api-proxy.php in browser
 * Should show: {"status":"ok","message":"Jeff Cline API Proxy is running"}
 */

// Error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't output PHP errors as HTML

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Health check - GET request shows proxy is alive
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'ok',
        'message' => 'Jeff Cline API Proxy is running',
        'php_version' => phpversion(),
        'curl_available' => function_exists('curl_init')
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status_code' => 40500, 'status_message' => 'POST method required']);
    exit;
}

// Read raw POST body
$rawInput = file_get_contents('php://input');

if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['status_code' => 40000, 'status_message' => 'Empty request body']);
    exit;
}

$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['status_code' => 40001, 'status_message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

if (!isset($input['endpoint']) || !isset($input['auth'])) {
    http_response_code(400);
    echo json_encode(['status_code' => 40002, 'status_message' => 'Missing endpoint or auth parameter']);
    exit;
}

// Check cURL is available
if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['status_code' => 50001, 'status_message' => 'cURL not available on this server. Contact your hosting provider.']);
    exit;
}

$endpoint = $input['endpoint'];
$auth = $input['auth'];
$body = isset($input['body']) ? $input['body'] : null;

// Ensure endpoint starts with /
if (strpos($endpoint, '/') !== 0) {
    $endpoint = '/' . $endpoint;
}

$url = 'https://api.dataforseo.com/v3' . $endpoint;

// Build cURL request
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$headers = array(
    'Authorization: ' . $auth,
    'Content-Type: application/json'
);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

if ($body !== null && $body !== 'null') {
    $jsonBody = json_encode($body);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonBody);
} else {
    curl_setopt($ch, CURLOPT_HTTPGET, true);
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);
curl_close($ch);

// Handle cURL errors
if ($curlErrno !== 0) {
    http_response_code(502);
    echo json_encode([
        'status_code' => 50200,
        'status_message' => 'Proxy cURL error: ' . $curlError . ' (code: ' . $curlErrno . ')'
    ]);
    exit;
}

// Handle empty response
if (empty($response)) {
    http_response_code(502);
    echo json_encode([
        'status_code' => 50201,
        'status_message' => 'Empty response from DataForSEO API (HTTP ' . $httpCode . ')'
    ]);
    exit;
}

// Verify response is valid JSON
$testJson = json_decode($response);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(502);
    echo json_encode([
        'status_code' => 50202,
        'status_message' => 'DataForSEO returned invalid JSON (HTTP ' . $httpCode . ')',
        'raw_preview' => substr($response, 0, 200)
    ]);
    exit;
}

// Success - pass through the response
http_response_code($httpCode);
echo $response;
