"use strict";

var _ = require('lodash');
var expect = require('expect.js');

var Consultant = require('../consultant');

describe('Consultant', function(){
    var consultant;
    
    beforeEach(function(){
        consultant = new Consultant('Jacob', ['Forrest Avenue', 'Time tracking', 'Jumping Rope']);
    });
    
    it ('has a name', function(){
        expect(consultant.name).to.be('Jacob');
    });

    it('has projects', function () {
				expect(consultant.projects).to.eql(['Forrest Avenue', 'Time tracking', 'Jumping Rope']);
    });

    it('can get the first project', function () {
				expect(consultant.firstProject()).to.be('Forrest Avenue');
    });

    it('can get the last project', function () {
				expect(consultant.lastProject()).to.be('Jumping Rope');
    });

    it('can get the middle project', function () {
				expect(consultant.middleProject()).to.be('Time tracking');
    });

    it('can add a new project', function () {
        consultant.addProject('Big boom');
				expect(consultant.lastProject()).to.be('Big boom');
    });
    
    it('can remove a project', function () {
        consultant.removeProject('Jumping Rope');
				expect(consultant.lastProject()).to.be('Time tracking');
    });
    
});
