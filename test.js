document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const testSelectionView = document.getElementById('test-selection-view');
    const testView = document.getElementById('test-view');
    const testListContainer = document.getElementById('test-list-container');
    
    Object.keys(MOCK_TESTS).forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-group';

        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title text-light';
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);

        const testsRow = document.createElement('div');
        testsRow.className = 'row gy-4';
        
        const tests = MOCK_TESTS[category];
        tests.forEach((test, index) => {
            const timeInMinutes = test.timeLimit / 60;
            const completionKey = `completed_${category}_${test.title}`;
            const isCompleted = localStorage.getItem(completionKey) === 'true';

            const testCard = `
                <div class="col-md-4">
                    <div class="card test-card">
                        <div class="card-body">
                            <h5 class="card-title text-light">${test.title}</h5>
                            <p class="card-text text-gray">${test.questions.length} Questions | ${timeInMinutes} Mins</p>
                            <button class="btn btn-primary btn-start-test" 
                                    data-category="${category}" 
                                    data-index="${index}" 
                                    ${isCompleted ? 'disabled' : ''}>
                                ${isCompleted ? 'Completed' : 'Start Test'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            testsRow.innerHTML += testCard;
        });

        categorySection.appendChild(testsRow);
        testListContainer.appendChild(categorySection);
    });

    let currentTest, currentQuestionIndex = 0, userAnswers, timerInterval;
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const progressBar = document.getElementById('progress-bar');

    document.querySelectorAll('.btn-start-test').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const index = e.target.dataset.index;
            startTest(category, index);
        });
    });

    function startTest(category, testIndex) {
        currentTest = MOCK_TESTS[category][testIndex];
        currentTest.category = category;
        currentQuestionIndex = 0;
        userAnswers = new Array(currentTest.questions.length).fill(null);
        
        testSelectionView.classList.add('d-none');
        testView.classList.remove('d-none');
        document.getElementById('test-title').innerText = currentTest.title;
        
        displayQuestion();
        startTimer(currentTest.timeLimit);
    }
    
    function displayQuestion() {
        const question = currentTest.questions[currentQuestionIndex];
        questionText.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsContainer.innerHTML = '';

        if (question.type === 'mcq') {
            optionsContainer.className = 'list-group';
            question.options.forEach((option, index) => {
                const isSelected = userAnswers[currentQuestionIndex] === index;
                const activeClass = isSelected ? 'active' : '';
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `list-group-item list-group-item-action option-btn ${activeClass}`;
                button.dataset.index = index;
                button.innerHTML = option;
                button.addEventListener('click', () => {
                    userAnswers[currentQuestionIndex] = index;
                    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                });
                optionsContainer.appendChild(button);
            });
        } else if (question.type === 'text') {
            optionsContainer.className = '';
            const answer = userAnswers[currentQuestionIndex] || '';
            optionsContainer.innerHTML = `<textarea class="form-control" id="text-answer" rows="3" placeholder="Type your answer here...">${answer}</textarea>`;
            document.getElementById('text-answer').addEventListener('input', (e) => {
                userAnswers[currentQuestionIndex] = e.target.value;
            });
        }
        
        if (window.renderMathInElement) { renderMathInElement(document.body); }
        updateNavigation();
        updateProgressBar();
    }
    
    function updateNavigation() {
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.innerHTML = (currentQuestionIndex === currentTest.questions.length - 1) ? 'Submit' : 'Next';
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex) / currentTest.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function startTimer(duration) {
        let timer = duration;
        const timerEl = document.getElementById('timer');
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerEl.textContent = `${minutes}:${seconds}`;
            if (--timer < 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    function submitTest() {
        clearInterval(timerInterval);
        const completionKey = `completed_${currentTest.category}_${currentTest.title}`;
        localStorage.setItem(completionKey, 'true');

        const results = {
            testTitle: currentTest.title,
            userAnswers: userAnswers,
            questions: currentTest.questions,
            score: calculateScore()
        };
        localStorage.setItem('testResults', JSON.stringify(results));
        window.location.href = 'results.html';
    }

    function calculateScore() {
        let score = 0;
        currentTest.questions.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer === null || userAnswer === undefined) return;

            if (q.type === 'mcq' && userAnswer === q.correctAnswer) {
                score++;
            } else if (q.type === 'text') {
                if (typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                    score++;
                }
            }
        });
        return score;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            submitTest();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
});
