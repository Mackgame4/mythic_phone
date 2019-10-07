import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';

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
    }
}

function CloseApp() {
    $('.no-chip-error').hide();
    $('.tuner-nav').removeData('disabled');
}

export default { SetupTuner, CloseApp }