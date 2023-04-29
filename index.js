const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "6267778762:AAGf-440wXho_Bs64cWVhdnDj099T_fdByc";
const webAppUrl = "https://jazzy-faun-95d43d.netlify.app";
const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
        await bot.sendMessage(chatId, "Go to our shop ", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Make an order", web_app: { url: webAppUrl } }],
                ],
            },
        });
        await bot.sendMessage(chatId, "Fill the form right down", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Fill the form",
                            web_app: { url: webAppUrl + "/form" },
                        },
                    ],
                ],
            },
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, "Thanks for your feedback!");
            await bot.sendMessage(chatId, "Your country:" + data.country);
            await bot.sendMessage(chatId, "Your city:" + data.city);
        } catch (error) {
            console.log(error);
        }
    }
});

app.post("/web-data", async (req, res) => {
    const { queryId, totalCost } = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: "article",
            id: queryId,
            title: "Successful buy!",
            input_message_content: {
                message_text:
                    "Congratilations! You have bought products for $" +
                    totalCost,
            },
        });
        return res.status(200).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json({});
    }
});

const PORT = 8000;

app.listen(PORT, () => "server started on port: " + PORT);
