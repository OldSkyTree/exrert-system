'use strict'

const print = require('./print');
const { probabilities } = require('./constants');

module.exports = class KnowledgeBase {
    constructor(input, memory) {
        this._input = input;
        this._memory = memory;
    }

    getRule(number){
        return this.rules[number]
            ? this.rules[number]
            : {};
    }

    printRule(number) {
        print(this.getRule(number).text, `#${number}: `);
    }

    get rules() {
        const {
            _input: input,
            _memory: memory,
        } = this;
        return {
            'start': {
                action: () => input.isValid ? '1': 'end',
                text: `ЕСЛИ поступила информация от пользователя
                ТО экспертная система начинает работу`,
            },
            '1': {
                action: () => {
                    if (input.labPercentage >= input.exam.labReq) {
                        memory.setProbability(probabilities.PERFECT);
                        return '3';
                    } else {
                        return '2';
                    }
                },
                text: `ЕСЛИ процент сданных лабораторных (${input.labPercentage}) >= ${input.exam.labReq}
                ТО степень готовности к экзамену = ${probabilities.PERFECT}%`
            },
            '2': {
                action: () => {
                    memory.setProbability(probabilities.HIGH);
                    memory.addUncomplitedJob('лабораторные работы');
                    return '3';
                },
                text: `ЕСЛИ процент сданных лабораторных (${input.labPercentage}) < ${input.exam.labReq}
                ТО степень готовности к экзамену = ${probabilities.HIGH}%`
            },
            '3': {
                action: () => {
                    return input.mainJobPercentage >= input.exam.mainJobReq
                        ? '5'
                        : '4';
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) = ${memory.probability}%
                И процент готовности ${input.exam.mainJob} (${input.mainJobPercentage}) >= ${input.exam.mainJobReq}
                ТО степень готовности к экзамену = ${memory.probability}%`
            },
            '4': {
                action: () => {
                    memory.decreaseProbability();
                    memory.addUncomplitedJob(input.exam.mainJob);
                    return '5';
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) = ${memory.probability}%
                И процент готовности ${input.exam.mainJob} (${input.mainJobPercentage}) < ${input.exam.mainJobReq}
                ТО степень готовности к экзамену = ${memory.lesser(memory.probability)}%`
            },
            '5': {
                action: () => {
                    return input.theoryScore >= input.exam.theoryReq
                        ? '7'
                        : '6';
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) = ${memory.probability}%
                И оценка по теории (${input.theoryScore}) >= ${input.exam.theoryReq}
                ТО степень готовности к экзамену = ${memory.probability}%`
            },
            '6': {
                action: () => {
                    memory.decreaseProbability();
                    memory.addUncomplitedJob('теоретический тест');
                    return '7';
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) = ${memory.probability}%
                И оценка по теории (${input.theoryScore}) < ${input.exam.theoryReq}
                ТО степень готовности к экзамену = ${memory.lesser(memory.probability)}%`
            },
            '7': {
                action: () => '8',
                text: `ЕСЛИ анализ входных данных завершен
                ТО начать анализ полученых результатов`
            },
            '8': {
                action: () => {
                    return memory.probability === probabilities.PERFECT
                        ? 'end'
                        : '9'
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) = ${probabilities.PERFECT}%
                ТО успехов, у тебя все просто отлично!`
            },
            '9': {
                action: () => {
                    return memory.probability >= probabilities.HIGH
                        ? '12'
                        : '10'
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) >= ${probabilities.HIGH}%
                ТО не все идеально, но очень неплохо!
                Посмотри наши рекомендации, чтобы знать что требует доработки.`
            },
            '10': {
                action: () => {
                    return memory.probability >= probabilities.MEDIUM
                        ? '12'
                        : '11'
                },
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) >= ${probabilities.MEDIUM}%
                ТО кажется кто-то халтурил и не делал задания :<
                Ну ничего, посмотри рекомендации и берись за работу, постарайся!`
            },
            '11': {
                action: () => '12',
                text: `ЕСЛИ степень готовности к экзамену (${memory.probability}%) < ${probabilities.MEDIUM}%
                ТО *недовольное цокание* не буду врать, все очень плохо.
                Стоит посмотреть на рекомендации, чтобы узнать что преподавали в этом семестре.
                Но знай, лишь познав бездну отчаяния осознаешь всю прелесть и красоту Солнца!`
            },
            '12': {
                action: () => 'end',
                text: `ЕСЛИ анализ полученых результатов завершен
                И есть моменты требующие исправлений
                ТО можешь обратить внимание на следующие моменты:
                ${memory.uncomplitedJobs.map(job => `- "${job}"`).join(';\n')}`
            },
            'end': {
                action: () => {},
                text: 'КОНЕЦ ПРОГРАММЫ'
            }
        };
    }
};
