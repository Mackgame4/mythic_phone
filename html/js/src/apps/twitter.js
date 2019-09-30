import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';

var tweets = null;
var notif = null;

$('#new-tweet').on('submit', function (e) {
    e.preventDefault();

    let data = $(this).serializeArray();

    let tweet = {
        author: 'PleaseWork',
        message: data[0].value,
        time: Date.now()
    };

    tweets.push(tweet);
    Data.StoreData('tweets', tweets);

    var pattern = /\B@[a-z0-9_-]+/gi;
    let mentions = tweet.message.match(pattern);
    $.each(mentions, function (index2, mention) {
        tweet.message = tweet.message.replace(
            mention,
            `<span class="mention" data-mention="${mention.replace(
                '@',
                ''
            )}">${mention}</span>`
        );
    });

    pattern = /\B#[a-z0-9_-]+/gi;
    let hashtags = tweet.message.match(pattern);
    $.each(hashtags, function (index2, hashtag) {
        tweet.message = tweet.message.replace(
            hashtag,
            `<span class="hashtag" data-hashtag="${hashtag.replace(
                '#',
                ''
            )}">${hashtag}</span>`
        );
    });

    $.post(
        Config.ROOT_ADDRESS + '/NewTweet',
        JSON.stringify({
            message: data[0].value,
            time: tweet.time,
            mentions: mentions,
            hashtags: hashtags
        }),
        function (status) {
            if (!status) {
                M.toast({ html: 'Failed Sending Tweet' });
            } else {
                tweet.author = status.author;

                AddTweet(tweet);

                var modal = M.Modal.getInstance($('#send-tweet-modal'));
                modal.close();
                $('#new-tweet-msg').val('');

                M.toast({ html: 'Tweet Sent' });
            }
        }
    );
});

$('.twitter-body').on('click', '.tweet .mention', function () {
    let user = $(this).data('mention');

    $('#new-tweet-msg').val('@' + user + ' ');

    var modal = M.Modal.getInstance($('#send-tweet-modal'));
    modal.open();
});

$('.twitter-body').on('click', '.author', function () {
    let user = $(this).html();

    $('#new-tweet-msg').val('@' + user + ' ');

    var modal = M.Modal.getInstance($('#send-tweet-modal'));
    modal.open();
});

function AddTweet(tweet) {
    var pattern = /\B@[a-z0-9_-]+/gi;
    let data = tweet.message.match(pattern);
    $.each(data, function (index2, mention) {
        tweet.message = tweet.message.replace(
            mention,
            `<span class="mention" data-mention="${mention.replace(
                '@',
                ''
            )}">${mention}</span>`
        );
    });

    pattern = /\B#[a-z0-9_-]+/gi;
    data = tweet.message.match(pattern);
    $.each(data, function (index2, hashtag) {
        tweet.message = tweet.message.replace(
            hashtag,
            `<span class="hashtag" data-hashtag="${hashtag.replace(
                '#',
                ''
            )}">${hashtag}</span>`
        );
    });

    /// TODO : Figure out & implement image embeding
    /*pattern = /https?[^<"]+/g;
    data = tweet.message.match(pattern);
    $.each(data, function(index2, hashtag) {
        tweet.message = tweet.message.replace(hashtag, `<span class="hashtag" data-hashtag="${hashtag.replace('#', '')}">' + hashtag + '</span>`);
    }); */

    $('.twitter-body').prepend(`
        <div class="tweet">
            <div class="avatar other-${tweet.author[0]
            .toString()
            .toLowerCase()}">${tweet.author[0]}</div>
            <div class="author">${tweet.author}</div>
            <div class="body">${tweet.message}</div>
            <div class="time" data-tooltip="${moment(tweet.time).format(
                'MM/DD/YYYY'
            )} ${moment(tweet.time).format('hh:mmA')}">${moment(tweet.time).fromNowOrNow()}</div>
        </div>`);

    $('.twitter-body .tweet:first-child .time').tooltip({
        position: top
    });
    $('.twitter-body .tweet:first-child').data('data', tweet);
}

function SetupTwitter() {
    tweets = Data.GetData('tweets');

    if (tweets == null) {
        tweets = new Array();
    }

    tweets.sort(Utils.DateSortOldest);

    $('.twitter-body').html('');
    $.each(tweets, function (index, tweet) {
        AddTweet(tweet)
    });
}

function ReceiveNewTweet(tweet) {
    if (notif != null) { clearTimeout(notif); }

    if (tweets == null) {
        tweets = Data.GetData('tweets');
    }

    tweets.push(tweet);
    Data.StoreData('tweets', tweets);

    $('.twitter-alert-header')
        .find('span')
        .html(tweet.author);
    $('.twitter-alert-body').html(tweet.message);
    $('.twitter-alert').fadeIn();
    notif = setTimeout(function () {
        $('.twitter-alert').fadeOut('normal', function () {
            $('.twitter-alert-header')
                .find('span')
                .html('');

            $('.twitter-alert-body').html('');

            notif = null;
        });
    }, 3000);

    if (App.GetCurrentApp() === 'twitter') {
        AddTweet(tweet);
    }
}

export default { SetupTwitter, ReceiveNewTweet };
