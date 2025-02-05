import { DEFAULT_MAPPINGS, type Mappings } from "$lib/mappings";
import WorkbookData from "$lib/WorkbookData";

const configDir = `${await window.api.homedir()}/.gnucash-importer`

class Configuration {
  workbookFile = $state<string>("");
  workbookPromise = $state<Promise<WorkbookData> | null>(null);
  workbook = $state<WorkbookData>();
  sheetValue = $state<string>("");
  postedAccount = $state<string>("");
  incomeAccount = $state<string>("");
  accumulateSplits = $state<boolean>(true);
  mappings = $state<Mappings>([...DEFAULT_MAPPINGS]);
  action = $state<string>("");
  customerMappings = $state<Record<string, string>>({});
  store = $state<Map<string, any>>();

  constructor() {
    $effect.root(() => {
      $effect(() => {
        this.workbookPromise = this.workbookFile
          ? this.getWorkbook(this.workbookFile)
          : null;
      });

      $effect(() => {
        if (!this.store) return;

        this.store.set("workbookFile", this.workbookFile);
        this.store.set("sheetValue", this.sheetValue);
        this.store.set("postedAccount", this.postedAccount);
        this.store.set("incomeAccount", this.incomeAccount);
        this.store.set("accumulateSplits", this.accumulateSplits);
        this.store.set("mappings", JSON.stringify(this.mappings));
        this.store.set("action", this.action);
        this.store.set(
          "customerMappings",
          JSON.stringify(this.customerMappings),
        );

        this.saveConfiguration().then();
      });
    });
    this.loadConfiguration().then();
  }

  async saveConfiguration() {
    if (!this.store) return;

    await window.api.fileWrite(
      `${configDir}/configuration.json`,
      JSON.stringify(Array.from(this.store.entries())),
    );
  }

  async getWorkbook(sheet: string) {
    this.workbook = await WorkbookData.fromSheet(sheet);
    if (!this.workbook.sheets.find((sheet) => sheet.name === this.sheetValue)) {
      this.sheetValue = this.workbook.sheets[0].name;
    }

    return this.workbook;
  }

  async loadConfiguration() {
    let store = new Map<string, any>();
    if (await window.api.fileExists(`${configDir}/configuration.json`)) {
      store = new Map(
        JSON.parse(
          new TextDecoder().decode(
            await window.api.fileRead(`${configDir}/configuration.json`),
          ),
        ),
      );
    }

    const workbookFile = store.get("workbookFile") as string;
    console.log(workbookFile);
    if (workbookFile && (await window.api.fileExists(workbookFile))) {
      this.workbookFile = workbookFile;
      this.sheetValue = store.get("sheetValue") || "";
      this.mappings = JSON.parse(store.get("mappings") || "{}");
      this.customerMappings = JSON.parse(store.get("customerMappings") || "{}");
    }

    this.action = store.get("action") || "";
    this.postedAccount = store.get("postedAccount") || "";
    this.incomeAccount = store.get("incomeAccount") || "";
    this.accumulateSplits = store.has("accumulateSplits")
      ? store.get("accumulateSplits")
      : true;

    this.store = store;
  }
}

export default new Configuration();
