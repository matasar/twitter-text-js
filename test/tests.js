module("twttr.txt");

test("twttr.txt.htmlEscape", function() {
  var tests = [
    ["&", "&amp;"],
    [">", "&gt;"],
    ["<", "&lt;"],
    ["\"", "&quot;"],
    ["'", "&#32;"],
    ["&<>\"", "&amp;&lt;&gt;&quot;"],
    ["<div>", "&lt;div&gt;"],
    ["a&b", "a&amp;b"],
    ["<a href=\"http://twitter.com\" target=\"_blank\">twitter & friends</a>", "&lt;a href=&quot;http://twitter.com&quot; target=&quot;_blank&quot;&gt;twitter &amp; friends&lt;/a&gt;"],
    ["&amp;", "&amp;amp;"],
    [undefined, undefined, "calling with undefined will return input"]
  ];

  for (var i = 0; i < tests.length; i++) {
    same(twttr.txt.htmlEscape(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
  }
});

test("twttr.txt.splitTags", function() {
  var tests = [
    ["foo", ["foo"]],
    ["foo<a>foo", ["foo", "a", "foo"]],
    ["<><>", ["", "", "", "", ""]],
    ["<a><em>foo</em></a>", ["", "a", "", "em", "foo", "/em", "", "/a", ""]]
  ];

  for (var i = 0; i < tests.length; i++) {
    same(twttr.txt.splitTags(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
  }
});

test("twttr.txt.autoLinkWithEntities", function() {
  var options = {urlClass: 'twitter-timeline-link', hashtagClass: 'twitter-hashtag', usernameClass: 'twitter-atreply', hashtagUrlBase: '#!/search?q=%23'};
  var tweet = "Hello @jack I am http://t.co/capital #jack";
  var entities = {"places":[],"urls":[{"expanded_url":"http://t.co/capital","url":"http://t.co/capital","indices":[17,36],"display_url":"t.co/capital"}],"hashtags":[{"text":"jack","indices":[37,42]}],"user_mentions":[{"name":"Jack","id_str":"3","id":3,"indices":[6,11],"screen_name":"jack"}]};
  var result = 'Hello <a class="twitter-atreply" data-screen-name="jack" href="http://twitter.com/jack" rel="nofollow">jack</a> I am <a href="http://t.co/capital" target="_blank" rel="nofollow" data-expanded-url="http://t.co/capital" class="twitter-timeline-link">t.co/capital</a> <a href="#!/search?q=%23jack" title = "#jack" class="twitter-hashtag" rel="nofollow">#jack</a>';
  var answer = twttr.txt.autoLinkWithEntities(tweet, entities, options);
  console.log(answer);
  equal(answer, result, "autolinks correctly");
});

test("twttr.txt.autoLinkWithEntities", function() {
  var options = {urlClass: 'twitter-timeline-link', hashtagClass: 'twitter-hashtag', usernameClass: 'twitter-atreply', hashtagUrlBase: '#!/search?q=%23'};
  var tweet = "Hello @jack I am http://t.co/capital #jack";
  var entities = {fake_entity: [{garbage: 12, "indices":[0,3]}], "places":[],"urls":[{"expanded_url":"http://t.co/capital","url":"http://t.co/capital","indices":[17,36],"display_url":"t.co/capital"}],"hashtags":[{"text":"jack","indices":[37,42]}],"user_mentions":[{"name":"Jack","id_str":"3","id":3,"indices":[6,11],"screen_name":"jack"}]};
  var result = 'Hello <a class="twitter-atreply" data-screen-name="jack" href="http://twitter.com/jack" rel="nofollow">jack</a> I am <a href="http://t.co/capital" target="_blank" rel="nofollow" data-expanded-url="http://t.co/capital" class="twitter-timeline-link">t.co/capital</a> <a href="#!/search?q=%23jack" title = "#jack" class="twitter-hashtag" rel="nofollow">#jack</a>';

  equal(twttr.txt.autoLinkWithEntities(tweet, entities, options), result, "autolinks correctly even with unknown entities");
});