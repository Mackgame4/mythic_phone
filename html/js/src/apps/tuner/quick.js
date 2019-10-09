import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';

var factoryTunes = null;
var customTunes = null;

$('#quick-custom-open').on('click', function() {
    App.OpenApp('tuner-custom', null, false, true);
});

function OpenApp() {
    factoryTunes = Data.GetData('factory-tunes');
    customTunes = Data.GetData('custom-tunes');

    $.each(factoryTunes, function(index, tune) {
        $('.tuner-quick-section#factory').find('.tuner-quick-buttons').append(`<button type="button" class="btn waves-effect waves-light teal darken-4 quick-tune-button">${tune.label}</button>`);
        $('.tuner-quick-section#factory').find('.tuner-quick-buttons .quick-tune-button:last-child').data('tune', tune);
    });

    $.each(customTunes, function(index, tune) {
        $('.tuner-quick-section#custom').find('.tuner-quick-buttons').append(`<button type="button" class="btn waves-effect waves-light teal darken-4 quick-tune-button">${tune.label}</button>`);
        $('.tuner-quick-section#custom').find('.tuner-quick-buttons .quick-tune-button:last-child').data('tune', tune);
    });

    $('#tuner-quick').fadeIn();
}

function CloseApp() {
    $('#tuner-quick').fadeOut('normal', function() {
        $('.tuner-quick-section#factory').find('.tuner-quick-buttons').html('');
        $('.tuner-quick-section#custom').find('.tuner-quick-buttons').html('');
    });
}

export default { OpenApp, CloseApp }