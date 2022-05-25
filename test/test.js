var assert = require('assert');

// Aws SDK for testing.
const awsSdk = require('@aws-sdk/client-s3');

describe('AwsS3', function () {
  
  describe('#post()', function () {

    it('should not cause error', async function () {

      let aws = require("../aws.js")(awsSdk, true);
      const fileName = "fileName";
      const value = "value";

      await aws.post(fileName, value);
    });
  });

  describe('#get()', function () {

    it('should return "value" after post', async function () {

      let aws = require("../aws.js")(awsSdk, true);
      const fileName = "fileName";
      const value = "value";

      await aws.post(fileName, value);

      assert.equal(await aws.get(fileName), value);
    });
  });

  describe('#get()', function () {

    it('should return null after delete', async function () {

      let aws = require("../aws.js")(awsSdk, true);
      const fileName = "fileName";
      const value = "value";

      await aws.post(fileName, value);
      await aws.delete(fileName);

      assert.equal(await aws.get(fileName), null);
    });
  });
});