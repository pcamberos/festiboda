var products = new Array;
var cotizador_totals = new Array;
var opciones_pagos = new Array;
var current_step_id = "";
var togo_step_id = "";
var dias_envios = new Array;
var envio_selected;

$(document).ready(function () {
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();

    //Wizard    
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.nav-tabs li>a.active');
        $active.parent().next().removeClass('disabled');
        nextTab($active);

    });

    $(".prev-step").click(function (e) {
        var $active = $('.nav-tabs li>a.active');
        prevTab($active);

    });

    $(".prev_button").hide();


    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var d = new Date();
    var options = {
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
        startDate: '-0d'
    };
    date_input.datepicker(options);

    products[0] = 17;
    products[1] = 9;
    products[2] = 9;
    products[3] = 240;

    cotizador_totals[0] = 0;
    cotizador_totals[1] = 0;
    cotizador_totals[2] = 0;
    cotizador_totals[3] = 0;

    dias_envios['normal'] = 30;
    dias_envios['express'] = 15;
    dias_envios['internacional'] = 50;

    $(".cantidad").live("change", function () {
        console.log("Cantidad change");
        var valor = $(this).val();
    });

    envio_selected = "";


});

function nextTab(elem) {
    current_step_id = $(elem).attr("id");
    togo_step_id = $(elem).parent().next().find('a[data-toggle="tab"]').attr("id");

    if (validate_next(current_step_id)) {
        $(elem).parent().next().find('a[data-toggle="tab"]').click();
        console.log("Validate NEXT");

        if (togo_step_id == 'step_2') {
            $(".prev_button").show();
            var split_date = ($("#date").val()).split("/");
            const date1 = new Date();
            const date2 = new Date(split_date['1'] + "/" + split_date['0'] + "/" + split_date['2']);
            let dif_intime = date2.getTime() - date1.getTime();
            let dif_indays = parseInt(dif_intime / (1000 * 3600 * 24));

            var cont_envios = 0;
            if (dif_indays < dias_envios['express']) {
                $("#envio_express").parent().parent().hide();
            } else {
                $("#envio_express").parent().parent().show();
                cont_envios++;
            }
            if (dif_indays < dias_envios['normal']) {
                $("#envio_normal").parent().parent().hide();
            } else {
                $("#envio_normal").parent().parent().show();
                cont_envios++;
            }
            if (dif_indays < dias_envios['internacional']) {
                $("#envio_internacional").parent().parent().hide();
            } else {
                $("#envio_internacional").parent().parent().show();
                cont_envios++;
            }

            if (cont_envios == 0) {
                $(".tiposenvio_text").text("LO SENTIMOS. NO ES POSIBLE REALIZAR ENVÍO EN UNA FECHA TAN CERCANA.")
            } else if (cont_envios == 1) {
                $(".tiposenvio_text").text("TENEMOS PARA TI EL SIGUIENTE TIPO DE ENVÍO:")
            } else {
                $(".tiposenvio_text").text(" TENEMOS PARA TI " + cont_envios + " TIPOS DE ENVÍO:  ")
            }
        }

        if (togo_step_id == 'step_5') {
            $(".next_button").hide();
            $("#book").animate({
                opacity: 0.25,
                left: "+=50",
                height: "toggle"
            }, 5000, function () {
                // Animation complete.
            });
        }

    } else {
        //alert("Favor de llenar el formulario.");
    }
}


function prevTab(elem) {
    togo_step_id = $(elem).parent().prev().find('a[data-toggle="tab"]').attr("id");
    $(elem).parent().prev().find('a[data-toggle="tab"]').click();


    if (togo_step_id == 'step_1') {
        $(".prev_button").hide();
    }

    if (togo_step_id == 'step_4') {
        $(".next_button").show();
    }
}

function calcularResultado(input) {
    var valor = $(input).val();
    if(valor=="")
    $(input).val("0");
    var clase = $(input).attr("id");
    var clase_arr = clase.split("_");
    var indice = clase_arr[1];
    var precio = products[indice];
    var total_prod = valor * precio;
    $(input).parent().parent().find(".resultado").text("$" + total_prod);
    cotizador_totals[indice] = total_prod;

    var subtotal = 0;
    $.each(cotizador_totals, function (index, item) {
        subtotal += item;
    });
    $(input).parent().parent().parent().find(".total").text("$" + subtotal);

    var total = subtotal;
    if ($("#envio_normal").is(':checked')) {
        total = total + 300;
    } else if ($("#envio_express").is(':checked')) {
        total = total + 1000;
    }

    $("#total_conenvio").text("$" + total)
    generar_opciones_pago(total);
}

$('#envio_normal, #envio_express, #envio_internacional').click(function () {
    var text = $(".total").text();
    var total = text.replace("$", '');

    var id = $(this).attr('id');
    envio_selected = id.split('_')[1];
    console.log("Envío selected: " + envio_selected);

    if ($("#envio_normal").is(':checked')) {
        total = +total + 300;
    } else if ($("#envio_express").is(':checked')) {
        total = +total + 1000;
    }else if ($("#envio_internacional").is(':checked')) {
        total = +total + 5000;
    }
    
    $("#total_conenvio").text("$" + total)
    generar_opciones_pago(total);
});

function generar_opciones_pago(total) {
    opciones_pagos[0] = (+total);
    opciones_pagos[1] = ((+total)*1.2) / 3;
    opciones_pagos[2] = ((+total)*1.3) / 6;
    opciones_pagos[3] = ((+total)*1.4) / 9;
    opciones_pagos[4] = ((+total)*1.5) / 12;

    $("#monto_pago_1").text("$" + opciones_pagos[0].toFixed(2));
    $("#monto_pago_3").text("$" + opciones_pagos[1].toFixed(2));
    $("#monto_pago_6").text("$" + opciones_pagos[2].toFixed(2));
    $("#monto_pago_9").text("$" + opciones_pagos[3].toFixed(2));
    $("#monto_pago_12").text("$" + opciones_pagos[4].toFixed(2));
}

const validate_next = (step) => {
    let ready_togo = false;

    switch (step) {
        case 'step_1':
            if ($("#client_name").val() != "" && $("#date").val() != "") {
                ready_togo = true;
            } else {
                alert("Favor de llenar el formulario.");
            }
            break;
        case 'step_2':
            ready_togo = (validate_cotizador() && (envio_selected != null) );
            console.log(envio_selected);
            if(!ready_togo){
                alert("Favor de seleccionar tanto productos como opción de envío. Gracias.");
            }
            break;
        case 'step_3':
            break;
        case 'step_4':
            break;
        case 'step_5':
            break;

    }
    return ready_togo;
}


const validate_cotizador = () => {
    let ready_togo = false;

    $("#cotizador > tbody > tr").each(function () {
        var tr_line = this;
        if ($(tr_line).attr("class") == 'product_line') {
            console.log($(tr_line).find('.cantidad').val());
            if( $(tr_line).find('.cantidad').val() > 0 ){
                ready_togo = true;
            }            
        }
    });
    return ready_togo;
}