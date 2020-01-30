'use strict';

const _ = require('lodash');
const readline = require('readline');

const print = require('./print');

module.exports = class Input {
    constructor(exams) {
        this._exams = exams;
        this._examId = null;
        this._labPercentage = null;
        this._mainJobPercentage = null;
        this._theoryScore = null;
    }

    async init() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        await new Promise((resolve, reject) => {
            print(`У нас есть информация о следующих предметах: ${this._exams.map(exam => `"${exam.name}"`).join(', ')}`);
            rl.question('С каким из них хотите продолжить?', (answer) => {
                const id = _.findIndex(this._exams, ({ name }) => name === answer);

                if (id === -1) reject('error');

                print(`Выбран: "${answer}"`);
                this._examId = id;

                resolve();
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                rl.question('Сколько лабораторных от общего колличества вы сдали? (в процентах) (0-100)', (answer) => {
                    print(`Выбран: "${answer}"`);
                    this._labPercentage = Number.parseFloat(answer/100);

                    resolve();
                });
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                rl.question(`Насколько завершена ${this._exams[this._examId].mainJob}? (в процентах) (0-100)`, (answer) => {
                    print(`Выбран: "${answer}"`);
                    this._mainJobPercentage = Number.parseFloat(answer/100);

                    resolve();
                });
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                rl.question('Как хорошо вы сдали тест по теории? (0-100)', (answer) => {
                    print(`Выбран: "${answer}"`);
                    this._theoryScore = Number.parseInt(answer);

                    resolve();
                });
            });
        }).finally(() => rl.close());
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