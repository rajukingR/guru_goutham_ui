// src/utils/generateSpecifications.js
export const generateSpecifications = (item) => {
  const {
    product_category
  } = item;

  switch (product_category) {
    case "Laptop":
      return `
        RAM: ${item.ram || "N/A"},
        Storage: ${item.storage || "N/A"},
        Disk: ${item.disk_type || "N/A"},
        Processor: ${item.processor_model || item.processor || "N/A"} ${item.generation || ""},
        Graphics Card: ${item.graphics || "N/A"},
        OS: ${item.os || "N/A"},
        Screen: ${item.display_size || item.screen_size || "N/A"}.
      `;

    case "Desktop":
      return `
        Model: ${item.model},
        RAM: ${item.ram || "N/A"},
        Processor: ${item.processor || "N/A"},
        Disk Type: ${item.disk_type},
        Storage: ${item.storage || "N/A"},
        Graphics Card: ${item.graphics || "N/A"},
        Motherboard: ${item.motherboard || "N/A"},
        SMPS: ${item.smps || "N/A"},
        Cabinet: ${item.cabinet || "N/A"},
        OS: ${item.os || "N/A"},
        Generation: ${item.generation || "N/A"},
        Wi-Fi: ${item.wifi_standard || "N/A"}.

      `;

    case "Assembled PC":
      return `
        Model: ${item.model},
        RAM: ${item.ram || "N/A"},
        Processor: ${item.processor || "N/A"},
        Disk Type: ${item.disk_type},
        Storage: ${item.storage || "N/A"},
        Graphics Card: ${item.graphics || "N/A"},
        Motherboard: ${item.motherboard || "N/A"},
        SMPS: ${item.smps || "N/A"},
        Cabinet: ${item.cabinet || "N/A"},
        Wi-Fi: ${item.wifi_standard || "N/A"}.
      `;

    case "Monitor":
      return `
        Size: ${item.screen_size || item.display_size || "N/A"},
        Resolution: ${item.resolution || "N/A"},
        Brightness: ${item.brightness || "N/A"}
      `;

    case "Processor":
      return `
        Model: ${item.model || "N/A"},
        Generation: ${item.generation || "N/A"},
        Speed: ${item.speed || item.processor_speed || "N/A"}
      `;

    case "RAM":
      return `
        Size: ${item.ram || item.sizeGb || "N/A"},
        Type: ${item.ramType || "N/A"},
        Speed: ${item.speed || item.ram_speed || "N/A"}
      `;


    case "NVMe Storage":
      return `
        Type: ${item.ramType || "N/A"},
        Speed: ${item.speed || item.ram_speed || "N/A"}
      `;

    case "SSD Storage":
      return `
        Capacity: ${item.capacity || item.storage || "N/A"},
        Type: ${item.ssd_type || item.disk_type || "N/A"},
        Speed: ${item.speed || "N/A"}
      `;

    case "HDD Storage":
      return `
        Capacity: ${item.capacity || item.storage || "N/A"},
        Speed: ${item.speed || "N/A"}
      `;

    case "Motherboard":
      return `
        Model: ${item.model || "N/A"}
      `;

    case "Cabinet":
      return `
        Model: ${item.model || "N/A"},
        Form Factor: ${item.cabinet || "N/A"}
      `;

    case "SMPS":
      return `
        Wattage: ${item.smps || "N/A"}
      `;

    case "Graphics Card":
      return `
        Model: ${item.model || "N/A"},
        Speed: ${item.speed || "N/A"}
      `;

    case "Keyboard & Mouse":
      return `
        Includes Mouse: ${item.mouse ? "Yes" : "No"},
        Includes Keyboard: ${item.keyboard ? "Yes" : "No"}
      `;

    case "Wi-Fi Card":
    case "Wi-Fi Dongle":
      return `
        Standard: ${item.wifi_standard || "N/A"},
        Frequency: ${item.frequency_band || item.frequencyMhz || "N/A"}
      `;

    case "Printer":
      return `
        Type: ${item.model || "N/A"}
      `;

    case "Projector":
      return `
        Model: ${item.model || "N/A"},
        Resolution: ${item.resolution || "N/A"}
      `;

    default:
      return `
        RAM: ${item.ram || "N/A"},
        Storage: ${item.storage || "N/A"},
        Processor: ${item.processor || "N/A"}
      `;
  }
};