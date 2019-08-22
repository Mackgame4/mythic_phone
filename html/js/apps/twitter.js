(function(exports){

    var tweets = null;

    exports.SetupTwitter = function() {
        tweets = GetData('tweets');

        this.console.log(tweets.length);

        tweets.sort(dateSortNewest);

        $.each(tweets, function(index, tweet) {
            $('.twitter-body').prepend('<div class="tweet"><div class="avatar other-' + tweet.author[1].toString().toLowerCase() + '">' + tweet.author[1] + '</div><div class="author">' + tweet.author + '</div><div class="body">' + tweet.message + '</div><div class="time">' + moment(tweet.time).fromNowOrNow() + '</div></div>');
            $('.twitter-body .tweet:first-child').data('data', tweet);
        });
    }

})(window)