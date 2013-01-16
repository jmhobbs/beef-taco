import sys
import os
import csv
import datetime
try:
    import cStringIO as StringIO
except ImportError:
    import StringIO

if 4 != len(sys.argv):
    print "usage: %s [cookies.txt] [information page] [notes]" % sys.argv[0]
    exit(1)

if not os.path.isfile(sys.argv[1]):
    print "ERROR: File does not exist, %s" % sys.argv[1]
    exit(2)

with open(sys.argv[1], 'r') as handle:
    sink = StringIO.StringIO()
    writer = csv.writer(sink, quoting=csv.QUOTE_ALL)
    for line in handle:
        split = line.strip('\r\n').split('\t')
        writer.writerow((split[0], split[0], split[2], split[5], split[6], datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'), sys.argv[2], sys.argv[3]))
    print sink.getvalue(),
