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

    it("should return null for bad input", function() {
      expect( parseTime("a123") ).toBeNull();
      expect( parseTime("abc") ).toBeNull();
      expect( parseTime("   ") ).toBeNull();
    });
  });

  describe("#tryToSetTimer", function() {
    var previousFunc = null;

    beforeEach(function() {
      previousFunc = window.setupNotification;
      spyOn(window, "setupNotification");
    });

    afterEach(function() {
      setupNotification = previousFunc;
    });

    it("should call setupNotification()", function() {
      tryToSetTimer("10 haha");
      expect(window.setupNotification).toHaveBeenCalled();
    });

    it("should not call setupNotification() if parseTime() returns null", function() {
      tryToSetTimer("abc");
      expect(window.setupNotification).not.toHaveBeenCalled();
    });

    it("should have correct seconds when called properly", function() {
      tryToSetTimer("10 haha");
      timer = window.setupNotification.mostRecentCall.args[0];
      expect(timer.seconds).toEqual(10*60);
    });

    it("should have correct description when called properly", function() {
      tryToSetTimer("10 haha");
      timer = window.setupNotification.mostRecentCall.args[0];
      expect(timer.desc).toEqual("haha");
    });

    it("should have correct epoch seconds when called properly", function() {
      tryToSetTimer("10 haha");
      timer = window.setupNotification.mostRecentCall.args[0];
      expect(timer.currentTime).toBeGreaterThan(12345);
    });

    it("should have 'Timer done!' when only time is given", function() {
      tryToSetTimer("10");
      timer = window.setupNotification.mostRecentCall.args[0];
      expect(timer.desc).toEqual("Timer done!");
    });
  });
});
