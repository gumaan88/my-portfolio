import { 
  Brain, 
  Network, 
  Server, 
  Code, 
  BarChart3, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail,
  Workflow,
  Database,
  Bot
} from 'lucide-react';

export const HERO_IMAGE_URL = "https://alawn.org/Uploads/Persons/51f4c8ca-90c5-42fd-818b-f675bacf21f0.png";

export const SOCIAL_LINKS = [
  { platform: 'LinkedIn', url: '#', icon: Linkedin },
  { platform: 'Twitter (X)', url: '#', icon: Twitter },
  { platform: 'GitHub', url: '#', icon: Github },
  { platform: 'Email', url: 'mailto:contact@jamaan.sa', icon: Mail },
];

export const CONTENT = {
  ar: {
    nav: [
      { label: 'الرئيسية', href: '#hero' },
      { label: 'التخصصات', href: '#expertise' },
      { label: 'حلول AI', href: '#ai-solutions' },
      { label: 'المشاريع', href: '#projects' },
      { label: 'المجتمع', href: '#community' },
    ],
    cta: {
      consult: 'اطلب استشارة',
      projects: 'استعرض المشاريع',
      contact: 'تواصل معي',
      allWork: 'عرض كل الأعمال',
      viewAll: 'عرض الكل',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      sent: 'تم الإرسال بنجاح',
      sentMsg: 'شكراً لتواصلك. سأقوم بالرد عليك في أقرب وقت ممكن.',
      sendAnother: 'إرسال رسالة أخرى',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      namePlaceholder: 'أدخل اسمك',
      emailPlaceholder: 'email@example.com',
      messagePlaceholder: 'كيف يمكنني مساعدتك؟'
    },
    hero: {
      status: 'متاح للمشاريع والاستشارات',
      role: ' استشاري التحول الرقمي',
      titleHighlight: 'الذكاء الاصطناعي',
      titlePart1: 'تطبيقات',
      titlePart2: 'والبنية الرقمية المتقدمة',
      description: 'أساعد المؤسسات على تبني المستقبل من خلال دمج حلول الذكاء الاصطناعي، تأمين البنية التحتية للشبكات، وأتمتة العمليات الرقمية لتحقيق أقصى كفاءة.',
      badge1Title: 'AI',
      badge1Sub: 'Applied AI',
      badge2Title: 'Cert. Engineer',
      badge2Sub: 'MikroTik'
    },
    expertise: {
      title: 'مجالات الخبرة',
      subtitle: 'مزيج فريد من الخبرات يجمع بين البنية التحتية الصلبة والمرونة البرمجية والذكاء الاصطناعي.',
      items: [
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
      ]
    },
    aiSolutions: {
      badge: 'الثورة الصناعية الرابعة',
      title: 'تطبيقات الذكاء الاصطناعي',
      description: 'حلول عملية وقابلة للتطبيق تعزز الإنتاجية وتحول البيانات الخام إلى قيمة ملموسة.',
      impactLabel: 'الأثر',
      items: [
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
      ]
    },
    projects: {
      title: 'أحدث المشاريع',
      items: [
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
      ]
    },
    community: {
      title: 'المشاركة المجتمعية',
      description: 'أؤمن بأن المعرفة تنمو بالمشاركة. أحرص دائماً على التواجد في الفعاليات التقنية ونقل الخبرات للمجتمع التقني.',
      role1: 'متحدث تقني',
      desc1: 'مشاركة دورية في مؤتمرات التحول الرقمي والذكاء الاصطناعي.',
      role2: 'ورش عمل تدريبية',
      desc2: 'تقديم ورش عمل في هندسة الشبكات (MikroTik) وتطوير الأنظمة.',
      role3: 'مساهمات مفتوحة المصدر',
      desc3: 'نشر أدوات وسكربتات مفيدة على GitHub لمجتمع المطورين.',
      location: 'الرياض، المملكة العربية السعودية'
    },
    contact: {
      title: 'لنبدأ العمل معاً',
      description: 'هل لديك مشروع طموح؟ أنا مستعد للمساعدة في تحويل أفكارك إلى واقع تقني ملموس.',
      channels: 'قنوات التواصل',
      quote: '"التكنولوجيا ليست مجرد أدوات، بل هي الطريقة التي نبني بها مستقبلاً أفضل وأكثر كفاءة."',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة للمهندس جمعان سعيد.',
      tagline: 'Designed for Excellence.'
    }
  },
  en: {
    nav: [
      { label: 'Home', href: '#hero' },
      { label: 'Expertise', href: '#expertise' },
      { label: 'AI Solutions', href: '#ai-solutions' },
      { label: 'Projects', href: '#projects' },
      { label: 'Community', href: '#community' },
    ],
    cta: {
      consult: 'Request Consultation',
      projects: 'View Projects',
      contact: 'Contact Me',
      allWork: 'View All Work',
      viewAll: 'View All',
      send: 'Send Message',
      sending: 'Sending...',
      sent: 'Message Sent',
      sentMsg: 'Thank you for reaching out. I will get back to you as soon as possible.',
      sendAnother: 'Send Another Message',
      name: 'Full Name',
      email: 'Email Address',
      message: 'Message',
      namePlaceholder: 'Enter your name',
      emailPlaceholder: 'email@example.com',
      messagePlaceholder: 'How can I help you?'
    },
    hero: {
      status: 'Available for Projects',
      role: 'Tech Consultant',
      titleHighlight: 'AI Applications',
      titlePart1: 'Advanced',
      titlePart2: '& Digital Infrastructure',
      description: 'Helping organizations embrace the future by integrating AI solutions, securing network infrastructure, and automating digital processes for maximum efficiency.',
      badge1Title: 'AI Expert',
      badge1Sub: 'Neural Networks',
      badge2Title: 'Cert. Engineer',
      badge2Sub: 'MikroTik'
    },
    expertise: {
      title: 'Areas of Expertise',
      subtitle: 'A unique blend of expertise combining solid infrastructure, software flexibility, and artificial intelligence.',
      items: [
        {
          title: 'AI Consultancy',
          description: 'Designing strategies for AI adoption in enterprises and building custom RAG systems for internal data analysis.',
          icon: Brain,
          tags: ['LLMs', 'Prompt Engineering', 'AI Strategy']
        },
        {
          title: 'Network Engineering',
          description: 'Planning and managing advanced network infrastructure, securing communications, and managing bandwidth using MikroTik solutions.',
          icon: Network,
          tags: ['Routing', 'VPN', 'Firewalling']
        },
        {
          title: 'DevOps & Infrastructure',
          description: 'Automating deployment processes (CI/CD), managing containers (Docker/K8s), and ensuring digital service stability.',
          icon: Server,
          tags: ['Docker', 'CI/CD', 'Linux']
        },
        {
          title: 'Google Workspace Automation',
          description: 'Developing advanced scripts to connect Google services, automate reports, and build custom productivity tools.',
          icon: Code,
          tags: ['Apps Script', 'Sheets API', 'Workflow Automation']
        },
      ]
    },
    aiSolutions: {
      badge: 'Industry 4.0',
      title: 'AI Applications',
      description: 'Practical and applicable solutions that boost productivity and turn raw data into tangible value.',
      impactLabel: 'Impact',
      items: [
        {
          title: 'Intelligent Workflow Automation',
          description: 'Transforming complex manual processes into fully automated workflows using AI agents.',
          impact: '60% Ops Time Reduction',
          icon: Workflow
        },
        {
          title: 'Decision Support Systems',
          description: 'AI-powered analytics dashboards to forecast trends and assist senior management in decision-making.',
          impact: '90% Forecast Accuracy',
          icon: BarChart3
        },
        {
          title: 'Corporate Smart Assistant',
          description: 'Building internal chatbots trained on company documents to answer employee and client queries instantly.',
          impact: '24/7 Self-Service',
          icon: Bot
        },
        {
          title: 'Big Data Analysis',
          description: 'Extracting hidden patterns and insights from large databases to improve operational efficiency.',
          impact: 'Real-time Strategic Insights',
          icon: Database
        }
      ]
    },
    projects: {
      title: 'Recent Projects',
      items: [
        {
          title: 'Smart Network Management System',
          category: 'Networks & Automation',
          description: 'Centralized platform for monitoring and managing MikroTik devices across multiple branches with automated Telegram alerts.',
          image: 'https://picsum.photos/800/600?random=1',
          stats: [
            { label: 'Managed Devices', value: '+500' },
            { label: 'Uptime', value: '99.9%' }
          ]
        },
        {
          title: 'AI Enterprise Knowledge Base',
          category: 'Artificial Intelligence',
          description: 'Semantic Search system for legal and technical documents using advanced Embedding models.',
          image: 'https://picsum.photos/800/600?random=2',
          stats: [
            { label: 'Search Accuracy', value: 'High' },
            { label: 'Time Saved', value: '4 hrs/day' }
          ]
        },
        {
          title: 'HR Automation System',
          category: 'Google Apps Script',
          description: 'Integrated system for managing leaves, payroll, and performance reviews built entirely within Google Workspace.',
          image: 'https://picsum.photos/800/600?random=3'
        }
      ]
    },
    community: {
      title: 'Community Engagement',
      description: 'I believe knowledge grows by sharing. I actively participate in tech events and transfer expertise to the tech community.',
      role1: 'Tech Speaker',
      desc1: 'Regular participation in digital transformation and AI conferences.',
      role2: 'Training Workshops',
      desc2: 'Delivering workshops on Network Engineering (MikroTik) and System Development.',
      role3: 'Open Source Contributions',
      desc3: 'Publishing useful tools and scripts on GitHub for the developer community.',
      location: 'Riyadh, Saudi Arabia'
    },
    contact: {
      title: 'Let\'s Work Together',
      description: 'Have an ambitious project? I am ready to help turn your ideas into tangible technical reality.',
      channels: 'Contact Channels',
      quote: '"Technology is not just tools; it is how we build a better and more efficient future."',
    },
    footer: {
      rights: 'All Rights Reserved. Eng. Jamaan Saeed.',
      tagline: 'Designed for Excellence.'
    }
  }
};