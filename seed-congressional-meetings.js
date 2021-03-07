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
        const hearing_name = [];
        const hearing_title = [];
        const hearing_details = [];
        const hearing_link = [];
        const chamber = [];
        let chamber1 = [];
        const results = [];
        const mainInfo = $('.schedule-heading');
        const URLElements = $('.schedule-data');
        let test;
        let test2;
        let committee_name;


for (let i = 0; i < mainInfo.length; i++) {
            const urlh3 = $(mainInfo[i]).find('small')[0]

            if (urlh3) {

                const urlh3Text = $(urlh3).text()

                // We then print the text on to the console
                //console.log(urlh3Text)
                chamber.push(urlh3Text)

            } else {
                chamber.push('No committee name')
            }

            chamber1 = chamber.toString().split(",");
           chamber1 = chamber1.toString();

           const reg = /\b,/g;
           const reg1 = /\s/g;
           test = chamber1.replace(reg, "");
           test2 = test.replace(reg1, "" );


            //add a space between words in the hearing-name
            committee_name = test2.replace(/([a-z])([A-Z])/g,  "$1 $2" )
                .replace(/(["'])([A-Z])/g,  "$1 $2" )
                .replace(/([a-z])(and)/g,  "$1 $2" )
                .split(",");

        }


for (let i = 0; i < URLElements.length; i++){

    const urlStrong = $(URLElements[i]).find('strong')[0]
    const urlp = $(URLElements[i]).find('p')[1]
    const urlh4 = $(URLElements[i]).find('h4')[0]
    const urla = $(URLElements[i]).find('a')[0]

    if (urlStrong) {
        // We wrap the span in `$` to create another cheerio instance of only the span
        // and use the `text` method to get only the text (ignoring the HTML)
        // of the span element
        const urlText = $(urlStrong).text()

        // We then print the text on to the console
        //console.log(urlText)
        hearing_details.push(urlText)
    }

    if(urlp){

        const urlpText = $(urlp).text()

        // We then print the text on to the console
        //console.log(urlpText)
        hearing_name.push(urlpText)

    } else{
        hearing_name.push('No Committee presiding')
    }

    if(urlh4){

        const urlh4Text = $(urlh4).text()

        // We then print the text on to the console

        hearing_title.push(urlh4Text)

    } else{
        hearing_title.push('No desc name')
    }

    if (urla) {
        // We wrap the span in `$` to create another cheerio instance of only the span
        // and use the `text` method to get only the text (ignoring the HTML)
        // of the span element
        const urlaText = $(urla).attr('href')

        // We then print the text on to the console
        //console.log(urlText)
        hearing_link.push("https://www.congress.gov/" +urlaText)
    }
}

        //console.log(hearing_details)
       // console.log(hearing_name)
       // console.log(hearing_link)
       // console.log(hearing_title)
      //  console.log(committee_name)
       // console.log(typeof (test3))


        for (let i=0; i<hearing_name.length; i++){

            results[i] = {
                    //time:hearing_details[i],
                    hearing_name: committee_name[i],
                    link: hearing_link[i],
                    committee_name: hearing_name[i],
                    hearing_details: hearing_title[i],
                    day: day,
                    month: month,
                    year: year


            }

        }

        console.log(typeof (results));
        console.log(typeof (JSON.stringify(results)));
        console.log(typeof (results));
        console.log(results);

        //write the data to a file
        //might need to change namification to include date
        let data_JSON = JSON.stringify(results);
        fs.writeFileSync('congressional-meetings.json', data_JSON);



    })
}

scrapeItems('https://www.congress.gov/committee-schedule/daily/' + MyDateString );

