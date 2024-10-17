import puppeteer from 'puppeteer-core'; // Using ES module import
import passkey from './passkey.js';

async function main() {
    const browser = await puppeteer.launch({
        headless: false, // Show Chrome window
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    });
    
    const page = await browser.newPage();

    // Go to the Unstop login page
    await page.goto('https://unstop.com/auth/login?returnUrl=%2F');
    
    // Wait for email selector
    await page.waitForSelector('input[formcontrolname="email"]', { visible: true });
    
    // Type in the email
    await page.type('input[formcontrolname="email"]', passkey.id);
    
    // Type in the password
    await page.type('#pwd', passkey.pass);
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 60000 });

    // Check if login was successful
    if (page.url() === 'https://unstop.com/' || await page.$('div.home-element')) {
        console.log('Login successful! You are now on the home page.');

        // Navigate to the "Compete" section
        await page.waitForSelector('a[href*="compete"]', { visible: true });
        await page.click('a[href*="compete"]'); // Click the "Compete" link

        // Wait for navigation to the compete page
        await page.waitForNavigation({ timeout: 90000 });

        // Confirm navigation to the Hackathon registration page or section
        console.log('Navigated to the Hackathon registration page.');

        // const findCompetitionsButtonSelector ='//button[contains(text(), "Find Competitions")]';;
        // await page.waitForSelector(findCompetitionsButtonSelector, {visible:true});

        // //click on the "find competition"

        // await page.click(findCompetitionsButtonSelector);

        const competitionsUrl = 'https://unstop.com/all-opportunities?oppstatus=open&domain=&course=6&specialization=&usertype=students';
        await page.goto(competitionsUrl, { waitUntil: 'networkidle2' });

        // await page.waitForNavigation({timeout:90000});

        // const competitionText = await page.evaluate(() => {
        //     const competitionDiv = document.querySelector('div.selected_filter.round-btn.filled'); // Generic classes
        //     return competitionDiv ? competitionDiv.innerText.trim() : null;
        // });
        
        // if (competitionText && competitionText.includes('Competitions')) {
        //     console.log("Competition section found.");
        // } else {
        //     console.log("Competition section not found.");
        // }
        
        // await page.waitForSelector('div.listing_dt_logo-box');
        // await page.click("div.listing_dt_logo-box");

    //     await page.evaluate(() => {
    //         document.addEventListener('click', (event) => {
    //             const clickedElement = event.target;
    //             console.log('Clicked element:', clickedElement);
        
    //     //         // Check if the clicked element is part of the hackathon card
    //     //         const hackathonCard = clickedElement.closest('.listing_dt_logo-box');
                
    //     //         if (hackathonCard) {
    //     //     console.log("Hackathon card");
    //     // }
    // })});

    // page.on("framenavigated", async (frame)=>{
    //     const currentUrl=frame.url();
    //     console.log("Frame url "+ currentUrl);
    // })

    // const [newPage] = await Promise.all([
    //         await page.evaluate(()=>{})
    //         new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))), // Wait for the new page to open
            
    //         page.click('.listing_dt_logo-box') // This will open a new window/tab
    //     ]);

    // await page.evaluate(()=>{
    //     document.addEventListener('click', (event)=>{
    //         const clickedElement=event.target;
    //         console.log(clickedElement);
    //     })
    // })


    browser.once('targetcreated', async(target)=>{
        const newPage=await target.page();
        console.log(newPage);
        page.click('.listing_dt_logo-box')
    })

    for(let i=1; i<=1; i++){
        await new Promise(resolve => {
            console.log(`Waiting for you to select a hackathon... (${i})`);
            setTimeout(resolve, 1000); // Delay for 10 seconds, allowing user time to choose
        });
    
        // Open the new tab/window when you click the hackathon card
        const [newPage] = await Promise.all([
            new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
            page.click('.listing_dt_logo-box') // Click the chosen hackathon card
        ]);

            await newPage.waitForSelector('.on_unstop.register_btn', {visible:true}); // Wait for the "Register" button to appear

            // Click on the "Register" button on the new page
            await newPage.click('.on_unstop.register_btn');

            // Wait for the dropdown trigger to appear and click it
            // await page.waitForSelector('div[id="mat-select-value-1"]', { visible: true });
            // console.log("Waiting for the result")
            // await page.click('div[id="mat-select-value-1"]'); // Open the dropdown
            
            // console.log("Waiting for the result")
            // // Wait for the dropdown options to appear
            // await page.waitForSelector('.mat-mdc-option', { visible: true }); // Adjust selector as needed
            // console.log("Waiting for the result")
            // // Click the specific option you want (in your case "B. Tech/BE")
            // await page.click('mat-option:has(span.mdc-list-item__primary-text:contains("B. Tech/BE"))'); // Example using pseudo-class if supported

            // console.log("Waiting for the result")

            await new Promise(function(resolve,reject){                           
                return setTimeout(resolve, 1000);
            });

            await page.click('.mat-mdc-select-value ');
            console.log("Clicked dropdown");
            await page.waitForSelector('.mat-option="1"', {visible:true});

            // Wait for the dropdown options to appear
            await waitForElementVisible('mat-option');
            console.log("Dropdown options appeared");

    }

        // if (newPage) {
        //     console.log('New page detected.');
        // } else {
        //     console.log('No new page detected.');
        // }
        // Perform any additional actions needed on the Hackathon page
        // For example, filling out the registration form, etc.
        // await page.fill('selector_for_registration_field', 'value');
        // await page.click('selector_for_register_button');
        
    } else {
        console.log('Login failed or unexpected page loaded.');
    }

    // Show the home page content
    const content = await page.content();

    // Close the browser
    // await browser.close(); // Uncomment this when you want to close the browser
}

main();
