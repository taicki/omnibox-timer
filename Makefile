all: tst package

package: clean
	cd src && zip ../omnibox-timer.zip *

clean:
	rm -f omnibox-timer.zip

tst:
	open test/SpecRunner.html
