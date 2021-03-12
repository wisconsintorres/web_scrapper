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

//create array for month names
const monthArray = new Array();
monthArray[0] = "Jan";
monthArray[1] = "Feb";
monthArray[2] = "Mar";
monthArray[3] = "Apr";
monthArray[4] = "May";
monthArray[5] = "Jun";
monthArray[6] = "Jul";
monthArray[7] = "Aug";
monthArray[8] = "Sep";
monthArray[9] = "Oct";
monthArray[10] = "Nov";
monthArray[11] = "Dec";

//call for new month
const monthName = monthArray[MyDate.getMonth()]
//day without zero to grabdata
const dayGrab = MyDate.getDate()
const searchDate = monthName + " " + 11;

//set the scrapper to the correct params
function scrapeItems (URL){

    request(URL, function (err, response, body) {

        if(err) console.error(err);
        let $ = cheerio.load(body);
        let press_date = [];
        let press_title = [];
        let press_link = [];
        const results = [];
        const URLElements = $('div').find('.element-header');
        const URLElementsA = $('div').find('.element').find('a');
        const URLElementsTitle = $('div').find('.element-title');
        for (let counter = 0; counter < URLElements.length; counter++) {

            const dateInfo = $(URLElements[counter]).find('span')
            const linklocation = $(URLElementsA)[counter]
            let linkInfo = $(URLElementsTitle[counter])
            //grabbing the data for the different dates, must match certain date in last if statement
            if (dateInfo) {
                const dateText = $(dateInfo).text()
                if(dateText == searchDate) {

                    press_date.push(dateText);
                    //grabbing information only for this date
                    //grab title text
                    function linkTitle(linkInfo){
                        if (linkInfo) {
                            let urlText = $(linkInfo).text()
                                .replace(/\n|\t/g, "")
                                .replace(/^[ \t]+/, "")
                                .replace(/[ \t]+$/, "")
                            return urlText;
                        }
                    }

                    function linkInformation(linklocation){
                        //grab link
                        if (linklocation){
                            let link = $(linklocation).attr('href')
                                .replace(/\n|\t/g, "");
                            return link;
                        }
                    }




                    press_link.push(linkInformation(linklocation));
                    press_title.push(linkTitle(linkInfo));

                }

            }


        }

        //building the JSON object based on how many for day grabbed
        for( let i =0; i < press_date.length; i++ ){
            
//using different date because website was wierd with its format
            results[i] = {
                date: MyDateString,
                link: press_link[i],
                title: press_title[i],
                day: day,
                month: month,
                year: year,
                org: 'United States Senate Committee on Energy and Natural Resources'
            }
        }




        console.log(results)
        console.log(results.length)
        //console.log(URLElements.length)


        //write the data to a file
        //might need to change namification to include date
        let data_JSON = JSON.stringify(results);
        fs.writeFileSync('senate-energy-committee-maj.json', data_JSON);

    })
}

scrapeItems('https://www.energy.senate.gov/democratic-news');