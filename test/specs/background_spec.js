describe("background.js", function() {
  describe("#parseTime", function() {
    it("should handle seconds", function() {
      expect( parseTime("123s") ).toBe( 123 );
    });

    it("should handle minutes", function() {
      expect( parseTime("123m") ).toBe( 123*60 );
      expect( parseTime("123t") ).toBe( 123*60 );
    });

    it("should handle hours", function() {
      expect( parseTime("123h") ).toBe( 123*60*60 );
    });

    it("should default to minutes", function() {
      expect( parseTime("123") ).toBe( 123*60 );
    });

    it("should handle float input", function() {
      expect( parseTime("123.5m") ).toBe( 123.5*60 );
      expect( parseTime("123.5h") ).toBe( 123.5*60*60 );
      expect( parseTime("123.5s") ).toBe( 123.5 );
    });

    it("should return null for bad input", function() {
      expect( parseTime("a123") ).toBeNull();
      expect( parseTime("abc") ).toBeNull();
      expect( parseTime("   ") ).toBeNull();
    });
  });

  describe("#tryToSetupTimer", function() {
    var previousFunc = null;
    var previousGiveFeedbackFunc = null;

    beforeEach(function() {
      previousFunc = window.setupTimer;
      previousGiveFeedbackFunc = window.giveFeedback;
      spyOn(window, "setupTimer");
      spyOn(window, "giveFeedback");
    });

    afterEach(function() {
      setupTimer = previousFunc;
      giveFeedback = previousGiveFeedbackFunc;
    });

    it("should call setupTimer()", function() {
      tryToSetupTimer("10 haha");
      expect(window.setupTimer).toHaveBeenCalled();
    });

    it("should not call setupTimer() if parseTime() returns null", function() {
      tryToSetupTimer("abc");
      expect(window.setupTimer).not.toHaveBeenCalled();
    });

    it("should have correct seconds when called properly", function() {
      tryToSetupTimer("10 haha");
      timer = window.setupTimer.mostRecentCall.args[0];
      expect(timer.seconds).toEqual(10*60);
    });

    it("should have correct description when called properly", function() {
      tryToSetupTimer("10 haha");
      timer = window.setupTimer.mostRecentCall.args[0];
      expect(timer.desc).toEqual("haha");
    });

    it("should have correct epoch seconds when called properly", function() {
      tryToSetupTimer("10 haha");
      timer = window.setupTimer.mostRecentCall.args[0];
      expect(timer.currentTime).toBeGreaterThan(12345);
    });

    it("should have 'Timer done!' when only time is given", function() {
      tryToSetupTimer("10");
      timer = window.setupTimer.mostRecentCall.args[0];
      expect(timer.desc).toEqual("Timer done!");
    });
  });

  describe("#History.findByCount()", function() {
    var history;

    beforeEach(function() {
      history = History();
      history.add("10 foobar");
      history.add("5 barbaz");
    });

    it("should find previous history", function() {
      var founds = history.findByCount("foobar");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("10 foobar");
      expect(founds[0]["count"]).toEqual(1);
    });

    it("should find all previous history when empty string is given", function() {
      var founds = history.findByCount("");
      expect(founds.length).toBe(2);
    });

    it("should not find unknown history", function() {
      var founds = history.findByCount("timer");
      expect(founds.length).toBe(0);
    });

    it("should trim input when finding", function() {
      var founds = history.findByCount(" foobar ");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("10 foobar");
    });

    it("should trim input when adding", function() {
      history.add("7 raboof    ");
      var founds = history.findByCount("raboof");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("7 raboof");
      expect(founds[0]["count"]).toEqual(1);
    });

    it("should increase count when adding same text", function() {
      history.add("10 foobar");
      history.add("10 foobar");
      history.add("10 foobar");
      var founds = history.findByCount("foobar");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("10 foobar");
      expect(founds[0]["count"]).toEqual(4);
    });

    it("should find and return founds sorted by count", function() {
      history.add("10 foobar");
      history.add("3 foobar");
      var founds = history.findByCount("foobar");
      expect(founds.length).toBe(2);
      expect(founds[0]["text"]).toEqual("10 foobar");
      expect(founds[1]["text"]).toEqual("3 foobar");
    });
  });

  describe("#History.findByTime()", function() {
    var history;

    beforeEach(function() {
      history = History();
      history.add("10 foobar");
      history.add("5 barbaz");
    });

    it("should find previous history", function() {
      var founds = history.findByTime("foobar");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("10 foobar");
      expect(founds[0]["count"]).toEqual(1);
    });

    it("should find all previous history when empty string is given", function() {
      var founds = history.findByTime("");
      expect(founds.length).toBe(2);
    });

    it("should not find unknown history", function() {
      var founds = history.findByTime("timer");
      expect(founds.length).toBe(0);
    });

    it("should trim input when find", function() {
      var founds = history.findByTime(" foobar ");
      expect(founds.length).toBe(1);
    });

    it("should trim input when find", function() {
      history.add("7 raboof    ");
      var founds = history.findByTime("raboof");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("7 raboof");
      expect(founds[0]["count"]).toEqual(1);
    });

    it("should increase count when adding same text", function() {
      history.add("10 foobar");
      history.add("10 foobar");
      history.add("10 foobar");
      var founds = history.findByTime("foobar");
      expect(founds.length).toBe(1);
      expect(founds[0]["text"]).toEqual("10 foobar");
      expect(founds[0]["count"]).toEqual(4);
    });

    it("should find and return founds sorted by timestamp", function() {
      history.add("5 foobar");
      history.add("3 foobar");
      var founds = history.findByTime("foobar");
      expect(founds.length).toBe(3);
      expect(founds[0]["text"]).toEqual("3 foobar");
      expect(founds[1]["text"]).toEqual("5 foobar");
      expect(founds[2]["text"]).toEqual("10 foobar");
    });
  });
});
