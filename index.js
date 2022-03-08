import fetch from "node-fetch";
import fs from "fs";
import cheerio from "cheerio";

// function to get the raw data
const getRawData = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

// URL for data
const URL = "https://play.google.com/store/apps/collection/cluster?clp=ogoKCA0qAggBUgIIAQ%3D%3D:S:ANO1ljJJQho&gsr=Cg2iCgoIDSoCCAFSAggB:S:ANO1ljJDbNY&hl=es";

const filePath = "links.txt";

// start of the program
const scrapeData = async () => {
    const rawData = await getRawData(URL);
    // parsing the data
    const parsedData = cheerio.load(rawData);
    let apps = [];

    for (let i = 0; i <= 49; i++) {
        let appsLink = parsedData("a.JC71ub")[i].attribs.href;
        apps.push(`${appsLink}\n`);
    }

// TODO: read file and delete duplicated data

    try {
        // if file exist write new data else create file
        if (fs.existsSync(filePath)) {
            fs.appendFile(filePath, apps.toString(), err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else {
            fs.writeFileSync(filePath, apps.toString())
        }
    } catch (err) {
        console.error(err)
    }
};

// invoking the main function
scrapeData();