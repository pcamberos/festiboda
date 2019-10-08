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
let folio_compra = "";

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
                    '    id="cantidad_' + index + '" class="cantidad form-control" ' +
                    '       /> <span class="invalid-feedback" role="alert">* El pedído minimo es de '+ item.minimo + ' piezas </span>' + 
                    '    </div> ' +
                    '    <div class="col-9 col-md-4"> ' +
                    '    <div onclick="myFunction(this,' + index + ')"> ' + item.name + '<i class="fa fa-sort-desc rotate-icon float-right d-block d-md-none"></i> </div> ' +
                    '    </div> ' +
                    '    <div class="col-6 col-md-3 text-md-right d-none d-md-block contenido' + index + '"> ' +
                    '    <div class="precio"><div class="mt-2 d-none d-md-none font-weight-light contenido' + index + '">Precio unitario</div> $' + item.unit_price + ' </div> ' +
                    '    </div> ' +
                    '    <div class="col-6 col-md-3 text-md-right d-none d-md-block contenido' + index + '">' +
                    '    <div class="mt-2 d-none d-md-none font-weight-light contenido' + index + '">Total</div><div class="resultado"> $0 </div>' +
                    '    </div> ' +
                    '</div>');
                var cotizador_line = {
                    id : item.id,
                    productname: item.name,
                    quantity: 0,
                    unitprice: +item.unit_price,
                    minimo: +item.minimo
                }
                full_cotizador.push(cotizador_line);
                cotizador_totals.push(0);
            });

            $("#cotizador").append('<div class="subtotal row " > ' +
                '<div class="d-inline-flex"> SUBTOTAL:&nbsp;</div> ' +
                '<div class="total d-inline-flex pr-1 pr-md-3 font-weight-bold" > $0 </div> ' +
                '</div>');
        });

    fetch('getTiposEnvio.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            tipos_envio = myJson;

            $.each(tipos_envio, function(index, item) {
                $("#tipos_envios p").append(
                    '<div class="radio">' +
                    '    <label><input type="radio" onclick="gettipoenvio(this)" id="envio_' + index + '" name="tipoenvradio"> ' + item.name + ' (' + item.dias_habiles + ' DÍAS ' +
                    '        HÁBILES) $' + item.price + ' ' +
                    '    </label> ' +
                    '</div> '
                );
                //tipos_envio[item.keyword] = item.price;
            });

            $("#tipos_envios p").append(
                ' <div class="total_cenv text-right pt-3 mt-3">' +
                '    TOTAL: <span id="total_conenvio" style="margin-left:5px; font-weight: bold;"> $0 </span>' +
                '</div> '
            );
        });
 
        //initTesting();
});

const initTesting = () => {
    setTimeout(() => {
        /* Página 1 */
        $("#client_name").val("Pablo Camberos");
        $("#event_date").val("31/10/2019");
        
        /* Página 2 */
        $("#envio_0").prop("checked",true);
        gettipoenvio($("#envio_0"));

        $("#cantidad_4").val("5");
        $("#cantidad_4").trigger("change");
        
        /* Página 3 */
        $("#forma_pago_select").val("pago_debito"); 
        $("#forma_pago_select").trigger("change");
        $("#opcion_pago_1").prop("checked",true);
        $("#opcion_pago_1").trigger("click");

        /* Pagina 4 */
        $("#card_nombre").val("Pablo Camberos");
        $("#client_email").val("juan.camberos@estrasol.com.mx");
        $("#card_tarjeta").val("4242424242424242");
        $("#card_cvc").val("789");
        $("#card_mesexp").val("10");
        $("#card_anioexp").val("2022");

        //$("#step_5").click();
    }, 800);
}

function nextTab(elem) {
    current_step_id = $(elem).attr("id");
    togo_step_id = $(elem).parent().next().find('a[data-toggle="tab"]').attr("id");

    if (validate_next(current_step_id)) {
        switch (togo_step_id) {
            case 'step_1':
                break;
            case 'step_2':
                $(".prev_button").show();
                var split_date = ($("#event_date").val()).split("/");
                const date1 = new Date();
                const date2 = new Date(split_date['1'] + "/" + split_date['0'] + "/" + split_date['2']);
                let dif_intime = date2.getTime() - date1.getTime();
                let dif_indays = parseInt(dif_intime / (1000 * 3600 * 24));

                var cont_envios = 0;
                $.each(tipos_envio, function (index, item) {
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
                $(elem).parent().next().find('a[data-toggle="tab"]').click();
                break;
            case 'step_3':
                $(elem).parent().next().find('a[data-toggle="tab"]').click();
                break;
            case 'step_4':
                $(".next_button").text("COMPLETAR PAGO");
                $(elem).parent().next().find('a[data-toggle="tab"]').click();
                break;
            case 'step_5':
                $("#card_nombre").prop('disabled', true);
                $("#card_tarjeta").prop('disabled', true);
                $("#card_cvc").prop('disabled', true);
                $("#card_mesexp").prop('disabled', true);
                $("#card_anioexp").prop('disabled', true);
                $("#client_email").prop('disabled', true);

                $(".next_button").prop('disabled', true);
                $(".next_button").text("Pago en proceso.. ");
                $(".next_button").append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">Loading...</span>')
                $(".prev_button").hide(); 
                triggerForm();
                break;
            case 'stepfinal':
                $(".post").prop('disabled',true);
                $(".next_button").prop('disabled', true);
                $(".next_button").text("Procesando información.. ");
                $(".next_button").append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">Loading...</span>')

                procesarDatosEnvio();
                break;
            default:
                break;
        }
    }
}

function prevTab(elem) {
    togo_step_id = $(elem).parent().prev().find('a[data-toggle="tab"]').attr("id");
    $(elem).parent().prev().find('a[data-toggle="tab"]').click();
    $('.alert').hide();
    switch (togo_step_id) {
        case 'step_1':
            $(".prev_button").hide();
            break;
        case 'step_2':
            break;
        case 'step_3':
            $(".next_button").text("Continuar");
            break;
        case 'step_4':
            $(".next_button").show();
            break;
        default:
            break;
    }


}

function calcularResultado(input) {
    var cantidad = $(input).val();
    if (cantidad == "")
        $(input).val("0");
    var clase = $(input).attr("id");
    var clase_arr = clase.split("_");
    var indice = clase_arr[1];
    var precio = products[indice].unit_price;
    var total_linea_prod = cantidad * precio;
    full_cotizador[indice].quantity = +cantidad;
    $(input).parent().parent().find(".resultado").text(currencyFormat(total_linea_prod));
    cotizador_totals[indice] = total_linea_prod;

    var subtotal = 0;
    $.each(cotizador_totals, function(index, item) {
        subtotal += item;
    });

    $(".total").text(currencyFormat(subtotal));

    var total = subtotal
    if (id_envio_selected)
        var total = +total + +tipos_envio[id_envio_selected].price;


    $("#total_conenvio").text(currencyFormat(total));
    generar_opciones_pago(total);
}

function currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
            $('#event_date').removeClass('is-invalid');
            let fechaev_validado = validate_fechaevento();

            if ($("#client_name").val() != "" && $("#event_date").val() != "") {
                if(fechaev_validado){
                    ready_togo = true;
                    $('.alert').hide();
                }else{ 
                    $('.alert').append('Lo sentimos, NO ES POSIBLE realizar tu pedido en una fecha tan cercana 😞. ');
                    $('#event_date').addClass('is-invalid');
                    $('.alert').fadeIn("slow", function () {});
                }
            } else {
                $('.alert').append("Favor de llenar los campos correspondientes.")
                $('.alert').fadeIn("slow", function () {});

                if ($("#client_name").val() == "")
                    $('#client_name').addClass('is-invalid');

                if ($("#event_date").val() == "")
                    $('#event_date').addClass('is-invalid');

                //<span class="invalid-feedback" role="alert"><strong>mensaje de error</strong></span>
                //Correo electrónico
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
            // VALIDANDO DATOS DE PAGO
            $('.alert').text("");
            let valid_cardnombre = ($("#card_nombre").val() != null && $("#card_nombre").val() != "");
            let valid_tarjeta = ($("#card_tarjeta").val() != null && $("#card_tarjeta").val() != "");
            let valid_CVC = ($("#card_cvc").val() != null && $("#card_cvc").val() != "");
            let valid_mesexp = ($("#card_mesexp").val() != null && $("#card_mesexp").val() != "");
            let valid_anioexp = ($("#card_anioexp").val() != null && $("#card_anioexp").val() != "");
            let valid_email = ($("#client_email").val() != null && $("#client_email").val() != "");

            let valid_mesexpsize = true;
            if (valid_mesexp)
                valid_mesexpsize = $("#card_mesexp").val().length == 2 ? true : false;
            let valid_anioexpsize = true;
            if (valid_anioexp)
                valid_anioexpsize = $("#card_anioexp").val().length == 4 ? true : false;

            let valid_emailformat = true;
            if (valid_email)
                valid_emailformat = /\S+@\S+/.test($("#client_email").val()); //validarEmail($("#client_email").val());

            $('#card_nombre').removeClass('is-invalid');
            $('#card_tarjeta').removeClass('is-invalid');
            $('#card_cvc').removeClass('is-invalid');
            $('#card_mesexp').removeClass('is-invalid');
            $('#card_anioexp').removeClass('is-invalid');

            if (valid_cardnombre && valid_tarjeta && valid_CVC && valid_mesexp && valid_anioexp && valid_email && valid_emailformat && valid_mesexpsize && valid_anioexpsize) {
                ready_togo = true;
                $('.alert').hide();
            } else {
                if (!valid_cardnombre) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#card_nombre').addClass('is-invalid');
                }
                
                if (!valid_email){
                    $('.alert').append("No se ha especificado correo electrónico.</br>")
                    $('#client_email').addClass('is-invalid');
                }

                if(!valid_emailformat){
                    $('.alert').append("El formato de correo electrónico no es correcto..</br>")
                    $('#client_email').addClass('is-invalid');
                }

                if (!valid_tarjeta) {
                    $('.alert').append("No se ha especificado el número de la tarjeta.</br>")
                    $('#card_tarjeta').addClass('is-invalid');
                }
                if (!valid_CVC) {
                    $('.alert').append("No se ha especificado el CVC de la tarjeta.</br>")
                    $('#card_cvc').addClass('is-invalid');
                }
                if (!valid_mesexp) {
                    $('.alert').append("No se ha especificado el mes de expiración de la tarjeta.</br>")
                    $('#card_mesexp').addClass('is-invalid');
                }

                if(!valid_mesexpsize){
                    $('.alert').append("Formato incorrecto para mes de expiración (MM). </br>")
                    $('#card_mesexp').addClass('is-invalid');
                }

                if (!valid_anioexp) {
                    $('.alert').append("No se ha especificado el año de expiración de la tarjeta.</br>")
                    $('#card_anioexp').addClass('is-invalid');
                }

                if(!valid_anioexpsize){
                    $('.alert').append("Formato incorrecto para año de expiración (AAAA). </br>")
                    $('#card_anioexp').addClass('is-invalid');
                }

                $('.alert').fadeIn("slow", function () {});
            }
            break;
        case 'step_5':
            $('.alert').text("");
            let valid_dirnombre = ($("#post_nombre").val() != null && $("#post_nombre").val() != "");
            let valid_cp = ($("#post_cp").val() != null && $("#post_cp").val() != "");
            let valid_estado = ($("#post_estado").val() != null && $("#post_estado").val() != "");
            let valid_delegacion = ($("#post_delegacion").val() != null && $("#post_delegacion").val() != "");
            let valid_colonia = ($("#post_colonia").val() != null && $("#post_colonia").val() != "");
            let valid_calle = ($("#post_calle").val() != null && $("#post_calle").val() != "");
            let valid_exterior = ($("#post_exterior").val() != null && $("#post_exterior").val() != "");
            let valid_interior = ($("#post_interior").val() != null && $("#post_interior").val() != "");
            let valid_calle1 = ($("#post_calle1").val() != null && $("#post_calle1").val() != "");
            let valid_calle2 = ($("#post_calle2").val() != null && $("#post_calle2").val() != "");
            let valid_referencias = ($("#post_referencias").val() != null && $("#post_referencias").val() != "");
            let valid_telefono = ($("#post_telefono").val() != null && $("#post_telefono").val() != "");

            let valid_tipodomicilio = ($("#post_tipodomicilio").val() != null && $("#post_exterior").val() != "");

            $('#post_nombre').removeClass('is-invalid');
            $('#post_cp').removeClass('is-invalid');
            $('#post_estado').removeClass('is-invalid');
            $('#post_delegacion').removeClass('is-invalid');
            $('#post_colonia').removeClass('is-invalid');
            $('#post_calle').removeClass('is-invalid');
            $('#post_exterior').removeClass('is-invalid');
            $('#post_interior').removeClass('is-invalid');
            $('#post_calle1').removeClass('is-invalid');
            $('#post_calle2').removeClass('is-invalid');
            $('#post_referencias').removeClass('is-invalid');
            $('#post_telefono').removeClass('is-invalid');
            $('#post_tipodomicilio').removeClass('is-invalid');

            if (valid_dirnombre && valid_cp && valid_estado && valid_delegacion && valid_colonia && valid_calle && valid_exterior && valid_interior && 
                valid_calle1 && valid_calle2 && valid_referencias && valid_telefono && valid_tipodomicilio ) {
                console.log("Datos de envío OK");
                ready_togo = true;
                $('.alert').hide();
            } else{
                console.log("Datos de envío WRONG");
                ready_togo = false;
                if (!valid_dirnombre) {
                    $('.alert').append("No se han especificado Nombre y apellidos.</br>")
                    $('#post_nombre').addClass('is-invalid');
                }
                if (!valid_cp) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_cp').addClass('is-invalid');
                }
                if (!valid_estado) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_estado').addClass('is-invalid');
                }
                if (!valid_delegacion) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_delegacion').addClass('is-invalid');
                }
                if (!valid_colonia) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_colonia').addClass('is-invalid');
                }
                if (!valid_calle) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_calle').addClass('is-invalid');
                }

                if (!valid_exterior) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_exterior').addClass('is-invalid');
                }
                if (!valid_interior) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_interior').addClass('is-invalid');
                }
                if (!valid_calle1) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_calle1').addClass('is-invalid');
                }
                if (!valid_calle2) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_calle2').addClass('is-invalid');
                }
                if (!valid_referencias) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_referencias').addClass('is-invalid');
                }
                if (!valid_telefono) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_telefono').addClass('is-invalid');
                }
                if (!valid_tipodomicilio) {
                    $('.alert').append("No se ha especificado el nombre de la tarjeta.</br>")
                    $('#post_tipodomicilio').addClass('is-invalid');
                }
            }
            break;
    }
    return ready_togo;
}

function validarEmail(valor) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(valor)){
     return true;
    } else {
     return false;
    }
  }




const validate_fechaevento = () => {
    let ready_togo = false;

    var split_date = ($("#event_date").val()).split("/");
    const date1 = new Date();
    const date2 = new Date(split_date['1'] + "/" + split_date['0'] + "/" + split_date['2']);
    let dif_intime = date2.getTime() - date1.getTime();
    let dif_indays = parseInt(dif_intime / (1000 * 3600 * 24));

    var cont_envios = 0;
    $.each(tipos_envio, function (index, item) {
        if (dif_indays < item.dias_habiles) {} else {
            ready_togo = true;
        }
    });
    return ready_togo;
}


const validate_cotizador = () => {
    let ready_togo = false;
    let someprod_bool = false;
    let minimo_bool = true;
    let index = 0;
    $("#cotizador p .product_line").each(function () {
        var tr_line = this;
        if ($(tr_line).find('.cantidad').val() > 0) {
            someprod_bool = true;
            if ($(tr_line).find('.cantidad').val() >= full_cotizador[index].minimo) {} else {
                minimo_bool = false;
                $(tr_line).find('.cantidad').addClass('is-invalid');
            }
        } else {
            $(tr_line).find('.cantidad').removeClass('is-invalid');
        }
        index++;
    });
    if (someprod_bool && minimo_bool) {
        ready_togo = true;
    }
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