

function recountAdditional() {
    var def = parseInt($('.page-form-block__price').attr('data-default-price'));

    $('.page-form-block__option input:checked').each(function () {
        def += parseInt($(this).closest('.page-form-block__option').attr('data-price').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(/[^0-9]/gim, ''));

    })

    def = def.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + " Р";
    $('.page-form-block__price span').text(def);
}


$(document).ready(function () {

    if ($('.page-form-block__option').length > 0) {
        $('.page-form-block__option input').change(
            function () {
                recountAdditional();
            }
        );
    }
});
