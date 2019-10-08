import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';

function OpenApp() {
    $('#tuner-quick').fadeIn();
}

function CloseApp() {
    $('#tuner-quick').fadeOut();
}

export default { OpenApp }