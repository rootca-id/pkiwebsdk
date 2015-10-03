"use strict";

require("../src/index");
var version = require("../package.json").version;
describe("Version", function() {
  it("Should be able to check SDK version", function(done) {
    expect(window.PKIWebSDK.version()).toBe(version);
    done();
  });
});
