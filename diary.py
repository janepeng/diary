import argparse
import datetime
import json
from subprocess import call

import constants
import helper as _

now = datetime.datetime.now()

parser = argparse.ArgumentParser()
parser.add_argument('--year', dest='year', default=None)
args = parser.parse_args()

file_content = None
# check if there is raw text file to process
with open('raw', 'r') as f:
	file_content = f.readlines()

# {
# 	date: {
# 		weather: sunny,
# 		content: []
# 	}
# }
new_diary = {}
# if so, convert text to json, save them by year
for line in file_content:
	# print line
	if line.strip():
		date = filter(None, line.split(' '))
		if len(date) > 1 and date[0].lower() in constants.monthes.keys() and _.is_int(date[1]):
			d_date = str(args.year or now.year) + constants.monthes[date[0].lower()] + _.format_date(date[1])
			new_diary[d_date] = {}
			if len(date) > 2:
				new_diary[d_date]['weather'] = date[2].strip()
			# date_obj = datetime.datetime(int(args.year or now.year), int(constants.monthes[date[0].lower()]), int(date[1]))
			# new_diary[d_date]['day'] = date_obj.weekday()
		else:
			if 'content' not in new_diary[d_date]:
				new_diary[d_date]['content'] = []
			new_diary[d_date]['content'].append(line.strip())

# back up data
with open('diary.json', 'r') as f:
    try:
        data = json.load(f)
    # if the file is empty the ValueError will be thrown
    except ValueError:
        data = {}
with open('diary.json', 'a') as f:
	data.update(new_diary)
	json.dump(data, f)
with open('data.json', 'w') as f:
	content = "data = '" + json.dumps(data) + "'"
	f.write(content)

# move processed text file to processed folder
dirname = str(now.year) + _.format_date(now.month) + _.format_date(now.day)

command = "mkdir processed/" + dirname
call(command.split())
command = "cp raw processed/" + dirname + "/"
call(command.split())
command = "rm raw"
call(command.split())
command = "cp diary.json processed/" + dirname + "/"
call(command.split())


















