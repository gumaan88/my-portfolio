import { 
  Brain, 
  Network, 
  Server, 
  Code, 
  BarChart3, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail,
  Workflow,
  Database,
  Bot
} from 'lucide-react';
import { NavItem, Service, Project, AISolution, SocialLink } from './types';

export const HERO_IMAGE_URL = "https://alawn.org/Uploads/Persons/51f4c8ca-90c5-42fd-818b-f675bacf21f0.png";

export const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'التخصصات', href: '#expertise' },
  { label: 'حلول AI', href: '#ai-solutions' },
  { label: 'المشاريع', href: '#projects' },
  { label: 'المجتمع', href: '#community' },
  { label: 'تواصل معي', href: '#contact' },
];

export const SERVICES: Service[] = [
  {
    title: 'استشارات الذكاء الاصطناعي',
    description: 'تصميم استراتيجيات تبني الذكاء الاصطناعي في المؤسسات، وبناء أنظمة RAG مخصصة لتحليل البيانات الداخلية.',
    icon: Brain,
    tags: ['LLMs', 'Prompt Engineering', 'AI Strategy']
  },
  {
    title: 'هندسة الشبكات (MikroTik)',
    description: 'تخطيط وإدارة البنية التحتية للشبكات المتقدمة، تأمين الاتصالات، وإدارة النطاق العريض باستخدام حلول MikroTik.',
    icon: Network,
    tags: ['Routing', 'VPN', 'Firewalling']
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'أتمتة عمليات النشر (CI/CD)، إدارة الحاويات (Docker/K8s)، وضمان استقرار الخدمات الرقمية.',
    icon: Server,
    tags: ['Docker', 'CI/CD', 'Linux']
  },
  {
    title: 'أتمتة Google Workspace',
    description: 'تطوير سكربتات متقدمة لربط خدمات جوجل، أتمتة التقارير، وبناء أدوات إنتاجية مخصصة.',
    icon: Code,
    tags: ['Apps Script', 'Sheets API', 'Workflow Automation']
  },
];

export const AI_SOLUTIONS: AISolution[] = [
  {
    title: 'أتمتة سير العمل الذكية',
    description: 'تحويل العمليات اليدوية المعقدة إلى تدفقات عمل آلية بالكامل باستخدام وكلاء الذكاء الاصطناعي.',
    impact: 'تقليل الوقت التشغيلي بنسبة 60%',
    icon: Workflow
  },
  {
    title: 'أنظمة دعم القرار',
    description: 'لوحات معلومات تحليلية مدعومة بـ AI للتنبؤ بالاتجاهات ومساعدة الإدارة العليا في اتخاذ القرارات.',
    impact: 'دقة تنبؤ تصل إلى 90%',
    icon: BarChart3
  },
  {
    title: 'المساعد المؤسسي الذكي',
    description: 'بناء شات بوت داخلي مدرب على وثائق الشركة للإجابة على استفسارات الموظفين والعملاء فورياً.',
    impact: 'خدمة ذاتية 24/7',
    icon: Bot
  },
  {
    title: 'تحليل البيانات الضخمة',
    description: 'استخراج أنماط ورؤى خفية من قواعد البيانات الكبيرة لتحسين الكفاءة التشغيلية.',
    impact: 'رؤى استراتيجية فورية',
    icon: Database
  }
];

export const PROJECTS: Project[] = [
  {
    title: 'نظام إدارة الشبكات الذكي',
    category: 'Networks & Automation',
    description: 'منصة مركزية لمراقبة وإدارة أجهزة MikroTik في فروع متعددة مع تنبيهات تلقائية عبر Telegram.',
    image: 'https://picsum.photos/800/600?random=1',
    stats: [
      { label: 'الأجهزة المدارة', value: '+500' },
      { label: 'Uptime', value: '99.9%' }
    ]
  },
  {
    title: 'AI Enterprise Knowledge Base',
    category: 'Artificial Intelligence',
    description: 'نظام بحث دلالي (Semantic Search) للمستندات القانونية والتقنية باستخدام نماذج Embedding متقدمة.',
    image: 'https://picsum.photos/800/600?random=2',
    stats: [
      { label: 'دقة البحث', value: 'عالية' },
      { label: 'توفير الوقت', value: '4 ساعات/يوم' }
    ]
  },
  {
    title: 'أتمتة الموارد البشرية',
    category: 'Google Apps Script',
    description: 'نظام متكامل لإدارة الإجازات، الرواتب، وتقييم الأداء مبني بالكامل داخل بيئة Google Workspace.',
    image: 'https://picsum.photos/800/600?random=3'
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'LinkedIn', url: '#', icon: Linkedin },
  { platform: 'Twitter (X)', url: '#', icon: Twitter },
  { platform: 'GitHub', url: '#', icon: Github },
  { platform: 'Email', url: 'mailto:contact@jamaan.sa', icon: Mail },
];