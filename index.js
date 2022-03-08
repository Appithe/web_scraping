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
        if (i === 0) {
            apps.push(`,${appsLink}\n`);
        } else if (i === 49) {
            apps.push(`${appsLink}\n,`);
        } else {
            apps.push(`${appsLink}\n`);
        }
    }

    try {
        // if file exist write new data else create file
        if (fs.existsSync(filePath)) {
            fs.appendFile(filePath, apps.toString(), err => {
                if (err) {
                    console.error(err)
                    return
                }
                removeDuplicates()
            })
        } else {
            fs.writeFileSync(filePath, apps.toString())
        }
    } catch (err) {
        console.error(err)
    }
};

const removeDuplicates = async () => {
    let links = []
    let setedLinks = null

    try {
        const data = fs.readFileSync(filePath, 'utf8')
        links = data.split(",")
        setedLinks = [...new Set(links)]

        fs.writeFileSync("links copy.txt", setedLinks.toString())

        console.log(`links encontrados: ${links.length}`)
        console.log(`setedLinks encontrados: ${setedLinks.length}`)
    } catch (err) {
        console.error(err)
    }
}

scrapeData();