import scrapy
import json
from pathlib import Path
import sys

class SinhalaSongBookCrawler(scrapy.Spider):
    name = "SinhalaSongBookCrawler"
    counter = 1

    data = {
        'songs': []
    }

    start_urls = [
        'https://sinhalasongbook.com/all-sinhala-song-lyrics-and-chords/'
    ]

    def writeToJson(self):
        with open("/home/due/Documents/ACA/Sem 7/DataMining/IR/project/data/original_data.json", 'a', encoding="utf8") as outfile:
            json.dump(self.data, outfile, ensure_ascii=False)

    def parse(self, response):
        for link in response.css("div.pt-cv-ifield ::attr(href)").getall():
            if link is not None:
                yield scrapy.Request(response.urljoin(link), callback = self.parseSong)
        yield scrapy.Request(response.css("ul.pt-cv-pagination ::attr(href)").getall()[-1], self.parse)

    def parseSong(self, response):
        self.counter = self.counter + 1
        self.data['songs'].append({
            'title': response.css("h1.entry-title ::text").getall()[0],
            'artists': response.css("div.su-column-inner span.entry-categories a ::text").getall(),
            'genres': response.css("div.su-column-inner span.entry-tags a ::text").getall(),
            'writer': response.css("div.su-column-inner span.lyrics a ::text").getall(),
            'lyrics': response.css("pre ::text").getall()
        })
        print(self.counter)
        print()
        print()
        if (self.counter == 10):
            print()
            self.writeToJson()
            raise scrapy.exceptions.CloseSpider('Reached Limit')