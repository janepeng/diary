
def is_int(val):
    try:
        val = int(val)
        return True
    except (ValueError, TypeError):
        return False

def format_date(date):
	date = str(date)
	if len(date) == 1:
		date = '0' + date
	return date

def print_dictionary(d):
	print '{'
	for date in d:
		print date, ': '
		for k in d[date]:
			if (isinstance(d[date][k], list)):
				print k, ': ', ', '.join(d[date][k])
			else:
				print k, ': ', d[date][k]
	print '}'
