//Conekta.setPublicKey('key_Cr9LHy6J8qZrwK8qGfGA63g');    //Testing Estrasol
Conekta.setPublicKey('key_I4YvzH6iyL6mFnwu2a7Uvpw');    //Testing Festiboda
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
  data.append('opcion_pago', opcion_pago_selected);
  data.append('num_pagos', num_pagos);
  data.append('order_status', "Paid");
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
      console.log(return_arr['1']);
      //var json_return = JSON.parse("{" + return_arr['1']);
      //$("#folio").text(json_return.folio);
      //folio_compra = json_return.folio;

      $(".next_button").prop('disabled', false);
      $(".next_button").text("Envíar y terminar.");
      $(".next_button").remove(".spinner-border");
      $(".next_button").remove(".sr-only");
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

const procesarDatosEnvio = () => {
  console.log("Procesar Datos de Envío");
  const data = new FormData();

  //const client_name = $("#client_name").val();
  //const date = $("#event_date").val();
  //const date_arr = date.split("/");
  //data.append('fecha_evento', date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]);
  //data.append('envio_selected', envio_selected);
  //data.append('num_pagos', opcion_pago_selected);
  //data.append('order_status', "Paid");
  const date = $("#event_date").val();
  const date_arr = date.split("/");

  let json_toOdoo = '{'
  + '"nombre_cliente":"' + $("#client_name").val() + '",'
  + '"correo_electronico":"' + $("#client_email").val() + '",'
  + '"tel":"' + $("#post_telefono").val() + '",'
  + '"street":"' + $("#post_calle").val() + '",'
  + '"nombre_contacto":"' + $("#post_nombre").val() + '",'
  + '"city":"' + $("#post_delegacion").val() + '",'
  + '"zip":"' + $("#post_cp").val() + '",'
  + '"state":"' + $("#post_estado").val() + '",'
  + '"country":"Mexico",'
  + '"RFC":"XAXX010101000",'
  + '"tipo_de_pago":"Tarjeta",'
  + '"no_pagos":"1pago",'
  + '"envio":"' + envio_selected + '",'
  + '"folio_web":"' + folio_compra + '",'
  + '"fecha_evento":"' + date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0] + '",'
  + '"generado_web":"true",';
  data.append('folio', folio_compra);  
  fetch('procesarDatosEnvio.php', {
    method: 'POST',
    body: data
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (resp) {
    json_toOdoo += '"lineas_productos":' + resp.line_products + '}';
    postData(json_toOdoo);
    console.warn("Json to ODOO:");
    console.log(json_toOdoo);
    $("#step_final").trigger("click");
    $(".next-step").hide();
  })
  .catch(function (error) {
    console.log('Request failed', error)
  });
};
const postData = (json_data) => {
  $.ajax({
      type: "POST",
      url: "odoo_ws.php",
      data: { 'data': json_data },
      success: function(msg) {
          console.log("record registered:");
      },
      error: function(xhr, errmsg, err) {
        console.warn(xhr.status);
      }
  });
}