import App from '../app';
import Data from '../data';

var apps = null;

$('.phone-screen').on('click', '#home-container .app-button', function(event) {
    App.OpenApp($(this).data('container'));
});

$('#screen-content').on('home-open-app', function() {
    OpenApp();
});

function OpenApp() {
    apps = Data.GetData('apps');
    $.each(apps, function(index, app) {
        if (app.enabled) {
            if (app.unread > 0) {
                $('.inner-app').append(
                    '<div class="app-button" data-tooltip="' +
                        app.name +
                        '"><div class="app-icon" id="' +
                        app.container +
                        '-app" style="background-color: ' +
                        app.color +
                        '"> ' +
                        app.icon +
                        '<div class="badge pulse">' +
                        app.unread +
                        '</div></div></div>'
                );
            } else {
                $('.inner-app').append(
                    '<div class="app-button" data-tooltip="' +
                        app.name +
                        '"><div class="app-icon" id="' +
                        app.container +
                        '-app" style="background-color: ' +
                        app.color +
                        '"> ' +
                        app.icon +
                        '</div></div>'
                );
            }
            let $app = $('#home-container .app-button:last-child');

            $app.tooltip({
                enterDelay: 0,
                exitDelay: 0,
                inDuration: 0
            });

            $app.data('container', app.container);
        }
    });
}

function ToggleApp(name, status) {
    let pApp = Apps.filter(app => app.container === name)[0];

    if (!status) {
        $('#' + pApp.container + '-app')
            .parent()
            .fadeOut();
        pApp.enabled = false;
    } else {
        pApp.enabled = true;
        OpenApp();
    }
}

function UpdateUnread(name, unread) {
    if (apps == null) {
        apps = Data.GetData('apps');
    }

    $.each(apps, function(index, app) {
        if (app.container == name) {
            app.unread = unread;
            return false;
        }
    });

    Data.StoreData('apps', apps);
    OpenApp();
}

export default { OpenApp, ToggleApp, UpdateUnread };
