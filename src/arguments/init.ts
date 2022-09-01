export async function action_init(path: string[]) {
	await Deno.mkdir(path + "libs", { recursive: true });
	await Deno.mkdir(path + "src", { recursive: true });
	await Deno.mkdir(path + "build", { recursive: true });

	await Deno.create(path + "config.c3pm");
	await Deno.create(path + ".gitignore");
	await Deno.create(path + "src/main.cpp");

	// write basic stuff into config, gitignore and main.cpp
	Deno.writeTextFileSync(path + "config.c3pm", "entryPoint: src/main.cpp\nsrcDir: src/\n\nname: main");
	Deno.writeTextFileSync(path + "src/main.cpp", "#include <iostream>\n\nint main(void) {\n\tstd::cout << \"Hello C++!\";\n\treturn 0;\n}\n");
}
