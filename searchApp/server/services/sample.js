const client = require('../es/client');

var keywords = require("../../../data/keyword.json");
var named_entities = require("../../../data/named_entities.json");

const searchService = async(request) => {
    let query = request.query
    let query_words = query.trim().split(" ");
    let removing_query_words = [];

    let size = 100;

    let field_type = '';

    let b_singer = 1;
    let b_unformatted_lyrics = 1;
    let b_title = 1;
    let b_writer = 1;
    

    if (query_words.length > 8) {
        b_unformatted_lyrics = b_unformatted_lyrics + 1;
        field_type = 'best_fields';
    } else {
        field_type = 'cross_fields';
        query_words.forEach(word => {
            word = word.replace('ගේ', '');
            word = word.replace('යන්ගේ', '');
            if (named_entities.artist_names.includes(word)) {
                b_singer = b_singer + 1;
            }
            if (named_entities.writer_names.includes(word)) {
                b_writer = b_writer + 1;
            }
            if (keywords.artist.includes(word)) {
                b_singer = b_singer + 1;
                removing_query_words.push(word);
            }
            if (keywords.write.includes(word)) {
                b_writer = b_writer + 1;
                removing_query_words.push(word);
            }
            if (keywords.song.includes(word)) {
                removing_query_words.push(word);
            }
        });
    }

    removing_query_words.forEach(word => {
        query = query.replace(word, '');
    });

    let fields = [`Singer^${b_singer}`, `Lyricist^${b_writer}`, `Title^${b_title}`,`Lyrics^${b_unformatted_lyrics}`,`Meaning^${b_unformatted_lyrics}`, `Metopher^${b_unformatted_lyrics}`,'Source Domain', 'Target Domain']

    if (request.field) {
        fields = [request.field]
    }


    let result = await client.search({
        index: 'sinhala_songs',
        body: {
            size: size,
            _source: {
                includes: ["Singer", "Title", "Lyricist", "Lyrics", "Metopher", "Meaning", "Target Domain", "Source Domain"]
            },
            query: {
                multi_match: {
                    query: query.trim(),
                    fields: fields,
                    operator: "or",
                    type: field_type
                }
            },
            aggs: {
                "singer_filter": {
                    terms: {
                        field: "Singer.keyword",
                        size: 10
                    }
                },
                "lyricist_filter": {
                    terms: {
                        field: "Lyricist.keyword",
                        size: 10
                    }
                }
            }
        }
    });
    return result;
}

module.exports = searchService;