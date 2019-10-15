//Conekta.setPublicKey('key_Cr9LHy6J8qZrwK8qGfGA63g');    //Testing Estrasol
Conekta.setPublicKey('key_I4YvzH6iyL6mFnwu2a7Uvpw'); //Testing Festiboda
//Conekta.setPublicKey('key_RArwRgiq2gvYyAJFaxgyAyQ');    // Producción Festiboda

var conektaSuccessResponseHandler = function(token) {
    var $form = $("#card-form");
    $form.append($('<input type="hidden" name="conektaTokenId" id="conektaTokenId">').val(token.id));

    const data = new FormData();
    let fullc = '{';
    full_cotizador.map(function(value, index, array) {
        fullc = fullc + '"' + index + '":' + JSON.stringify(value)
        if (index < (full_cotizador.length - 1)) {
            fullc = fullc + ",";
        }
    });
    fullc = fullc + "}";

    const client_name = $("#client_name").val();
    const date = $("#event_date").val();
    const date_arr = date.split("/");

    let email_address = "";
    let order_status = "";
    if (opcion_pago_selected == 'pago_credito' || opcion_pago_selected == 'pago_debito') {
        email_address = $("#card_client_email").val();
        order_status = "Pagado";
    } else {
        email_address = $("#oxxo_client_email").val();
        order_status = "Por Pagar";
    }

    data.append('full_cotizador', fullc);
    data.append('client_name', client_name);
    data.append('client_mail', email_address);
    data.append('fecha_evento', date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]);
    data.append('envio_selected', envio_selected);
    data.append('opcion_pago', opcion_pago_selected);
    data.append('num_pagos', num_pagos);
    data.append('order_status', order_status);
    data.append('token_venta', token.id);

    fetch('executeOrder.php', {
            method: 'POST',
            body: data
        })
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            console.log(text);
            var return_arr = text.split("{");
            var json_return = JSON.parse("{" + return_arr['1']);
            console.log(json_return);
            folio_compra = json_return.folio;
            if (json_return.type == 'pago_credito' || json_return.type == 'pago_debito') {
                $(".mu_gracias").show();
                $(".tu_pago").show();
                $(".folio_lbl").text("FOLIO:")
                $("#folio").text(json_return.folio);
                $(".proceder").text("Para proceder, favor de especificar tus datos de envío.");
            } else {
                $(".mu_gracias").hide();
                $(".tu_pago").hide();
                $(".folio_lbl").text("Número de referencia oxxo: ")
                $("#folio").text(json_return.reference);
                $(".proceder").text("Realizar su pago en oxxo con el número de referencia proporcionado.Se recomienda llenar los datos de envío para procerder una vez realizado el pago.");
            }


            $(".next_button").prop('disabled', false);
            $(".next_button").text("Envíar y terminar.");
            $(".next_button").remove(".spinner-border");
            $(".next_button").remove(".sr-only");
            $("#step_5").click();

        })
        .catch(function(error) {
            console.log('Request failed', error)
        });
};

var conektaErrorResponseHandler = function(response) {
    var $form = $("#card-form");
    $form.find(".card-errors").text(response.message_to_purchaser);
    $form.find("button").prop("disabled", false);
};

// jQuery para que genere el token después de dar click en submit
$(function() {
    $("#card-form").submit(function(event) {
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
    const date = $("#event_date").val();
    const date_arr = date.split("/");

    let email_address = "";
    if (opcion_pago_selected == 'pago_credito' || opcion_pago_selected == 'pago_debito') {
        email_address = $("#card_client_email").val();
    } else {
        email_address = $("#oxxo_client_email").val();
    }

    let json_toOdoo = '{' +
        '"nombre_cliente":"' + $("#client_name").val() + '",' +
        '"correo_electronico":"' + email_address + '",' +
        '"tel":"' + $("#post_telefono").val() + '",' +
        '"street":"' + $("#post_calle").val() + '",' +
        '"nombre_contacto":"' + $("#post_nombre").val() + '",' +
        '"city":"' + $("#post_delegacion").val() + '",' +
        '"zip":"' + $("#post_cp").val() + '",' +
        '"state":"' + $("#post_estado").val() + '",' +
        '"country":"Mexico",' +
        '"RFC":"XAXX010101000",' +
        '"tipo_de_pago":"Tarjeta",' +
        '"no_pagos":"1pago",' +
        '"envio":"' + envio_selected + '",' +
        '"folio_web":"' + folio_compra + '",' +
        '"fecha_evento":"' + date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0] + '",' +
        '"generado_web":"true",';
    data.append('folio', folio_compra);

    data.append('nombre', $("#post_nombre").val());
    data.append('cp', $("#post_cp").val());
    data.append('pais', $("#post_pais").text());
    data.append('estado', $("#post_estado").text());
    data.append('ciudad', $("#post_delegacion").val());
    data.append('colonia', $("#post_colonia").val());
    data.append('calle', $("#post_calle").val());
    data.append('exterior', $("#post_exterior").val());
    data.append('interior', $("#post_interior").val());
    data.append('calle1', $("#post_calle1").val());
    data.append('calle2', $("#post_calle2").val());
    data.append('referencia', $("#post_referencias").val());
    data.append('telefono', $("#post_telefono").val());
    data.append('trabajo', $('input:radio[name=trabajo]:checked').val());
    fetch('procesarDatosEnvio.php', {
            method: 'POST',
            body: data
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(resp) {
            json_toOdoo += '"lineas_productos":' + resp.line_products + '}';
            postData(json_toOdoo);
            $("#step_final").trigger("click");
            $(".next-step").hide();
        })
        .catch(function(error) {
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