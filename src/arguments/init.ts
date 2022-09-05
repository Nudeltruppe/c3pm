import { ConfigParser, ConfigSections } from "../config.ts";

export async function action_init(path: string[]) {
	await Deno.mkdir(path + "libs", { recursive: true });
	await Deno.mkdir(path + "src", { recursive: true });
	await Deno.mkdir(path + "build", { recursive: true });

	await Deno.create(path + "config.c3pm");
	await Deno.create(path + ".gitignore");
	await Deno.create(path + "src/main.cpp");
	await Deno.create(path + "libs/packages.cfg");

	// write basic stuff into config, gitignore and main.cpp
	var config: ConfigSections = {
		"root": {
			"entry_point": "src/main.cpp",
			"src_dir": "src/",
			"name": "main",
		},
	};
	var config_parser = new ConfigParser("");
	config_parser.config_sections = config;

	Deno.writeTextFileSync(path + "config.c3pm", config_parser.gen());
	Deno.writeTextFileSync(path + "src/main.cpp", '#include <iostream>\n\nint main(void) {\n\tstd::cout << "Hello C++!";\n\treturn 0;\n}\n');
}
