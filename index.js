import fetch from "node-fetch";
import fs from "fs";
import cheerio from "cheerio";

const filePath = "links.txt";

// URL for data
const URL_GOOGLEPLAY = "https://play.google.com/store/apps/collection/cluster?clp=ogoKCA0qAggBUgIIAQ%3D%3D:S:ANO1ljJJQho&gsr=Cg2iCgoIDSoCCAFSAggB:S:ANO1ljJDbNY&hl=es";

// function to get the raw data
const getRawData = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

// start of the program
const scrapeData = async () => {
    const rawData = await getRawData(URL_GOOGLEPLAY);
    // parsing the data
    const parsedData = cheerio.load(rawData);
    let apps = [];

    for (let i = 0; i <= 35; i++) {
        let appsLink = parsedData("a.JC71ub")[i].attribs.href;
        if (i === 0) {
            apps.push(`,${appsLink}\n`);
        } else if (i === 35) {
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
            })
        } else {
            fs.writeFileSync(filePath, apps.toString())
        }
    } catch (err) {
        console.error(err)
    }
};

const removeDuplicates = () => {
    let links = []
    let setedLinks = null

    try {
        const data = fs.readFileSync(filePath, 'utf8')
        links = data.split(",")
        setedLinks = [...new Set(links)]

        fs.writeFileSync("links.txt", setedLinks.toString())

        console.log(`links encontrados: ${links.length}`)
        console.log(`setedLinks encontrados: ${setedLinks.length}`)
    } catch (err) {
        console.error(err)
    }
}

const URL_INICIO = "https://play.google.com"

const GetAppInfo = async () => {
    let links = []

    const data = fs.readFileSync(filePath, 'utf8');
    links = data.split(",");

    let appUrl = URL_INICIO.concat(links[0]);

    const appData = await getRawData(appUrl);
    const parsedAppData = cheerio.load(appData);

    const developer = parsedAppData("button.LkLjZd ScJHi HPiPcc IfEcue")
    console.log(developer)

}


// scrapeData();
// removeDuplicates();