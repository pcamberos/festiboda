<?php
$log_file = "logfilename.log";
ini_set("log_errors", 1);
ini_set("error_log", $log_file);
ini_set("log_errors", TRUE);
require_once('Ripcord/ripcord.php');

$server_url = 'https://festiboda-m1-607527.dev.odoo.com';
$db_name = 'festiboda-m1-607527';
$username = 'eacosta@estrasol.com.mx';
$password = 'estrasol.';
$answer="ok";

$data=$_POST['data'];
$saleOrder_lines = '{
  "nombre_cliente":"Pablo Camberos",
  "correo_electronico":"juan.camberos@estrasol.com.mx",
  "tel":"3345784512",
  "street":"Mexicaltzingo",
  "nombre_contacto":"Andrea Juarez","city":"Zapopan","zip":"12312","state":"Jalisco","country":"Mexico","RFC":"XAXX010101000","tipo_de_pago":"Tarjeta","no_pagos":"1pago","envio":"normal","folio_web":"V0000057","fecha_evento":"2019-10-31","generado_web":"true","lineas_productos":{"1":["Mandil",4,9.00,"Sometext"],"2":["Kit",1,6.00,"Sometext"],"3":["Letrero",2,250.00,"Sometext"],"4":["Sandalias",25,16.00,"Sometext"]}}';
$saleOrder_lines=json_decode($saleOrder_lines/*$data*/,true);

try {
  insertarRegistro($server_url,$db_name,$username,$password,$saleOrder_lines);
  $answer="Registro en Odoo Exitoso";
  } catch (Exception $e) {
    error_log("Error : ".$e); 
    $answer="Registro en Odoo Fallido";
  }

echo json_encode($answer);

function insertarRegistro($server_url,$db_name,$username,$password,$saleOrder_lines){
  error_log("Validando si pasan los datos: ".$saleOrder_lines['nombre_cliente']);
  $common = ripcord::client($server_url.'/xmlrpc/2/common');
  $uid = $common->authenticate($db_name, $username, $password, array());
  $models = ripcord::client("https://festiboda-m1-607527.dev.odoo.com/xmlrpc/2/object");  
  $partner = $models->execute_kw($db_name,$uid,$password,'res.partner',
      'create',
      array(
        array(
          'name'=> $saleOrder_lines['nombre_cliente'],
          'email'=>$saleOrder_lines['correo_electronico'],
          'phone'=>$saleOrder_lines['tel'],
          'street'=>$saleOrder_lines['street'],
          'city'=>$saleOrder_lines['city'],
          'zip'=>$saleOrder_lines['zip'],
          'state_id'=>getState($db_name,$uid,$password,$saleOrder_lines['state'],$models),
          'country_id'=>getCountry($db_name,$uid,$password,$saleOrder_lines['country'],$models),
          'NIF'=>$saleOrder_lines['RFC'],
          'x_studio_generado_web'=> True,
          'lang'=>'es_MX',
          'comment'=>"Cliente registrado mediante la plataforma web de Festiboda",
          'user_id'=>1
        )
        )
  );
  $partners_address = $models->execute_kw($db_name,$uid,$password,'res.partner',
      'create',
      array(
        array(
          'name'=> $saleOrder_lines['nombre_contacto'],
          'email'=>$saleOrder_lines['correo_electronico'],
          'phone'=>$saleOrder_lines['tel'],
          'street'=>$saleOrder_lines['street'],
          'city'=>$saleOrder_lines['city'],
          'zip'=>$saleOrder_lines['zip'],
          'state_id'=>getState($db_name,$uid,$password,$saleOrder_lines['state'],$models),
          'country_id'=>getCountry($db_name,$uid,$password,$saleOrder_lines['country'],$models),
          'x_studio_generado_web'=> True,
          'type'=>'delivery',
          'comment'=>"Dirección registrada en la orden de pedido registrada mediante la plataforma web de Festiboda",
          'parent_id'=>$partner
        )
        )
  );
  $objDateTime = date("d-m-Y");
  $partner_saleOrder = $models->execute_kw($db_name,$uid,$password,'sale.order',
      'create',
      array(
        array(
          'partner_id'=> $partner,
          'validity_date'=>$objDateTime,
          'x_studio_folio_web'=>$saleOrder_lines['folio_web'],
          'x_studio_tipo_de_pago'=>getTipoPago($saleOrder_lines['tipo_de_pago']),
          'x_studio_no_pagos'=>getNumeroPagos($saleOrder_lines['no_pagos']),
          'x_studio_envio'=>getTipoEnvio($saleOrder_lines['envio']),
          'x_studio_fecha_de_evento'=>$saleOrder_lines['fecha_evento'],
          'x_studio_es_web'=>True,
          'origin'=>$saleOrder_lines['folio_web'],
          'campaign_id'=>6,
          'medium_id'=>10,
          'source_id'=>6,
          'state'=>"sale",
          'confirmation_date'=>$objDateTime
        )
        )
  );
  setOrderLines($db_name,$uid,$password,$saleOrder_lines['lineas_productos'],$models,$partner_saleOrder);
}
function setOrderLines($db_name,$uid,$password,$lineas,$models,$partner_saleOrder){
  foreach($lineas as $a){
    $counter=0;
    foreach($a as $v){
      $counter++;
      $counterII=0;
      if($counter==1){
        $product_data=$models->execute_kw($db_name, $uid, $password,'product.product', 'search_read',
        array(
          array(
            array('x_studio_referencia_web', '=', $v )
          )
        ),array('fields'=>array('id','name','list_price','description'),'limit'=>1));
      }else if($counter==2){
        $qty=$v;
      }else if($counter==3){
        $web_price=$v;
      }else if($counter==4){
        $web_description=$v;
      }
    }
    foreach($product_data as $prodData){
      foreach($prodData as $productField){
        $counterII++;
        if($counterII==1){
          $prodID=$productField;
        }else if($counterII==2){
          $prodName=$productField;
        }else if($counterII==3){
          $prodPrice=$productField;
        }else if($counterII==4){
          $prodDesc=$productField;
        }
      }
    }

    $order_line = $models->execute_kw($db_name,$uid,$password,'sale.order.line','create',
        array(
          array(
            'order_id'=>$partner_saleOrder,
						'product_id'=>$prodID,
						'name'=>$prodName,
						'product_uom_qty'=>$qty,
						'price_unit'=>$web_price,
						'x_studio_properties'=>$web_description,
						'price_subtotal'=>$web_price*$qty,
						'price_total'=>$web_price*$qty
          )
        )
    );
  }
}
function getTipoEnvio($tipoEnvioRaw){
  $tipoEnvio=null;
  switch($tipoEnvioRaw){
    case "internacional":$tipoEnvio="Envío Internacional";break;
    case "express":$tipoEnvio="Envío Express";break;
    case "normal":$tipoEnvio="Envío Normal";break;
    default:$tipoEnvio=$tipoEnvioRaw;
  }
  return $tipoEnvio;
}

function getNumeroPagos($noPagosRaw){
  $noPagos=null;
  switch($noPagosRaw){
    case "1pago":$noPagos="1 Pago";break;
    case "3pagos":$noPagos="3 Pagos";break;
    case "6pagos":$noPagos="6 Pagos";break;
    case "9pagos":$noPagos="9 Pagos";break;
    case "12pagos":$noPagos="12 Pagos";break;
    default:$noPagos=$noPagosRaw;
  }
  return $noPagos;
}
function getTipoPago($tipoPagoRaw){
  $tipoPago=null;
  switch($tipoPagoRaw){
    case "Tarjeta":$tipoPago="Tarjeta";break;
    default:$tipoPago=$tipoPagoRaw;
  }
  return $tipoPago;
}

function getCountry($db_name,$uid,$password,$countryName,$models){
  error_log("Processing country ID for:".$countryName);
  if($countryName !== null && $countryName !== ""){
    $countryId=$models->execute_kw($db_name, $uid, $password,'res.country', 'search_read',
    array(
      array(
        array('name', '=', $countryName )
      )
      ),
    array('fields'=>array('id'),'limit'=>1));
    foreach($countryId as $a){
      foreach($a as $v){
        $countryId=$v;
      }
    }
  }else{
    $countryId="";
  }
  return $countryId;
}
function getState($db_name,$uid,$password,$stateName,$models){
  error_log("Processing state ID for:".$stateName);
  if($stateName !== null && $stateName !== ""){
    $stateId=$models->execute_kw($db_name, $uid, $password,'res.country.state', 'search_read',
    array(
      array(
        array('name', '=', $stateName )
      )
      ),
    array('fields'=>array('id'),'limit'=>1));
    foreach($stateId as $a){
      foreach($a as $v){
        $stateId=$v;
      }
    }
  }else{
    $stateId="";
  }
  return $stateId;
}