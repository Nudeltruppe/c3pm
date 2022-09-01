import { actionBuild } from "../arguments/build.ts";
import { actionInit } from "../arguments/init.ts";
import { actionInstall } from "../arguments/install.ts";
import { actionRun } from "../arguments/run.ts";

// should parse command line arguments
// i.e.: install to install a library from github, run to build and then run, build to just build, etc.
export function parseArgs(args: Array<string>) {
	// args[0] should be the action
	// args[1..] should ge the arguments
	switch (args[0]) {
		case "init":
			actionInit(args[1]);
			break;

		case "install":
			actionInstall(args.slice(1, args.length));
			break;

		case "run":
			actionRun();
			break;
		
		case "build":
			actionBuild();
			break;

		default:
			console.log('ERROR: unrecognized action "' + args[0] + '"');
			break;
	}
}
