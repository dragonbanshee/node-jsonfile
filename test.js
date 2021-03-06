var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var rimraf = require('rimraf')
var jf = require('./')

/* global describe it beforeEach afterEach */

describe('jsonfile', function () {
  var TEST_DIR

  beforeEach(function (done) {
    TEST_DIR = path.join(os.tmpdir(), 'jsonfile-tests')
    rimraf(TEST_DIR, function () {
      fs.mkdir(TEST_DIR, done)
    })
  })

  afterEach(function (done) {
    rimraf(TEST_DIR, done)
  })

  describe('+ readFile()', function () {
    it('should read and parse JSON', function (done) {
      var file = path.join(TEST_DIR, 'somefile.json')
      var obj = {name: 'JP'}
      fs.writeFileSync(file, JSON.stringify(obj))

      jf.readFile(file, function (err, obj2) {
        assert.ifError(err)
        assert.equal(obj2.name, obj.name)
        done()
      })
    })
  })

  describe('+ writeFile()', function () {
    it('should serialize and write JSON', function (done) {
      var file = path.join(TEST_DIR, 'somefile2.json')
      var obj = {name: 'JP'}

      jf.writeFile(file, obj, function (err) {
        assert.ifError(err)
        fs.readFile(file, 'utf8', function (err, data) {
          assert.ifError(err)
          var obj2 = JSON.parse(data)
          assert.equal(obj2.name, obj.name)

          // verify EOL
          assert.equal(data[data.length - 1], '\n')
          done()
        })
      })
    })

    describe('> when global spaces is set', function () {
      it('should write JSON with spacing', function (done) {
        var file = path.join(TEST_DIR, 'somefile.json')
        var obj = {name: 'JP'}
        jf.spaces = 2
        jf.writeFile(file, obj, function (err) {
          assert.ifError(err)

          var data = fs.readFileSync(file, 'utf8')
          assert.equal(data, '{\n  "name": "JP"\n}\n')

          // restore default
          jf.spaces = null
          done()
        })
      })
    })
  })

  describe('+ readFileSync()', function () {
    it('should read and parse JSON', function () {
      var file = path.join(TEST_DIR, 'somefile3.json')
      var obj = {name: 'JP'}
      fs.writeFileSync(file, JSON.stringify(obj))

      try {
        var obj2 = jf.readFileSync(file)
        assert.equal(obj2.name, obj.name)
      } catch (err) {
        assert(err)
      }
    })

    describe('> when invalid JSON and throws set to false', function () {
      it('should return null', function () {
        var file = path.join(TEST_DIR, 'somefile4-invalid.json')
        var data = '{not valid JSON'
        fs.writeFileSync(file, data)

        assert.throws(function () {
          jf.readFileSync(file)
        })

        var obj = jf.readFileSync(file, {throws: false})
        assert.strictEqual(obj, null)
      })
    })
  })

  describe('+ writeFileSync()', function () {
    it('should serialize the JSON and write it to file', function () {
      var file = path.join(TEST_DIR, 'somefile4.json')
      var obj = {name: 'JP'}

      jf.writeFileSync(file, obj)

      var data = fs.readFileSync(file, 'utf8')
      var obj2 = JSON.parse(data)
      assert.equal(obj2.name, obj.name)
      assert.equal(data[data.length - 1], '\n')
      assert.equal(data, '{"name":"JP"}\n')
    })

    describe('> when global spaces is set', function () {
      it('should write JSON with spacing', function () {
        var file = path.join(TEST_DIR, 'somefile.json')
        var obj = {name: 'JP'}
        jf.spaces = 2
        jf.writeFileSync(file, obj)

        var data = fs.readFileSync(file, 'utf8')
        assert.equal(data, '{\n  "name": "JP"\n}\n')

        // restore default
        jf.spaces = null
      })
    })
  })

  describe('+ appendFile()', function () {
    it('should serialize the JSON and append it to file', function (done) {
      var file = path.join(TEST_DIR, 'somefile5.json')
      var obj = {name: 'JP'}

      jf.appendFile(file, obj, function (err) {
        assert.ifError(err)
        fs.readFile(file, 'utf8', function (err, data) {
          assert.ifError(err)
          var obj2 = JSON.parse(data)
          assert.equal(obj2.name, obj.name)

          assert.equal(data[data.length - 1], '\n')
          done()
        })
      })
    })

    describe('> when global spaces is set', function () {
      it('should write JSON with spacing', function (done) {
        var file = path.join(TEST_DIR, 'somefile.json')
        var obj = {name: 'JP'}
        jf.spaces = 2
        jf.appendFile(file, obj, function (err) {
          assert.ifError(err)

          var data = fs.readFileSync(file, 'utf8')
          assert.equal(data, '{\n  "name": "JP"\n}\n')

          jf.spaces = null
          done()
        })
      })
    })
  })

  describe('+ appendFileSync()', function () {
    it('should serialize the JSON and write it to file', function () {
      var file = path.join(TEST_DIR, 'somefile6.json')
      var obj = {name: 'JP'}

      jf.appendFileSync(file, obj)

      var data = fs.readFileSync(file, 'utf8')
      var obj2 = JSON.parse(data)
      assert.equal(obj2.name, obj.name)
      assert.equal(data[data.length - 1], '\n')
      assert.equal(data, '{"name":"JP"}\n')
    })

    describe('> when global spaces is set', function () {
      it('should write JSON with spacing', function () {
        var file = path.join(TEST_DIR, 'somefile.json')
        var obj = {name: 'JP'}
        jf.spaces = 2
        jf.appendFileSync(file, obj)

        var data = fs.readFileSync(file, 'utf8')
        assert.equal(data, '{\n  "name": "JP"\n}\n')

        jf.spaces = null
      })
    })
  })

  describe('spaces', function () {
    it('should default to null', function () {
      assert.strictEqual(jf.spaces, null)
    })
  })
})
