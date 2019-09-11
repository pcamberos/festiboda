Conekta.setPublicKey('key_Cr9LHy6J8qZrwK8qGfGA63g');

var conektaSuccessResponseHandler = function (token) {
  var $form = $("#card-form");
  $form.append($('<input type="hidden" name="conektaTokenId" id="conektaTokenId">').val(token.id));

  const data = new FormData();
  let fullc = '{';
  full_cotizador.map(function (value, index, array) {
    fullc = fullc + '"' + index + '":' + JSON.stringify(value)
    if (index < (full_cotizador.length - 1)) {
      fullc = fullc + ",";
    }
  });
  fullc = fullc + "}";

  const client_name = $("#client_name").val();
  const date = $("#date").val();
  const date_arr = date.split("/");

  data.append('full_cotizador', fullc);
  data.append('client_name', client_name);
  data.append('costoenvio', +tipos_envio[id_envio_selected].price);
  data.append('fecha_evento', date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]);
  data.append('envio_selected', envio_selected);
  data.append('price_envio_selected', tipos_envio[id_envio_selected].price);
  data.append('total', ($("#total_conenvio").text()).replace("$", ""));
  data.append('num_pagos', opcion_pago_selected);
  data.append('order_status', "Paid");
  data.append('envio_calle', $("#envio_calle").val());
  data.append('envio_numext', $("#envio_numext").val());
  data.append('envio_numint', $("#envio_numint").val());
  data.append('envio_cp', $("#envio_cp").val());
  data.append('envio_tel', $("#envio_tel").val());
  data.append('envio_cel', $("#envio_cel").val());
  data.append('envio_referencia', $("#envio_referencia").val());
  data.append('envio_municipio', $("#envio_municipio").val());
  data.append('envio_estado', $("#envio_estado").val());
  data.append('envio_pais', $("#envio_pais").val());

  fetch('executeOrder.php', {
      method: 'POST',
      body: data
    })
    .then(function (response) {
      console.log(response);
      return response.text();
      
    })
    .then(function (text) {
      console.log(text);
    })
    .catch(function (error) {
      console.log('Request failed', error)
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