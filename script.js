import puppeteer from 'puppeteer'; // Using ES module import

import passkey from './passkey.js';


async function main() {
    const browser = await puppeteer.launch({ headless: false }); // Visible browser for debugging
    const page = await browser.newPage();

    // Go to the Unstop login page
    await page.goto('https://unstop.com/auth/login?returnUrl=%2F');
    
    //wait for email selector
    await page.waitForSelector('input[formcontrolname="email" ]', {visible:true});
    // Type in the email
    await page.type('input[formcontrolname="email" ]', passkey.id);
    
    // Type in the password (assuming the correct selector is '#password')
    await page.type('#pwd', passkey.pass);
    
    // Click the login button (using its type="submit")
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForNavigation({timeout: 60000});

    //if login successfully, then 

    if (page.url() === 'https://unstop.com/home' || await page.$('div.home-element')) { // Adjust the URL or selector as needed
        console.log('Login successful! You are now on the home page.');
    } else {
        console.log('Login failed or unexpected page loaded.');
    }

    // Show the home page content
    const content = await page.content();

    // Close the browser
    // await browser.close();--> We will close the browser once our target done

    
}

main();
