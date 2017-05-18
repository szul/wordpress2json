# wordpress2json

Node application written in TypeScript for parsing an exported WordPress XML file, and converting the data to a JSON array of items

### Installation

To install:

```
git clone https://github.com/szul/wordpress2json.git
cd wordpress2json
npm install
tsc -p tsconfig.json
```

### Using

To run:

```
node dist/app.js YOUR_WORDPRESS_XML_FILE.xml
```

This will create a wordpress.json file in the same directory that you are in, and it will consist of an array of the items that represent the WordPress items (pages/posts) in the XML file.
