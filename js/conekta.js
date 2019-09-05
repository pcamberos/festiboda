Conekta.setPublicKey('key_Cr9LHy6J8qZrwK8qGfGA63g');

var conektaSuccessResponseHandler = function (token) {
  var $form = $("#card-form");
  // Inserta el token_id en la forma para que se envíe al servidor
  $form.append($('<input type="hidden" name="conektaTokenId" id="conektaTokenId">').val(token.id));
  //$form.get(0).submit(); // Hace submit

  const data = new FormData();
  let fullc = '{';
  full_cotizador.map(function (value, index, array) {
    fullc = fullc + '"' + index + '":' + JSON.stringify(value)
    if (index < (full_cotizador.length - 1)) {
      fullc = fullc + ",";
    }
  });
  fullc = fullc + "}";

  let client_name = $("#client_name").val();
  console.log("ClientName: " + client_name);

  data.append('full_cotizador', fullc);
  data.append('client_name', client_name);
  data.append('costoenvio', +tipos_envio[id_envio_selected].price);
  fetch('payConekta.php', {
      method: 'POST',
      body: data
    })
    .then(function (response) {
      if (response.ok) {
        return response.text()
      } else {
        throw "Error en la llamada Ajax";
      }

    })
    .then(function (texto) {
        console.warn("LISTO PARA GUARDAR LA ORDEN EN BD Y GENERAR FOLIO!");
        let date_fieldvalue = $("#date").val();
        date_arr = date_fieldvalue.split("/");
        //alert(date_arr);

        const order_data = new FormData();
        order_data.append('client_name', client_name);
        order_data.append('fecha_evento', date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]);
        order_data.append('envio_selected', envio_selected);
        order_data.append('price_envio_selected', tipos_envio[id_envio_selected].price);
        order_data.append('total', ($("#total_conenvio").text()).replace("$","") );
        order_data.append('num_pagos',  opcion_pago_selected);
        order_data.append('order_status', "Paid" );
        order_data.append('envio_calle', $("#envio_calle").val());
        order_data.append('envio_numext', $("#envio_numext").val());
        order_data.append('envio_numint', $("#envio_numint").val());
        order_data.append('envio_cp', $("#envio_cp").val());
        order_data.append('envio_tel', $("#envio_tel").val());
        order_data.append('envio_cel', $("#envio_cel").val());
        order_data.append('envio_referencia', $("#envio_referencia").val());
        order_data.append('envio_municipio', $("#envio_municipio").val());
        order_data.append('envio_estado', $("#envio_estado").val());
        order_data.append('envio_pais', $("#envio_pais").val());

        fetch('saveOrder.php', {
            method: 'POST',
            body: order_data
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (myJson) {
            console.log(myJson);
          });

      })
      .catch(function (err) {
        console.log(err);
      });

    };

var conektaErrorResponseHandler = function (response) {
  var $form = $("#card-form");
  $form.find(".card-errors").text(response.message_to_purchaser);
  $form.find("button").prop("disabled", false);
};

// jQuery para que genere el token después de dar click en submit
$(function () {
  $("#card-form").submit(function (event) {
    var $form = $(this);
    // Previene hacer submit más de una vez
    $form.find("button").prop("disabled", true);
    Conekta.Token.create($form, conektaSuccessResponseHandler, conektaErrorResponseHandler);
    return false;
  });
});