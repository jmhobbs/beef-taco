package : clean cookies
	cd firefox && cp ../cookies.js chrome/content/cookies.js && zip -r ../beef-taco.xpi * && cd ..

clean :
	rm -f beef-taco.xpi cookies.js

cookies:
	python tools/cookies-csv-to-js.py > cookies.js

diff: cookies
	diff cookies.js firefox/chrome/content/cookies.js
