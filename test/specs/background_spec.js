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
});
