const request = require('request'),
      cheerio = require('cheerio');
const fs = require('fs');

//set the date to scrap the correct data
const MyDate = new Date();
let MyDateString;

MyDate.setDate(MyDate.getDate());

MyDateString = MyDate.getFullYear() + '/'
    + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
    + ('0' + MyDate.getDate()).slice(-2);

const day = '0' + MyDate.getDate();
const month = '0' + (MyDate.getMonth()+1);
const year = MyDate.getFullYear().toString();

//set the scrapper to the correct params
function scrapeItems (URL){

    request(URL, function (err, response, body) {

        if(err) console.error(err);
        let $ = cheerio.load(body);
        const press_date = [];
        const press_title = [];
        const press_link = [];
        const results = [];
        const URLElements = $('.date');
        const URLElementsA = $('td');


        for (let i = 0; i < URLElements.length; i++) {

            const dateInfo = $(URLElements[i]).find('time')[0]
            const linkInfo = $(URLElementsA[i]).find('a')[0]
            const textInfo = $(URLElementsA[i]).find('a')[0]

            //grabbing the data for the different dates, must match certain date in last if statement
            if (dateInfo) {

                const urlText = $(dateInfo).text()
                    .replace(/\n|\t/g, "");

                if(urlText == "03/04/21") {

                   press_date.push(urlText);
                }

            }

            //finding the link and removing garbage from tag lines
            if(linkInfo){

               const linkInfoText = $(linkInfo).attr('href')
                   .replace(/\n|\t/g, "");

                press_link.push(linkInfoText);

            }

            //get the title text
            if(textInfo){

                const InfoText = $(textInfo).attr('id', 'text').text()
                    .replace(/\n|\t/g, "");

                press_title.push(InfoText);

            }


        }

        //building the JSON object based on how many for day grabbed
        for( let i =0; i < press_date.length; i++ ){

            results[i] = {
                date: press_date[i],
                link: press_link[i],
                title: press_title[i],
                day: day,
                month: month,
                year: year,
                org: 'United States Senate Committee on Banking, Housing, and Urban Affairs'
            }
        }




        console.log(results)
        console.log(results.length)


        //write the data to a file
        //might need to change namification to include date
        let data_JSON = JSON.stringify(results);
        fs.writeFileSync('senate-banking-committee-min.json', data_JSON);

    })
}

scrapeItems('https://www.banking.senate.gov/newsroom/minority-press-releases');
