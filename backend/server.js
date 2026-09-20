const http = require("http");

const OpenAI =
    require("openai");

const client =
    new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

const PORT = process.env.PORT || 3000;

async function analyzeWithAI(
    resume,
    jobDescription
) {

    const response =
        await client.responses.create({

            model: "gpt-5-mini",

            input: [
                {
                    role: "system",
                    content:
                        "You are a resume analysis assistant. Analyze the resume against the job description and return concise, factual feedback."
                },
                {
                    role: "user",
                    content:
                        `Resume:
${resume}

Job Description:
${jobDescription}

Return:
1. Matching skills
2. Missing skills
3. Resume improvement suggestions
4. Overall alignment summary`
                }
            ]
        });

    return response.output_text;
}

const server = http.createServer(
    (req, res) => {

        res.setHeader(
            "Content-Type",
            "application/json"
        );

        if (
            req.method === "GET" &&
            req.url === "/"
        ) {

            res.end(
                JSON.stringify({
                    status: "Backend is running",
                    app: "AI Resume Analyzer"
                })
            );

            return;
        }
                if (
            req.method === "POST" &&
            req.url === "/analyze"
        ) {

            let body = "";

            req.on(
                "data",
                chunk => {
                    body += chunk;
                }
            );

            req.on(
                "end",
                async () => {

                    try {

                        const data =
                            JSON.parse(body);

                        const resume =
                            data.resume || "";

                        const jobDescription =
                            data.jobDescription || "";

                        if (
                            !resume ||
                            !jobDescription
                        ) {

                            res.statusCode = 400;

                            res.end(
                                JSON.stringify({
                                    error:
                                        "Resume and job description are required."
                                })
                            );

                            return;
                        }

                        const result =
                            await analyzeWithAI(
                                resume,
                                jobDescription
                            );

                        res.statusCode = 200;

                        res.end(
                            JSON.stringify({
                                success: true,
                                result: result
                            })
                        );

                    } catch (error) {

                        console.error(
                            "AI analysis error:",
                            error
                        );

                        res.statusCode = 500;

                        res.end(
                            JSON.stringify({
                                error:
                                    "AI analysis failed."
                            })
                        );
                    }
                }
            );

            return;
                }

        res.statusCode = 404;

        res.end(
            JSON.stringify({
                error: "Route not found"
            })
        );
    }
);

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
