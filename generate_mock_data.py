
import helper as _
import random
import json

loremipsum = """
Lorem ipsum dolor sit amet, ad scripta partiendo tincidunt mea. 
Adolescens ullamcorper ut duo. Est lorem commodo vivendo eu, ea vim ubique numquam 
legimus. Vis ex congue partiendo. Fabulas probatus convenire has cu, vel mandamus 
repudiare ut, facilisis gloriatur qui eu. Eum in audire accumsan instructior.
"""
loremipsum_array = loremipsum.split(' ')

years = [2016]
DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
WEATHER = ['sunny', 'cloudy']

diary = {}
counter = 0

for year in years:
	for month in range(12):
		for day in range(1, DAYS[month]+1):
			counter += 1
			date = str(year) + _.format_date(month+1) + _.format_date(day)
			diary[date] = {}
			diary[date]["weather"] = WEATHER[counter%(len(WEATHER))]
			if counter >= len(loremipsum_array):
				counter = 1
			content = " ".join(loremipsum_array[0:counter]).replace('\n', '')
			diary[date]["content"] = content
			# if counter < len(loremipsum_array):
			# 	content = " ".join(loremipsum_array[0:counter]).replace('\n', '')
			# 	diary[date]["content"] = content
			# else:
			# 	diary[date]["content"] = []
			# 	for x in range(random.randint(1, 3)):
			# 		diary[date]["content"].append(loremipsum.replace('\n', ''))

with open('mock_data.json', 'w') as f:
	content = "data = '" + json.dumps(diary) + "'"
	f.write(content)
