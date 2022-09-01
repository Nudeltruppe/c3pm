format:
	deno fmt --options-use-tabs --options-line-width 1000

format-commit: format
	git add .
	git commit -m "reformat code"

run:
	deno run c3pm.ts --allow-read

install:
	gm2 run install

compile:
	deno compile c3pm.ts
