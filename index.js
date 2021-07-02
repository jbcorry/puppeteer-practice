const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        // {headless: false} // comment this out when not debugging
    );
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/s?bbn=172659&rh=n%3A172659%2Cp_72%3A1248879011&dc&qid=1625262382&rnid=1248877011&ref=lp_172659_nr_p_72_0');

    const result = await page.evaluate(() => {

        // grab the parent element for all product data on the top rated tv page (querySelectorAll returns a NodeList)
        let productsFromPage = document.querySelectorAll('div.s-latency-cf-section > div.a-section.a-spacing-medium > div.a-section.a-spacing-none');
        
        // convert said NodeList into an array so we can map over it and return what we need
        const productArray = [...productsFromPage];
        return productArray.map((productEl) => {

            // the h2 inside of each product el contains the title
            let productName = productEl.querySelector('h2').innerText;

            // for product price, some are not set so a try catch statement will help that be more readable and not throw an error
            let productPrice;
            try {
                productPrice = productEl.querySelector('.a-price > .a-offscreen').innerHTML;
                
            } catch (error) {
                productPrice = 'Price not listed';
            }

            // return requested data for each product
            return {
                name: productName,
                price: productPrice
            };
        });
    });

    console.log(result);

    // takes a screenshot (dimensions are weird, and can be changed if needed)
    await page.screenshot({path: 'top-tv-page.png'});

    await browser.close();

})()