const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true});
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});
describe('HTML semantic structure', () => {
    it('HTML `doctype` should be declared', async () => {
        const doctype = await page.evaluate(() => document.doctype.name);
        expect(doctype).toBe('html');
    });
    it('Document should contain `<head>` tag', async () => {
        const markup = fs
            .readFileSync(path.resolve('./index.html'), 'utf8')
       expect(markup).toMatch(/<head/);
    });
    it("Document should contain a `<title>` that's not empty", async () => {
        const markup = fs
            .readFileSync(path.resolve('./index.html'), 'utf8')
        expect(markup).toMatch(/<title>.*<\/title>/);
    });
    it('Document should contain a `<body>` tag', async () => {
        const markup = fs
            .readFileSync(path.resolve('./index.html'), 'utf8')
        expect(markup).toMatch(/<body/);
    });
});
    
describe('Font', () => {
    it("Page should use `Arapey` font", async () => {
        const fontFamily = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-family')));
        expect(fontFamily.filter(f => f.includes('Arapey')).length).toBeGreaterThan(0);
    });
});

describe('Navigation Menu', () => {
    it('Menu items should be aligned horizontally', async () => {
        await page.waitForSelector('a');
        const menu = await page.$$eval('a', (elements) => elements.map((element) => element.getBoundingClientRect().top));
        for (let i = 0; i < menu.length - 1; i++) {
            expect(menu[i]).toBeLessThan(menu[i + 1]);
        }
    });
    it("Links on page should contain valid `href` attributes and redirect User to corresponding sections on page", async () => {
        const links = await page.$$eval('a', (elements) => elements.map((element) => element.getAttribute('href')));
        expect(links).toEqual(expect.arrayContaining([expect.any(String)]));
        await page.goto('file://' + path.resolve('./index.html') + links[1]);
        expect(page.url()).toContain(links[1]);
        const body = await page.$eval('body', el => el.innerHTML);
        expect(body).toBeTruthy();
    });
});
