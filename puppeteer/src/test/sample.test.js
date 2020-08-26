const timeout = 10000;

beforeAll(async () => {
    jest.setTimeout(10000);
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.waitFor(3000);
    await page.click('button');
    await page.waitFor(5000);
});

describe("Test Register", () => {
    test("Title of the page", async () => {
        const title = await page.title();
        expect(title).toBe("Angular 6 User Registration and Login Example");
    }, timeout);

    test("Header of the page", async () => {
        const h2Handle = await page.$("h2");
        const html = await page.evaluate(h2Handle => h2Handle.innerHTML, h2Handle);
        expect(html).toBe("Register");
    }, timeout);

    test("Cancel Fill in form", async () => {
        await page.click('.btn-link');
        const h2Handle = await page.$("h2");
        const html = await page.evaluate(h2Handle => h2Handle.innerHTML, h2Handle);
        expect(html).toBe("Login");
        await page.goto(URL, { waitUntil: "domcontentloaded" });
        await page.waitFor(5000);
    }, timeout);

    test("Fill in form and register", async () => {
        const firstNameInput = await page.$('[formcontrolname="firstName"]');
        await firstNameInput.type('First');
        const lasttNameInput = await page.$('[formcontrolname="lastName"]');
        await lasttNameInput.type('Last');
        const userNameInput = await page.$('[formcontrolname="username"]');
        await userNameInput.type('test123');
        const passwordInput = await page.$('[formcontrolname="password"]');
        await passwordInput.type('test123.');
        await page.click('.btn-primary');
        await page.waitFor(5000);
        const message = await page.$(".alert-success");
        const text = await page.evaluate(message => message.innerHTML, message);
        expect(text).toBe("Registration successful");
    }, timeout);

    test("Login", async () => {
        const userNameInput = await page.$('[formcontrolname="username"]');
        await userNameInput.type('test123');
        const passwordInput = await page.$('[formcontrolname="password"]');
        await passwordInput.type('test123.');
        await page.click('.btn-primary');
        await page.waitFor(3000);
        const h1Handle = await page.$("h1");
        const html = await page.evaluate(h1Handle => h1Handle.innerHTML, h1Handle);
        expect(html).toBe("Hi First!");
    }, timeout);
});
