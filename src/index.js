const express = require("express");

var mjax = require("mathjax-node");

mjax.config({
    MathJax: {
        loader: {load: ['[tex]/color', '[tex]/cancel']},
        tex: {packages: {'[+]': ['color', 'cancel']}}
    }
});

mjax.start();

function mathjax(res, eq) {
/* Convert query TeX to SVG with mathjax-node */
    mjax.typeset({math: eq.tex, format: "TeX", svg: true}, (data) => {
        if (data.errors) res.send(data.errors);
        else {
            let svg = data.svg;
            res.writeHeader(200, {"Content-Type": "image/svg+xml"});
            res.end(eq.cc ?svg.replaceAll(`"currentColor"`, `"${eq.cc}"`) : svg);
        }
    });
}

const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => res.send("Server is running"));
app.get("/hi", (req, res) => res.send("Hello, world!"));
app.get("/mjax.svg", (req, res) => mathjax(res, req.query));

app.listen(5000, () => console.log("Server ready on port 5000."));

module.exports = app;
