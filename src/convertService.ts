import { readFile, mkdir, writeFile, copyFile } from "fs/promises";
import { join, extname } from "path";
import { flags } from "@oclif/command";
import dayjs from "dayjs";
import {
  Attachment,
  emotions,
  FlattenedLifecraftEntry,
  formatMapping,
  LifecraftEntry,
  LifecraftExport,
} from "./lifecraftExport";
import YAML from "yaml";
const groupBy = require("lodash.groupby");
import glob from "glob";

export class ConvertService {
  private supportedVersion = "1.0";

  constructor(
    private exportFilePath: string,
    private outdir: string,
    private withMetadata: boolean,
    private withFlattenedMetadata: boolean,
    private withEmbeddedAttachments: boolean
  ) {}

  private createDir = async (path: string) => {
    try {
      await mkdir(path);
    } catch (e) {
      // already exists
    }
  };

  private findFiles = (pattern: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      glob(pattern, (error, files) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  };

  private readExport = async (): Promise<LifecraftExport> => {
    const exportJsonPath = await this.findFiles(
      join(this.exportFilePath, "*.json")
    );
    if (exportJsonPath.length === 0) {
      throw new Error("No JSON files found in export");
    }

    if (exportJsonPath.length >= 1) {
      console.warn(
        "Multiple JSON files found in export. Taking first one:",
        exportJsonPath[0]
      );
    }

    const exportJson: LifecraftExport = JSON.parse(
      await readFile(exportJsonPath[0], "utf-8")
    );

    if (exportJson.metadata.version !== this.supportedVersion) {
      throw new Error(
        `Version of selected export ${exportJson.metadata.version} is not supported ${this.supportedVersion}.`
      );
    }
    return exportJson;
  };

  private flattenMetadata = (
    entry: LifecraftEntry,
    entryDateFormat: string,
    entryIndex: number
  ): FlattenedLifecraftEntry => ({
    timestamp: dayjs(entry.dateCreated).toISOString(),
    tags: entry.tags?.length > 0 ? entry.tags : [],
    emotions:
      entry.emotions?.length > 0
        ? entry.emotions.map(
            (emotion) =>
              emotions[Math.floor(emotion.code / 100) - 1][
                Math.floor((emotion.code / 100 - 1) * 100) - 1
              ]
          )
        : [],
    attachments:
      entry.attachments?.length > 0
        ? entry.attachments.map((attachment, index) =>
            this.getAttachmentDestinationPath(
              ".",
              entryDateFormat,
              entryIndex,
              index,
              attachment.type
            )
          )
        : [],
  });

  private prepareMarkdownContent = (
    entry: LifecraftEntry,
    entryDateFormat: string,
    entryIndex: number
  ): string => {
    const text = entry.text;
    delete entry["text"];

    const content = [];

    if (this.withMetadata) {
      const yamlMetadata = YAML.stringify(
        this.withFlattenedMetadata
          ? this.flattenMetadata(entry, entryDateFormat, entryIndex)
          : entry
      );
      content.push(`---\n${yamlMetadata}---`);
    }

    content.push(text);

    if (this.withEmbeddedAttachments && entry.attachments?.length > 0) {
      content.push(
        ...entry.attachments.map(
          (attachment, index) =>
            `![](${this.getAttachmentDestinationPath(
              ".",
              entryDateFormat,
              entryIndex,
              index,
              attachment.type
            )})`
        )
      );
    }

    return content.join("\n");
  };

  private writeMarkdownEntry = async (
    entry: LifecraftEntry,
    entryDateFormat: string,
    entryIndex: number,
    entryAmount: number
  ) => {
    const entryFileName = `${entryDateFormat}${
      entryAmount > 1 ? `_${entryIndex + 1}` : ""
    }.md`;
    const entryFilePath = join(this.outdir, entryDateFormat, entryFileName);
    const entryContent = this.prepareMarkdownContent(
      entry,
      entryDateFormat,
      entryIndex
    );
    await writeFile(entryFilePath, entryContent);
  };

  private getAttachmentDestinationPath = (
    basePath: string = ".",
    entryDateFormat: string,
    entryIndex: number,
    attachmentIndex: number,
    type: string
  ) => {
    const extension = extname(type).replace(".", "");
    return join(
      basePath,
      "attachments",
      `${entryDateFormat}_${entryIndex + 1}_${attachmentIndex + 1}.${
        formatMapping[extension] ?? extension
      }`
    );
  };

  private copyAttachments = async (
    entry: LifecraftEntry,
    entryDateFormat: string,
    entryIndex: number
  ) => {
    const entryPath = join(this.outdir, entryDateFormat);
    await Promise.all(
      entry.attachments.map(async (attachment, attachmentIndex) => {
        const ext = extname(attachment.type).replace(".", "");
        const attachmentFilename = `${attachment.identifier}.${
          formatMapping[ext] ?? ext
        }`;
        const attachmentDestination = this.getAttachmentDestinationPath(
          entryPath,
          entryDateFormat,
          entryIndex,
          attachmentIndex,
          attachment.type
        );
        this.createDir(join(entryPath, "attachments"));
        try {
          await copyFile(
            join(this.exportFilePath, "Attachments", attachmentFilename),
            attachmentDestination
          );
        } catch (e) {
          console.error(`Failed to copy attachment: ${e}`);
        }
      })
    );
  };

  private convertEntry = async (
    entry: LifecraftEntry,
    entryIndex: number,
    entryAmount: number
  ) => {
    const entryDateFormat = dayjs(entry.dateAssigned).format("YYYY-MM-DD");
    await this.createDir(join(this.outdir, entryDateFormat));
    await this.writeMarkdownEntry(
      entry,
      entryDateFormat,
      entryIndex,
      entryAmount
    );
    if (entry.attachments && entry.attachments.length > 0) {
      await this.copyAttachments(entry, entryDateFormat, entryIndex);
    }
  };

  private convertEntries = async (lifecraftExport: LifecraftExport) => {
    await Promise.all(
      Object.entries(
        groupBy(lifecraftExport.entries, (entry: LifecraftEntry) =>
          dayjs(entry.dateAssigned).format("YYYY-MM-DD")
        )
      ).map(async ([_, entries]: [string, any]) =>
        entries.map(async (entry: LifecraftEntry, index: number) =>
          this.convertEntry(entry, index, entries.length)
        )
      )
    );
  };

  convert = async () => {
    const lifecraftExport = await this.readExport();
    await this.createDir(this.outdir);
    await this.convertEntries(lifecraftExport);
  };
}
