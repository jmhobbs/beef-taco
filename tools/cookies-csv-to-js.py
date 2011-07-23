# -*- coding: utf-8 -*-

import time
import csv

reader = csv.reader( open( "cookies.csv", "r" ) )

print "// Generated:", time.strftime( "%a, %d %b %Y %H:%M:%S +0000", time.gmtime() )
print "com.github.jmhobbs.beef_taco.cookies = {"

for row in reader:
	# Skip header row
	if row[0] == 'Network':
		continue
	print "\t//", row[0]
	print "\t" + '"' + row[1].replace( '"', '\\"' ) + '" :  [ { path: "' + row[2].replace( '"', '\\"' ) + '", name: "' + row[3].replace( '"', '\\"' ) + '", value: "' + row[4].replace( '"', '\\"' ) + '" } ],'

print "}"
