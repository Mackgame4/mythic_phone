import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';
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

function SetupTuner(tunerActive) {
    if (!tunerActive) {
        $('.no-chip-error').show('scale', function() {
            $('.tuner-nav').data('disabled', true);
        });
    } else {
        timer = setTimeout(function() {
            $('#tuner-home-screen').fadeIn('normal');
        }, 5000)
    }
}

function CloseApp() {
    clearTimeout(timer);
    $('.no-chip-error').hide();
    $('.tuner-nav').removeData('disabled');
}

export default { SetupTuner, CloseApp }