"use strict";

var _ = require('lodash');
var expect = require('expect.js');

var Consultant = require('../consultant');

describe('Consultant', function(){
    it ('can function', function(){
        var consultant = new Consultant('Jacob');
        expect(consultant.name).to.be('Jacob');
    });
});
