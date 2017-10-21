var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches,
        substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    cb(matches);
  };
};
var populateDropdown = function(companyNames) {
  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 0
  }, {
    name: 'companyNames',
    limit: 300,
    source: substringMatcher(companyNames)
  });
};
