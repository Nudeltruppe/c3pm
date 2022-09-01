import { readLines } from "https://deno.land/std/io/bufio.ts";

export async function parseFile(file_path: URL | string): Promise<[Array<string>, String]> {
	/*
    1. open file
    2. read evaluate loop line by line

    Should return:
    - [libs]
    - "src_folder"
    - [location of other files]
    */
	const file = await Deno.open(file_path);
	for await (const line of readLines(file)) {
		console.log("Processing:", line);
	}
	// parse actual stanza here

	return [[], ""];
}
