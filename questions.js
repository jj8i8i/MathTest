const MOCK_TESTS = {
    "Camp 1": [
        {
            title: "C1 - Algebra Basics",
            timeLimit: 600,
            questions: [
                {
                    type: 'text',
                    question: "Solve for $x$ in the equation $3x - 5 = 16$.",
                    correctAnswer: "7",
                    solution: "To solve for $x$, we first add 5 to both sides: $3x - 5 + 5 = 16 + 5$, which simplifies to $3x = 21$. Then, we divide both sides by 3: $\\frac{3x}{3} = \\frac{21}{3}$. This gives us the final answer, $x = 7$."
                },
                {
                    type: 'mcq',
                    question: "What is the value of $x^2 - 2y$ if $x=4$ and $y=3$?",
                    options: ["10", "12", "8", "14"],
                    correctAnswer: 0,
                    solution: "Substitute the values of $x$ and $y$ into the expression. We get $4^2 - 2(3)$. First, calculate the exponent: $4^2 = 16$. Then, perform the multiplication: $2(3) = 6$. Finally, subtract the results: $16 - 6 = 10$."
                }
            ]
        }
    ],
    "TMO": [
        {
            title: "TMO - Number Theory",
            timeLimit: 1200,
            questions: [
                {
                    type: 'text',
                    question: "What is the smallest prime number greater than 50?",
                    correctAnswer: "53",
                    solution: "A prime number is a number greater than 1 that has no positive divisors other than 1 and itself. We check the odd numbers after 50: 51 is divisible by 3 ($5+1=6$), so it's not prime. 53 is not divisible by 2, 3, 5, or 7. The next prime to check is 11, but $11^2 = 121 > 53$, so we only need to check primes up to $\\sqrt{53} \\approx 7.2$. Since 53 is not divisible by any of these, it is a prime number."
                }
            ]
        }
    ]
};
