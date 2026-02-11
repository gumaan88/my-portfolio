import { 
  Brain, Network, Server, Code, BarChart3, Workflow, Database, Bot, 
  Cpu, Globe, Shield, Zap, Terminal, Smartphone, Cloud, Layers
} from 'lucide-react';

export const iconMap: { [key: string]: any } = {
  Brain, Network, Server, Code, BarChart3, Workflow, Database, Bot,
  Cpu, Globe, Shield, Zap, Terminal, Smartphone, Cloud, Layers
};

export const getIcon = (name: string) => {
  return iconMap[name] || Brain;
};

export const iconOptions = Object.keys(iconMap);