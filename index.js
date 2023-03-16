const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Starting URL of the website to visit
const startingUrl = 'https://pixl8.com/en/';

// Hostname of the starting URL
const startingUrlHostname = new URL(startingUrl).hostname;

// Set of visited URLs to avoid visiting the same page twice
const visitedUrls = new Set();

// Get current timestamp in YYYYMMDDHHmmss format
const timestamp = new Date().toISOString().replace(/[-T:.]/g, '').slice(0, 14);

// Filepath for the output CSV file
const csvFilePath = path.join(__dirname, 'export', `${startingUrlHostname}-${timestamp}.csv`);

// Create the export directory if it doesn't exist
if (!fs.existsSync(path.dirname(csvFilePath))) {
  fs.mkdirSync(path.dirname(csvFilePath), { recursive: true });
}

// Create a write stream to the CSV file
const writeStream = fs.createWriteStream(csvFilePath, { flags: 'w' });

// Write the header row to the CSV file
writeStream.write('URL\n');

// Recursive function to visit all pages of the website under the same domain
function visitPage(url) {
  // Check if the URL has already been visited
  if (visitedUrls.has(url)) {
    return;
  }

  // Check if the URL is under the same domain as the starting URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    console.error(`Invalid URL: ${url}`);
    return;
  }
  if (parsedUrl.hostname !== startingUrlHostname || !parsedUrl.pathname) {
    return;
  }

  // Check if the URL is a downloadable asset
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.mp3', '.wav'];
  const lastPathnamePart = decodeURIComponent(parsedUrl.pathname.split('/').pop());
  const assetRegex = new RegExp(`(${fileExtensions.join('|')})$`, 'i');
  if (assetRegex.test(lastPathnamePart)) {
    return;
  }

  // Add the URL to the set of visited URLs
  visitedUrls.add(url);

  // Make an HTTP request to the URL
  request(url, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    // Parse the HTML using Cheerio
    const $ = cheerio.load(body);

    // Write the URL to the CSV file
    writeStream.write(`${url}\n`);

    // Find all links on the page and visit them recursively
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        let absoluteUrl;
        try {
          absoluteUrl = new URL(href, url).href;
        } catch (error) {
          console.error(`Invalid URL: ${href}`);
          return;
        }
        visitPage(absoluteUrl);
      }
    });
  });
}

// Start visiting pages from the starting URL
visitPage(startingUrl);
