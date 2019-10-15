<?php
/**
 * CHAT 2 desk
 */
$ch = curl_init();
$authorization = "Authorization: 21f98ba7e707576f8dcc5aadd2db6c";

curl_setopt($ch, CURLOPT_URL, "https://api.chat2desk.com.mx/v1/messages?limit=1");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', $authorization));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$result = curl_exec($ch);
curl_close($ch);

$array_result = json_decode($result, true);
$total_messages = $array_result['meta']['total'];
$total_without_limit = $total_messages - 180;

/*
* BUSCAR LOS ÚLTIMOS 200 MENSAJES
*/
$ch = curl_init();                                              //type=from_client&
curl_setopt($ch, CURLOPT_URL, "https://api.chat2desk.com.mx/v1/messages?offset=" . $total_without_limit . "&limit=200");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', $authorization));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$result = curl_exec($ch);
curl_close($ch);

$array_result = json_decode($result, true);
$array_messages = $array_result['data'];



$return_array['something'] = "Return something";

echo json_encode($array_messages);
