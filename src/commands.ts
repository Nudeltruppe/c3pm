import { action_build } from "./arguments/build.ts";
import { action_init } from "./arguments/init.ts";
import { action_install } from "./arguments/install.ts";
import { action_run } from "./arguments/run.ts";

async function help(args: string[]) {
	if (args.length != 0) {
		throw new Error("Expected no arguments!");
	}

	console.log(`> ${Object.keys(commands).join(", ")}`);
}

export const commands: { [key: string]: (args: string[]) => Promise<void> } = {
	"build": action_build,
	"init": action_init,
	"install": action_install,
	"run": action_run,
	"help": help,
};

export async function on_command(args: string[]) {
	if (args.length < 1) {
		throw new Error("Expected at least1 argument!");
	}

	await commands[args[0]](args.slice(1, args.length));
}
