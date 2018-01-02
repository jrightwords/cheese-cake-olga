$('form.cont-form-form').validate({
    rules: {
        yourname : {
            required: true
        },
        youremail: {
            required: true,
            email: true
        },
        yourmessage: {
            required: true
        }
    },
    submitHandler: function (form, e) {
        $('.cont-form img.ajax-loader').show();
        $.ajax({
            type: 'POST',
            dataType: 'html',
            url: '/Contacts/FormSubmit',
            data: {
                '__RequestVerificationToken': $('form.cback-form input[name="__RequestVerificationToken"]').val(),
                'yourname': $('form.cont-form-form input[name="yourname"]').val(),
                'youremail': $('form.cont-form-form input[name="youremail"]').val(),
                'yourmessage': $('form.cont-form-form textarea[name="yourmessage"]').val()
            },
            success: function (res) {
                $('.cont-form img.ajax-loader').hide();
                if (res === 'SUCCESS') {               
                    $('div.cont-form-response-output').text('Спасибо, Ваше сообщение отправлено').fadeIn(500);
                    $('.contact-page-form').delay(3000).fadeOut(500);
                }
                else {
                    $('div.cont-form-response-output').text(res).fadeIn(500);
                }
                
            }
        });
        e.preventDefault();
    }
});