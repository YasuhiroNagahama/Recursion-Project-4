const config = {
  url: "https://api.recursionist.io/builder/computers",
  optionInitial: `<option value="">-</option>`,
  count: 1,
};

const storageInfo = {
  hddStorageList: [
    "250GB",
    "300GB",
    "450GB",
    "500GB",
    "1TB",
    "1.5TB",
    "2TB",
    "3TB",
    "4TB",
    "5TB",
    "6TB",
    "8TB",
    "10TB",
    "12TB",
  ],
  ssdStorageList: [
    "58GB",
    "118GB",
    "128GB",
    "250GB",
    "256GB",
    "280GB",
    "400GB",
    "480GB",
    "500GB",
    "512GB",
    "800GB",
    "960GB",
    "1TB",
    "2TB",
    "4TB",
  ],
  hddStorageBrandList: ["WD", "HGST", "Seagate", "Toshiba", "Hitachi"],
  ssdStorageBrandList: [
    "Intel",
    "Samsung",
    "Sabrent",
    "Corsair",
    "Gigabyte",
    "HP",
    "Crucial",
    "WD",
    "Adata",
    "SanDisk",
    "Mushkin",
    "Seagate",
    "XPG",
    "Plextor",
    "Nvme",
    "Zotac",
  ],
  currentStorageType: "",
};

class DecisionModel {
  static benchmarkList = {};

  // 以下の書き方を理解する
  static async fetchApiData(dataType) {
    const response = await fetch(config.url + "?type=" + dataType);
    const data = await response.json();
    return data;
  }

  static createOptionElement(content) {
    const option = document.createElement("option");
    option.innerHTML = content;

    return option;
  }

  static modelStringParsing(modelData) {
    const test = modelData.substring(modelData.lastIndexOf(" ") + 1);
    return test[0];
  }

  static updateCpuModelBox() {
    const cpuBrandBox = document.getElementById("select-box-cpu-brand");
    const cpuModelBox = document.getElementById("select-box-cpu-model");

    cpuBrandBox.addEventListener("input", function () {
      // 中身を初期化
      cpuModelBox.innerHTML = config.optionInitial;

      if (cpuBrandBox.value == "") return false;

      const currentBrand = cpuBrandBox.value;

      DecisionModel.fetchApiData("cpu").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Brand == currentBrand) {
            cpuModelBox.append(
              DecisionModel.createOptionElement(data[i].Model)
            );
          }
        }
      });
    });

    cpuModelBox.addEventListener("input", function () {
      if (cpuModelBox.value == "") return false;

      const currentModel = cpuModelBox.value;

      DecisionModel.fetchApiData("cpu").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Model == currentModel) {
            DecisionModel.benchmarkList["cpu"] = Number(
              Number(data[i].Benchmark)
            );
          }
        }
      });
    });
  }

  static updateGpuModelBox() {
    const gpuBrandBox = document.getElementById("select-box-gpu-brand");
    const gpuModelBox = document.getElementById("select-box-gpu-model");

    gpuBrandBox.addEventListener("input", function () {
      // 中身を初期化
      gpuModelBox.innerHTML = config.optionInitial;

      if (gpuBrandBox.value == "") return false;

      const currentBrand = gpuBrandBox.value;

      DecisionModel.fetchApiData("gpu").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Brand == currentBrand) {
            gpuModelBox.append(
              DecisionModel.createOptionElement(data[i].Model)
            );
          }
        }
      });
    });

    gpuModelBox.addEventListener("input", function () {
      if (gpuModelBox.value == "") return false;

      const currentModel = gpuModelBox.value;

      DecisionModel.fetchApiData("gpu").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Model == currentModel) {
            DecisionModel.benchmarkList["gpu"] = Number(
              Number(data[i].Benchmark)
            );
          }
        }
      });
    });
  }

  static updateRamModelBox() {
    const ramBox = document.getElementById("select-box-ram");
    const ramBrandBox = document.getElementById("select-box-ram-brand");
    const ramModelBox = document.getElementById("select-box-ram-model");

    ramBox.addEventListener("input", function () {
      ramBrandBox.value = "";
      ramModelBox.innerHTML = config.optionInitial;
    });

    ramBrandBox.addEventListener("input", function () {
      // 中身を初期化
      ramModelBox.innerHTML = config.optionInitial;

      if (ramBox.value == "") return false;

      const currentQty = ramBox.value;
      const currentBrand = ramBrandBox.value;

      DecisionModel.fetchApiData("ram").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Brand == currentBrand) {
            const modelString = DecisionModel.modelStringParsing(data[i].Model);
            if (modelString == currentQty) {
              ramModelBox.append(
                DecisionModel.createOptionElement(data[i].Model)
              );
            }
          }
        }
      });
    });

    ramModelBox.addEventListener("input", function () {
      if (ramModelBox.value == "") return false;

      const currentModel = ramModelBox.value;

      DecisionModel.fetchApiData("ram").then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Model == currentModel) {
            DecisionModel.benchmarkList["ram"] = Number(
              Number(data[i].Benchmark)
            );
          }
        }
      });
    });
  }

  static updateStorageModelBox() {
    const storageDevice = document.getElementById("select-box-storage-device");
    const storageBox = document.getElementById("select-box-storage");
    const storageBrandBox = document.getElementById("select-box-storage-brand");
    const storageModelBox = document.getElementById("select-box-storage-model");

    storageDevice.addEventListener("input", function () {
      // 中身を初期化
      storageBox.innerHTML = config.optionInitial;
      storageBrandBox.innerHTML = config.optionInitial;

      if (storageDevice.value == "hdd") {
        for (let i = 0; i < storageInfo.hddStorageList.length; i++) {
          storageBox.append(
            DecisionModel.createOptionElement(storageInfo.hddStorageList[i])
          );
        }

        for (let i = 0; i < storageInfo.hddStorageBrandList.length; i++) {
          storageBrandBox.append(
            DecisionModel.createOptionElement(
              storageInfo.hddStorageBrandList[i]
            )
          );
        }

        currentStorageType = "hdd";
      } else if (storageDevice.value == "ssd") {
        for (let i = 0; i < storageInfo.ssdStorageList.length; i++) {
          storageBox.append(
            DecisionModel.createOptionElement(storageInfo.ssdStorageList[i])
          );
        }

        for (let i = 0; i < storageInfo.ssdStorageBrandList.length; i++) {
          storageBrandBox.append(
            DecisionModel.createOptionElement(
              storageInfo.ssdStorageBrandList[i]
            )
          );
        }

        currentStorageType = "ssd";
      }
    });

    storageBox.addEventListener("input", function () {
      storageBrandBox.value = "";
      storageModelBox.innerHTML = config.optionInitial;
    });

    storageBrandBox.addEventListener("input", function () {
      // 中身を初期化
      storageModelBox.innerHTML = config.optionInitial;

      if (storageDevice.value == "" || storageBox.value == "") return false;

      const currentStorage = storageBox.value;
      const currentBrand = storageBrandBox.value;

      DecisionModel.fetchApiData(storageDevice.value).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].Brand == currentBrand &&
            data[i].Model.indexOf(" " + currentStorage) != -1
          ) {
            storageModelBox.append(
              DecisionModel.createOptionElement(data[i].Model)
            );
          }
        }
      });
    });

    storageModelBox.addEventListener("input", function () {
      if (storageModelBox.value == "") return false;

      const currentModel = storageModelBox.value;

      DecisionModel.fetchApiData(storageDevice.value).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Model == currentModel) {
            DecisionModel.benchmarkList["storage"] = Number(data[i].Benchmark);
          }
        }
      });
    });
  }
}

class BuildComputer {
  static calculateGamingPCPerformance(benchList) {
    return storageInfo.currentStorageType == "ssd"
      ? Math.floor(
          benchList["cpu"] * 0.25 +
            benchList["gpu"] * 0.6 +
            benchList["ram"] * 0.125 +
            benchList["storage"] * 0.1
        ) + "%"
      : Math.floor(
          benchList["cpu"] * 0.25 +
            benchList["gpu"] * 0.6 +
            benchList["ram"] * 0.125 +
            benchList["storage"] * 0.025
        ) + "%";
  }

  static calculateWorkingPCPerformance(benchList) {
    return (
      Math.floor(
        benchList["cpu"] * 0.6 +
          benchList["gpu"] * 0.25 +
          benchList["ram"] * 0.1 +
          benchList["storage"] * 0.05
      ) + "%"
    );
  }

  static createPcInfoHtml() {
    // 全てのインプットタグ要素を取得
    const cpuBrandBox = document.getElementById("select-box-cpu-brand");
    const cpuModelBox = document.getElementById("select-box-cpu-model");
    const gpuBrandBox = document.getElementById("select-box-gpu-brand");
    const gpuModelBox = document.getElementById("select-box-gpu-model");
    const ramBox = document.getElementById("select-box-ram");
    const ramBrandBox = document.getElementById("select-box-ram-brand");
    const ramModelBox = document.getElementById("select-box-ram-model");
    const storageDevice = document.getElementById("select-box-storage-device");
    const storageBox = document.getElementById("select-box-storage");
    const storageBrandBox = document.getElementById("select-box-storage-brand");
    const storageModelBox = document.getElementById("select-box-storage-model");

    // addPCボタン要素を取得
    const addPcBtn = document.getElementById("pc-btn");

    addPcBtn.addEventListener("click", function () {
      if (
        cpuBrandBox.value == "" ||
        cpuModelBox.value == "" ||
        gpuBrandBox.value == "" ||
        gpuModelBox.value == "" ||
        ramBox.value == "" ||
        ramBrandBox.value == "" ||
        ramModelBox.value == "" ||
        storageDevice.value == "" ||
        storageBox.value == "" ||
        storageBrandBox.value == "" ||
        storageModelBox.value == ""
      ) {
        alert("入力されていない項目があります。");

        return false;
      }

      const pcInfoWrap = document.getElementById("pc-info-wrap");
      const pcInfo = document.createElement("div");
      pcInfo.classList.add(
        "d-flex",
        "flex-column",
        "gap-5",
        "bg-dark",
        "py-4",
        "px-2"
      );

      const gamePerf = BuildComputer.calculateGamingPCPerformance(
        DecisionModel.benchmarkList
      );
      const workPerf = BuildComputer.calculateWorkingPCPerformance(
        DecisionModel.benchmarkList
      );

      pcInfo.innerHTML = `    
      <h1 class="h1 text-center text-white fw-bold">Your PC ${config.count}</h1>
      <div class="pc-parts-wrapper text-white border border-4 border-white p-4">
        <h1 class="pc-parts-type h1 fw-bold border-bottom border-white">CPU</h1>
        <ul class="pc-parts-list mt-3">
          <li class="pc-parts-item h4">Brand : ${cpuBrandBox.value}</li>
          <li class="pc-parts-item h4">Model : ${cpuModelBox.value}</li>
        </ul>
      </div>
      <div class="pc-parts-wrapper text-white border border-4 border-white p-4">
        <h1 class="pc-parts-type h1 fw-bold border-bottom border-white">GPU</h1>
        <ul class="pc-parts-list mt-3">
          <li class="pc-parts-item h4">Brand : ${gpuBrandBox.value}</li>
          <li class="pc-parts-item h4">Model : ${gpuModelBox.value}</li>
        </ul>
      </div>
      <div class="pc-parts-wrapper text-white border border-4 border-white p-4">
        <h1 class="pc-parts-type h1 fw-bold border-bottom border-white">RAM</h1>
        <ul class="pc-parts-list mt-3">
          <li class="pc-parts-item h4">Brand : ${ramBrandBox.value}</li>
          <li class="pc-parts-item h4">Model : ${ramModelBox.value}</li>
        </ul>
      </div>
      <div class="pc-parts-wrapper text-white border border-4 border-white p-4">
        <h1 class="pc-parts-type h1 fw-bold border-bottom border-white">
          STORAGE
        </h1>
        <ul class="pc-parts-list mt-3">
          <li class="pc-parts-item h4">Disk : ${storageDevice.value.toUpperCase()}</li>
          <li class="pc-parts-item h4">Storage : ${storageBox.value}</li>
          <li class="pc-parts-item h4">Brand : ${storageBrandBox.value}</li>
          <li class="pc-parts-item h4">Model : ${storageModelBox.value}</li>
        </ul>
      </div>

      <div class="pc-perf-wrapper h1 text-white">
        <h1 class="pc-perf-title text-center">PC PERFORMANCE</h1>
        <ul class="pc-perf-list d-flex justify-content-center align-items-center gap-5 mt-4">
          <li class="pc-perf-item fw-bold">Gaming : ${gamePerf}</li>
          <li class="pc-perf-item fw-bold">Work : ${workPerf}</li>
        </ul>
      </div>`;

      pcInfoWrap.append(pcInfo);
      config.count++;

      alert("新たにPC情報が追加されました。");
    });
  }
}

DecisionModel.updateCpuModelBox();
DecisionModel.updateGpuModelBox();
DecisionModel.updateRamModelBox();
DecisionModel.updateStorageModelBox();

BuildComputer.createPcInfoHtml();
