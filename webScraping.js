const puppeteer = require('puppeteer');

async function hacerScraping(busqueda){

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 100
    });
    const page = await browser.newPage();

    await page.goto('https://es.wallapop.com');
    await page.waitForSelector('#onetrust-button-group-parent');

    const cookie = '#onetrust-accept-btn-handler';
    const barra_busqueda = '#searchbox-form-input';

    await page.click(cookie);
    await page.type(barra_busqueda, busqueda);
    //await new Promise(resolve => setTimeout(resolve, 2000));
    await page.keyboard.press('Enter');

    await page.waitForSelector('.ItemCardList__item');
    //await new Promise(resolve => setTimeout(resolve, 5000));

    const resultados = await page.evaluate(() => {

        const items = Array.from(document.querySelectorAll('.ItemCardList__item'));
            
        return items.map((item) => { 
            const titulo = item.querySelector('.ItemCard__title')?.innerText ||  "No hay titulo";                
            const precio = item.querySelector('.ItemCard__price')?.innerText || "No hay precio";
            const foto = item.querySelector('img')?.getAttribute('src') || "No hay foto";
            const link = item.getAttribute('href') || "No hay link";                  
            return {titulo, precio, foto,link}; 
        });


    });

    await browser.close();

    return resultados;

}

module.exports = { hacerScraping };