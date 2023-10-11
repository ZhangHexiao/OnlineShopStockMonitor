const puppeteer = require('puppeteer');
var sound = require("sound-play");

(async function main() {

  puppeteer.launch({ headless: false, defaultViewport: null }).then(async browser => {
    var foundPhone = false;
    console.log("monitor started")
    //Add the list of the page of product you would like to monitor
    const productPageList = ['https://www.costco.ca/.product.4000221050.html', 'https://www.costco.ca/.product.4000221044.html', 'https://www.costco.ca/.product.4000221048.html', 'https://www.costco.ca/.product.4000221006.html'];

    for (let k = 0; k < productPageList.length; k++) {

      const page2 = await browser.newPage();

      await page2.goto(productPageList[k]);
      await page2.setViewport({
        width: 1200,
        height: 800
      });

      await page2.evaluate(() => {
        window.scrollTo(0, 550);
      });

      let foundPhone = await page2.evaluate(async () => {
        //Need to figure out the selector to monitor
        let colorElements = document.getElementById('swatches-productOption00').getElementsByClassName('selection-item');
        for (let i = 0; i < colorElements.length; i++) {
          await colorElements[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          let memoryElements = document.getElementById('swatchesID-productOption01').getElementsByClassName('selection-item');
          for (let j = 0; j < memoryElements.length; j++) {
            await memoryElements[j].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            let addTOCartButton = document.getElementById('add-to-cart-btn');
            if (addTOCartButton.value !== 'Out of Stock') {
              return true;
            }
          }

        }
      });

      if (foundPhone) {
        await sound.play("haoyunlai.mp3");
        break;
      } else {
        //This is the Product page list -1
        if (k == 3) {
          k = 0
        }
      }
      await page2.close();
    }
  })
})();

