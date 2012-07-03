test("parseTime", function() {
  equal(parseTime("123"), 123*60);
  equal(parseTime("123s"), 123);
  equal(parseTime("123m"), 123*60);
  equal(parseTime("123h"), 123*60*60);
  equal(parseTime("123t"), 123*60);

  equal(parseTime("a123"), null);
  equal(parseTime("abc"), null);
  equal(parseTime("   "), null);
});
