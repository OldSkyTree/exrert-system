'use strict';

const _ = require('lodash');

const print = require('./print');

module.exports = class Input {
    constructor(exams) {
        this._exams = exams;
        this._examId = null;
        this._labPercentage = null;
        this._mainJobPercentage = null;
        this._theoryScore = null;
    }

    init() {
        print(`У нас есть информация о следующих предметах: ${this._exams.map(exam => `"${exam.name}"`).join(', ')}`);
        print('С каким из них хотите продолжить?');
        print(`Выбран: "${this._exams[0].name}"`);
        this._examId = 0;

        print('Сколько лабораторных от общего колличества вы сдали? (в процентах) (0-100)');
        this._labPercentage = 0.5;

        print(`Насколько завершена ${this._exams[this._examId].mainJob}? (в процентах) (0-100)`);
        this._mainJobPercentage = 0.7;

        print('Как хорошо вы сдали тест по теории? (0-100)');
        this._theoryScore = 90;
    }

    get exam() {
        return this._exams[this._examId];
    }

    get labPercentage() {
        return this._labPercentage;
    }

    get mainJobPercentage() {
        return this._mainJobPercentage;
    }

    get theoryScore() {
        return this._theoryScore;
    }

    get isValid() {
        if (this._examId === null) return false;
        if (this._labPercentage === null) return false;
        if (this._mainJobPercentage === null) return false;
        if (this._theoryScore === null) return false;
        
        return true;
    }
};