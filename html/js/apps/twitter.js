(function(exports){

    var tweets = null;

    exports.SetupTwitter = function() {
        tweets = GetData('tweets');

        this.console.log(tweets.length);

        tweets.sort(dateSortNewest);

        $.each(tweets, function(index, tweet) {

            var pattern = /\B@[a-z0-9_-]+/gi;
            let b = tweet.message.match(pattern);

            $.each(b, function(index2, mention) {
                tweet.message.replace(mention, '<span class="mention">' + mention + '</span>')
            })

            console.log(b);

            $('.twitter-body').prepend('<div class="tweet"><div class="avatar other-' + tweet.author[1].toString().toLowerCase() + '">' + tweet.author[1] + '</div><div class="author">' + tweet.author + '</div><div class="body">' + tweet.message + '</div><div class="time">' + moment(tweet.time).fromNowOrNow() + '</div></div>');
            $('.twitter-body .tweet:first-child').data('data', tweet);
        });
    }

})(window)