Conekta.setPublicKey('key_Cr9LHy6J8qZrwK8qGfGA63g');    //Testing Estrasol
//Conekta.setPublicKey('key_I4YvzH6iyL6mFnwu2a7Uvpw');    //Testing Festiboda
//Conekta.setPublicKey('key_RArwRgiq2gvYyAJFaxgyAyQ');    // Producción Festiboda

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
  const date = $("#event_date").val();
  const date_arr = date.split("/");

  data.append('full_cotizador', fullc);
  data.append('client_name', client_name);
  data.append('client_mail', $("#client_email").val());
  data.append('fecha_evento', date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]);
  data.append('envio_selected', envio_selected);
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
  data.append('token_venta',token.id);

  fetch('executeOrder.php', {
      method: 'POST',
      body: data
    })
    .then(function (response) {
      return response.text();
      
    })
    .then(function (text) {
      var return_arr = text.split("{");
      var json_return = JSON.parse("{" + return_arr['1']);
      console.warn("Json return:");
      console.log(json_return);
      $("#folio").text(+json_return.folio);
      $(".next_button").hide();
      $("#step_5").click();

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

const triggerForm = () => {
  $("#card-form").trigger("submit");
}