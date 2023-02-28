const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "APP_USR-8568054048336755-120610-0e365b37e1d63b91562976de68c64407-1249664557",
});

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
				payer: req.body.payer
			}
		],
		back_urls: {
			"success": "https://mobibuss.com.br/verify/" + req.body.booking_id,
			"failure": "https://mobibuss.com.br/verify/" + req.body.booking_id,
			"pending": "https://mobibuss.com.br/verify/" + req.body.booking_id
		},
    "payment_methods": {
			"excluded_payment_types": [
					{
							"id": "ticket"
					}
			],
			"excluded_payment_types": [
				{
					"id": "pix"
				}
			]
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(21230, () => {
	console.log("The server is now running on Port 21230");
});