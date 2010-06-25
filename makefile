package : clean
					cd firefox; zip -r ../beef-taco.xpi *; cd ..

clean :
					rm -f beef-taco.xpi

cookies:
				python tools/cookies-csv-to-js.py > cookies.js
