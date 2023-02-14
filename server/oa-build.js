const swaggerJsDoc = require("swagger-jsdoc");
const { writeFile, } = require('fs');
const path = require("path");

const specData = swaggerJsDoc({
    apis: ["/dist/routes/*.js"],
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Farm IDLE – Backend API',
            version: '1.0.0',
            contact: {
                name: "Eldon W.",
                url: "https://github.com/eldonwilliams/",
            },
        },
    },
});

console.log("Writing...")
writeFile(path.join(__dirname, "oa-spec.json"), JSON.stringify(specData), {}, () => {
    console.log("Wrote!");
});