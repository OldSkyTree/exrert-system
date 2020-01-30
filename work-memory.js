'use strict';

const _ = require('lodash');

const { probabilities } = require('./constants');

module.exports = class WorkMemory {
    constructor() {
        this._probability = probabilities.PERFECT;
        this._uncomplitedJobs = [];
    }

    get probability() {
        return this._probability;
    }

    get uncomplitedJobs() {
        return this._uncomplitedJobs;
    }

    setProbability(probability) {
        this._probability = probability;
    }

    greater(probability) {
        return _.find(probabilities, (prob) => {
            return prob > probability;
        }) || probability;
    }

    lesser(probability) {
        return _.findLast(probabilities, (prob) => {
            return prob < probability;
        }) || probability;
    }

    increaseProbability(count = 1) {
        for (let i = 0; i < count; i++) {
            this._probability = this.greater(this._probability);
        }
    }

    decreaseProbability(count = 1) {
        for (let i = 0; i < count; i++) {
            this._probability = this.lesser(this._probability);
        }
    }

    addUncomplitedJob(job) {
        this._uncomplitedJobs.push(job);
    }
};