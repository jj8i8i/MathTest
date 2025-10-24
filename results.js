document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const resultsData = JSON.parse(localStorage.getItem('testResults'));
    if (!resultsData) {
        document.body.innerHTML = '<div class="container mt-5 text-light"><h1>No results found.</h1><a href="test.html">Go back to test selection</a></div>';
        return;
    }

    const { userAnswers, questions, score } = resultsData;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

    document.getElementById('score-text').innerText = `${score} / ${totalQuestions}`;
    document.getElementById('score-percentage').innerText = `(${percentage}%)`;
    
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        let reviewContent = '';
        let isCorrectFlag = false;

        if (q.type === 'mcq') {
            isCorrectFlag = userAnswer === q.correctAnswer;
            let optionsHtml = '';
            q.options.forEach((option, optIndex) => {
                let itemClass = 'list-group-item';
                if (optIndex === q.correctAnswer) itemClass += ' list-group-item-success';
                if (userAnswer === optIndex && userAnswer !== q.correctAnswer) itemClass += ' list-group-item-danger';
                optionsHtml += `<li class="${itemClass}">${option}</li>`;
            });
            reviewContent = `<ul class="list-group list-group-flush">${optionsHtml}</ul>`;
        } else if (q.type === 'text') {
            isCorrectFlag = typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            const resultClass = isCorrectFlag ? 'text-success' : 'text-danger';
            reviewContent = `
                <div class="card-body">
                    <p class="mb-1"><strong>Your Answer:</strong> <span class="${resultClass}">${userAnswer || '<i>(No answer)</i>'}</span></p>
                    ${!isCorrectFlag ? `<p><strong>Correct Answer:</strong> <span class="text-success">${q.correctAnswer}</span></p>` : ''}
                </div>`;
        }
        
        let solutionHtml = '';
        if (q.solution) {
            solutionHtml = `
                <div class="card-body border-top" style="border-color: #4A5568 !important;">
                    <details>
                        <summary>Show Solution</summary>
                        <div class="solution-content mt-2">
                            ${q.solution}
                        </div>
                    </details>
                </div>
            `;
        }

        const reviewCard = `
            <div class="card review-card mb-3">
                <div class="card-header bg-dark text-light" style="background-color: #1A202C !important;">
                    <strong>Question ${index + 1}:</strong> ${q.question}
                </div>
                ${reviewContent}
                ${solutionHtml}
            </div>
        `;
        reviewContainer.innerHTML += reviewCard;
    });

    if (window.renderMathInElement) {
        renderMathInElement(document.body);
        document.querySelectorAll('details').forEach(detail => {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    renderMathInElement(detail);
                }
            });
        });
    }

    localStorage.removeItem('testResults');
});
