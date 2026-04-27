export const LANGUAGES = [
  { code: "nl", label: "NL", name: "Nederlands",  rtl: false },
  { code: "en", label: "EN", name: "English",      rtl: false },
  { code: "ar", label: "AR", name: "العربية",      rtl: true  },
  { code: "es", label: "ES", name: "Español",      rtl: false },
  { code: "zh", label: "ZH", name: "中文",          rtl: false },
];

export const translations = {
  nl: {
    nav: {
      about: "Over mij", skills: "Vaardigheden", projects: "Projecten",
      education: "Opleiding", contact: "Contact",
    },
    hero: {
      subtitle: "Business, IT & Management student",
      cta_contact: "Contact", cta_projects: "Projecten",
    },
    about: {
      label: "01 —", title: "Over mij",
      p1: "Ik ben Asrin Kilinc — 22 jaar, IT-student en iemand die graag uitzoekt hoe dingen werken. Ik zit precies tussen techniek en mensen in: ik begrijp hoe systemen worden gebouwd, maar mijn kracht ligt in het signaleren van problemen, het doordenken van oplossingen en ervoor zorgen dat iedereen op één lijn zit.",
      p2: "Ik heb gewerkt aan echte projecten — van een groepsuitgaven-splitter tot een veilige notitie-app. Ik houd ervan om dingen voor elkaar te krijgen: of dat nu het afbakenen van een project is, samenwerken met ontwikkelaars, of er zelf induiken en het uitzoeken.",
      highlights: [
        { label: "Consultant Mindset",  desc: "Tech vertalen naar bedrijfswaarde" },
        { label: "IT Student",          desc: "Informatietechnologie studeren aan de HvA" },
        { label: "Tech-Savvy",          desc: "Begrijp code, architectuur & systemen" },
        { label: "Hands-On Builder",    desc: "Echte apps gebouwd van idee tot lancering" },
      ],
    },
    skills: {
      label: "02 —", title: "Vaardigheden & Tech",
      categories: [
        { title: "Consulting",    skills: ["Requirementsanalyse", "Stakeholderbeheer", "Probleemoplossing", "Projectscoping"] },
        { title: "Tech Kennis",   skills: ["HTML/CSS", "SQL", "Python"] },
        { title: "Tools",         skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"] },
        { title: "Soft Skills",   skills: ["Communicatie", "Agile/Scrum", "Documentatie", "Teamwork"] },
      ],
    },
    projects: {
      label: "03 —", title: "Projecten",
      items: [
        {
          semester: "Semester 3",
          title: "Ministerie van Defensie — Epicflow Dashboard",
          description: "Een inkoopbeheerdashboard voor het Nederlandse Ministerie van Defensie, gebouwd onder het Epicflow-merk. Visualiseert contractrisiconiveaus, leveranciersprestaties, budget vs. uitgaven en inkooptijdlijnen.",
          tags: ["Dashboard", "Overheid", "Datavisualisatie", "Inkoop"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
        },
        {
          semester: "Semester 2",
          title: "Rituals — CO₂ Emissions Dashboard",
          description: "Een duurzaamheidsdashboard dat CO₂-uitstoot per regio en maand bijhoudt voor Rituals Cosmetics. Bevat datavisualisatie, maandelijkse trendanalyse en rapportagetools.",
          tags: ["Duurzaamheid", "Dashboard", "CO₂", "Data-analyse"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
        },
        {
          semester: "Semester 1",
          title: "DOKKI€ — Group Expense Splitter",
          description: "Een webapp waarmee je moeiteloos gedeelde uitgaven binnen een vriendengroep kunt bijhouden en automatisch verdelen. Bijgedragen aan productvisiee, UX-flows en overall requirements.",
          tags: ["Web App", "UX Design", "JavaScript", "Product"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
        },
        {
          semester: "Semester 1",
          title: "SafeNotes — Secure Note-Taking App",
          description: "Een privacy-first notitieplatform met gebruikersauthenticatie, snelle invoer en veilige opslag. Sleutelrol gespeeld bij het definiëren van requirements, gebruikersflows en de authenticatie-ervaring.",
          tags: ["React", "Node.js", "Auth", "HvA Project"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
        },
      ],
    },
    education: {
      label: "04 —", title: "Opleiding",
      timeline: [
        { year: "Sept 2017 — Juli 2022", title: "HAVO — Natuur & Techniek met Wiskunde B", institution: "Lyceum Sancta Maria", description: "Middelbare school afgerond op HAVO-niveau met profiel Natuur & Techniek en Wiskunde B." },
        { year: "Mei 2024", title: "Certificaat Natuurkunde voor Piloten", institution: "Wismon, Utrecht", description: "Behaalde het certificaat Module Natuurkunde voor Piloten — een aanvullende kwalificatie op het gebied van toegepaste natuurkunde." },
        { year: "Sept 2024 — Heden", title: "Bachelor's in Information Technology", institution: "Hogeschool van Amsterdam (HvA)", description: "IT studeren met een consultingfocus — inclusief software, systemen, projectmanagement en stakeholdercommunicatie. Elk semester draait om echte klantprojecten." },
        { year: "Semester 1 · 2024/2025", title: "DOKKI€ & SafeNotes", institution: "HvA — Eerste Semester Projecten", description: "Twee applicaties gebouwd in het eerste semester: DOKKI€, een groepsuitgaven-splitter, en SafeNotes, een veilig notitieplatform met authenticatie." },
        { year: "Semester 2 · 2024/2025", title: "Rituals — CO₂ Emissions Dashboard", institution: "HvA — Klant: Rituals Cosmetics", description: "Een duurzaamheidsdashboard ontwikkeld voor Rituals, waarmee CO₂-uitstoot per regio en maand wordt bijgehouden, inclusief rapportage en analysetools ter ondersteuning van ESG-doelstellingen." },
        { year: "Semester 3 · 2025/2026", title: "Ministerie van Defensie — Epicflow", institution: "HvA — Klant: Ministerie van Defensie", description: "Een inkoopbeheerdashboard gebouwd voor het Ministerie van Defensie, met visualisaties van contractrisico's, leveranciersprestaties en budgetbewaking onder het Epicflow-merk." },
        { year: "Semester 4 · 2026", title: "Studio Semester — AI Face Tracking Camera", institution: "HvA — Dark Tech · Profiel: AI-Engineer", description: "Momenteel werkend in een team van 5 aan een studiosemesterproject onder het thema Dark Tech. We bouwen een AI-gestuurde gezichtsvolgende camera die het ongemakkelijke gevoel creëert altijd bekeken te worden." },
      ],
    },
    contact: {
      label: "05 —", title: "Contact",
      intro: "Ik sta altijd open voor nieuwe kansen, samenwerkingen of een gezellig gesprek over tech. Neem gerust contact op!",
      email_label: "E-mail", location_label: "Locatie", location_value: "Haarlem, Nederland",
      form: {
        name: "Jouw naam", email: "Jouw e-mail", subject: "Onderwerp",
        message: "Jouw bericht...", send: "Verstuur bericht", sending: "Versturen...",
        success: "Bericht verzonden! Ik neem zo snel mogelijk contact op.",
        error: "Er ging iets mis. Probeer het opnieuw of mail direct naar asrinkilinc@hotmail.com.",
      },
    },
    footer: { rights: "All rights reserved." },
  },

  en: {
    nav: {
      about: "About me", skills: "Skills", projects: "Projects",
      education: "Education", contact: "Contact",
    },
    hero: {
      subtitle: "Business, IT & Management student",
      cta_contact: "Contact", cta_projects: "Projects",
    },
    about: {
      label: "01 —", title: "About me",
      p1: "I'm Asrin Kilinc — 22 years old, IT student and someone who loves figuring out how things work. I sit right between tech and people: I understand how systems are built, but my strength lies in spotting problems, thinking through solutions, and making sure everyone is on the same page.",
      p2: "I've worked on real projects — from a group expense splitter to a secure note-taking app. I love getting things done: whether that's scoping a project, collaborating with developers, or diving in myself and figuring it out.",
      highlights: [
        { label: "Consultant Mindset",  desc: "Translating tech into business value" },
        { label: "IT Student",          desc: "Studying Information Technology at HvA" },
        { label: "Tech-Savvy",          desc: "Understand code, architecture & systems" },
        { label: "Hands-On Builder",    desc: "Built real-world apps from idea to launch" },
      ],
    },
    skills: {
      label: "02 —", title: "Skills & Tech",
      categories: [
        { title: "Consulting",    skills: ["Requirements Analysis", "Stakeholder Management", "Problem Solving", "Project Scoping"] },
        { title: "Tech Skills",   skills: ["HTML/CSS", "SQL", "Python"] },
        { title: "Tools",         skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"] },
        { title: "Soft Skills",   skills: ["Communication", "Agile/Scrum", "Documentation", "Teamwork"] },
      ],
    },
    projects: {
      label: "03 —", title: "Projects",
      items: [
        {
          semester: "Semester 3",
          title: "Ministry of Defence — Epicflow Dashboard",
          description: "A procurement management dashboard for the Dutch Ministry of Defence, built under the Epicflow brand. Visualises contract risk levels, supplier performance, budget vs. spend and procurement timelines.",
          tags: ["Dashboard", "Government", "Data Visualisation", "Procurement"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
        },
        {
          semester: "Semester 2",
          title: "Rituals — CO₂ Emissions Dashboard",
          description: "A sustainability dashboard tracking CO₂ emissions per region and month for Rituals Cosmetics. Includes data visualisation, monthly trend analysis and reporting tools.",
          tags: ["Sustainability", "Dashboard", "CO₂", "Data Analysis"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
        },
        {
          semester: "Semester 1",
          title: "DOKKI€ — Group Expense Splitter",
          description: "A web app that lets you effortlessly track and automatically split shared expenses within a group of friends. Contributed to product vision, UX flows and overall requirements.",
          tags: ["Web App", "UX Design", "JavaScript", "Product"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
        },
        {
          semester: "Semester 1",
          title: "SafeNotes — Secure Note-Taking App",
          description: "A privacy-first note-taking platform with user authentication, quick input and secure storage. Played a key role in defining requirements, user flows and the authentication experience.",
          tags: ["React", "Node.js", "Auth", "HvA Project"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
        },
      ],
    },
    education: {
      label: "04 —", title: "Education",
      timeline: [
        { year: "Sept 2017 — July 2022", title: "HAVO — Science & Engineering + advanced mathematics", institution: "Lyceum Sancta Maria", description: "Completed secondary school at HAVO level with the Science & Engineering profile and advanced mathematics." },
        { year: "May 2024", title: "Certificate Physics for Pilots", institution: "Wismon, Utrecht", description: "Obtained the Module Physics for Pilots certificate — an additional qualification in applied physics." },
        { year: "Sept 2024 — Present", title: "Bachelor's in Information Technology", institution: "Amsterdam University of Applied Sciences (HvA)", description: "Studying IT with a consulting focus — covering software, systems, project management and stakeholder communication. Every semester revolves around real client projects." },
        { year: "Semester 1 · 2024/2025", title: "DOKKI€ & SafeNotes", institution: "HvA — First Semester Projects", description: "Two applications built in the first semester: DOKKI€, a group expense splitter, and SafeNotes, a secure note-taking platform with authentication." },
        { year: "Semester 2 · 2024/2025", title: "Rituals — CO₂ Emissions Dashboard", institution: "HvA — Client: Rituals Cosmetics", description: "A sustainability dashboard developed for Rituals, tracking CO₂ emissions by region and month, including reporting and analysis tools to support ESG objectives." },
        { year: "Semester 3 · 2025/2026", title: "Ministry of Defence — Epicflow", institution: "HvA — Client: Ministry of Defence", description: "A procurement management dashboard built for the Ministry of Defence, with visualisations of contract risks, supplier performance and budget monitoring under the Epicflow brand." },
        { year: "Semester 4 · 2026", title: "Studio Semester — AI Face Tracking Camera", institution: "HvA — Dark Tech · Profile: AI-Engineer", description: "Currently working in a team of 5 on a studio semester project under the Dark Tech theme. We're building an AI-driven face-tracking camera that creates the unsettling feeling of always being watched." },
      ],
    },
    contact: {
      label: "05 —", title: "Contact",
      intro: "I'm always open to new opportunities, collaborations, or a casual conversation about tech. Feel free to reach out!",
      email_label: "Email", location_label: "Location", location_value: "Haarlem, Netherlands",
      form: {
        name: "Your name", email: "Your email", subject: "Subject",
        message: "Your message...", send: "Send message", sending: "Sending...",
        success: "Message sent! I'll get back to you as soon as possible.",
        error: "Something went wrong. Please try again or email asrinkilinc@hotmail.com directly.",
      },
    },
    footer: { rights: "All rights reserved." },
  },

  ar: {
    nav: {
      about: "عني", skills: "المهارات", projects: "المشاريع",
      education: "التعليم", contact: "اتصل بي",
    },
    hero: {
      subtitle: "طالب إدارة الأعمال وتكنولوجيا المعلومات",
      cta_contact: "اتصل بي", cta_projects: "المشاريع",
    },
    about: {
      label: "01 —", title: "عني",
      p1: "أنا أصرين كيلينج — 22 عامًا، طالب تقنية معلومات وشخص يحب معرفة كيفية عمل الأشياء. أقف في المنتصف بين التقنية والناس: أفهم كيف تُبنى الأنظمة، لكن قوتي تكمن في رصد المشكلات، والتفكير في الحلول، والتأكد من أن الجميع على نفس الصفحة.",
      p2: "عملت على مشاريع حقيقية — من تطبيق تقسيم المصاريف الجماعية إلى منصة تدوين ملاحظات آمنة. أحب إنجاز الأمور: سواء كان ذلك تحديد نطاق المشروع، أو التعاون مع المطورين، أو الغوص بنفسي لإيجاد الحلول.",
      highlights: [
        { label: "عقلية الاستشارة",      desc: "تحويل التقنية إلى قيمة أعمال" },
        { label: "طالب تقنية معلومات",   desc: "دراسة تكنولوجيا المعلومات في الجامعة" },
        { label: "متمكن من التقنية",     desc: "فهم الكود والبنية والأنظمة" },
        { label: "مبني بالممارسة",       desc: "بناء تطبيقات حقيقية من الفكرة للإطلاق" },
      ],
    },
    skills: {
      label: "02 —", title: "المهارات والتقنيات",
      categories: [
        { title: "الاستشارة",       skills: ["تحليل المتطلبات", "إدارة أصحاب المصلحة", "حل المشكلات", "تحديد نطاق المشروع"] },
        { title: "المعرفة التقنية", skills: ["HTML/CSS", "SQL", "Python"] },
        { title: "الأدوات",         skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"] },
        { title: "المهارات الناعمة",skills: ["التواصل", "Agile/Scrum", "التوثيق", "العمل الجماعي"] },
      ],
    },
    projects: {
      label: "03 —", title: "المشاريع",
      items: [
        {
          semester: "الفصل 3",
          title: "وزارة الدفاع — لوحة تحكم Epicflow",
          description: "لوحة تحكم لإدارة المشتريات لوزارة الدفاع الهولندية، مبنية تحت علامة Epicflow. تعرض مستويات مخاطر العقود وأداء الموردين والميزانية مقابل الإنفاق والجداول الزمنية للمشتريات.",
          tags: ["Dashboard", "Government", "Data Visualisation", "Procurement"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
        },
        {
          semester: "الفصل 2",
          title: "Rituals — لوحة انبعاثات CO₂",
          description: "لوحة تحكم للاستدامة تتتبع انبعاثات CO₂ لكل منطقة وشهر لشركة Rituals Cosmetics. تتضمن تصور البيانات وتحليل الاتجاهات الشهرية وأدوات الإبلاغ.",
          tags: ["Sustainability", "Dashboard", "CO₂", "Data Analysis"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
        },
        {
          semester: "الفصل 1",
          title: "DOKKI€ — تطبيق تقسيم المصاريف",
          description: "تطبيق ويب يتيح لك تتبع المصاريف المشتركة داخل مجموعة أصدقاء وتقسيمها تلقائيًا. ساهمت في رؤية المنتج وتدفقات تجربة المستخدم والمتطلبات العامة.",
          tags: ["Web App", "UX Design", "JavaScript", "Product"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
        },
        {
          semester: "الفصل 1",
          title: "SafeNotes — تطبيق تدوين ملاحظات آمن",
          description: "منصة تدوين ملاحظات تضع الخصوصية أولاً مع مصادقة المستخدم وإدخال سريع وتخزين آمن. أدّيت دورًا رئيسيًا في تحديد المتطلبات وتدفقات المستخدم وتجربة المصادقة.",
          tags: ["React", "Node.js", "Auth", "HvA Project"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
        },
      ],
    },
    education: {
      label: "04 —", title: "التعليم",
      timeline: [
        { year: "سبتمبر 2017 — يوليو 2022", title: "HAVO — العلوم والتكنولوجيا مع الرياضيات B", institution: "Lyceum Sancta Maria", description: "أتممت المدرسة الثانوية بمستوى HAVO مع تخصص العلوم والتكنولوجيا والرياضيات B." },
        { year: "مايو 2024", title: "شهادة الفيزياء للطيارين", institution: "Wismon, أوتريخت", description: "حصلت على شهادة وحدة الفيزياء للطيارين — مؤهل إضافي في الفيزياء التطبيقية." },
        { year: "سبتمبر 2024 — حتى الآن", title: "بكالوريوس في تكنولوجيا المعلومات", institution: "Hogeschool van Amsterdam (HvA)", description: "أدرس تكنولوجيا المعلومات بتركيز استشاري — يشمل البرمجيات والأنظمة وإدارة المشاريع والتواصل مع أصحاب المصلحة. كل فصل يتمحور حول مشاريع عملاء حقيقية." },
        { year: "الفصل 1 · 2024/2025", title: "DOKKI€ وSafeNotes", institution: "HvA — مشاريع الفصل الأول", description: "بُنيَ تطبيقان في الفصل الأول: DOKKI€ لتقسيم المصاريف، وSafeNotes منصة آمنة لتدوين الملاحظات مع المصادقة." },
        { year: "الفصل 2 · 2024/2025", title: "Rituals — لوحة انبعاثات CO₂", institution: "HvA — العميل: Rituals Cosmetics", description: "لوحة تحكم للاستدامة طُوِّرت لصالح Rituals لتتبع انبعاثات CO₂ حسب المنطقة والشهر، تشمل أدوات إبلاغ وتحليل لدعم أهداف ESG." },
        { year: "الفصل 3 · 2025/2026", title: "وزارة الدفاع — Epicflow", institution: "HvA — العميل: وزارة الدفاع", description: "لوحة تحكم لإدارة المشتريات بُنيَت لوزارة الدفاع مع تصورات لمخاطر العقود وأداء الموردين ومراقبة الميزانية تحت علامة Epicflow." },
        { year: "الفصل 4 · 2026", title: "فصل الاستوديو — كاميرا تتبع الوجه بالذكاء الاصطناعي", institution: "HvA — Dark Tech · تخصص: مهندس ذكاء اصطناعي", description: "أعمل حاليًا في فريق من 5 أفراد على مشروع فصل الاستوديو تحت موضوع Dark Tech. نبني كاميرا تتبع وجه مدعومة بالذكاء الاصطناعي تخلق شعورًا غير مريح بالمراقبة الدائمة." },
      ],
    },
    contact: {
      label: "05 —", title: "اتصل بي",
      intro: "أنا دائمًا منفتح على الفرص الجديدة والتعاون أو محادثة عادية حول التقنية. لا تتردد في التواصل!",
      email_label: "البريد الإلكتروني", location_label: "الموقع", location_value: "هارلم، هولندا",
      form: {
        name: "اسمك", email: "بريدك الإلكتروني", subject: "الموضوع",
        message: "رسالتك...", send: "إرسال الرسالة", sending: "جار الإرسال...",
        success: "تم إرسال الرسالة! سأتواصل معك في أقرب وقت.",
        error: "حدث خطأ ما. حاول مرة أخرى أو راسلني مباشرة على asrinkilinc@hotmail.com.",
      },
    },
    footer: { rights: "جميع الحقوق محفوظة." },
  },

  es: {
    nav: {
      about: "Sobre mí", skills: "Habilidades", projects: "Proyectos",
      education: "Educación", contact: "Contacto",
    },
    hero: {
      subtitle: "Estudiante de Negocios, IT y Gestión",
      cta_contact: "Contacto", cta_projects: "Proyectos",
    },
    about: {
      label: "01 —", title: "Sobre mí",
      p1: "Soy Asrin Kilinc — 22 años, estudiante de TI y alguien que le encanta descubrir cómo funcionan las cosas. Me sitúo exactamente entre la tecnología y las personas: entiendo cómo se construyen los sistemas, pero mi fortaleza radica en detectar problemas, pensar en soluciones y asegurarme de que todos estén alineados.",
      p2: "He trabajado en proyectos reales — desde una aplicación para dividir gastos grupales hasta una app segura para tomar notas. Me encanta hacer que las cosas sucedan: ya sea definiendo el alcance de un proyecto, colaborando con desarrolladores o sumergirme yo mismo para encontrar soluciones.",
      highlights: [
        { label: "Mentalidad Consultora",  desc: "Traducir tecnología en valor empresarial" },
        { label: "Estudiante de TI",       desc: "Estudiando Tecnología de la Información en la HvA" },
        { label: "Conocedor de Tecnología",desc: "Entiendo código, arquitectura y sistemas" },
        { label: "Constructor Práctico",   desc: "Apps reales construidas desde idea hasta lanzamiento" },
      ],
    },
    skills: {
      label: "02 —", title: "Habilidades y Tecnología",
      categories: [
        { title: "Consultoría",        skills: ["Análisis de Requisitos", "Gestión de Stakeholders", "Resolución de Problemas", "Alcance del Proyecto"] },
        { title: "Conocimiento Técnico",skills: ["HTML/CSS", "SQL", "Python"] },
        { title: "Herramientas",       skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"] },
        { title: "Habilidades Blandas",skills: ["Comunicación", "Agile/Scrum", "Documentación", "Trabajo en equipo"] },
      ],
    },
    projects: {
      label: "03 —", title: "Proyectos",
      items: [
        {
          semester: "Semestre 3",
          title: "Ministerio de Defensa — Dashboard Epicflow",
          description: "Un dashboard de gestión de compras para el Ministerio de Defensa holandés, construido bajo la marca Epicflow. Visualiza niveles de riesgo de contratos, rendimiento de proveedores, presupuesto vs. gasto y cronogramas de adquisición.",
          tags: ["Dashboard", "Gobierno", "Visualización de Datos", "Compras"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
        },
        {
          semester: "Semestre 2",
          title: "Rituals — Dashboard de Emisiones CO₂",
          description: "Un dashboard de sostenibilidad que rastrea las emisiones de CO₂ por región y mes para Rituals Cosmetics. Incluye visualización de datos, análisis de tendencias mensuales y herramientas de informes.",
          tags: ["Sostenibilidad", "Dashboard", "CO₂", "Análisis de Datos"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
        },
        {
          semester: "Semestre 1",
          title: "DOKKI€ — Divisor de Gastos Grupales",
          description: "Una app web que permite rastrear y dividir automáticamente gastos compartidos dentro de un grupo de amigos. Contribuí a la visión del producto, flujos UX y requisitos generales.",
          tags: ["Web App", "UX Design", "JavaScript", "Product"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
        },
        {
          semester: "Semestre 1",
          title: "SafeNotes — App Segura de Notas",
          description: "Una plataforma de toma de notas que prioriza la privacidad, con autenticación de usuarios, entrada rápida y almacenamiento seguro. Jugué un papel clave en la definición de requisitos, flujos de usuario y la experiencia de autenticación.",
          tags: ["React", "Node.js", "Auth", "HvA Project"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
        },
      ],
    },
    education: {
      label: "04 —", title: "Educación",
      timeline: [
        { year: "Sept 2017 — Jul 2022", title: "HAVO — Ciencias y Tecnología con Matemáticas B", institution: "Lyceum Sancta Maria", description: "Completé la escuela secundaria a nivel HAVO con el perfil de Ciencias y Tecnología y Matemáticas B." },
        { year: "Mayo 2024", title: "Certificado de Física para Pilotos", institution: "Wismon, Utrecht", description: "Obtuve el certificado Módulo Física para Pilotos — una calificación adicional en física aplicada." },
        { year: "Sept 2024 — Presente", title: "Grado en Tecnología de la Información", institution: "Hogeschool van Amsterdam (HvA)", description: "Estudiando TI con enfoque en consultoría — incluyendo software, sistemas, gestión de proyectos y comunicación con stakeholders. Cada semestre gira en torno a proyectos reales de clientes." },
        { year: "Semestre 1 · 2024/2025", title: "DOKKI€ & SafeNotes", institution: "HvA — Proyectos del Primer Semestre", description: "Dos aplicaciones construidas en el primer semestre: DOKKI€, un divisor de gastos grupales, y SafeNotes, una plataforma segura de notas con autenticación." },
        { year: "Semestre 2 · 2024/2025", title: "Rituals — Dashboard de CO₂", institution: "HvA — Cliente: Rituals Cosmetics", description: "Un dashboard de sostenibilidad desarrollado para Rituals, rastreando emisiones de CO₂ por región y mes, incluyendo herramientas de análisis e informes para apoyar los objetivos ESG." },
        { year: "Semestre 3 · 2025/2026", title: "Ministerio de Defensa — Epicflow", institution: "HvA — Cliente: Ministerio de Defensa", description: "Un dashboard de gestión de compras construido para el Ministerio de Defensa, con visualizaciones de riesgos contractuales, rendimiento de proveedores y monitoreo presupuestario bajo la marca Epicflow." },
        { year: "Semestre 4 · 2026", title: "Semestre Studio — Cámara de Seguimiento Facial con IA", institution: "HvA — Dark Tech · Perfil: AI-Engineer", description: "Actualmente trabajando en un equipo de 5 en un proyecto de semestre studio bajo el tema Dark Tech. Estamos construyendo una cámara de seguimiento facial impulsada por IA que crea la incómoda sensación de ser siempre observado." },
      ],
    },
    contact: {
      label: "05 —", title: "Contacto",
      intro: "Siempre estoy abierto a nuevas oportunidades, colaboraciones o una conversación casual sobre tecnología. ¡No dudes en contactarme!",
      email_label: "Correo electrónico", location_label: "Ubicación", location_value: "Haarlem, Países Bajos",
      form: {
        name: "Tu nombre", email: "Tu correo electrónico", subject: "Asunto",
        message: "Tu mensaje...", send: "Enviar mensaje", sending: "Enviando...",
        success: "¡Mensaje enviado! Me pondré en contacto contigo lo antes posible.",
        error: "Algo salió mal. Inténtalo de nuevo o envía un correo directamente a asrinkilinc@hotmail.com.",
      },
    },
    footer: { rights: "Todos los derechos reservados." },
  },

  zh: {
    nav: {
      about: "关于我", skills: "技能", projects: "项目",
      education: "教育", contact: "联系",
    },
    hero: {
      subtitle: "商业、IT与管理专业学生",
      cta_contact: "联系我", cta_projects: "项目",
    },
    about: {
      label: "01 —", title: "关于我",
      p1: "我是Asrin Kilinc——22岁，IT学生，热衷于探索事物的运作方式。我处于技术与人之间的交汇点：我理解系统是如何构建的，但我的优势在于发现问题、思考解决方案，并确保每个人都达成共识。",
      p2: "我参与过真实项目——从群组费用分摊应用到安全笔记应用。我喜欢把事情做成：无论是界定项目范围、与开发人员合作，还是自己深入探索寻找答案。",
      highlights: [
        { label: "咨询思维",   desc: "将技术转化为商业价值" },
        { label: "IT学生",     desc: "在阿姆斯特丹应用科技大学学习信息技术" },
        { label: "技术达人",   desc: "理解代码、架构与系统" },
        { label: "实践构建者", desc: "从创意到上线构建真实应用" },
      ],
    },
    skills: {
      label: "02 —", title: "技能与技术",
      categories: [
        { title: "咨询",   skills: ["需求分析", "利益相关者管理", "问题解决", "项目范围界定"] },
        { title: "技术知识",skills: ["HTML/CSS", "SQL", "Python"] },
        { title: "工具",   skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"] },
        { title: "软技能", skills: ["沟通", "Agile/Scrum", "文档", "团队合作"] },
      ],
    },
    projects: {
      label: "03 —", title: "项目",
      items: [
        {
          semester: "第3学期",
          title: "国防部 — Epicflow 仪表板",
          description: "为荷兰国防部构建的采购管理仪表板，以Epicflow品牌呈现。可视化合同风险等级、供应商绩效、预算与支出对比及采购时间线。",
          tags: ["Dashboard", "Government", "Data Visualisation", "Procurement"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
        },
        {
          semester: "第2学期",
          title: "Rituals — CO₂排放仪表板",
          description: "为Rituals Cosmetics构建的可持续发展仪表板，按地区和月份追踪CO₂排放。包含数据可视化、月度趋势分析和报告工具。",
          tags: ["Sustainability", "Dashboard", "CO₂", "Data Analysis"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
        },
        {
          semester: "第1学期",
          title: "DOKKI€ — 群组费用分摊应用",
          description: "一款让你轻松追踪和自动分摊朋友群组共同费用的网页应用。参与贡献了产品愿景、用户体验流程和整体需求定义。",
          tags: ["Web App", "UX Design", "JavaScript", "Product"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
        },
        {
          semester: "第1学期",
          title: "SafeNotes — 安全笔记应用",
          description: "一个以隐私为优先的笔记平台，具备用户认证、快速输入和安全存储功能。在需求定义、用户流程和认证体验方面发挥了关键作用。",
          tags: ["React", "Node.js", "Auth", "HvA Project"],
          image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
        },
      ],
    },
    education: {
      label: "04 —", title: "教育",
      timeline: [
        { year: "2017年9月 — 2022年7月", title: "HAVO — 自然与技术（含数学B）", institution: "Lyceum Sancta Maria", description: "以HAVO水平完成中学教育，主修自然与技术方向及数学B课程。" },
        { year: "2024年5月", title: "飞行员物理证书", institution: "Wismon，乌得勒支", description: "获得飞行员物理模块证书——应用物理学领域的额外资质。" },
        { year: "2024年9月 — 至今", title: "信息技术学士学位", institution: "阿姆斯特丹应用科技大学（HvA）", description: "以咨询为重点学习IT——涵盖软件、系统、项目管理和利益相关者沟通。每学期围绕真实客户项目展开。" },
        { year: "第1学期 · 2024/2025", title: "DOKKI€ 与 SafeNotes", institution: "HvA — 第一学期项目", description: "第一学期构建的两款应用：DOKKI€群组费用分摊工具，以及SafeNotes带认证功能的安全笔记平台。" },
        { year: "第2学期 · 2024/2025", title: "Rituals — CO₂排放仪表板", institution: "HvA — 客户：Rituals Cosmetics", description: "为Rituals开发的可持续发展仪表板，按地区和月份追踪CO₂排放，包含报告和分析工具以支持ESG目标。" },
        { year: "第3学期 · 2025/2026", title: "国防部 — Epicflow", institution: "HvA — 客户：国防部", description: "为国防部构建的采购管理仪表板，在Epicflow品牌下可视化合同风险、供应商绩效和预算监控。" },
        { year: "第4学期 · 2026", title: "工作室学期 — AI人脸追踪摄像头", institution: "HvA — 暗黑科技 · 方向：AI工程师", description: "目前与5人团队共同参与暗黑科技主题的工作室学期项目。我们正在构建一款AI驱动的人脸追踪摄像头，营造出一种始终被注视的不安感，探索监控技术与人类感知的边界。" },
      ],
    },
    contact: {
      label: "05 —", title: "联系",
      intro: "我随时欢迎新机会、合作或关于技术的随意交流。随时联系我！",
      email_label: "邮箱", location_label: "位置", location_value: "哈勒姆，荷兰",
      form: {
        name: "你的姓名", email: "你的邮箱", subject: "主题",
        message: "你的消息...", send: "发送消息", sending: "发送中...",
        success: "消息已发送！我会尽快回复你。",
        error: "出现了问题。请重试或直接发邮件至 asrinkilinc@hotmail.com。",
      },
    },
    footer: { rights: "版权所有。" },
  },
};
