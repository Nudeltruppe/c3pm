import { ConfigParser } from "../config.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";

function exitWithMessage(message: String) {
	console.log(message);
	Deno.exit();
}

async function buildDirectory(dir: string, entry: string, build: string, file_count: number): Promise<number> {
	for (let x of Deno.readDirSync(dir)) {
		if (x.isDirectory) {
			buildDirectory(dir + x.name + "/", dir + entry, build, file_count);
		} else if ((x.name.endsWith(".cpp") || x.name.endsWith(".c")) && x.name != dir + entry) {
			let hpp_file_exists = await exists(dir + x.name.split(".cpp")[0] + ".hpp").then((result) => result);
			let h_file_exists = await exists(dir + x.name.split(".c")[0] + "h").then((result) => result);

			if (hpp_file_exists || h_file_exists) {
				Deno.run({
					cmd: ["clang", "-c", dir + x.name, "-o", build + file_count.toString() + ".o"],
				});
				file_count += 1;
			}
		}
	}
	return file_count;
}

export async function action_build() {
	/*
    1. Build all libs in /libs/ recursively. Put all .a files in the build dir
    2. Build all the files in the src dir recursively. Put all .o files in the build dir
    3. compile the main file with all the .a files into a single standalone executable
    */

	// check wether file exists or not
	exists("./config.c3pm").then((result) => result ? result : exitWithMessage("No config found :(\nAborting!"));

	// parse file
	let my_parser = new ConfigParser(Deno.readTextFileSync("./config.c3pm"));
	my_parser.parse();

	let file_count: number = 0;
	for (let section of my_parser.sections) {
		let root: string = Deno.cwd();
        let build_dir: string = Deno.realPathSync("./build/")+"/";
		let name: string;
		let entry_point: string;
		let src_dir: string;
		let depends: Array<string>;

		name = my_parser.get("name", section);
		entry_point = my_parser.get("entry_point", section);
		src_dir = my_parser.get("src_dir", section);

		// Step 1: Build all libs in the lib folder and output them into build
		for (const entry of Deno.readDirSync("./libs/")) {
			if (entry.isDirectory) {
				// execute make
				let current_working_directory: string = "./libs/" + entry.name + "/";
				Deno.chdir(current_working_directory);
				Deno.run({
					cmd: ["make"],
				});

				for (const file of Deno.readDirSync("./")) {
					if (file.isFile && file.name.endsWith(".a")) { // valid library binary to link
						Deno.copyFileSync("./" + file.name, root + "build/" + file_count.toString() + ".a");
						file_count += 1;
					}
				}
				Deno.chdir(root);
			}
		}

		// Step 2: build src dir
		file_count = await buildDirectory(src_dir, entry_point, build_dir, file_count);

        // Step 3: compile and link
        let command: Array<string> = ["clang++", "-o", name, entry_point];
        for (let x of Deno.readDirSync(build_dir)) {
            command.push(build_dir+x.name);
        }

        Deno.run({
            cmd: command,
        });

        // Step 4: Cleanup build dir
        await Deno.remove(build_dir, {recursive: true});
        await Deno.mkdir(build_dir);
	}
}
