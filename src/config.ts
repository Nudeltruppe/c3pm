export interface ConfigSections {
	[key: string]: { [key: string]: any };
}

export class ConfigParser {
	valid_stanzas: Array<string> = ["name", "entry_point", "src_dir"];
	required_stanzas: Array<string> = ["name", "entry_point", "src_dir"];
	config: string;

	sections: Array<string> = [];
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
				this.sections.push(section);
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
					let key = parts[0].trim();
					if (this.valid_stanzas.includes(key)) {
						this.config_sections[section][key] = JSON.parse(parts[1].trim()) as object;
					} else {
						throw new Error(`Invalid stanza key: "${key}"`);
					}
				} catch (e) {
					this.config_sections[section][parts[0].trim()] = parts[1].trim();
				}
			}
		}

		// check if all required stanzas are found
		for (let req of this.required_stanzas) {
			if (this.config_sections[section][req] == null) {
				throw new Error(`Stanza: "${req}" is required!`);
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
