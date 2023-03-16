# Website Crawler

This is a Node.js script that crawls a website and exports all the URLs found on that website to a CSV file.

## Installation

1. Clone the repository
2. Install the dependencies using `npm install`

## Usage

To use the script, run the following command:
npm start

`starting_url` is the URL of the website you want to crawl.

## Output

The script exports all the URLs found on the website to a CSV file. The file is named after the domain of the website followed by a timestamp, with a separator. The CSV file is located in the `/export` folder located at the root path.

Each URL is written on a separate row and column in the CSV file.

## Requirements

This script requires Node.js version 10 or higher.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
