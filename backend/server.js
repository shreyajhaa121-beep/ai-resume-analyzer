const http = require("http");

const cors = require("cors");

const OpenAI =
    require("openai");

const client =
    new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "*"
};

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
    async (req, res) => {

        res.setHeader(
            "Content-Type",
            "application/json"
        );
                res.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );

                if (
            req.method === "OPTIONS"
        ) {

            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
            );

            res.statusCode = 204;

            res.end();

            return;
                }

        if (req.method === "GET" && req.url === "/test-ai") {
    try {
        const response = await client.responses.create({
            model: "gpt-5-mini",
            input: "Reply with exactly: AI backend working"
        });

        res.end(JSON.stringify({
            success: true,
            result: response.output_text
        }));
    } catch (error) {
        console.error("Test AI error:", error);

        res.statusCode = 500;

        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
    }

    return;
}

if (req.method === "GET" && req.url === "/") {
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
