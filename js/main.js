// MT1.11 Compat
var $E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	return ($(filter) || document).getElements(selector);
};

var trackEvent = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);

    ga('send', 'event', ev);
};

jQuery( document ).ready(function( $ ) {

    var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    };

    $('#phoneForm').submit(function(e) {
        e.preventDefault();
        $('#call_button').click();
    });

    $('#call_button').click(function(e) {

        var phone = $('#phone').val();

        if (!validatePhone(phone))
            return alert('Please enter a valid US phone number!');

        var data = {
            campaignId: 2,
            userPhone: validatePhone(phone),
            userLocation: '00000'
        };

        $.ajax({
            url: 'http://call-power-dp.herokuapp.com/call/create',
            type: "get",
            dataType: "json",
            data: data,
            success: function(res) {
                trackEvent('call-power');

                console.log('Started call-power: ', res);
            }
        });
        $('.overlay').css('display', 'table');
        setTimeout(function() {
            $('.overlay').addClass('visible');
            setTimeout(function() {
                $('.overlay .modal .inner').addClass('visible');
            }, 10);
        }, 100);
    });

    $('#emailForm').submit(function(e) {
        e.preventDefault();
        $('#email_button').click();
    });

    $('#email_button').click(function(e) {

        if (!validateEmail($('#email').val()))
            return alert('Please enter a valid email address!');

        $('#email_form_fields').addClass('fade');
        $('.thanks').addClass('visible');
        setTimeout(function() {
            $('#email_form_fields').hide();
        }, 500);

        var form = $('#emailForm');
        $.post(form.attr('action'), form.serialize(), function(data){});

    });

    $('a.twitter').click(function(e) {

        e.preventDefault();

        trackEvent('share');

        var tw_text = encodeURIComponent(TWEET_TEXT);
        window.open('https://twitter.com/intent/tweet?hashtags=&text='+ tw_text +'&related=demandprogress');

    });

    $('.a.facebook').click(function(e) {
        trackEvent('share');
    });

    $('a.close').click(function (e){
        $('.overlay').removeClass('visible');
    });

});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}