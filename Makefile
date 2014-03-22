all: package

package: clean
	cd src && zip ../omnibox-timer.zip *

clean:
	rm -f omnibox-timer.zip
