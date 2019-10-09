import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';

$('#quick-custom-open').on('click', function() {
    App.OpenApp('tuner-custom', null, false, true);
});

function OpenApp() {
    $('#tuner-quick').fadeIn();
}

function CloseApp() {
    $('#tuner-quick').fadeOut();
}

export default { OpenApp, CloseApp }