import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';

$('.tuner-nav').on('click', function(e) {
    if ($(this).data('disabled')) return;

    let app = $(this).data('section');
    $('.no-chip-error').fadeOut('fast');
    $('.tuner-nav').removeData('disabled');
    App.OpenApp(`tuner-${app}`, null);
});

$('#no-chip-quit').on('click', function() {
    App.GoBack();
})

function SetupTuner() {
    $('.no-chip-error').show('scale', function() {
        $('.tuner-nav').data('disabled', true);
    });
}

function CloseApp() {

}

export default { SetupTuner, CloseApp }