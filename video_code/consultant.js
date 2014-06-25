"use strict";

var _ = require('lodash');

function Consultant(name, projects) {
		this.name = name;
    this.projects = projects;
}

Consultant.prototype = {
    firstProject: function () {
				return _.first(this.projects);
    },

    lastProject: function () {
				return _.last(this.projects);
    },

    middleProject: function () {
				return this.projects[Math.floor(this.projects.length / 2)];
    },

    addProject: function (newProject) {
				this.projects.push(newProject);
    },

    removeProject: function (removeProject) {
        _.remove(this.projects, function(element) {return element == removeProject});
    }


};

module.exports = Consultant;
