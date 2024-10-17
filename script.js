
// ----Made by :Ashutosh---- 

import puppeteer from 'puppeteer-core'; // Using ES module import
import passkey from './passkey.js';

async function main() {
    const browser = await puppeteer.launch({
        headless: false, // Show Chrome window
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    });

    const page = await browser.newPage();//Intatntiated the page for the browser

    // Go to the Unstop login page
    await page.goto('https://unstop.com/auth/login?returnUrl=%2F');

    await page.screenshot({ path: 'LoginPage.png' });
    // Wait for email selector
    await page.waitForSelector('input[formcontrolname="email"]', { visible: true });

    // Type in the email
    await page.type('input[formcontrolname="email"]', passkey.id);
    await page.screenshot({ path: 'EmailTyping.png' });
    // Type in the password
    await page.type('#pwd', passkey.pass);

    await page.screenshot({ path: 'passwordTyping.png' });
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 60000 });

    // Check if login was successful
    if (page.url() === 'https://unstop.com/' || await page.$('div.home-element')) {
        console.log('Login successful! You are now on the home page.');

        // Navigate to the "Compete" section
        await page.waitForSelector('a[href*="compete"]', { visible: true });
        await page.screenshot({ path: 'Compete.png' });
        await page.click('a[href*="compete"]'); // Click the "Compete" link

        await page.waitForNavigation({ timeout: 90000 });//Navigation timeout to ensure the free flow working

        console.log('Navigated to the Hackathon registration page.');//Certain console to ensure the direction can be detected

        const competitionsUrl = 'https://unstop.com/all-opportunities?oppstatus=open&domain=&course=6&specialization=&usertype=students';
        await page.goto(competitionsUrl, { waitUntil: 'networkidle2' }); 

        await page.screenshot({ path: 'competitonPage.png' });
        /**Directly moving to the allopportunity page, I had went to the page directly through the url after login */


        for (let i = 1; i <= 1; i++) { //Here only get two option to choose your desired hackathon
            await new Promise(resolve => {
                console.log(`Waiting for you to select a hackathon... (${i})`);
                setTimeout(resolve, 10000); // Delay for 10 seconds, allowing user time to choose, ensure that the user can get time for selecting the hackathon
            });

            // Open the new tab/window when you click the hackathon card
            const [newPage] = await Promise.all([
                new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
                page.click('.register_btn') // Click the chosen hackathon card Every time 
            ]);

            await newPage.waitForSelector('mat-select[id="mat-select-0"]', { visible: true });

            await newPage.click('mat-select[id="mat-select-0"]'); //wait for selector and click function for the newPage is resulting in pop down of the section consisting of options

            console.log("Clicked dropdown");

            await newPage.waitForSelector('mat-option[id="mat-option-2"]', { visible: true });
            await newPage.click('mat-option[id="mat-option-2"]');
            //It is for specific person, hence automatically choose the BE/Btech course
            console.log("Select the BE/BTECH");

            await newPage.waitForSelector('mat-select[id="mat-select-2"]', { visible: true });
            await newPage.click('mat-select[id="mat-select-2"]');

            await newPage.screenshot({ path: 'BEBTECH.png' });

            // await newPage.waitForSelector('mat-option[id="mat-option-1"]', { visible: true });

            // await newPage.click('mat-option[id="mat-option-1"]'); these works only when the browser cookies didn't save it

            await newPage.click('label[for="pass_out_year--2026"]');
            await newPage.screenshot({ path: 'pass_out_year--2026.png' });

            await newPage.click("label[id='label_acceptance']");//click the checkbox automatically

            await newPage.type('.input-container input', 'India');
            await newPage.waitForSelector('a', { visible: true });

            // Get all anchor elements for choosing the country of residence
            const links = await newPage.$$('a');
            // $$ is a shorthand method used to select multiple elements that match a specified selector.

            // Iterate through the list of anchor elements
            for (const link of links) {
                // Get the text content of the current link
                const text = await link.evaluate(el => el.textContent.trim());

                // Check if the text matches "India"
                if (text === 'India') {
                    await link.click(); // Click if text matches
                    console.log("Clicked on the option with text 'India'.");
                    break; // Exit the loop once found and clicked
                }
            }
            await newPage.screenshot({ path: 'after-india-selection.png' });
            console.log("contry of residence")
            // await newPage.waitForSelector('button[class="c-btn"]');


            // await newPage.waitForSelector('.align-center button');
            console.log("Clicked the button");

            await newPage.click('.align-center button')  // Click the chosen hackathon card Every time 

            // Wait for navigation to happen (if clicking leads to a new page)
            await newPage.waitForNavigation({ waitUntil: 'load', timeout: 20000 }); 
            // Take a screenshot of the new page
            await newPage.screenshot({ path: 'registrationpage.png' });


            console.log("Select ")
            
            console.log("Dropdown options appeared");

        }

    } else {
        console.log('Login failed or unexpected page loaded.');
    }

    // Show the home page content
    const content = await page.content();

    // Close the browser
    // await browser.close(); // Uncomment this when you want to close the browser
}

main();
