const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.render("index", {
        price: null,
        currency: null,
        error: null
    });
});

app.post("/price", async (req,res) => {
    const currency = req.body.currency;

    try {
        const response = await axios.get(
            "https://blockchain.info/ticker"
        );
        const currencyData = response.data[currency];
        if(!currencyData) {
            return res.render("index", {
                price:null,
                currency:null,
                error: "The selected currency is not available."
            });
        }

        res.render("index", {
            price: currencyData,
            currency: currency,
            error: null
        });
    }
    catch (error) {
        console.error(error);

        res.render("index", {
            price:null,
            currency:null,
            error: "Unable to retrieve Bitcoin price. Please try again"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

