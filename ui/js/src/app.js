import Config from './config';
import Data from './data';
import Utils from './utils';
import Notif from './notification';
import Apps from './apps/apps';

import Test from './test';

var appTrail = [
    {
        app: null,
        data: null,
        fade: null
    }
];

var navDisabled = false;

moment.fn.fromNowOrNow = function(a) {
    if (Math.abs(moment().diff(this)) < 60000) {
        return 'just now';
    }
    return this.fromNow(a);
};

$(function() {
    $('.wrapper').fadeIn();
    Data.ClearData();
    Data.SetupData([
        { name: 'myData', data: Test.PlayerDetails },
        { name: 'contacts', data: Test.Contacts },
        { name: 'messages', data: Test.Messages },
        { name: 'history', data: Test.Calls },
        { name: 'apps', data: Config.Apps },
        { name: 'muted', data: false },
        { name: 'tweets', data: Test.Tweets },
        { name: 'adverts', data: Test.Adverts },
        { name: 'factory-tunes', data: Test.FactoryTunes },
        { name: 'custom-tunes', data: Test.Tunes },
    ]);

    OpenApp('home', null, true);
});

window.addEventListener('message', function(event) {
    switch (event.data.action) {
        case 'setup':
            Data.SetupData(event.data.data);
            break;
        case 'show':
            $('.wrapper').show('slide', { direction: 'down' }, 500);

            if (!Apps.Phone.Call.IsCallPending()) {
                OpenApp('home', null, true);
            } else {
                appTrail = [
                    {
                        app: 'home',
                        data: null,
                        fade: false
                    }
                ];
                OpenApp(
                    'phone-call',
                    {
                        number: event.data.number,
                        receiver: !event.data.initiator
                    },
                    false
                );
            }

            break;
        case 'hide':
            ClosePhone();
            break;
        case 'logout':
            Data.ClearData();
            break;
        case 'setmute':
            Utils.SetMute(event.data.muted);
            break;
        case 'updateTime':
            Utils.UpdateClock(event.data.time);
            break;
        case 'updateUnread':
            Apps.Home.UpdateUnread(event.data.app, event.data.unread);
            break;
        case 'receiveText':
            Apps.Messages.Convo.ReceiveText(
                event.data.data.sender,
                event.data.data.text
            );
            break;
        case 'receiveCall':
            OpenApp(
                'phone-call',
                { number: event.data.number, receiver: true },
                false
            );
            break;
        case 'acceptCallSender':
            Apps.Phone.Call.CallAnswered();
            break;
        case 'acceptCallReceiver':
            Apps.Phone.Call.CallAnswered();
            break;
        case 'endCall':
            Apps.Phone.Call.CallHungUp();
            break;
        case 'ReceiveNewTweet':
            Apps.Twitter.ReceiveNewTweet(event.data.tweet);
            break;
    }
});

function InitShit() {
    $('.modal').modal();
    $('.dropdown-trigger').dropdown({
        constrainWidth: false
    });
    $('.tabs').tabs();
    $('.char-count-input').characterCounter();
    $('.phone-number').mask('000-000-0000', { placeholder: '###-###-####' });
}

$(function() {
    document.onkeyup = function(data) {
        if (data.which == 114 || data.which == 27) {
            ClosePhone();
        }
    };
});

$('.phone-header').on('click', '.in-call', function(e) {
    if (appTrail[appTrail.length - 1].app != 'phone-call') {
        OpenApp('phone-call', null, false);
    }
});

$('.back-button').on('click', function(e) {
    if (!navDisabled) {
        GoBack();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.home-button').on('click', function(e) {
    if (!navDisabled) {
        GoHome();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.close-button').on('click', function(e) {
    ClosePhone();
});

$('#remove-sim-card').on('click', function(e) {
    let modal = M.Modal.getInstance($('#remove-sim-conf'));
    modal.close();
    Utils.NotifyAltSim(false);
    Notif.Alert('Sim Removed');
});

$('.mute').on('click', function(e) {
    let muted = Data.GetData('muted');
    Utils.SetMute(!muted);
});

function ClosePhone() {
    $.post(Config.ROOT_ADDRESS + '/ClosePhone', JSON.stringify({}));
    $('.wrapper').hide('slide', { direction: 'down' }, 500, function() {
        CloseAppAction(appTrail[appTrail.length - 1].app);
        $('#toast-container').remove();
        $('.material-tooltip').remove();
        $('.app-container').hide();
        appTrail = [
            {
                app: null,
                data: null,
                fade: null
            }
        ];
    });
}

function SetupApp(app, data, pop, disableFade, html) {
    $('#screen-content').html(html);
    InitShit();

    CloseAppAction(appTrail[appTrail.length - 1].app);
    if (pop) {
        appTrail.pop();
        disableFade = null;
        appTrail.pop();
    }

    appTrail.push({
        app: app,
        data: data,
        fade: disableFade
    });

    $('.material-tooltip').remove();
    OpenAppAction(app, data);
}

function OpenApp(app, data = null, pop = false, disableFade = false) {
    if ($('#screen-content .app-container').length <= 0 || disableFade) {
        console.log('what the fuck bro')
        $.ajax({
            url: `../../html/apps/${app}.html`,
            cache: false,
            dataType: "html",
            statusCode: {
                404: function() {
                    appTrail.push({ app: app, data: null, fade: false });
                    Notif.Alert('App Doesn\'t Exist', 1000);
                    GoHome();
                }
            },
            success: function(response) {
                SetupApp(app, data, pop, disableFade, response);
                $('#screen-content').show();
            }
        });
    } else {
        $('#screen-content').fadeOut('fast', function() {
            $.ajax({
                url: `../../html/apps/${app}.html`,
                cache: false,
                dataType: "html",
                statusCode: {
                    404: function() {
                        appTrail.push({ app: app, data: null, fade: false });
                        Notif.Alert('App Doesn\'t Exist', 1000);
                        GoHome();
                    }
                },
                success: function(response) {
                    SetupApp(app, data, pop, disableFade, response);
                    $('#screen-content').fadeIn('fast');
                }
            });
        });
    }
}

function RefreshApp() {
    $('.material-tooltip').remove();
    OpenAppAction(
        appTrail[appTrail.length - 1].app,
        appTrail[appTrail.length - 1].data
    );
}

function OpenAppAction(app, data) {
    $('#screen-content').trigger(`${app}-open-app`);
}

function CloseAppAction(app) {
    $('#screen-content').trigger(`${app}-close-app`);
}

function GoHome() {
    console.log(appTrail[appTrail.length - 1].app)
    if (appTrail[appTrail.length - 1].app !== 'home') {
        OpenApp('home');
    }
}

function GoBack() {
    if (appTrail[appTrail.length - 1].app !== 'home') {
        if (appTrail.length > 1) {
            OpenApp(
                appTrail[appTrail.length - 2].app,
                appTrail[appTrail.length - 2].data,
                true,
                appTrail[appTrail.length - 1].fade
            );
        } else {
            GoHome();
        }
    }
}

function GetCurrentApp() {
    return appTrail[appTrail.length - 1].app;
}

export default { GoHome, GoBack, OpenApp, RefreshApp, GetCurrentApp };
