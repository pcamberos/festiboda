let products = new Array;
let tipos_envio = new Array;
let full_cotizador = new Array;
let edition_mode;


$(document).ready(function () {
    edition_mode = false;

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

    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";

    fetch('getProducts.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            products = myJson;
            $.each(myJson, function (index, item) {
                $("#products_table tbody").append('<tr class="product_line"> ' +

                    '    <td>' +
                    '    <div> ' +
                    '       <span  class="data_text product_name" > ' + item.name + '</span>' +
                    '       <input class="edit_field product_name_edit"  type="text" value="' + item.name + '" />' +
                    '       <br><span  class="data_type" style="color:darkblue;font-size:12px;"> product </span>' +
                    '       <br><span  class="data_id product_id" style="color:darkgreen;font-size:12px;"> ' + item.id + '</span>' +
                    '    </div> ' +
                    '    </td> ' +

                    '    <td>' +
                    '    <div> ' +
                    '       <span  class="data_text product_unit_price" > $' + item.unit_price + '</span>' +
                    '       <input class="edit_field product_unit_price_edit"  type="text" value="' + item.unit_price + '" />' +
                    '    </div> ' +
                    '    </td> ' +

                    '    <td > ' +
                    '    <div class="edit_div">' +
                    '    <button type="button" class="btn btn-secondary edit_btn" onclick="editarBtn(this)" > Editar </button> ' +
                    '    <button type="button" class="btn btn-danger delete_btn" onclick= "deleteBtn(this)" > Eliminar </button> ' +
                    '    <button type="button" class="btn btn-success save_btn" onclick="guardarBtn(this)" > Guardar </button> ' +
                    '    <button type="button" class="btn btn-danger cancel_btn" onclick= "cancelarBtn(this)" > Cancelar </button> ' +
                    '    </div> ' +
                    '    </td> ' +

                    '</tr>');
                var cotizador_line = {
                    productname: item.name,
                    quantity: 0,
                    unitprice: +item.unit_price
                }
                full_cotizador.push(cotizador_line);
            });

        });

    fetch('getTiposEnvio.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            tipos_envio = myJson;
            $.each(myJson, function (index, item) {
                $("#tiposenvio_table tbody").append('<tr class="product_line"> ' +
                    '    <td>' +
                    '    <div class="tipoenvio_keyword" > ' + item.keyword + ' </div> ' +
                    '    </td> ' +

                    '    <td>' +
                    '    <div> ' +
                    '       <span  class="data_text tipoenvio_name" > ' + item.name + '</span>' +
                    '       <input class="edit_field tipoenvio_name_edit"  type="text" value="' + item.name + '"/>' +
                    '    </div> ' +
                    '    </td> ' +

                    '    <td>' +
                    '    <div > ' +
                    '       <span  class="data_text tipoenvio_diashabiles" > ' + item.dias_habiles + '</span>' +
                    '       <input class="edit_field tipoenvio_diashabiles_edit" type="text" value="' + item.name + '"  />' +
                    '    </div> ' +
                    '    </td> ' +

                    '    <td>' +
                    '    <div> ' +
                    '       <span  class="data_text tipoenvio_precio" > $' + item.price + '</span>' +
                    '       <input class="edit_field tipoenvio_precio_edit"  type="text" value="' + item.price + '" />' +
                    '    </div> ' +
                    '    </td> ' +

                    '    <td > ' +
                    '    <div class="edit_div">' +
                    '    <button type="button" class="btn btn-secondary edit_btn" onclick="editarBtn(this)" > Editar </button> ' +
                    '    <button type="button" class="btn btn-danger delete_btn" onclick= "deleteBtn(this)" > Eliminar </button> ' +
                    '    <button type="button" class="btn btn-success save_btn" onclick="guardarBtn(this)" > Guardar </button> ' +
                    '    <button type="button" class="btn btn-danger cancel_btn" onclick= "cancelarBtn(this)" > Cancelar </button> ' +
                    '    </div> ' +
                    '    </td> ' +

                    '</tr>');
                var cotizador_line = {
                    productname: item.name,
                    quantity: 0,
                    unitprice: +item.unit_price
                }
                full_cotizador.push(cotizador_line);
            });

        });



});


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
            let validate_bool = validate_cotizador();
            ready_togo = (validate_cotizador() && (envio_selected != null && envio_selected != ""));
            if (!ready_togo) {
                alert("Favor de seleccionar tanto productos como opción de envío. Gracias.");
            }
            break;
        case 'step_3':
            if (opcion_pago_selected != null) {
                ready_togo = true;
            } else {
                alert("Favor de escoger una opción de pago.");
            }
            break;
        case 'step_4':
            break;
        case 'step_5':
            break;
    }
    return ready_togo;
}


/**
 * Modificando botones de Edición
 */
const editarBtn = (input) => {
    console.log("Editando la TR");

    if (!edition_mode) {
        // Campos
        $(input).parent().parent().parent().find(".edit_field").show();
        $(input).parent().parent().parent().find(".data_text").hide();

        // Botones
        $(input).parent().parent().parent().find(".save_btn").show();
        $(input).parent().parent().parent().find(".cancel_btn").show();

        $(input).parent().parent().parent().find(".edit_btn").hide();
        $(input).parent().parent().parent().find(".delete_btn").hide();

        edition_mode = true;
    } else {
        alert("Nel Prro");
    }
}

const cancelarBtn = (input) => {
    console.log("Dejar de editar la TR");

    if (edition_mode) {
        // Campos
        $(input).parent().parent().parent().find(".edit_field").hide();
        $(input).parent().parent().parent().find(".data_text").show();

        // Botones
        $(input).parent().parent().parent().find(".save_btn").hide();
        $(input).parent().parent().parent().find(".cancel_btn").hide();

        $(input).parent().parent().parent().find(".edit_btn").show();
        $(input).parent().parent().parent().find(".delete_btn").show();
        edition_mode = false;
    } else {
        alert("Nel Prro");
    }
}

const guardarBtn = (input) => {
    console.log("Guardar TR");

    let item_tr = $(input).parent().parent().parent();
    let data_type = $(item_tr).find(".data_type").text();
    let data_id = $(item_tr).find(".data_id").text();

    if(data_type=='product'){
        let data_name = $(item_tr).find(".product_name_edit").text();
        let data_price = $(item_tr).find(".product_unit_price_edit").text();
        

    }else if(data_type=='tipoenvio'){

    }


    console.log("Data Type: " + data_type);
    console.log("Data Id: " + data_id);

}