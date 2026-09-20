const http = require("http");

const PORT = process.env.PORT || 3000;

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
