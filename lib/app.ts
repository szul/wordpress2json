/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/shelljs/index.d.ts" />
/// <reference path="../node_modules/@types/yargs/index.d.ts" />

import * as fs from "fs";
import * as path from "path";
import * as shelljs from "shelljs";
import * as yargs from "yargs"; 

interface Image {
      url: string
    , title?: string
}

interface Enclosure {
      url: string
    , type?: string
    , length?: number
}

interface Post {
      title: string
    , description?: string
    , summary?: string
    , link: string
    , pubdate: Date
    , author: string
    , image?: Image
    , enclosure?: Enclosure
}

var argv = yargs.argv._;
var Posts: Array<Post> = [];
var feedparser = require("feedparser");
var feed = path.join(shelljs.pwd().toString(), argv[0]);
var parser = new feedparser();

function getImage(item: any): Image {
    if(item.image != null && item.image.url != null) {
        return item.image;
    }
    if(item.enclosures != null) {
        for(let i = 0; i < item.enclosures.length; i++) {
            if(item.enclosures[i].type === "image") {
                return {
                    url: item.enclosures[i].url
                };
            }
        }
    }
}
function getEnclosure(item: any): Enclosure {
    if(item.enclosures != null) {
        for(let i = 0; i < item.enclosures.length; i++) {
            if(item.enclosures[i].type === "audio/mpeg") {
                return { 
                      url: item.enclosures[i].url
                    , type: item.enclosures[i].type
                    , length: item.enclosures[i].length
                };
            }
        }
    }
}
function saveFile(): boolean {
    try {
        fs.writeFileSync(path.normalize(path.join(shelljs.pwd().toString(), "wordpress.json")), JSON.stringify(Posts));
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

fs.createReadStream(feed).pipe(parser);

parser.on("readable", () => {
    let item = null;
    while(item = parser.read()) {
        let image: Image = getImage(item);
        let enclosure: Enclosure = getEnclosure(item);
        let post: Post = {
              title: item.title
            , description: item.description
            , summary: item.summary
            , link: item.link
            , pubdate: item.pubdate
            , author: item.author
            , image: image
            , enclosure: enclosure
        };
        Posts.push(post);
    }
    saveFile();
}).on("error", (err) => {
    console.log(err);
});
