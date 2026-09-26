const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());

app.use(express.json({
    limit: "1mb"
}));

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Nahid AI Status Generator Server is Running"
    });

});


app.post("/generate", async (req, res) => {

    try {

        const prompt = req.body.prompt;

        if (!prompt || !prompt.trim()) {

            return res.status(400).json({
                success: false,
                error: "Prompt is required"
            });

        }


        const instructions = `
তুমি Nahid AI Status Generator।

তোমার কাজ হলো ব্যবহারকারীর নির্দেশ বুঝে
সেই অনুযায়ী বাংলা Status তৈরি করা।

ব্যবহারকারী যতটি Status চাইবে,
সম্ভব হলে ঠিক ততটি Status তৈরি করবে।

ব্যবহারকারী যদি ২০টি চায়,
২০টি দেবে।

৩০টি চাইলে ৩০টি দেবে।

১০টি চাইলে ১০টি দেবে।

ব্যবহারকারী ছোট চাইলে ছোট Status লিখবে।

মাঝারি চাইলে মাঝারি Status লিখবে।

বড় চাইলে বড় Status লিখবে।

ব্যবহারকারী যে বিষয় চাইবে,
শুধু সেই বিষয়ের Status তৈরি করবে।

উদাহরণ:

ইসলামিক
রোমান্টিক
মোটিভেশনাল
ভালোবাসা
কষ্ট
বন্ধুত্ব
বৃষ্টি
প্রকৃতি
ঈদ
রমজান
জন্মদিন
সফলতা
Facebook
TikTok
ইত্যাদি।

ব্যবহারকারী বাংলা চাইলে বাংলা ভাষায় লিখবে।

প্রয়োজনে সুন্দর Emoji ব্যবহার করবে।

প্রতিটি Status আলাদা এবং স্বাভাবিক হবে।

একই Status বারবার লিখবে না।

Facebook পোস্ট করার উপযোগী ভাষা ব্যবহার করবে।

ব্যবহারকারী যদি বলে "এক লাইনের",
তাহলে এক লাইনের Status দেবে।

ব্যবহারকারী যদি বলে "৩ লাইনের",
তাহলে প্রায় ৩ লাইনের Status দেবে।

ব্যবহারকারী যদি বলে "বড় করে",
তাহলে বিস্তারিত Status দেবে।

ব্যবহারকারী নিজের ভাষায় যেভাবে নির্দেশ দেবে,
সেই নির্দেশ অনুসরণ করবে।

শুধু এই JSON format-এ উত্তর দেবে:

{
  "statuses": [
    "Status 1",
    "Status 2",
    "Status 3"
  ]
}

JSON-এর বাইরে কোনো লেখা লিখবে না।
`;


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            instructions: instructions,

            input: prompt

        });


        const text = response.output_text;


        let data;

        try {

            data = JSON.parse(text);

        } catch (error) {

            const start = text.indexOf("{");

            const end = text.lastIndexOf("}");

            if (
                start !== -1 &&
                end !== -1
            ) {

                data = JSON.parse(
                    text.substring(
                        start,
                        end + 1
                    )
                );

            } else {

                throw new Error(
                    "Invalid AI response"
                );

            }

        }


        if (
            !data.statuses ||
            !Array.isArray(data.statuses)
        ) {

            throw new Error(
                "AI did not return statuses"
            );

        }


        res.json({

            success: true,

            statuses: data.statuses

        });


    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            error: "AI generation failed"

        });

    }

});


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "Nahid AI Status Server running on port " + PORT
        );

    }
);
