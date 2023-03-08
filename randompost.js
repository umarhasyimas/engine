var randomposts_number = 5;
var randomposts_chars = 110;
var randomposts_details = 'no';
var randomposts_comments = 'Comments';
var randomposts_commentsd = 'Comments Disabled';
var randomposts_current = [];
var total_randomposts = 0;
var randomposts_current = new Array(randomposts_number);

function randomposts(json) {
    total_randomposts = json.feed.openSearch$totalResults.$t;
}
document.write('<script type=\"text/javascript\" src=\"/feeds/posts/default?alt=json-in-script&max-results=0&callback=randomposts\"><\/script>');

function getvalue() {
    for (var i = 0; i < randomposts_number; i++) {
        var found = false;
        var rndValue = get_random();
        for (var j = 0; j < randomposts_current.length; j++) {
            if (randomposts_current[j] == rndValue) {
                found = true;
                break;
            }
        }
        if (found) {
            i--;
        } else {
            randomposts_current[i] = rndValue;
        }
    }
}

function get_random() {
    var ranNum = 1 + Math.round(Math.random() * (total_randomposts - 1));
    return ranNum;
}
function random_posts(json) {
    for (var i = 0; i < randomposts_number; i++) {
        var entry = json.feed.entry[i];
        var randompoststitle = entry.title.$t;
        if ('content' in entry) {
            var randompostsnippet = entry.content.$t;
        } else {
            if ('summary' in entry) {
                var randompostsnippet = entry.summary.$t;
            } else {
                var randompostsnippet = "";
            }
        }
        randompostsnippet = randompostsnippet.replace(/<[^>]*>/g, "");
        if (randompostsnippet.length < randomposts_chars) {
            var randomposts_snippet = randompostsnippet;
        } else {
            randompostsnippet = randompostsnippet.substring(0, randomposts_chars);
            var whitespace = randompostsnippet.lastIndexOf(" ");
            randomposts_snippet = randompostsnippet.substring(0, whitespace) + "&#133;";
        }
        for (var j = 0; j < entry.link.length; j++) {
            if ('thr$total' in entry) {
                var randomposts_commentsnum = entry.thr$total.$t + ' ' + randomposts_comments;
            } else {
                randomposts_commentsnum = randomposts_commentsd;
            } if (entry.link[j].rel == 'alternate') {
                var randompostsurl = entry.link[j].href;
                var randomposts_date = entry.published.$t;
                if ('media$thumbnail' in entry) {
                    var randompoststhumb = entry.media$thumbnail.url;
                } else {
                    randompoststhumb = "https://blogger.googleusercontent.com/img/a/AVvXsEgmZShlnzxXXjSgQ0H_I-2M4vhjseo-Kj20jIbMFtfYdntDT6FuZGtbVr3RCKA6WNtecnLlkhkm3GfvTxjefwPB1sb9DCdECAacr6IrTOa5CK6KzmzACNBCtcaMeua2Y8KKEt6a8bBv_fs4V0sNB3mE7a2cRChBXqlPOJKY4SejKwOecTZo1_1l4z3-=s172";
                }
            }
        }
        document.write('<li>');
        document.write('<a href="' + randompostsurl + '" rel="nofollow"><img alt="' + randompoststitle + '" src="' + randompoststhumb + '"/></a>');
        document.write('<div><a href="' + randompostsurl + '" rel="nofollow">' + randompoststitle + '</a></div>');
        if (randomposts_details == 'yes') {
            document.write('<span><div  class="random-info">' + randomposts_date.substring(8, 10) + '.' + randomposts_date.substring(5, 7) + '.' + randomposts_date.substring(0, 4) + ' - ' + randomposts_commentsnum) + '</div></span>';
        }
        document.write('<br/><div class="random-summary">' + randomposts_snippet + '</div><div style="clear:both"></div></li>');
    }
}
getvalue();
for (var i = 0; i < randomposts_number; i++) {
    document.write('<script type=\"text/javascript\" src=\"/feeds/posts/default?alt=json-in-script&start-index=' + randomposts_current[i] + '&max-results=1&callback=random_posts\"><\/script>');
}