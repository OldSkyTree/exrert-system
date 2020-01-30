'use strict';

const fs = require('fs');

const Input = require('./input');
const WorkMemory = require('./work-memory');
const KnowledgeBase = require('./knowledge-base');

const main = async () => {
    const exams = JSON.parse(fs.readFileSync('./exams.json'));
    const input = new Input(exams);

    await input.init();
    
    const memory = new WorkMemory();
    const knowledgeBase = new KnowledgeBase(input, memory);

    let currentRule = 'start';
    while (currentRule != 'end') {
        knowledgeBase.printRule(currentRule);

        currentRule = knowledgeBase.getRule(currentRule).action();
    }
    knowledgeBase.printRule(currentRule);
};

// точка входа
(() => main())();