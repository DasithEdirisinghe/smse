import re
import json

files = open("../data/corpus.json", encoding='utf8')

sample = json.load(files)    

for i in sample:
    # print('i ',i["Lyrics"])
    i["Lyrics"] = i["Lyrics"].replace('\\n', ' ')
    i["Lyrics"] = i["Lyrics"].replace('/n', ' ')
    # print('result ',i["Lyrics"])
    


print(sample)



fil = open("../data/corpus_2.json", 'w', encoding='utf8')

json.dump(sample, fil, ensure_ascii=False)




