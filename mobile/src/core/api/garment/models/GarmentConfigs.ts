export interface ConfigItem {
  id: string;
  name: string;
}

export interface GarmentConfigs {
  brands: ConfigItem[];
  categories: ConfigItem[];
  styles: ConfigItem[];
  colors: ConfigItem[];
}