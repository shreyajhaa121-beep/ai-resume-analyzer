// ================================
// AI RESUME ANALYZER
// JavaScript
// ================================


// Get HTML elements
const resumeFile =
    document.getElementById("resumeFile");

const fileName =
    document.getElementById("fileName");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const jobDescription =
    document.getElementById("jobDescription");

const results =
    document.getElementById("results");

const score =
    document.getElementById("score");

const scoreMessage =
    document.getElementById("scoreMessage");

const matchedKeywords =
    document.getElementById("matchedKeywords");

const missingKeywords =
    document.getElementById("missingKeywords");

const suggestions =
    document.getElementById("suggestions");

const bulletInput =
    document.getElementById("bulletInput");

const improveBulletBtn =
    document.getElementById("improveBulletBtn");

const improvedBullet =
    document.getElementById("improvedBullet");


// Store resume text
let resumeText = "";


// =================================
// 1. RESUME FILE SELECTION
// =================================

resumeFile.addEventListener(
    "change",
    async function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Show file name
        fileName.textContent =
            file.name;


        // Read TXT files
        if (file.type === "text/plain") {

            resumeText =
                await file.text();

        } else {

            // PDF support will be added later
            resumeText =
                "PDF text extraction will be added in the next version.";

        }

    }
);


// =================================
// 2. EXTRACT KEYWORDS
// =================================

function extractKeywords(text) {

    const stopWords = new Set([

        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "from",
        "your",
        "you",
        "are",
        "have",
        "has",
        "will",
        "our",
        "their",
        "into",
        "about",
        "using",
        "work",
        "working",
        "job",
        "role",
        "years"

    ]);


    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9+#.]/g, " ")
        .split(/\s+/)
        .filter(word =>
            word.length >= 3 &&
            !stopWords.has(word)
        );


    const frequency = {};


    words.forEach(word => {

        frequency[word] =
            (frequency[word] || 0) + 1;

    });


    return Object.entries(frequency)

        .sort((a, b) =>
            b[1] - a[1]
        )

        .slice(0, 20)

        .map(item =>
            item[0]
        );

}


// =================================
// 3. DISPLAY KEYWORDS
// =================================

function displayKeywords(
    container,
    keywords
) {

    container.innerHTML = "";


    keywords.forEach(keyword => {

        const span =
            document.createElement("span");

        span.className =
            "keyword";

        span.textContent =
            keyword;

        container.appendChild(span);

    });

}


// =================================
// 4. ANALYZE RESUME
// =================================

function analyzeResume() {

    const jobText =
        jobDescription.value.trim();


    // Check resume
    if (!resumeText) {

        alert(
            "Please upload your resume first."
        );

        return;
    }


    // Check job description
    if (!jobText) {

        alert(
            "Please enter the job description."
        );

        return;
    }


    const resumeLower =
        resumeText.toLowerCase();


    // Get keywords from job description
    const jobKeywords =
        extractKeywords(jobText);


    const matched = [];

    const missing = [];


    // Compare keywords
    jobKeywords.forEach(keyword => {

        if (
            resumeLower.includes(keyword)
        ) {

            matched.push(keyword);

        } else {

            missing.push(keyword);

        }

    });


    // Calculate score
    const total =
        jobKeywords.length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (matched.length / total) * 100
            );


    // Display score
    score.textContent =
        percentage;


    // Score message
    if (percentage >= 80) {

        scoreMessage.textContent =
            "Strong keyword match with the job description.";

    }

    else if (percentage >= 60) {

        scoreMessage.textContent =
            "Good match, but there is room for improvement.";

    }

    else {

        scoreMessage.textContent =
            "Several important job-related keywords are missing.";

    }


    // Display matched keywords
    displayKeywords(
        matchedKeywords,
        matched
    );


    // Display missing keywords
    displayKeywords(
        missingKeywords,
        missing
    );


    // Generate suggestions
    generateSuggestions(
        percentage,
        missing
    );


    // Show results
    results.classList.remove(
        "hidden"
    );


    // Scroll to results
    results.scrollIntoView({
        behavior: "smooth"
    });

}


// =================================
// 5. GENERATE SUGGESTIONS
// =================================

function generateSuggestions(
    percentage,
    missing
) {

    suggestions.innerHTML = "";


    const suggestionList = [];


    if (percentage < 60) {

        suggestionList.push(
            "Add relevant technical skills from the job description."
        );

    }


    if (missing.length > 0) {

        suggestionList.push(
            "Review missing keywords and add them only when they genuinely describe your experience."
        );

    }


    // Check Projects section
    if (
        !resumeText
            .toLowerCase()
            .includes("projects")
    ) {

        suggestionList.push(
            "Consider adding a Projects section with measurable results."
        );

    }


    suggestionList.push(
        "Use clear action verbs such as developed, implemented, designed, analyzed and optimized."
    );


    suggestionList.push(
        "Keep bullet points concise and focused on impact."
    );


    // Display suggestions
    suggestionList.forEach(
        suggestion => {

            const li =
                document.createElement("li");

            li.textContent =
                suggestion;

            suggestions.appendChild(li);

        }
    );

}


// =================================
// 6. ANALYZE BUTTON
// =================================

analyzeBtn.addEventListener(
    "click",
    analyzeResume
);


// =================================
// 7. BULLET IMPROVEMENT
// =================================

improveBulletBtn.addEventListener(
    "click",
    function () {

        const bullet =
            bulletInput.value.trim();


        if (!bullet) {

            alert(
                "Please enter a resume bullet first."
            );

            return;
        }


        const improved =
            improveBulletRuleBased(
                bullet
            );


        improvedBullet.textContent =
            improved;

    }
);


// =================================
// 8. IMPROVE BULLET
// =================================

function improveBulletRuleBased(
    bullet
) {

    let result =
        bullet.trim();


    const replacements = {

        "worked on":
            "Developed",

        "helped":
            "Supported",

        "made":
            "Created",

        "did":
            "Executed",

        "used":
            "Utilized",

        "responsible for":
            "Managed"

    };


    Object.keys(replacements)
        .forEach(oldPhrase => {

            const regex =
                new RegExp(
                    oldPhrase,
                    "i"
                );


            result =
                result.replace(
                    regex,
                    replacements[oldPhrase]
                );

        });


    return result;

}
