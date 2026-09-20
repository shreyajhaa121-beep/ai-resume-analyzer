// ============================================
// AI RESUME ANALYZER - BETTER ATS ENGINE
// ============================================

// ============================================
// PDF TEXT EXTRACTION
// ============================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

async function extractPdfText(file) {

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer)
        }).promise;

    let text = "";

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);

        const content =
            await page.getTextContent();

        const pageText =
            content.items
                .map(item => item.str)
                .join(" ");

        text += pageText + "\n";
    }

    return text;
}


// ============================================
// 1. GET HTML ELEMENTS
// ============================================

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

const skillsScore =
    document.getElementById("skillsScore");

const keywordsScore =
    document.getElementById("keywordsScore");

const sectionsScore =
    document.getElementById("sectionsScore");

const overallScore =
    document.getElementById("overallScore");

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

const downloadReportBtn =
    document.getElementById("downloadReportBtn");

const contactCheck =
    document.getElementById("contactCheck");

const summaryCheck =
    document.getElementById("summaryCheck");

const skillsCheck =
    document.getElementById("skillsCheck");

const projectsCheck =
    document.getElementById("projectsCheck");

const experienceCheck =
    document.getElementById("experienceCheck");

const educationCheck =
    document.getElementById("educationCheck");


// Store resume text
let resumeText = "";


// ============================================
// 2. RESUME FILE SELECTION
// ============================================

resumeFile.addEventListener(
    "change",
    async function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        fileName.textContent =
            file.name;


        // TXT files
        if (
            file.type === "text/plain" ||
            file.name.toLowerCase().endsWith(".txt")
        ) {

            resumeText =
                await file.text();

        }


        // PDF files
        else if (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        ) {

            try {

                resumeText =
                    await extractPdfText(file);

                if (!resumeText.trim()) {

                    throw new Error(
                        "No selectable text found in PDF."
                    );

                }

            }

            catch (error) {

                console.error(error);

                resumeText = "";

                alert(
                    "Could not read this PDF. Please try a text-based PDF."
                );

            }

        }


        // Unsupported file
        else {

            resumeText = "";

            alert(
                "Please upload a TXT or PDF resume."
            );

        }

    }
);


// ============================================
// 3. KNOWN TECHNICAL SKILLS
// ============================================

const technicalSkills = [

    "html",
    "html5",

    "css",
    "css3",

    "javascript",
    "typescript",

    "python",
    "java",
    "c",
    "c++",

    "react",
    "node.js",
    "nodejs",

    "sql",
    "mysql",

    "git",
    "github",

    "docker",

    "api",
    "rest api",

    "localstorage",
    "dom manipulation",

    "responsive web design",
    "responsive design",

    "web application development",

    "data management",

    "debugging",

    "frontend development",
    "backend development",

    "problem solving",

    "communication",
    "teamwork"
];


// ============================================
// 4. NORMALIZE TEXT
// ============================================

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[•|]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// ============================================
// 5. SMART TERM MATCHING
// ============================================

function containsTerm(text, term) {

    const normalizedText =
        normalizeText(text);

    const normalizedTerm =
        normalizeText(term);

    // Exact match
    if (
        normalizedText.includes(
            normalizedTerm
        )
    ) {
        return true;
    }

    // Simple word variations
    const variations = [
        normalizedTerm,
        normalizedTerm + "s",
        normalizedTerm + "es",
        normalizedTerm + "ed",
        normalizedTerm + "ing"
    ];

    return variations.some(
        variation =>
            normalizedText.includes(
                variation
            )
    );

}


// ============================================
// 6. EXTRACT IMPORTANT SKILLS
// ============================================

function extractSkills(text) {

    const foundSkills = [];

    technicalSkills.forEach(skill => {

        if (
            containsTerm(text, skill)
        ) {

            // Avoid duplicate entries
            if (
                !foundSkills.some(
                    item =>
                        item === skill
                )
            ) {

                foundSkills.push(skill);

            }

        }

    });

    return foundSkills;

}


// ============================================
// 7. EXTRACT IMPORTANT GENERAL KEYWORDS
// ============================================

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
        "years",
        "looking",
        "help",
        "helping",
        "good",
        "basic",
        "experience",
        "requirements",
        "responsibilities",
        "knowledge",
        "understanding",
        "improve",
        "improvement",
        "applications",
        "application",
        "technical",
        "skills",
        "ability",
        "develop",
        "developing",
        "build",
        "building",
        "maintain",
        "maintaining",
        "features",
        "issues",
        "users",
        "user"

    ]);


    const words =
        normalizeText(text)
            .replace(
                /[^a-z0-9+#.\s]/g,
                " "
            )
            .split(/\s+/)
            .map(word =>
                word.replace(
                    /^[.,;:!?()[\]{}]+|[.,;:!?()[\]{}]+$/g,
                    ""
                )
            )
            .filter(word =>
                word.length >= 4 &&
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
        .slice(0, 15)
        .map(item =>
            item[0]
        );

}


// ============================================
// 8. DISPLAY KEYWORDS
// ============================================

function displayKeywords(
    container,
    keywords
) {

    container.innerHTML = "";

    if (keywords.length === 0) {

        const span =
            document.createElement("span");

        span.textContent =
            "None";

        span.className =
            "keyword";

        container.appendChild(span);

        return;

    }


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


// ============================================
// 9. CHECK RESUME SECTIONS
// ============================================

function checkResumeSections() {

    const text =
        normalizeText(resumeText);


    return {

        summary:
            text.includes("professional summary") ||
            text.includes("summary"),

        skills:
            text.includes("technical skills") ||
            text.includes("skills"),

        projects:
            text.includes("projects"),

        experience:
            text.includes("experience") ||
            text.includes("intern"),

        education:
            text.includes("education"),

        contact:
            text.includes("linkedin") ||
            text.includes("github") ||
            text.includes("@")

    };

}


// ============================================
// 10. ANALYZE RESUME
// ============================================

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
        normalizeText(resumeText);


    // ----------------------------------------
    // Extract skills
    // ----------------------------------------

    const jobSkills =
        extractSkills(jobText);

    const matchedSkills = [];

    const missingSkills = [];


    jobSkills.forEach(skill => {

        if (
            containsTerm(
                resumeLower,
                skill
            )
        ) {

            matchedSkills.push(skill);

        }

        else {

            missingSkills.push(skill);

        }

    });


    // ----------------------------------------
    // Extract general keywords
    // ----------------------------------------

    const generalKeywords =
        extractKeywords(jobText);

    const matchedGeneral = [];

    const missingGeneral = [];


    generalKeywords.forEach(keyword => {

        if (
            containsTerm(
                resumeLower,
                keyword
            )
        ) {

            matchedGeneral.push(keyword);

        }

        else {

            missingGeneral.push(keyword);

        }

    });


    // ----------------------------------------
    // Calculate weighted score
    // ----------------------------------------

    let skillScore = 0;

    let keywordScore = 0;

    let sectionScore = 0;


    if (jobSkills.length > 0) {

        skillScore =
            (
                matchedSkills.length /
                jobSkills.length
            ) * 60;

    }


    if (generalKeywords.length > 0) {

        keywordScore =
            (
                matchedGeneral.length /
                generalKeywords.length
            ) * 25;

    }


    const sections =
        checkResumeSections();


    if (sections.summary) {
        sectionScore += 3;
    }

    if (sections.skills) {
        sectionScore += 3;
    }

    if (sections.projects) {
        sectionScore += 4;
    }


    let percentage =
        Math.round(
            skillScore +
            keywordScore +
            sectionScore
        );


    // Keep score between 0 and 100
    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    // ----------------------------------------
    // Display score
    // ----------------------------------------

    score.textContent =
        percentage;


    // ----------------------------------------
    // Display ATS score breakdown
    // ----------------------------------------

    skillsScore.textContent =
        Math.round(skillScore) + "/60";

    keywordsScore.textContent =
        Math.round(keywordScore) + "/25";

    sectionsScore.textContent =
        sectionScore + "/10";

    overallScore.textContent =
        percentage + "/100";


    // ----------------------------------------
    // Score message
    // ----------------------------------------

    if (percentage >= 80) {

        scoreMessage.textContent =
            "Strong alignment with the job description.";

    }

    else if (percentage >= 60) {

        scoreMessage.textContent =
            "Good alignment, with some areas to improve.";

    }

    else {

        scoreMessage.textContent =
            "Several job requirements may need attention.";

    }


    // ----------------------------------------
    // Display matched skills + keywords
    // ----------------------------------------

    const matched =
        [
            ...new Set(
                [
                    ...matchedSkills,
                    ...matchedGeneral
                ]
            )
        ].slice(0, 20);


    const missing =
        [
            ...new Set(
                [
                    ...missingSkills,
                    ...missingGeneral
                ]
            )
        ].slice(0, 20);


    displayKeywords(
        matchedKeywords,
        matched
    );


    displayKeywords(
        missingKeywords,
        missing
    );


    // ----------------------------------------
    // Generate suggestions
    // ----------------------------------------

    generateSuggestions(
        percentage,
        missingSkills,
        missingGeneral,
        sections
    );


    // Show results
    results.classList.remove(
        "hidden"
    );


    results.scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================
// 11. GENERATE SMARTER SUGGESTIONS
// ============================================

function generateSuggestions(
    percentage,
    missingSkills,
    missingGeneral,
    sections
) {

    suggestions.innerHTML = "";

    const suggestionList = [];


    // Score suggestion
    if (percentage < 60) {

        suggestionList.push(
            "Review the job description and strengthen the skills that genuinely match your experience."
        );

    }

    else if (percentage < 80) {

        suggestionList.push(
            "Improve alignment by adding relevant skills and evidence from your actual experience."
        );

    }

    else {

        suggestionList.push(
            "Your resume shows strong alignment; continue using specific evidence and measurable results."
        );

    }


    // Missing technical skills
    if (
        missingSkills.length > 0
    ) {

        suggestionList.push(
            "Consider adding these technical skills only if you genuinely have experience with them: " +
            missingSkills.slice(0, 5).join(", ") +
            "."
        );

    }


    // Projects
    if (!sections.projects) {

        suggestionList.push(
            "Consider adding a Projects section with technologies, responsibilities and measurable results."
        );

    }


    // Experience
    if (!sections.experience) {

        suggestionList.push(
            "Add relevant internship, training or practical experience if applicable."
        );

    }


    // Skills
    if (!sections.skills) {

        suggestionList.push(
            "Add a clearly organized Technical Skills section."
        );

    }


    // General improvement
    suggestionList.push(
        "Use clear action verbs such as developed, implemented, designed, analyzed and optimized."
    );


    suggestionList.push(
        "Keep resume bullet points concise and focused on your contribution and results."
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


// ============================================
// 12. ANALYZE BUTTON
// ============================================

analyzeBtn.addEventListener(
    "click",
    analyzeResume
);


// ============================================
// 13. BULLET IMPROVEMENT
// ============================================

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


// ============================================
// 14. RULE-BASED BULLET IMPROVEMENT
// ============================================

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
            "Managed",

        "worked with":
            "Collaborated with",

        "fixed":
            "Resolved",

        "created":
            "Developed"

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


// ============================================
// 15. DOWNLOAD ATS REPORT
// ============================================

downloadReportBtn.addEventListener(
    "click",
    function () {

        const today =
            new Date().toLocaleDateString();


        const report = `
========================================
        AI RESUME ANALYZER
        ATS COMPATIBILITY REPORT
========================================

Resume:
${fileName.textContent}

Analysis Date:
${today}


========================================
        OVERALL ATS SCORE
========================================

${overallScore.textContent}


========================================
        SCORE BREAKDOWN
========================================

Technical Skills:
${skillsScore.textContent}

Job Keywords:
${keywordsScore.textContent}

Resume Sections:
${sectionsScore.textContent}

Overall ATS Score:
${overallScore.textContent}


========================================
        MATCHED KEYWORDS
========================================

${matchedKeywords.innerText || "None"}


========================================
        MISSING KEYWORDS
========================================

${missingKeywords.innerText || "None"}


========================================
        RESUME SUGGESTIONS
========================================

${suggestions.innerText || "None"}


========================================
        END OF REPORT
========================================

Generated by AI Resume Analyzer
`;


        const blob =
            new Blob(
                [report],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "ATS-Resume-Analysis-Report.txt";


        link.textContent =
            "Download ATS Report";


        link.style.display =
            "none";


        document.body.appendChild(link);


        link.click();


        setTimeout(
            function () {

                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);

            },
            1000
        );

    }
);
