export interface ConfigSections {
	[key: string]: { [key: string]: any };
}

export class ConfigParser {
	config: string;

	config_sections: ConfigSections = {};

	constructor(config: string) {
		this.config = config;
	}

	parse(): void {
		var lines = this.config.split("\n");
		var section = "root";
		for (var line of lines) {
			if (line.startsWith(":")) {
				section = line.substring(1).trim();
			} else if (line.startsWith(";")) {
				// Comment
			} else {
				var parts = line.split("=");
				if (parts.length != 2) {
					continue;
				}

				if (this.config_sections[section] == null) {
					this.config_sections[section] = {};
				}

				try {
					this.config_sections[section][parts[0].trim()] = JSON.parse(parts[1].trim()) as object;
				} catch (e) {
					this.config_sections[section][parts[0].trim()] = parts[1].trim();
				}
			}
		}

		// log("config", this.gen());
	}

	get(key: string, section: string = "root"): any {
		if (this.config_sections[section] == null) {
			throw new Error(`Section ${section} not found`);
		}

		if (this.config_sections[section][key] == null) {
			throw new Error(`Key ${key} not found in section ${section}`);
		}

		return this.config_sections[section][key];
	}

	gen(): string {
		var output = "";
		for (var section in this.config_sections) {
			output += `:${section}\n`;
			for (var key in this.config_sections[section]) {
				output += `${key}=${JSON.stringify(this.config_sections[section][key])}\n`;
			}
			output += "\n";
		}
		return output;
	}

}