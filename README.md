# GNUCash Importer

A simple utility for importing hours worked from spreadsheets directly into GNUCash.

## Disclaimer

I am not responsible for any data loss or corruption that may occur as a result of using this tool. Please make sure to back up your GNUCash file before using this tool.

## Installation

The tool isn't ready to be easily installed in its current state. Please clone the repository instead and follow the following steps.

1. Clone the repository `git clone https://github.com/sverben/gnucash-importer.git`
2. Enter the API directory `cd gnucash-importer/api`
3. Install the native system requirements `sudo apt install weasyprint python3-gnucash`
4. Prepare a virtual environment `python3 -m venv venv --system-site-packages`
5. Activate the virtual environment `source venv/bin/activate`
6. Install the requirements `pip install -r requirements.txt`
7. Copy the sample invoice template `cp templates.example templates`
8. Edit the template to match your needs `nano templates/invoice.html`
9. Enter the client directory `cd ../client`
10. Install the requirements `bun install`

## Usage

You can run the tool by executing the following command: `./start.sh <path-to-gnucash-file>`

## Credits

This tool makes use of the GNUCash Python bindings rest API, the original source can be found on [GitHub](https://github.com/Gnucash/gnucash/tree/stable/bindings/python/example_scripts/rest-api).
