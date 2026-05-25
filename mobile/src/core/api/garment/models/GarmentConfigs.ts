export interface ConfigItem {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
  hexCode: string;
}

export interface GarmentConfigs {
  brands: ConfigItem[];
  categories: ConfigItem[];
  styles: ConfigItem[];
  colors: Color[];
}