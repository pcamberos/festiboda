let products = new Array;
let tipos_envio = new Array;
let full_cotizador = new Array;
let cotizador_totals = new Array;
let opciones_pagos = new Array;
let current_step_id = "";
let togo_step_id = "";
let envio_selected;
let id_envio_selected;
let opcion_pago_selected;

$(document).ready(function() {
    subtotal = 0;

    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    //Wizard    
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function(e) {
        var $active = $('.nav-tabs li>a.active');
        $active.parent().next().removeClass('disabled');
        nextTab($active);
    });

    $(".prev-step").click(function(e) {
        var $active = $('.nav-tabs li>a.active');
        prevTab($active);
    });

    $(".prev_button").hide();

    $(".opcion_pago").click(function(e) {
        let id_pago = $(this).find(".monto_pago").attr("id");
        opcion_pago_selected = id_pago.replace("monto_pago_", "");
        console.log(id_pago);
    });

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

    cotizador_totals[0] = 0;
    cotizador_totals[1] = 0;
    cotizador_totals[2] = 0;
    cotizador_totals[3] = 0;

    envio_selected = "";

    fetch('getProducts.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            products = myJson;
            $.each(myJson, function(index, item) {
                $("#cotizador p").append('<div class=" product_line row mb-3"> ' +
                    '    <div class="col-3 col-md-2 pl-2 pl-md-0"> ' +
                    '    <input type="number" min="0" value="0" onchange="calcularResultado(this);"  ' + // TESTING "VALOR 0"
                    '    id="cantidad_' + index + '" class="cantidad" ' +
                    '       /> ' +
                    '    </div> ' +
                    '    <div class="col-9 col-md-4"> ' +
                    '    <div onclick="myFunction(this,' + index + ')"> ' + item.name + '<i class="fa fa-sort-desc rotate-icon float-right d-block d-md-none"></i> </div> ' +
                    '    </div> ' +
                    '    <div class="col-6 col-md-3 text-md-right d-none d-md-block contenido' + index + '"> ' +
                    '    <div class="precio"><div class="mt-2 d-none d-md-none contenido' + index + '">Precio unitario</div> $' + item.unit_price + ' </div> ' +
                    '    </div> ' +
                    '    <div class="col-6 col-md-3 text-md-right d-none d-md-block contenido' + index + '">' +
                    '    <div class="mt-2 d-none d-md-none contenido' + index + '">Total</div><div class="resultado"> $0 </div>' +
                    '    </div> ' +
                    '</div>');
                var cotizador_line = {
                    productname: item.name,
                    quantity: 0,
                    unitprice: +item.unit_price
                }
                full_cotizador.push(cotizador_line);
            });

            $("#cotizador").append('<div class="subtotal row " > ' +
                '<div class="d-inline-flex"> SUBTOTAL:&nbsp;</div> ' +
                '<div class="total d-inline-flex pr-1 pr-md-3" style="font-weight: bold;"> $0 </div> ' +
                '</div>');
        });

    fetch('getTiposEnvio.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            tipos_envio = myJson;

            $.each(tipos_envio, function(index, item) {
                $("#tipos_envios tbody tr td").append(
                    '<div class="radio">' +
                    '    <label><input type="radio" onclick="gettipoenvio(this)" id="envio_' + index + '" name="tipoenvradio"> ' + item.name + ' (' + item.dias_habiles + ' DÍAS ' +
                    '        HÁBILES) $' + item.price + ' ' +
                    '    </label> ' +
                    '</div> '
                );
                //tipos_envio[item.keyword] = item.price;
            });

            $("#tipos_envios tbody tr td").append(
                ' <div class="total_cenv" style="margin-top:30px; margin-left:350px;">' +
                '    TOTAL: <span id="total_conenvio" style="margin-left:50px; font-weight: bold;"> $0 </span>' +
                '</div> '
            );

        });


    /*setTimeout(() => {
        testingInit()
    }, 1000);*/

});

const testingInit = () => {
    $("#cantidad_0").trigger("change"); // TESTING
    $("#cantidad_1").trigger("change"); // TESTING
    $("#cantidad_2").trigger("change"); // TESTING
    $("#cantidad_3").trigger("change"); // TESTING
    gettipoenvio($("#envio_1"));
    $("#opcion_pago_1").prop("checked", true);
    opcion_pago_selected = "1";
    console.warn("End to testing Init!");
}

function nextTab(elem) {
    current_step_id = $(elem).attr("id");
    togo_step_id = $(elem).parent().next().find('a[data-toggle="tab"]').attr("id");

    if (validate_next(current_step_id)) {
        $(elem).parent().next().find('a[data-toggle="tab"]').click();

        if (togo_step_id == 'step_2') {
            $(".prev_button").show();
            var split_date = ($("#date").val()).split("/");
            const date1 = new Date();
            const date2 = new Date(split_date['1'] + "/" + split_date['0'] + "/" + split_date['2']);
            let dif_intime = date2.getTime() - date1.getTime();
            let dif_indays = parseInt(dif_intime / (1000 * 3600 * 24));

            var cont_envios = 0;
            $.each(tipos_envio, function(index, item) {
                if (dif_indays < item.dias_habiles) {
                    $("#envio_" + index).parent().parent().hide();
                } else {
                    $("#envio_" + index).parent().parent().show();
                    cont_envios++;
                }

            });

            if (cont_envios == 0) {
                $(".tiposenvio_text").text("LO SENTIMOS. NO ES POSIBLE REALIZAR ENVÍO EN UNA FECHA TAN CERCANA.")
            } else if (cont_envios == 1) {
                $(".tiposenvio_text").text("TENEMOS PARA TI EL SIGUIENTE TIPO DE ENVÍO:")
            } else {
                $(".tiposenvio_text").text(" TENEMOS PARA TI " + cont_envios + " TIPOS DE ENVÍO:  ")
            }
        }

        if (togo_step_id == 'step_4') {
            $(".next_button").text("Realizar Pago");
        }


        if (togo_step_id == 'step_5') {
            $(".next_button").hide();
            $("#book").animate({
                opacity: 0.25,
                left: "+=50",
                height: "toggle"
            }, 5000, function() {
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

    if (togo_step_id == 'step_3') {
        $(".next_button").text("Siguiente");
    }

    if (togo_step_id == 'step_4') {
        $(".next_button").show();
    }
}

function calcularResultado(input) {
    var valor = $(input).val();
    if (valor == "")
        $(input).val("0");
    var clase = $(input).attr("id");
    var clase_arr = clase.split("_");
    var indice = clase_arr[1];
    var precio = products[indice].unit_price;
    var total_prod = valor * precio;
    full_cotizador[indice].quantity = +valor;
    $(input).parent().parent().find(".resultado").text("$" + total_prod);
    cotizador_totals[indice] = total_prod;

    var subtotal = 0;
    $.each(cotizador_totals, function(index, item) {
        subtotal += item;
    });

    $(".total").text("$" + subtotal);
    var total = subtotal
    if (id_envio_selected)
        var total = +total + +tipos_envio[id_envio_selected].price;


    $("#total_conenvio").text("$" + total)
    generar_opciones_pago(total);

    /* console.warn("Full Cotizador..");
     console.log(full_cotizador);*/
}

const gettipoenvio = (input_radio) => {
    var id_input = $(input_radio).attr("id");
    id_envio_selected = id_input.split('_')[1];
    envio_selected = tipos_envio[id_envio_selected].keyword;

    var text = $(".total").text();
    var total = text.replace("$", '');

    total = +total + +tipos_envio[id_envio_selected].price;
    $("#total_conenvio").text("$" + total)
    generar_opciones_pago(total);
}

/*$('#envio_normal, #envio_express, #envio_internacional').click(function () {
    var text = $(".total").text();
    var total = text.replace("$", '');

    var id = $(this).attr('id');
    envio_selected = id.split('_')[1];
    console.log("Envío selected: " + envio_selected);

    if ($("#envio_normal").is(':checked')) {
        total = +total + 300;
    } else if ($("#envio_express").is(':checked')) {
        total = +total + 1000;
    } else if ($("#envio_internacional").is(':checked')) {
        total = +total + 5000;
    }

    $("#total_conenvio").text("$" + total)
    generar_opciones_pago(total);
});
*/

function generar_opciones_pago(total) {
    opciones_pagos[0] = (+total);
    opciones_pagos[1] = ((+total) * 1.2) / 3;
    opciones_pagos[2] = ((+total) * 1.3) / 6;
    opciones_pagos[3] = ((+total) * 1.4) / 9;
    opciones_pagos[4] = ((+total) * 1.5) / 12;

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
            $('.alert').text("");
            $('#client_name').removeClass('is-invalid');
            $('#client_email').removeClass('is-invalid');
            $('#date').removeClass('is-invalid');

            if ($("#client_name").val() != "" && $("#date").val() != "" && $("#client_email").val() != "") {
                ready_togo = true;
                $('.alert').hide();
            } else {
                $('.alert').append("Favor de llenar los campos correspondientes.")
                $('.alert').fadeIn("slow", function () {});

                if ($("#client_name").val() == "")
                    $('#client_name').addClass('is-invalid');

                if ($("#client_email").val() == "") 
                    $('#client_email').addClass('is-invalid');

                if ($("#date").val() == "")
                    $('#date').addClass('is-invalid');

                //<span class="invalid-feedback" role="alert"><strong>mensaje de error</strong></span>
            }

            break;
        case 'step_2':
            $('.alert').text("");
            let cot_validado = validate_cotizador();
            let cot_tipoenvio = (envio_selected != null && envio_selected != "");
            if (cot_validado && cot_tipoenvio) {
                ready_togo = true;
                $('.alert').hide();
            } else {
                if (!cot_validado)
                    $('.alert').append("Es necesario seleccionar por lo menos un producto.</br>")
                if (!cot_tipoenvio)
                    $('.alert').append("No se ha especificado ningun tipo de envío.</br>")
                $('.alert').fadeIn("slow", function () {});
            }
            break;
        case 'step_3':
            $('.alert').text("");
            let opcionpago_validado = (opcion_pago_selected != null && opcion_pago_selected != "");
            if (opcionpago_validado) {
                ready_togo = true;
                $('.alert').hide();
            } else {
                $('.alert').append("No se ha especificado opción de pago.</br>");
                $('.alert').fadeIn("slow", function () {});
            }
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
    $("#cotizador p").each(function() {
        var tr_line = this;
        console.log($(tr_line).find('.cantidad').val());
        if ($(tr_line).find('.cantidad').val() > 0) {
            ready_togo = true;
        }
    });
    return ready_togo;
}

function myFunction(valor, contenido) {
    if ($(valor).find('.fa').hasClass('fa-sort-desc')) {
        $(".contenido" + contenido).removeClass('d-none');
        $(valor).find('.fa').removeClass('fa-sort-desc');
        $(valor).find('.fa').addClass('fa-sort-asc');
    } else {
        $(".contenido" + contenido).addClass('d-none');
        $(valor).find('.fa').addClass('fa-sort-desc');
        $(valor).find('.fa').removeClass('fa-sort-asc');
    }
}