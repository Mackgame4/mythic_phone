import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';
import Quick from './quick';
import anime from 'animejs/lib/anime.es.js';

var timer = null;

$('.tuner-nav').on('click', function(e) {
    if ($(this).data('disabled')) return;

    let app = $(this).data('section');
    App.OpenApp(`tuner-${app}`, null, false, true);
});

$('#no-chip-quit').on('click', function() {
    App.GoBack();
})

function OpenApp(tunerActive) {
    if (!tunerActive) {
        $('.no-chip-error').show('scale', function() {
            $('.tuner-nav').data('disabled', true);
        });
    } else {
        $('#tuner-home-screen').fadeIn('normal');

        $('.tuner-nav').each(function() {
            let element = this;
            setTimeout(function() {
                console.log("??");
                $(element).fadeIn('normal');
            }, 1000);
        });
    }
}

function CloseApp() {
    clearTimeout(timer);
    $('.no-chip-error').hide();
    $('.tuner-nav').removeData('disabled');
    $('#tuner-home-screen').fadeOut('normal');
}

export default { OpenApp, CloseApp, Quick }