let $ = function (el) {
    return document.querySelector(el);
}, $$ = function (el) {
    return document.querySelectorAll(el);
};

let baseAnswers, chosenAnswers = [], counter = 0;

let FUNCTIONS = {
    buttonsFunctions: function () {
        $$('.button.-goto').forEach(button => {
            button.addEventListener('click', () => {
                const goToBoxClass = button.getAttribute('data-goto');
                if (goToBoxClass == '.-info')
                    FUNCTIONS.resetAnswers();

                FUNCTIONS.hideSection('.box__section');

                setTimeout(() => {
                    FUNCTIONS.showSection(goToBoxClass);
                }, 500);
            });
        });

        $$('.answers__button').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.getAttribute('data-answer');
                button.classList.add('-chosen');
                $('.answers__button:not(.-chosen)').classList.add('-not-chosen');
                FUNCTIONS.chooseAnswer(answer);
            });
        });
    },
    calcScore: function () {
        let answersScore = {A: 0, B: 0, C: 0, D: 0, E: 0};
        for (let i = 0; i < chosenAnswers.length; i++) {
            switch (chosenAnswers[i]) {
                case 'A':
                    answersScore['A']++;
                    break;
                case 'B':
                    answersScore['B']++;
                    break;
                case 'C':
                    answersScore['C']++;
                    break;
                case 'D':
                    answersScore['D']++;
                    break;
                case 'E':
                    answersScore['E']++;
                    break;
            }
        }

        FUNCTIONS.prepareChoosedAnswersList();

        FUNCTIONS.hideSection('.box__section');
        setTimeout(() => {
            FUNCTIONS.showSection('.-score');
        }, 500);

        setTimeout(() => {
            'ABCDE'.split('').forEach((letter, index) => {
                $('[data-answer=' + letter + '] .chart__value').style.width = 'calc(100% / 12 * ' + answersScore[letter] + ')';
                $('[data-answer=' + letter + '] .chart__value').innerHTML = answersScore[letter] + ' pkt';
                if (answersScore[letter] < 4)
                    $('[data-answer=' + letter + '] .chart__value').classList.add('-less-than-four');

                if (answersScore[letter] == 0)
                    $('[data-answer=' + letter + '] .chart__value').classList.add('-zero');
            });
        }, 1000);

        setTimeout(() => {
            'ABCDE'.split('').forEach((letter, index) => {
                $('[data-answer=' + letter + '] .chart__value').classList.add('-text-visible');
            });
        }, 3000);
    },
    changeQuestion: function (baseAnswers, counter) {
        setTimeout(() => {
            $$('.answers__button').forEach(button => {
                button.classList.remove('-chosen');
                button.classList.remove('-not-chosen');
            });
            $('.-question').innerHTML = (counter + 1) + '. Większe znaczenie dla mnie ma, gdy... ';
            $('.-answer1').setAttribute('data-answer', baseAnswers[counter]['type1']);
            $('.-answer2').setAttribute('data-answer', baseAnswers[counter]['type2']);
            $('.-answer1 .answers__text').innerHTML = baseAnswers[counter]['answer1'];
            $('.-answer2 .answers__text').innerHTML = baseAnswers[counter]['answer2'];
            $('.answers').style.opacity = 1;
        }, 300);
    },
    chooseAnswer: function (answer) {
        chosenAnswers[counter] = answer;
        counter++;
        $('.progress__bar').style.display = 'block';
        $('.progress__bar').style.width = Math.round((counter / 30) * 100) + '%';
        $('.progress__value').textContent = Math.round((counter / 30) * 100) + '%';

        setTimeout(() => {
            $('.answers').style.opacity = 0;
            if (counter === 30) {
                FUNCTIONS.calcScore();
            } else {
                FUNCTIONS.changeQuestion(baseAnswers, counter);
            }
        }, 300);
    },
    hideSection: function (section) {
        $$(section).forEach(box => {
            if (box.style.display == 'block') {
                box.style.opacity = '0';
                box.addEventListener('transitionend', () => {
                    if (box.style.opacity == '0')
                        box.style.display = 'none';
                }, false);
            }
        });
    },
    showSection: function (section) {
        $$(section).forEach(box => {
            box.style.opacity = '0';
            box.style.display = 'block';
            setTimeout(() => box.style.opacity = '1', 0);
        });
    },
    loadAnswers: function () {
        fetch('./answers.json').then(response => response.json()).then(data => {
            baseAnswers = data;
            FUNCTIONS.changeQuestion(baseAnswers, 0);
        });
    },
    resetAnswers: function () {
        chosenAnswers = [];
        counter = 0;
        FUNCTIONS.changeQuestion(baseAnswers, 0);
        $('.progress__bar').style.width = '0%';
        $('.progress__value').textContent = '0%';
        $$('.chart__value').forEach(chart => {
            chart.style.width = "0";
            chart.classList.remove('-less-than-four');
            chart.classList.remove('-text-visible');
            chart.classList.remove('-zero');
            chart.innerHTML = '';
        });
    },
    prepareChoosedAnswersList: function () {
        $('.question').innerHTML = null;

        for (let i = 0; i < chosenAnswers.length; i++) {
            let questionNumber = i + 1,
            type1 = baseAnswers[i]['type1'],
            type2 = baseAnswers[i]['type2'],
            answer1 = baseAnswers[i]['answer1'],
            answer2 = baseAnswers[i]['answer2'];

            let isChooseAnswer1 = chosenAnswers[i] == type1 ? '-chosen' : '-not-chosen',
                isChooseAnswer2 = chosenAnswers[i] == type2 ? '-chosen' : '-not-chosen';

            let itemTemplate = `
                <li class="question__item">
                    ${questionNumber}.
                    <ul class="question__answers">
                            <li class="question__answersitem ${isChooseAnswer1}" data-answer="${type1}">
                            ${answer1}
                            </li>
                        <li class="question__answersitem ${isChooseAnswer2}" data-answer="${type2}">
                            ${answer2}
                        </li>
                    </ul>
                </li>`;

            $('.question').insertAdjacentHTML('beforeend', itemTemplate);
        }
    },
    init: function () {
        FUNCTIONS.loadAnswers();
        FUNCTIONS.buttonsFunctions();
    }
};

FUNCTIONS.init();