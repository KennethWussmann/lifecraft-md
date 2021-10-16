import { join } from "path";
import { Command, flags } from "@oclif/command";
import glob from "glob";
import { ConvertService } from "./convertService";

class LifecraftToMarkdownConverter extends Command {
  static description = "Convert Lifecraft exports to markdown files";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h", description: "Show usage" }),
    outdir: flags.string({
      char: "o",
      default: "out/",
      description: "Output directory of conversion result",
    }),
    metadata: flags.boolean({
      char: "m",
      default: false,
      description: "Prepend entry metadata as YAML before markdown",
    }),
    flatten: flags.boolean({
      char: "f",
      default: false,
      description: "Flatten the metadata",
    }),
    embed: flags.boolean({
      char: "e",
      default: true,
      description: "Embed attachments as images in markdown",
      allowNo: true,
    }),
  };

  static args = [
    {
      name: "export",
      required: false,
      description: "Lifecraft export file in .lifecraftex format",
    },
  ];

  run = async () => {
    const { args, flags } = this.parse(LifecraftToMarkdownConverter);
    if (!args.export) {
      console.error("No export given.");
      process.exit(1);
    }

    await new ConvertService(
      args.export,
      flags.outdir,
      flags.metadata,
      flags.flatten,
      flags.embed
    ).convert();
    console.log("Done!");
  };
}

export = LifecraftToMarkdownConverter;
