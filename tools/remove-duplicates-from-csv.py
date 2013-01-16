import os.path
import sys
import csv
try:
    import cStringIO as StringIO
except ImportError:
    import StringIO

if 2 != len(sys.argv):
    print "usage: %s [cookies.csv]" % sys.argv[0]
    exit(1)

if not os.path.isfile(sys.argv[1]):
    print "ERROR: File does not exist, %s" % sys.argv[1]
    exit(2)

with open(sys.argv[1], 'r') as handle:
    reader = csv.reader(handle)
    reader.next()  # Discard header row

    sink = StringIO.StringIO()
    writer = csv.writer(sink, quoting=csv.QUOTE_ALL)

    found = []
    skipped = 0

    for row in reader:
        signature = '-'.join((row[1], row[2], row[3], row[4]))
        if signature not in found:
            found.append(signature)
            writer.writerow(row)
        else:
            skipped += 1

    print sink.getvalue(),
