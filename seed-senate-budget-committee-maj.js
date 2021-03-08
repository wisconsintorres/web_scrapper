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
        let press_date = [];
        let press_title = [];
        let press_link = [];
        const results = [];
        const URLElements = $('li').find('p');
        const URLElementsA = $('#press').find('li').find('a');

        for (let counter = 0; counter < URLElements.length; counter++) {

            const dateInfo = $(URLElements[counter])
            const linklocation = $(URLElementsA)[counter]
            let linkInfo = $(URLElementsA[counter])

            //grabbing the data for the different dates, must match certain date in last if statement
            if (dateInfo) {
                const dateText = $(dateInfo).text()

                if(dateText == "03.04.21") {

                    press_date.push(dateText);
                    //grabbing information only for this date
                    //grab title text
                    function linkTitle(linkInfo){
                        if (linkInfo) {
                            let urlText = $(linkInfo).text()
                                .replace(/\n|\t/g, "");
                            return urlText;
                        }
                    }

                    function linkInformation(linklocation){
                        //grab link
                        if (linklocation){
                            let link = $(linklocation).attr('href')
                                .replace(/\n|\t/g, "");
                            return 'https://www.budget.senate.gov' + link;
                        }
                    }




                    press_link.push(linkInformation(linklocation));
                    press_title.push(linkTitle(linkInfo));

                }

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
                org: 'United States Senate Committee on the Budget'
            }
        }




        console.log(results)
        console.log(results.length)
        //console.log(URLElements.length)


        //write the data to a file
        //might need to change namification to include date
        let data_JSON = JSON.stringify(results);
        fs.writeFileSync('senate-agri-committee-maj.json', data_JSON);

    })
}

scrapeItems('https://www.budget.senate.gov/chairman/newsroom');