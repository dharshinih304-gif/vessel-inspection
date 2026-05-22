const puppeteer = require('puppeteer');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();

  // Log all console messages from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Log all navigations
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log('Navigated to:', frame.url());
    }
  });

  try {
    // We will test the flow described by the user:
    // "click log out then login it taking me to dashboard"
    // Let's go to the main portal login page.
    console.log('Navigating to http://localhost:3001/login');
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });

    console.log('Entering credentials...');
    await page.type('input[type="email"]', 'admin@sellamsoft.com');
    await page.type('input[type="password"]', 'admin123');

    console.log('Clicking login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation timeout')),
      page.click('button[type="submit"]')
    ]);

    console.log('Current URL after login click:', page.url());
    
    // Check if it's the dashboard or superadmin companies
    if (page.url().includes('/dashboard')) {
      console.log('BUG DETECTED: Redirected to dashboard!');
    } else if (page.url().includes('/superadmin/companies')) {
      console.log('SUCCESS: Redirected to superadmin portal!');
    }

    // Now, let's try the logout flow
    console.log('Attempting to logout from the current page...');
    
    // Look for a logout button in the DOM
    const logoutBtn = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Logout') || el.textContent.includes('Log out'));
    });
    
    if (logoutBtn) {
      console.log('Logout button found. Clicking...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation timeout')),
        logoutBtn.click()
      ]);
      console.log('URL after logout:', page.url());
      
      console.log('Logging in again...');
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', 'admin@sellamsoft.com');
      await page.type('input[type="password"]', 'admin123');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation timeout')),
        page.click('button[type="submit"]')
      ]);
      console.log('Final URL after re-login:', page.url());
    } else {
      console.log('Could not find logout button. Logging HTML for debugging...');
      const html = await page.content();
      console.log(html.substring(0, 1000));
    }

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

run();
