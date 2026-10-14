const main = document.querySelector('#main');
const header = document.querySelector('#site-header');
let language = localStorage.getItem('sehasetu-language') === 'hi' ? 'hi' : 'en';
let wizardStep = 1;
let resourceCategory = 'all';
let resourceQuery = '';
let adminRecords = [];
let noticeTimer;

const copy = {
  en: {
    'nav.home': 'Home', 'nav.services': 'Services', 'nav.process': 'How it works', 'nav.families': 'For families', 'nav.partners': 'For care partners', 'nav.about': 'About us', 'nav.contact': 'Contact', 'nav.request': 'Request care',
    'hero.eyebrow': 'A thoughtful starting point for care in Varanasi', 'hero.title': 'Care for your loved ones. <em>Peace of mind</em> for your family.', 'hero.body': 'Finding dependable care for an elderly family member can feel overwhelming. We help families explore care options, coordinate caregivers, organise appointments, and stay informed throughout an agreed care journey.', 'hero.request': 'Request care', 'hero.explore': 'Explore our services', 'hero.tagline': 'Hospital Se Ghar Tak, Har Kadam Saath.', 'hero.noteTitle': 'Care starts with a conversation.', 'hero.note': 'Your family stays part of the decisions.',
    'trust.one': 'Personalised care coordination', 'trust.two': 'A clear scope and written quote', 'trust.three': 'Family updates with consent', 'trust.four': 'A local focus on Varanasi',
    'services.eyebrow': 'Where can we help?', 'services.title': 'How can we help you today?', 'services.body': 'Start with the kind of support your family needs. We will help you understand what may be available before anything is confirmed.', 'services.all': 'View all services', 'services.scope': 'A clear distinction: Everyday companionship and daily-living assistance are non-clinical support. Nursing and other clinical services require appropriately qualified providers, availability, and confirmation.',
    's.elderly.title': 'Elderly care at home', 's.elderly.body': 'Explore support for everyday activities, companionship, and agreed daily routines.', 's.elderly.link': 'Explore elderly care',
    's.caregiver.title': 'Find a caregiver', 's.caregiver.body': 'Share your loved one’s needs, schedule, and area to explore suitable available options.', 's.caregiver.link': 'Find a caregiver',
    's.hospital.title': 'Hospital visit assistance', 's.hospital.body': 'Coordinate appointment scheduling and practical support, subject to availability.', 's.hospital.link': 'Plan a hospital visit',
    's.appointment.title': 'Appointment coordination', 's.appointment.body': 'Get help organising appointments, reminders, and agreed family communication.', 's.appointment.link': 'Coordinate an appointment',
    's.family.title': 'Family care coordination', 's.family.body': 'Help family members follow agreed care arrangements and visit updates.', 's.family.link': 'Talk to our team',
    's.nursing.title': 'Nursing and professional care', 's.nursing.body': 'Enquire about eligible nursing or allied services through appropriately qualified providers.', 's.nursing.link': 'Enquire about professional care',
    'how.eyebrow': 'A considered approach', 'how.title': 'Care should feel easier to navigate.', 'how.body': 'Each step is explained before your family decides. A request is not a booking until you accept the provider, written scope, schedule, price, and terms.',
    'step.one.title': 'Tell us what you need', 'step.one.body': 'Share the type of help, preferred schedule, and area.', 'step.two.title': 'Understand the care needs', 'step.two.body': 'A coordinator checks the request against the service scope.', 'step.three.title': 'Explore suitable options', 'step.three.body': 'Available providers are assessed for fit and required verification.', 'step.four.title': 'Review and approve', 'step.four.body': 'Review a written scope, schedule, quote, and terms.', 'step.five.title': 'Coordinate and follow up', 'step.five.body': 'Arrangements and agreed updates are coordinated.', 'how.important': 'A request is an enquiry, not a confirmed appointment or care booking. Your family approves the written plan before any arrangement is confirmed.',
    'about.eyebrow': 'A little more together', 'about.title': 'Care that connects hospitals, homes, and families.', 'about.body': 'SEHASETU Healthcare is being developed to make care coordination simpler for families. Our approach connects families with appropriate service options, helps clarify requirements and costs, and supports communication throughout an agreed care journey.', 'about.body2': 'We believe care should be easier to understand, more transparent to arrange, and centred on the dignity of every individual.', 'about.link': 'Get to know us', 'about.point1': 'One coordination point to start an enquiry', 'about.point2': 'Costs and scope explained before confirmation', 'about.point3': 'Family communication with the person’s consent', 'about.point4': 'A Varanasi-first service focus',
    'partner.eyebrow': 'For caregivers and service providers', 'partner.title': 'Grow with SEHASETU. Help families find the right support.', 'partner.body': 'We are building a partner network for caregivers, eligible health professionals, agencies, and local service providers. An application is the start of a review, never an automatic approval.', 'partner.cta': 'Explore partnering',
    'resources.eyebrow': 'A family reading room', 'resources.title': 'Thoughtful guidance, at your own pace.', 'resources.body': 'Practical, original resources for planning home care and coordinating as a family.', 'resources.all': 'All resources', 'resource.search': 'Search resources', 'resource.nothing': 'No articles match your search. Try another phrase or category.',
    'faq.eyebrow': 'Good to know', 'faq.title': 'Questions families often ask.', 'faq.body': 'A clear picture of our developing service model, what is confirmed, and what still depends on availability.', 'faq.all': 'View all questions',
    'cta.title': 'Not sure where to start?', 'cta.body': 'Tell us a little about the support you are looking for.', 'cta.button': 'Request care',
    'page.home': 'Thoughtful care coordination in Varanasi', 'page.services': 'Explore the services families may request', 'page.how': 'How care requests become confirmed arrangements', 'page.about': 'An approach centred on dignity, clarity, and family', 'page.families': 'Support for families near and far', 'page.partners': 'An open, considered partnership approach', 'page.contact': 'Start a conversation with SEHASETU Healthcare',
    'form.step': 'Step', 'form.of': 'of', 'form.next': 'Continue', 'form.back': 'Back', 'form.step1': 'Who needs care?', 'form.step2': 'What support would help?', 'form.step3': 'Where and when?', 'form.step4': 'How can we reach you?', 'form.step5': 'One last thing', 'form.myself': 'Myself', 'form.parent': 'Parent', 'form.grandparent': 'Grandparent', 'form.other': 'Another family member',
    'form.companion': 'Companionship', 'form.daily': 'Daily-living assistance', 'form.scheduled': 'Caregiver for scheduled hours', 'form.appointment': 'Hospital or appointment coordination', 'form.mobility': 'Mobility assistance', 'form.nursing': 'Qualified nursing enquiry', 'form.otherSupport': 'Something else', 'form.area': 'Area or locality in Varanasi', 'form.date': 'Preferred date', 'form.time': 'Preferred time', 'form.frequency': 'How often?', 'form.once': 'One time', 'form.recurring': 'Recurring', 'form.name': 'Your full name', 'form.phone': 'Mobile number', 'form.relationship': 'Your relationship to the person receiving care', 'form.language': 'Preferred language', 'form.email': 'Email address (optional)', 'form.message': 'Anything else we should know? (optional)', 'form.consent': 'I agree to be contacted about this care request and have read the privacy notice.', 'form.updates': 'I would also like to receive occasional updates. (Optional)', 'form.submit': 'Submit care request', 'form.privacy': 'Please do not include medical records or sensitive clinical details in this form. Your details are sent only if the secure service is configured.', 'form.unavailable': 'Online requests are not yet connected. Your details have not been sent or saved. Please try again later or contact the team once official contact details are published.', 'form.success': 'Your request was received.', 'form.receipt': 'Reference number', 'form.error': 'We could not send your request. Please try again.',
    'partner.formTitle': 'Introduce yourself', 'partner.name': 'Full name or organisation name', 'partner.category': 'Service category', 'partner.experience': 'Relevant experience', 'partner.areas': 'Service areas in Varanasi', 'partner.availability': 'Availability', 'partner.qualification': 'Qualifications or registrations, where applicable', 'partner.consent': 'I consent to being contacted and to appropriate identity, qualification, and reference checks.', 'partner.noDocs': 'Do not attach identity documents, medical records, or sensitive files to this enquiry. Secure document collection is not configured yet.', 'partner.submit': 'Send partner enquiry',
    'footer.scope': 'SEHASETU coordinates enquiries; independent providers retain responsibility for the professional services they deliver. Services, partners, availability, verification, and arrangements are subject to confirmation. This is not an emergency medical service.',
  },
  hi: {
    'nav.home': 'होम', 'nav.services': 'सेवाएँ', 'nav.process': 'यह कैसे काम करता है', 'nav.families': 'परिवारों के लिए', 'nav.partners': 'सेवा सहयोगियों के लिए', 'nav.about': 'हमारे बारे में', 'nav.contact': 'संपर्क करें', 'nav.request': 'देखभाल का अनुरोध करें',
    'hero.eyebrow': 'वाराणसी में देखभाल का एक संवेदनशील आरंभ', 'hero.title': 'अपनों की देखभाल। <em>परिवार को सुकून</em> का भरोसा।', 'hero.body': 'परिवार के किसी बुज़ुर्ग के लिए भरोसेमंद सहायता ढूँढ़ना मुश्किल लग सकता है। हम देखभाल के विकल्प तलाशने, देखभालकर्ता से समन्वय करने, अपॉइंटमेंट व्यवस्थित करने और तय देखभाल के दौरान परिवार को जानकारी देने में सहायता करते हैं।', 'hero.request': 'देखभाल का अनुरोध करें', 'hero.explore': 'हमारी सेवाएँ देखें', 'hero.tagline': 'हॉस्पिटल से घर तक, हर कदम साथ।', 'hero.noteTitle': 'देखभाल की शुरुआत बातचीत से।', 'hero.note': 'हर निर्णय में आपका परिवार शामिल रहता है।',
    'trust.one': 'आपकी ज़रूरत के अनुसार देखभाल समन्वय', 'trust.two': 'स्पष्ट सेवा और लिखित अनुमान', 'trust.three': 'सहमति से परिवार को जानकारी', 'trust.four': 'वाराणसी पर स्थानीय ध्यान',
    'services.eyebrow': 'हम कैसे सहायता करें?', 'services.title': 'आज हम आपकी क्या मदद कर सकते हैं?', 'services.body': 'अपने परिवार की ज़रूरत के अनुसार सहायता चुनें। कुछ भी तय होने से पहले हम उपलब्ध विकल्प समझने में आपकी मदद करेंगे।', 'services.all': 'सभी सेवाएँ देखें', 'services.scope': 'एक ज़रूरी अंतर: साथ और रोज़मर्रा के कामों में सहायता गैर-चिकित्सीय सेवाएँ हैं। नर्सिंग और दूसरी चिकित्सीय सेवाओं के लिए उचित योग्यता वाले प्रदाता, उपलब्धता और पुष्टि आवश्यक है।',
    's.elderly.title': 'घर पर बुज़ुर्गों की देखभाल', 's.elderly.body': 'रोज़मर्रा के कामों, साथ और तय दिनचर्या के लिए सहायता के विकल्प जानें।', 's.elderly.link': 'बुज़ुर्गों की देखभाल देखें',
    's.caregiver.title': 'देखभालकर्ता ढूँढ़ें', 's.caregiver.body': 'उपलब्ध विकल्प जानने के लिए अपने प्रियजन की ज़रूरत, समय और क्षेत्र बताएँ।', 's.caregiver.link': 'देखभालकर्ता ढूँढ़ें',
    's.hospital.title': 'अस्पताल जाने में सहायता', 's.hospital.body': 'उपलब्धता के अनुसार अपॉइंटमेंट और अस्पताल आने-जाने में समन्वय पाएँ।', 's.hospital.link': 'अस्पताल जाने की योजना बनाएँ',
    's.appointment.title': 'अपॉइंटमेंट का समन्वय', 's.appointment.body': 'अपॉइंटमेंट, रिमाइंडर और परिवार के बीच तय जानकारी के समन्वय में सहायता पाएँ।', 's.appointment.link': 'अपॉइंटमेंट का समन्वय करें',
    's.family.title': 'परिवार के लिए देखभाल समन्वय', 's.family.body': 'परिवार को तय देखभाल व्यवस्था और मुलाक़ातों की जानकारी दें।', 's.family.link': 'हमारी टीम से बात करें',
    's.nursing.title': 'नर्सिंग और पेशेवर देखभाल', 's.nursing.body': 'योग्य प्रदाता के माध्यम से उपलब्ध नर्सिंग या सहायक स्वास्थ्य सेवाओं की जानकारी लें।', 's.nursing.link': 'पेशेवर देखभाल के लिए पूछें',
    'how.eyebrow': 'सोची-समझी प्रक्रिया', 'how.title': 'देखभाल समझना आसान होना चाहिए।', 'how.body': 'हर चरण की जानकारी निर्णय लेने से पहले दी जाती है। प्रदाता, लिखित सेवा, समय, शुल्क और नियमों को स्वीकार किए बिना कोई सेवा बुक नहीं होती।',
    'step.one.title': 'अपनी ज़रूरत बताएँ', 'step.one.body': 'सहायता, समय और क्षेत्र की जानकारी दें।', 'step.two.title': 'ज़रूरत समझें', 'step.two.body': 'समन्वयक उपलब्ध सेवा के दायरे के अनुसार अनुरोध देखता है।', 'step.three.title': 'उपयुक्त विकल्प जानें', 'step.three.body': 'उपलब्ध प्रदाता की उपयुक्तता और ज़रूरी जाँच की समीक्षा होती है।', 'step.four.title': 'योजना देखें और स्वीकारें', 'step.four.body': 'लिखित सेवा, समय, अनुमान और नियम देखें।', 'step.five.title': 'समन्वय और आगे की जानकारी', 'step.five.body': 'तय व्यवस्था और सहमति से दी जाने वाली जानकारी का समन्वय करें।', 'how.important': 'अनुरोध पूछताछ है, पक्की अपॉइंटमेंट या देखभाल बुकिंग नहीं। किसी व्यवस्था की पुष्टि से पहले आपका परिवार लिखित योजना को स्वीकार करेगा।',
    'about.eyebrow': 'मिलकर की गई एक शुरुआत', 'about.title': 'अस्पताल, घर और परिवार को जोड़ने वाली देखभाल।', 'about.body': 'SEHASETU Healthcare परिवारों के लिए देखभाल का समन्वय आसान बनाने की दिशा में काम कर रहा है। हमारा उद्देश्य परिवारों को उपयुक्त सेवा विकल्पों से जोड़ना, ज़रूरत और खर्च स्पष्ट करना, और तय देखभाल के दौरान बातचीत में सहायता करना है।', 'about.body2': 'हम मानते हैं कि देखभाल समझने में आसान, व्यवस्था में पारदर्शी और हर व्यक्ति के सम्मान पर केंद्रित होनी चाहिए।', 'about.link': 'हमारे बारे में जानें', 'about.point1': 'देखभाल की पूछताछ के लिए एक समन्वय संपर्क', 'about.point2': 'पुष्टि से पहले सेवा और लागत की जानकारी', 'about.point3': 'व्यक्ति की सहमति से परिवार को जानकारी', 'about.point4': 'वाराणसी पर शुरुआती ध्यान',
    'partner.eyebrow': 'देखभालकर्ताओं और सेवा प्रदाताओं के लिए', 'partner.title': 'SEHASETU के साथ आगे बढ़ें। परिवारों को सही सहायता खोजने में मदद करें।', 'partner.body': 'हम देखभालकर्ताओं, योग्य स्वास्थ्य पेशेवरों, एजेंसियों और स्थानीय सेवा प्रदाताओं का नेटवर्क बना रहे हैं। आवेदन समीक्षा की शुरुआत है, अपने-आप स्वीकृति नहीं।', 'partner.cta': 'साझेदारी के बारे में जानें',
    'resources.eyebrow': 'परिवार के लिए जानकारी', 'resources.title': 'सोच-समझकर पढ़ें, अपनी रफ़्तार से।', 'resources.body': 'घर पर देखभाल और परिवार के समन्वय के लिए उपयोगी, मौलिक जानकारी।', 'resources.all': 'सभी लेख देखें', 'resource.search': 'लेख खोजें', 'resource.nothing': 'आपकी खोज से मिलता लेख नहीं मिला। दूसरा शब्द या श्रेणी आज़माएँ।',
    'faq.eyebrow': 'उपयोगी जानकारी', 'faq.title': 'परिवारों के कुछ आम सवाल।', 'faq.body': 'सेवा के मौजूदा मॉडल, पक्की व्यवस्था और उपलब्धता पर निर्भर विकल्पों की स्पष्ट जानकारी।', 'faq.all': 'सभी सवाल देखें',
    'cta.title': 'समझ नहीं आ रहा कहाँ से शुरू करें?', 'cta.body': 'जिस सहायता की तलाश है, उसके बारे में हमें थोड़ा बताएँ।', 'cta.button': 'देखभाल का अनुरोध करें',
    'page.home': 'वाराणसी में सोच-समझकर देखभाल समन्वय', 'page.services': 'परिवारों के लिए उपलब्ध सेवा विकल्प जानें', 'page.how': 'देखभाल अनुरोध से पक्की व्यवस्था तक', 'page.about': 'सम्मान, स्पष्टता और परिवार पर केंद्रित सोच', 'page.families': 'पास और दूर के परिवारों के लिए सहायता', 'page.partners': 'साझेदारी का खुला और विचारपूर्ण तरीका', 'page.contact': 'SEHASETU Healthcare से बातचीत शुरू करें',
    'form.step': 'चरण', 'form.of': 'में से', 'form.next': 'जारी रखें', 'form.back': 'वापस जाएँ', 'form.step1': 'किसे देखभाल की ज़रूरत है?', 'form.step2': 'किस सहायता की ज़रूरत है?', 'form.step3': 'कहाँ और कब?', 'form.step4': 'आपसे कैसे संपर्क करें?', 'form.step5': 'एक आख़िरी बात', 'form.myself': 'मुझे', 'form.parent': 'माता-पिता को', 'form.grandparent': 'दादा-दादी / नाना-नानी को', 'form.other': 'परिवार के किसी दूसरे सदस्य को',
    'form.companion': 'साथ और बातचीत', 'form.daily': 'रोज़मर्रा के कामों में सहायता', 'form.scheduled': 'तय समय के लिए देखभालकर्ता', 'form.appointment': 'अस्पताल या अपॉइंटमेंट का समन्वय', 'form.mobility': 'चलने-फिरने में सहायता', 'form.nursing': 'योग्य नर्सिंग सेवा की पूछताछ', 'form.otherSupport': 'कुछ और', 'form.area': 'वाराणसी का इलाका या मोहल्ला', 'form.date': 'सुविधाजनक तारीख़', 'form.time': 'सुविधाजनक समय', 'form.frequency': 'कितनी बार?', 'form.once': 'एक बार', 'form.recurring': 'बार-बार', 'form.name': 'आपका पूरा नाम', 'form.phone': 'मोबाइल नंबर', 'form.relationship': 'देखभाल पाने वाले व्यक्ति से आपका रिश्ता', 'form.language': 'आपकी पसंदीदा भाषा', 'form.email': 'ईमेल पता (वैकल्पिक)', 'form.message': 'क्या कोई और बात बताना चाहेंगे? (वैकल्पिक)', 'form.consent': 'मैं इस देखभाल अनुरोध के बारे में संपर्क करने की सहमति देता/देती हूँ और गोपनीयता सूचना पढ़ी है।', 'form.updates': 'मैं कभी-कभी जानकारी पाना चाहता/चाहती हूँ। (वैकल्पिक)', 'form.submit': 'देखभाल अनुरोध भेजें', 'form.privacy': 'कृपया इस फ़ॉर्म में मेडिकल रिकॉर्ड या संवेदनशील स्वास्थ्य जानकारी न दें। सुरक्षित सेवा चालू होने पर ही आपकी जानकारी भेजी जाएगी।', 'form.unavailable': 'ऑनलाइन अनुरोध की सुविधा अभी शुरू नहीं हुई है। आपकी जानकारी न भेजी गई है, न सेव हुई है। आधिकारिक संपर्क जानकारी उपलब्ध होने पर पुनः प्रयास करें।', 'form.success': 'आपका अनुरोध प्राप्त हो गया है।', 'form.receipt': 'संदर्भ संख्या', 'form.error': 'अनुरोध नहीं भेजा जा सका। कृपया पुनः प्रयास करें।',
    'partner.formTitle': 'अपना परिचय दें', 'partner.name': 'पूरा नाम या संस्था का नाम', 'partner.category': 'सेवा श्रेणी', 'partner.experience': 'संबंधित अनुभव', 'partner.areas': 'वाराणसी में सेवा क्षेत्र', 'partner.availability': 'उपलब्धता', 'partner.qualification': 'योग्यता या पंजीकरण, जहाँ लागू हो', 'partner.consent': 'मैंसे संपर्क करने और आवश्यक पहचान, योग्यता तथा संदर्भ जाँच के लिए सहमति देता/देती हूँ।', 'partner.noDocs': 'इस पूछताछ में पहचान पत्र, मेडिकल रिकॉर्ड या संवेदनशील दस्तावेज़ न जोड़ें। सुरक्षित दस्तावेज़ सुविधा अभी तैयार नहीं है।', 'partner.submit': 'साझेदार पूछताछ भेजें',
    'footer.scope': 'SEHASETU पूछताछ का समन्वय करता है। स्वतंत्र प्रदाता अपनी पेशेवर सेवा के लिए स्वयं ज़िम्मेदार हैं। सेवाएँ, साझेदार, उपलब्धता, जाँच और व्यवस्था की पुष्टि आवश्यक है। यह आपातकालीन चिकित्सा सेवा नहीं है।',
  },
};

copy.en['form.chooseSupport'] = 'Choose at least one type of support.';
copy.hi['form.chooseSupport'] = 'कृपया कम से कम एक सहायता विकल्प चुनें।';

const serviceData = [
  { slug: 'elderly-care', title: 'elderly', icon: 'heart', audience: 'Older adults and families exploring support at home.', includes: 'Companionship, help with agreed everyday routines, and scheduled non-clinical support when available.', excludes: 'Medical advice, personal care requiring professional training, diagnosis, medicines, procedures, and emergency response.', category: 'Non-clinical support' },
  { slug: 'daily-living-support', title: 'daily', icon: 'home', audience: 'People who may benefit from a little everyday support at home.', includes: 'Non-clinical help with mutually agreed activities and a planned daily routine.', excludes: 'Clinical tasks, lifting beyond the agreed safe plan, and any service outside the written scope.', category: 'Non-clinical support' },
  { slug: 'caregiver-coordination', title: 'caregiver', icon: 'people', audience: 'Families who need help exploring scheduled caregiver availability.', includes: 'A conversation about timing, locality, support needs, and available partner options.', excludes: 'A guaranteed placement or a confirmed caregiver before both sides accept written terms.', category: 'Coordination' },
  { slug: 'family-care-updates', title: 'family', icon: 'message', audience: 'Families coordinating care from the same or a different city.', includes: 'Agreed communication with authorised family contacts about the care arrangement.', excludes: 'Sharing personal details without permission or representing coordination updates as clinical assessments.', category: 'Coordination' },
  { slug: 'hospital-visit-coordination', title: 'hospital', icon: 'calendar', audience: 'Families arranging practical assistance around a scheduled appointment.', includes: 'Appointment scheduling support and exploration of practical visit assistance.', excludes: 'Emergency transport, medical advice, clinical interpretation, and a confirmed visit before availability is accepted.', category: 'Coordination' },
  { slug: 'respite-support', title: 'respite', icon: 'rest', audience: 'Family caregivers exploring temporary support while they are unavailable.', includes: 'An enquiry about planned short-term non-clinical assistance, subject to availability.', excludes: 'Guaranteed coverage, emergency cover, and clinical services without a qualified provider.', category: 'Non-clinical support' },
  { slug: 'qualified-professional-care', title: 'nursing', icon: 'plus', audience: 'Families enquiring about eligible nursing or allied health services.', includes: 'Coordination of an enquiry with an appropriately qualified and eligible provider, if available.', excludes: 'Unqualified clinical work, diagnosis, prescribing, treatment decisions, and a service before qualification and availability are checked.', category: 'Professional care enquiry' },
  { slug: 'hospital-to-home-recovery', icon: 'van', accent: 'blue', category: 'Transition coordination', enTitle: 'Hospital-to-home recovery', hiTitle: 'अस्पताल से घर की देखभाल', enBody: 'Coordinate practical discharge-to-home tasks and family follow-up after a hospital stay.', hiBody: 'अस्पताल से घर लौटने के बाद डिस्चार्ज-संबंधी व्यावहारिक कार्यों और परिवार के फॉलो-अप का समन्वय।', enLink: 'Plan the transition', hiLink: 'घर वापसी की योजना', displayTitle: 'Hospital-to-home recovery coordination', includes: 'A family-led checklist for practical discharge arrangements, appointment coordination, home support enquiries, and agreed updates after a hospital stay.', excludes: 'Medical discharge decisions, interpretation of clinical instructions, emergency transport, or clinical care without an appropriately qualified provider.' },
  { slug: 'diagnostics-coordination', icon: 'pulse', accent: 'blue', category: 'Diagnostics coordination', enTitle: 'Diagnostics coordination', hiTitle: 'जांच समन्वय', enBody: 'Ask about coordinating a diagnostic appointment through an eligible provider, subject to confirmation.', hiBody: 'उपलब्ध और पात्र सेवा-प्रदाता की पुष्टि के अधीन जांच अपॉइंटमेंट के समन्वय के बारे में पूछें।', enLink: 'Explore diagnostics', hiLink: 'जांच सहायता जानें', displayTitle: 'Diagnostics appointment coordination', includes: 'An enquiry about coordinating an appointment with an eligible diagnostic provider, including practical scheduling and family communication.', excludes: 'Diagnostic interpretation, clinical advice, a test order, sample collection, or confirmed access to any facility before provider eligibility and availability are checked.' },
  { slug: 'physiotherapy-coordination', icon: 'therapy', accent: 'purple', category: 'Rehabilitation enquiry', enTitle: 'Physiotherapy coordination', hiTitle: 'फिजियोथेरेपी समन्वय', enBody: 'Enquire about physiotherapy with an appropriately qualified provider, if available.', hiBody: 'यदि उपलब्ध हों, तो उपयुक्त रूप से योग्य प्रदाता से फिजियोथेरेपी के बारे में पूछें।', enLink: 'Explore physiotherapy', hiLink: 'फिजियोथेरेपी जानें', displayTitle: 'Physiotherapy and rehabilitation coordination', includes: 'An enquiry to explore a physiotherapy appointment or home visit with an appropriately qualified provider, subject to scope and availability.', excludes: 'Diagnosis, exercise prescription, treatment decisions, rehabilitation outcomes, or clinical service by an unqualified person.' },
  { slug: 'medical-equipment-coordination', icon: 'equipment', accent: 'green', category: 'Equipment coordination', enTitle: 'Medical equipment coordination', hiTitle: 'चिकित्सा उपकरण समन्वय', enBody: 'Coordinate an enquiry about required equipment; supplier, suitability and availability must be checked.', hiBody: 'आवश्यक उपकरण के बारे में पूछताछ समन्वित करें; आपूर्तिकर्ता, उपयुक्तता और उपलब्धता की पुष्टि आवश्यक है।', enLink: 'Ask about equipment', hiLink: 'उपकरण के बारे में पूछें', displayTitle: 'Medical equipment coordination', includes: 'A practical enquiry about identifying an equipment need stated by the family or treating professional and exploring supplier availability and terms.', excludes: 'Clinical device selection, fit assessment, a purchase or rental guarantee, or instructions for equipment use without an appropriately qualified professional.' },
  { slug: 'insurance-document-assistance', icon: 'document', accent: 'orange', category: 'Document assistance', enTitle: 'Insurance document assistance', hiTitle: 'बीमा दस्तावेज़ सहायता', enBody: 'Get practical help organising claim paperwork; insurer decisions and approvals remain independent.', hiBody: 'क्लेम के कागज़ व्यवस्थित करने में व्यावहारिक सहायता लें; बीमाकर्ता के निर्णय स्वतंत्र हैं।', enLink: 'Explore document help', hiLink: 'दस्तावेज़ सहायता जानें', displayTitle: 'Insurance document coordination assistance', includes: 'A non-legal, administrative enquiry about organising a checklist of documents requested by the family’s insurer or hospital.', excludes: 'Insurance advice, policy interpretation, claim submission on a customer’s behalf, approval guarantees, legal representation, or retention of identity and medical documents in this website.' },
  { slug: 'long-term-care-coordination', icon: 'heart', accent: 'teal', category: 'Family coordination', enTitle: 'Long-term care coordination', hiTitle: 'दीर्घकालिक देखभाल समन्वय', enBody: 'Help families discuss a changing support plan, agreed responsibilities and follow-ups.', hiBody: 'परिवारों को बदलती सहायता योजना, सहमत जिम्मेदारियों और फॉलो-अप पर चर्चा में मदद।', enLink: 'Plan family support', hiLink: 'परिवार सहायता योजना', displayTitle: 'Long-term care and family coordination', includes: 'A conversation about a changing non-clinical support plan, named family contacts, communication preferences, and appointments or service enquiries.', excludes: 'Clinical case management, guaranteed continuity, professional advice, or sharing updates without the care recipient’s consent.' },
];

const healthText = {
  en: {
    doctorTitle: 'Doctor Consultation & Hospital Assistance',
    doctorIntro: 'Request help coordinating an appointment, hospital visit, practical accompaniment, or follow-up for a family member in Varanasi.',
    medicineTitle: 'Medicines Delivered to Your Home',
    medicineIntro: 'After your doctor consultation, SEHASETU Healthcare can help coordinate the delivery of your prescribed medicines to your home, subject to prescription verification, medicine availability, and applicable laws. Our goal is to make ongoing care easier for elderly patients and their families.',
    doctorNotice: 'SEHASETU is a care-coordination service, not a substitute for a registered doctor. We do not diagnose, prescribe, interpret clinical instructions, or promise a doctor or hospital appointment.',
    medicineNotice: 'Medicine fulfillment is not connected yet. Any future supply requires a valid prescription, medicine-specific checks by an authorized pharmacy or pharmacist, availability, customer approval of price, and compliance with applicable law. Do not upload or send prescriptions through this website.',
    noUpload: 'Secure private prescription storage and authorized pharmacy review are not connected. This form does not accept documents. If coordination is available, staff will explain a suitable next step; no medicine order is placed by submitting this request.',
    patientDetails: 'Patient and contact details',
    patientName: 'Patient full name',
    age: 'Age (years)',
    dob: 'Date of birth (if age not known)',
    caregiverName: 'Family member or caregiver name',
    phone: 'Registered mobile number',
    email: 'Email address (optional)',
    address: 'Current address',
    locality: 'Service area / locality in Varanasi',
    doctorDetails: 'Doctor and hospital preferences',
    doctorPreference: 'Doctor preference',
    preferDoctor: 'I have a preferred doctor',
    noDoctor: "I don't have a preferred doctor",
    findDoctor: 'I need help finding a doctor',
    doctorName: 'Preferred doctor name',
    specialty: 'Specialty (if known)',
    hospital: 'Preferred hospital or clinic',
    hospitalAddress: 'Hospital address or location',
    lastVisit: 'Last consultation date (if applicable)',
    nextVisit: 'Next appointment or follow-up date (if known)',
    accompaniment: 'Do you need hospital accompaniment?',
    medicineHelp: 'Do you need help coordinating prescribed medicine?',
    contactMethod: 'Preferred contact method',
    phoneContact: 'Phone',
    emailContact: 'Email',
    followUp: 'Would you like a non-essential follow-up check-in?',
    followUpDate: 'Requested follow-up date',
    yes: 'Yes',
    no: 'No',
    consent: 'I confirm I am the patient or authorised to share these details. I consent to their secure storage and use only for this care-coordination request.',
    consentNote: 'Share only information needed to coordinate care. Do not include diagnoses, symptoms, or medical records in optional fields.',
    submitCoordination: 'Request doctor / hospital assistance',
    medicineRequest: 'Medicine request details',
    medicineName: 'Medicine name (if known; optional)',
    quantity: 'Quantity from prescription (if known; optional)',
    deliveryInstructions: 'Delivery instructions (optional)',
    requestedDate: 'Requested delivery date (not guaranteed)',
    deliveryWindow: 'Preferred time window',
    flexible: 'Flexible',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    requestType: 'Request type',
    firstOrder: 'First request',
    refill: 'Refill request',
    verified: 'I understand this is only a request. An authorized pharmacy must verify the prescription, restrictions, availability, and price, and I must approve the order before any fulfillment.',
    medicineConsent: 'I consent to process these details for this medicine-coordination request and, if an authorized pharmacy integration is established, share only the minimum necessary information with it.',
    submitMedicine: 'Request medicine delivery assistance',
    how: 'How coordination would work',
    steps: [
      ['Doctor consultation', 'The patient consults their doctor, independently or with practical assistance where available.'],
      ['Prescription review', 'A valid prescription must be reviewed by an appropriately authorized pharmacy or pharmacist. This website does not receive prescriptions.'],
      ['Availability and price', 'The responsible seller must confirm the permitted medicine, quantity, price, and delivery charge.'],
      ['Customer approval', 'The patient or authorized representative must approve before an order proceeds.'],
      ['Delivery and check-in', 'A legally authorized pharmacy and delivery partner must fulfill the order. Follow-up reminders are not automated.'],
    ],
    pending: 'Pending setup: private prescription uploads, pharmacy verification and ordering, payments, SMS/WhatsApp reminders, delivery tracking, staff roles, and automated retention/deletion controls. Requests are stored only when server encryption is configured and are visible only to the existing administrator account.',
    noAuto: 'A reminder request is recorded for staff review only. No SMS, WhatsApp, automatic refill, order, payment, pharmacy verification, or delivery confirmation is generated. A week passing never renews a prescription.',
  },
  hi: {
    doctorTitle: 'डॉक्टर परामर्श और अस्पताल सहायता',
    doctorIntro: 'वाराणसी में परिवार के सदस्य के लिए अपॉइंटमेंट, अस्पताल जाने, साथ जाने की व्यवस्था या फॉलो-अप के समन्वय हेतु अनुरोध करें।',
    medicineTitle: 'घर पर दवाओं के समन्वय में सहायता',
    medicineIntro: 'डॉक्टर से परामर्श के बाद, SEHASETU Healthcare आपके लिए लिखी गई दवाओं को घर तक पहुंचाने में समन्वय कर सकता है। यह वैध पर्चे की जांच, दवा की उपलब्धता और लागू कानूनों पर निर्भर है। हमारा उद्देश्य बुज़ुर्गों और उनके परिवारों के लिए निरंतर देखभाल को आसान बनाना है।',
    doctorNotice: 'SEHASETU देखभाल-समन्वय सेवा है, पंजीकृत डॉक्टर का विकल्प नहीं। हम निदान, दवा लिखने, चिकित्सकीय निर्देशों की व्याख्या या डॉक्टर/अस्पताल अपॉइंटमेंट की गारंटी नहीं देते।',
    medicineNotice: 'दवा उपलब्ध कराने की सुविधा अभी जुड़ी नहीं है। भविष्य में किसी भी आपूर्ति के लिए वैध पर्चा, अधिकृत फार्मेसी/फार्मासिस्ट की जांच, उपलब्धता, कीमत पर ग्राहक की मंज़ूरी और लागू कानूनों का पालन आवश्यक होगा। इस वेबसाइट पर पर्चा अपलोड या न भेजें।',
    noUpload: 'निजी पर्चा-संग्रह और अधिकृत फार्मेसी समीक्षा की सुविधा उपलब्ध नहीं है। यह फ़ॉर्म दस्तावेज़ स्वीकार नहीं करता। अनुरोध भेजने से दवा का ऑर्डर नहीं होता।',
    patientDetails: 'मरीज़ और संपर्क जानकारी',
    patientName: 'मरीज़ का पूरा नाम',
    age: 'उम्र (वर्ष)',
    dob: 'जन्म तिथि (यदि उम्र ज्ञात न हो)',
    caregiverName: 'परिवार के सदस्य या देखभालकर्ता का नाम',
    phone: 'पंजीकृत मोबाइल नंबर',
    email: 'ईमेल (वैकल्पिक)',
    address: 'वर्तमान पता',
    locality: 'वाराणसी का सेवा क्षेत्र / इलाका',
    doctorDetails: 'डॉक्टर और अस्पताल की पसंद',
    doctorPreference: 'डॉक्टर की पसंद',
    preferDoctor: 'मेरे पसंदीदा डॉक्टर हैं',
    noDoctor: 'मेरे पसंदीदा डॉक्टर नहीं हैं',
    findDoctor: 'डॉक्टर ढूंढने में सहायता चाहिए',
    doctorName: 'पसंदीदा डॉक्टर का नाम',
    specialty: 'विशेषज्ञता (यदि ज्ञात हो)',
    hospital: 'पसंदीदा अस्पताल या क्लिनिक',
    hospitalAddress: 'अस्पताल का पता या स्थान',
    lastVisit: 'पिछले परामर्श की तारीख (यदि लागू हो)',
    nextVisit: 'अगली अपॉइंटमेंट या फॉलो-अप तारीख (यदि ज्ञात हो)',
    accompaniment: 'क्या अस्पताल जाने में साथ की आवश्यकता है?',
    medicineHelp: 'क्या लिखी गई दवा के समन्वय में सहायता चाहिए?',
    contactMethod: 'पसंदीदा संपर्क माध्यम',
    phoneContact: 'फोन',
    emailContact: 'ईमेल',
    followUp: 'क्या आप गैर-ज़रूरी फॉलो-अप संपर्क चाहते हैं?',
    followUpDate: 'अनुरोधित फॉलो-अप तारीख',
    yes: 'हाँ',
    no: 'नहीं',
    consent: 'मैं पुष्टि करता/करती हूँ कि मैं मरीज़ हूँ या यह जानकारी साझा करने के लिए अधिकृत हूँ। मैं इस अनुरोध के लिए सुरक्षित संग्रह और उपयोग की सहमति देता/देती हूँ।',
    consentNote: 'केवल देखभाल समन्वय के लिए आवश्यक जानकारी दें। वैकल्पिक फ़ील्ड में निदान, लक्षण या मेडिकल रिकॉर्ड न दें।',
    submitCoordination: 'डॉक्टर / अस्पताल सहायता का अनुरोध करें',
    medicineRequest: 'दवा अनुरोध का विवरण',
    medicineName: 'दवा का नाम (यदि ज्ञात हो; वैकल्पिक)',
    quantity: 'पर्चे के अनुसार मात्रा (यदि ज्ञात हो; वैकल्पिक)',
    deliveryInstructions: 'डिलीवरी निर्देश (वैकल्पिक)',
    requestedDate: 'अनुरोधित डिलीवरी तारीख (गारंटी नहीं)',
    deliveryWindow: 'पसंदीदा समय',
    flexible: 'लचीला',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    requestType: 'अनुरोध का प्रकार',
    firstOrder: 'पहला अनुरोध',
    refill: 'रीफिल अनुरोध',
    verified: 'मैं समझता/समझती हूँ कि यह केवल अनुरोध है। अधिकृत फार्मेसी को पर्चे, नियम, उपलब्धता और कीमत की जांच करनी होगी और ऑर्डर आगे बढ़ने से पहले मेरी मंज़ूरी आवश्यक है।',
    medicineConsent: 'मैं इस दवा-समन्वय अनुरोध के लिए जानकारी संसाधित करने और अधिकृत फार्मेसी सुविधा जुड़ने पर न्यूनतम आवश्यक जानकारी साझा करने की सहमति देता/देती हूँ।',
    submitMedicine: 'दवा डिलीवरी सहायता का अनुरोध करें',
    how: 'समन्वय की प्रक्रिया',
    steps: [
      ['डॉक्टर से परामर्श', 'मरीज़ डॉक्टर से परामर्श करता है; उपलब्ध होने पर व्यावहारिक सहायता ली जा सकती है।'],
      ['पर्चे की समीक्षा', 'वैध पर्चे की समीक्षा अधिकृत फार्मेसी या फार्मासिस्ट द्वारा होनी चाहिए। यह वेबसाइट पर्चे प्राप्त नहीं करती।'],
      ['उपलब्धता और कीमत', 'विक्रेता को अनुमत दवा, मात्रा, कीमत और डिलीवरी शुल्क की पुष्टि करनी होगी।'],
      ['ग्राहक की मंज़ूरी', 'ऑर्डर आगे बढ़ने से पहले मरीज़ या अधिकृत प्रतिनिधि की मंज़ूरी आवश्यक है।'],
      ['डिलीवरी और संपर्क', 'कानूनी रूप से अधिकृत फार्मेसी और डिलीवरी पार्टनर को ऑर्डर पूरा करना होगा। रिमाइंडर स्वचालित नहीं हैं।'],
    ],
    pending: 'अभी उपलब्ध नहीं: निजी पर्चा अपलोड, फार्मेसी सत्यापन/ऑर्डर, भुगतान, SMS/WhatsApp रिमाइंडर, डिलीवरी ट्रैकिंग, स्टाफ भूमिकाएँ और स्वचालित डेटा नियंत्रण।',
    noAuto: 'रिमाइंडर अनुरोध केवल स्टाफ समीक्षा के लिए दर्ज होता है। कोई SMS, WhatsApp, स्वतः रीफिल, ऑर्डर, भुगतान, फार्मेसी सत्यापन या डिलीवरी पुष्टि नहीं होती। एक सप्ताह बीतने से पर्चा नवीनीकृत नहीं होता।',
  },
};

const articles = [
  { slug: 'choosing-an-elderly-caregiver', category: 'Finding care', title: 'How to choose an elderly caregiver', excerpt: 'A practical conversation guide for finding a support arrangement that respects your family member’s needs.', body: '<h2>Start with the person, not the timetable</h2><p>Ask your family member what makes a day feel comfortable, what they would like help with, and what they prefer to do independently. A good plan begins with dignity and clear boundaries.</p><h2>Questions worth asking</h2><ul><li>What tasks are included in the agreed, written scope?</li><li>What relevant experience does the provider have?</li><li>How are schedules, attendance, substitutions, and cancellations handled?</li><li>Who should the family contact with a question or concern?</li></ul><h2>Agree before the first visit</h2><p>Share essential household preferences with permission, confirm the schedule and fees in writing, and make sure everyone understands what is outside the arrangement. Check any qualifications needed for specialised tasks.</p><p>For clinical concerns or support beyond a caregiver’s training, ask a qualified healthcare professional.</p>' },
  { slug: 'questions-before-home-care', category: 'Planning', title: 'Questions to ask before arranging home care', excerpt: 'Cover the service scope, scheduling, pricing, and the plan for concerns before you confirm.', body: '<h2>Clarify what is included</h2><p>Ask which day-to-day tasks are in scope and where the boundary between non-clinical assistance and professional care lies. Get the arrangement in writing.</p><h2>Confirm the practical details</h2><p>Discuss start times, frequency, locality, pricing, extra charges, cancellation terms, payment milestones, and who to contact if plans change.</p><h2>Protect privacy and choice</h2><p>Only share information needed for the agreed arrangement, with the person’s permission. Make sure your family member can speak up and participate in decisions.</p>' },
  { slug: 'preparing-home-for-support', category: 'At home', title: 'Preparing the home for a first care visit', excerpt: 'Simple planning steps to help a new home-support arrangement start with clarity and care.', body: '<h2>Walk through the routine together</h2><p>With the person’s permission, share important household preferences, agreed tasks, and emergency contact details appropriate to the arrangement.</p><h2>Make space for a respectful visit</h2><p>Identify the areas involved, offer a seat and clear directions, and explain any household routines or access considerations. Do not share unnecessary medical records.</p><h2>Review, do not assume</h2><p>Confirm the visitor’s identity through the contact arrangement you agreed in advance. If anything about the visit feels wrong, pause and contact your care coordinator.</p>' },
  { slug: 'coordinating-care-from-another-city', category: 'For families', title: 'Coordinating care when family lives in another city', excerpt: 'A calmer framework for shared decisions, agreed contacts, and consent-based updates.', body: '<h2>Agree who does what</h2><p>Choose a main family contact, clarify who may receive updates, and involve the person receiving care in every decision they can make.</p><h2>Make expectations clear</h2><p>Write down the agreed schedule, fee, scope, and how the family will hear about changes. Decide what should happen if a visit is delayed or missed.</p><h2>Keep communication proportionate</h2><p>Share only information the person has agreed to share. Coordination updates do not replace professional health advice or a direct conversation with the provider.</p>' },
  { slug: 'preparing-for-an-appointment', category: 'Appointments', title: 'Getting ready for a hospital appointment', excerpt: 'A family checklist for planning the practical details around an upcoming appointment.', body: '<h2>Before the day</h2><p>Confirm the appointment time, location, travel plan, and the contact person for the day. Ask the clinic directly about any preparation or documents the clinician has requested.</p><h2>Bring a short list</h2><p>Help your family member write down questions they want to raise. Keep any clinician-requested records with them and avoid sharing them through an unsecure enquiry form.</p><p>This checklist supports appointment organisation. For clinical preparation, follow the treating professional’s instructions.</p>' },
  { slug: 'caregiver-or-nurse', category: 'Understanding care', title: 'A caregiver and a nurse: understanding the difference', excerpt: 'Why role boundaries and appropriate qualifications matter when arranging support at home.', body: '<h2>Different training, different work</h2><p>A non-clinical caregiver may assist with agreed companionship or everyday routines. Nursing is a professional clinical role with applicable qualifications, registration, and responsibilities.</p><h2>Ask who will perform the work</h2><p>Confirm the individual’s role, relevant credentials for professional tasks, written scope, and who is accountable for the work. Do not assume a caregiver is qualified to perform clinical procedures.</p><p>Clinical questions belong with an appropriately qualified healthcare professional.</p>' },
  { slug: 'first-visit-family-checklist', category: 'Planning', title: 'A family checklist for a first care visit', excerpt: 'Before, during, and after the first agreed visit: a few details to review together.', body: '<h2>Before the visit</h2><ul><li>Confirm the provider, date, arrival time, agreed tasks, fees, and contact process.</li><li>Check that the person receiving care understands and welcomes the arrangement.</li><li>Share only the preferences and practical details needed.</li></ul><h2>After the visit</h2><p>Ask your family member what felt comfortable, note any agreed follow-up, and raise concerns using the agreed contact process.</p>' },
];

const faqItems = [
  ['What is SEHASETU Healthcare?', 'A developing care coordination platform that helps Varanasi families explore appropriate support, clarify scope and costs, and coordinate communication. Independent providers deliver their own services.'],
  ['Which areas do you serve?', 'The initial focus is Varanasi, Uttar Pradesh. A particular locality and service must be checked for availability; coverage is not guaranteed.'],
  ['How can I request elderly care?', 'Use the care request form to share your requirements and locality. A form submission is an enquiry, not a confirmed appointment or booking.'],
  ['Can I arrange care for parents from another city?', 'Family members can make an enquiry and request consent-based updates. The person receiving care should be included in decisions whenever possible.'],
  ['How are caregivers and service partners checked?', 'Partner eligibility, identity, qualification, references, and service scope need to be checked before a service is offered. Do not treat an enquiry as confirmation that any individual is verified or approved.'],
  ['Are caregivers and nurses the same?', 'No. Everyday caregiver support is non-clinical. Nursing and other clinical work must be performed by appropriately qualified and eligible professionals.'],
  ['How much does home care cost?', 'Cost depends on the service, duration, frequency, location, provider charges, additional agreed services, applicable taxes, and any coordination fee. Request a written quote before confirming.'],
  ['Can I book recurring support?', 'You can request recurring support. Schedule, provider availability, price, cancellation terms, and service scope all need written agreement before a booking is confirmed.'],
  ['How are family updates shared?', 'Only agreed updates are shared with authorised family contacts and with the care recipient’s appropriate consent. Coordination updates are not clinical assessments.'],
  ['What happens if a caregiver cancels?', 'A replacement cannot be guaranteed. Any next steps depend on the agreed booking terms and the availability of another suitable option.'],
  ['What happens if I have a complaint?', 'Please use the complaints process and published grievance contact once official contact information is configured. No grievance contact has been supplied yet.'],
  ['Does SEHASETU provide emergency medical services?', 'No. SEHASETU is not an emergency response or medical service. In an emergency, contact local emergency services or a qualified medical professional.'],
  ['How is personal information handled?', 'Only request information needed to assess a service enquiry. Online submission and secure storage remain unavailable until the backend is configured. See the privacy notice for details.'],
  ['How can I become a service partner?', 'Submit a partner enquiry for review. An application does not mean approval. Appropriate identity, qualifications, availability, references, and written terms require review.'],
];

const icons = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  home: '<path d="m3 10 9-7 9 7v10H5V10m5 10v-6h4v6"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m5-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 2a4 4 0 0 1 4 4v2m-4-18a4 4 0 0 1 0 8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
  plus: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm0-14v8m-4-4h8"/>',
  rest: '<path d="M3 20h18M5 20v-6a7 7 0 0 1 14 0v6M5 11a8 8 0 0 1 14 0M9 14h.01M15 14h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.2.4 2.4.9 3.5a2 2 0 0 1-.4 2.1L8.3 10.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c1.1.5 2.3.8 3.5.9a2 2 0 0 1 1.9 2.1Z"/>',
  hospital: '<path d="M3 21V7l9-4 9 4v14M8 21v-5h8v5M12 7v6m-3-3h6M6 10h.01M18 10h.01"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  bottle: '<path d="M9 3h6m-5 0v4l-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-2-2V3m-6 11h8"/>',
  therapy: '<circle cx="12" cy="5" r="2"/><path d="m9 21 2-7-4 2-2-3m7 1 4 2 3-5m-8 3-3 7m5-8 2 8"/>',
  equipment: '<path d="M4 19V5m0 10h16M8 5v8m8-8v8M4 8h16M7 19v2m10-2v2"/>',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h8"/>',
  van: '<path d="M3 6h12v12H3zM15 10h4l3 3v5h-7M7 18a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
};

const t = (key) => copy[language]?.[key] || copy.en[key] || key;
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true" viewBox="0 0 24 24">${icons[name] || icons.heart}</svg>`;
const routePath = () => decodeURI(location.pathname).replace(/\/$/, '') || '/';
const pathSegments = () => routePath().split('/').filter(Boolean);
const link = (href, label, cls = 'button button-primary') => `<a class="${cls}" href="${href}">${label}</a>`;
const pageHero = (eyebrow, title, body, path, accent = 'teal') => `<section class="page-hero page-${esc(accent)}"><div class="container page-heading"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${esc(eyebrow)}</span></nav><span class="eyebrow">${esc(eyebrow)}</span><h1>${title}</h1><p>${body}</p></div></section>`;
const sectionHeading = (eyebrow, title, body = '', center = false) => `<div class="section-heading${center ? ' section-heading-center' : ''}"><span class="eyebrow">${esc(eyebrow)}</span><h2>${title}</h2>${body ? `<p>${body}</p>` : ''}</div>`;

function serviceCard(service) {
  const keys = { 'elderly-care': 'elderly', 'daily-living-support': 'elderly', 'caregiver-coordination': 'caregiver', 'family-care-updates': 'family', 'hospital-visit-coordination': 'hospital', 'respite-support': 'family', 'qualified-professional-care': 'nursing' };
  const key = keys[service.slug];
  const title = service[`${language}Title`] || t(`s.${key}.title`);
  const body = service[`${language}Body`] || t(`s.${key}.body`);
  const linkText = service[`${language}Link`] || t(`s.${key}.link`);
  return `<article class="service-card service-${esc(service.accent || 'teal')}"><span class="service-icon">${icon(service.icon)}</span><span class="service-category">${esc(service.category)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p><a class="service-link" href="/services/${service.slug}">${esc(linkText)} <span aria-hidden="true">→</span></a></article>`;
}

function articleCard(article) {
  return `<article class="resource-card" data-resource data-category="${esc(article.category)}"><span class="resource-category">${esc(article.category)}</span><h3>${esc(article.title)}</h3><p>${esc(article.excerpt)}</p><a class="service-link" href="/resources/${article.slug}">Read article <span aria-hidden="true">→</span></a></article>`;
}

function footer() {
  return `<section class="section-tight container"><div class="cta-band"><div><h2>${t('cta.title')}</h2><p>${t('cta.body')}</p></div>${link('/request-care', `${t('cta.button')} <span aria-hidden="true">↗</span>`, 'button button-primary')}</div></section>
  <footer class="site-footer"><div class="container"><div class="footer-top"><div class="footer-brand"><a class="brand" href="/" aria-label="SEHASETU Healthcare home"><svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true" fill="none"><path d="M5 32h34M9 32V16m26 16V16M9 17c3.2-6 7.4-9 13-9s9.8 3 13 9M9 23c3.3-4 7.7-6 13-6s9.7 2 13 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="26" r="2.1" fill="currentColor"/></svg><span class="brand-type"><strong>SEHASETU</strong><span>HEALTHCARE</span></span></a><p class="footer-tagline">Hospital Se Ghar Tak, Har Kadam Saath.</p><p>Thoughtful care coordination for families in Varanasi.</p></div><nav class="footer-column" aria-label="Services"><h2>Explore</h2><ul><li><a href="/services">All services</a></li><li><a href="/doctor-hospital-assistance">Doctor &amp; hospital assistance</a></li><li><a href="/medicine-delivery">Medicine request assistance</a></li><li><a href="/how-it-works">How it works</a></li><li><a href="/request-care">Request care</a></li><li><a href="/resources">Care resources</a></li><li><a href="/faqs">Common questions</a></li></ul></nav><nav class="footer-column" aria-label="Company"><h2>SEHASETU</h2><ul><li><a href="/about">About us</a></li><li><a href="/for-partners">For care partners</a></li><li><a href="/partner-application">Partner enquiry</a></li><li><a href="/for-families">For families</a></li><li><a href="/contact">Contact</a></li></ul></nav><nav class="footer-column" aria-label="Policies"><h2>Useful information</h2><ul><li><a href="/privacy">Privacy notice</a></li><li><a href="/terms">Terms and conditions</a></li><li><a href="/cancellation">Cancellation policy</a></li><li><a href="/grievance">Complaints process</a></li><li><a href="/admin">Staff sign-in</a></li></ul></nav></div><p class="footer-disclaimer">${t('footer.scope')} Website content, terms, privacy notices, partner agreements, and applicable legal requirements need appropriate review before launch.</p><div class="footer-bottom"><span>© ${new Date().getFullYear()} SEHASETU Healthcare</span><span>Initial service focus: Varanasi, Uttar Pradesh, India</span></div></div></footer>`;
}

function legacyHomePage() {
  const heroPhoto = 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1300&q=85';
  const process = ['one', 'two', 'three', 'four', 'five'];
  const trust = [['shield', 'trust.one'], ['check', 'trust.two'], ['people', 'trust.three'], ['pin', 'trust.four']];
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">${t('hero.eyebrow')}</span><h1>${t('hero.title')}</h1><p>${t('hero.body')}</p><div class="hero-actions">${link('/request-care', `${t('hero.request')} <span aria-hidden="true">↗</span>`)}${link('/services', t('hero.explore'), 'button button-secondary')}</div><p class="hero-tagline"><strong>${t('hero.tagline')}</strong></p></div><div class="hero-media"><img class="hero-photo" src="${heroPhoto}" alt="An older woman speaks warmly with a younger woman, illustrating a family care conversation" width="1300" height="867" fetchpriority="high" referrerpolicy="no-referrer"><div class="photo-note"><div class="photo-note-top"><span class="note-symbol">${icon('heart')}</span>${t('hero.noteTitle')}</div><p>${t('hero.note')}</p></div></div></div></section>
  <section class="trust-strip" aria-label="Our service principles"><div class="container trust-grid">${trust.map(([ico, key]) => `<div class="trust-item"><span class="trust-icon">${icon(ico)}</span><span>${t(key)}</span></div>`).join('')}</div></section>
  <section class="section"><div class="container">${sectionHeading(t('services.eyebrow'), t('services.title'), t('services.body'))}<div class="service-grid">${[serviceData[0], serviceData[2], serviceData[4], serviceData[3], serviceData[5], serviceData[6]].map(serviceCard).join('')}</div><div class="scope-note">${icon('shield')}<span>${t('services.scope')}</span></div></div></section>
  <section class="section section-soft"><div class="container">${sectionHeading(language === 'hi' ? 'सहायता सेवाएँ' : 'More ways to coordinate care', language === 'hi' ? 'डॉक्टर से लेकर घर तक समन्वय सहायता' : 'From a doctor visit to support at home', language === 'hi' ? 'डॉक्टर और अस्पताल सहायता, अपॉइंटमेंट समन्वय, बुज़ुर्गों की देखभाल और दवा अनुरोध के बारे में जानें।' : 'Explore doctor and hospital assistance, follow-up coordination, elderly support, and medicine requests.')}<div class="service-grid">${[
    ['/doctor-hospital-assistance', language === 'hi' ? 'डॉक्टर और अस्पताल सहायता' : 'Doctor & Hospital Assistance', 'calendar', language === 'hi' ? 'अपॉइंटमेंट समन्वय और अस्पताल साथ के लिए अनुरोध करें।' : 'Request appointment coordination and practical hospital accompaniment.'],
    ['/medicine-delivery', language === 'hi' ? 'दवा डिलीवरी सहायता' : 'Medicine Home Delivery', 'plus', language === 'hi' ? 'वैध पर्चे की जांच और फार्मेसी सुविधा के अधीन।' : 'Request coordination, subject to prescription review and pharmacy setup.'],
    ['/doctor-hospital-assistance', language === 'hi' ? 'फॉलो-अप अपॉइंटमेंट' : 'Follow-up Appointment Coordination', 'calendar', language === 'hi' ? 'परिवार की सहमति के साथ अगली तारीखें समन्वित करें।' : 'Coordinate next appointments with the family’s consent.'],
    ['/medicine-delivery', language === 'hi' ? 'पर्चे के अनुसार रीफिल सहायता' : 'Prescription Refill Assistance', 'shield', language === 'hi' ? 'कोई रीफिल स्वतः नहीं होता; नई पुष्टि आवश्यक है।' : 'No automatic refill; each request needs fresh confirmation.'],
    ['/services/elderly-care', language === 'hi' ? 'बुज़ुर्गों और परिवार की सहायता' : 'Elderly Care & Family Support', 'people', language === 'hi' ? 'घर पर गैर-चिकित्सकीय सहायता के विकल्प जानें।' : 'Explore non-clinical support options for older adults at home.'],
  ].map(([href, title, ico, body]) => `<article class="service-card"><span class="service-icon">${icon(ico)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p><a class="service-link" href="${href}">${language === 'hi' ? 'और जानें' : 'Learn more'} <span aria-hidden="true">→</span></a></article>`).join('')}</div></div></section>
  <section class="section section-soft"><div class="container">${sectionHeading(t('how.eyebrow'), t('how.title'), t('how.body'))}<div class="steps">${process.map((item, i) => `<article class="step-card"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><h3>${t(`step.${item}.title`)}</h3><p>${t(`step.${item}.body`)}</p></article>`).join('')}</div><p class="small-print"><strong>Before you confirm:</strong> ${t('how.important')}</p></div></section>
  <section class="section"><div class="container values-grid"><div class="values-image"><img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85" alt="A multigenerational family stands together at the coast at sunset" width="1000" height="700" loading="lazy" referrerpolicy="no-referrer"><span class="values-stamp">Care that brings families closer.</span></div><div class="values-copy"><span class="eyebrow">${t('about.eyebrow')}</span><h2 class="section-heading" style="margin-bottom:16px">${t('about.title')}</h2><p>${t('about.body')}</p><p>${t('about.body2')}</p><ul class="values-list">${[1, 2, 3, 4].map(n => `<li><span class="check-mark" aria-hidden="true">✓</span>${t(`about.point${n}`)}</li>`).join('')}</ul>${link('/about', `${t('about.link')} <span aria-hidden="true">→</span>`, 'button-text')}</div></div></section>
  <section class="section section-soft"><div class="container">${sectionHeading(t('resources.eyebrow'), t('resources.title'), t('resources.body'))}<div class="resource-grid">${articles.slice(0, 3).map(articleCard).join('')}</div><p style="margin:20px 0 0">${link('/resources', `${t('resources.all')} <span aria-hidden="true">→</span>`, 'button-text')}</p></div></section>
  <section class="section"><div class="container partner-banner"><div><span class="eyebrow">${t('partner.eyebrow')}</span><h2>${t('partner.title')}</h2><p>${t('partner.body')}</p></div>${link('/for-partners', `${t('partner.cta')} <span aria-hidden="true">↗</span>`, 'button button-white')}</div></section>
  <section class="section section-soft"><div class="container faq-grid"><div class="faq-intro">${sectionHeading(t('faq.eyebrow'), t('faq.title'), t('faq.body'))}${link('/faqs', `${t('faq.all')} <span aria-hidden="true">→</span>`, 'button-text')}</div><div class="faq-list">${faqItems.slice(0, 6).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>
  <section class="section-tight container"><div class="cta-band"><div><h2>${t('cta.title')}</h2><p>${t('cta.body')}</p></div>${link('/request-care', `${t('cta.button')} <span aria-hidden="true">↗</span>`, 'button button-primary')}</div></section>`;
}

function homePage() {
  const heroPhoto = 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1300&q=85';
  const shortcutServices = [
    { href: '/services/elderly-care', icon: 'heart', title: language === 'hi' ? 'बुज़ुर्गों की देखभाल' : 'Elderly care', detail: language === 'hi' ? 'साथ और दैनिक मदद' : 'Companionship & daily help', color: 'teal' },
    { href: '/services/hospital-to-home-recovery', icon: 'van', title: language === 'hi' ? 'अस्पताल से घर' : 'Hospital-to-home', detail: language === 'hi' ? 'डिस्चार्ज के बाद समन्वय' : 'Recovery coordination', color: 'blue' },
    { href: '/doctor-hospital-assistance', icon: 'hospital', title: language === 'hi' ? 'डॉक्टर और अस्पताल' : 'Doctor & hospital', detail: language === 'hi' ? 'अपॉइंटमेंट और साथ' : 'Appointments & assistance', color: 'blue' },
    { href: '/services/qualified-professional-care', icon: 'plus', title: language === 'hi' ? 'योग्य नर्सिंग' : 'Qualified nursing', detail: language === 'hi' ? 'पेशेवर सेवा की पूछताछ' : 'Professional care enquiry', color: 'purple' },
    { href: '/services/diagnostics-coordination', icon: 'pulse', title: language === 'hi' ? 'जांच समन्वय' : 'Diagnostics', detail: language === 'hi' ? 'प्रदाता की पुष्टि आवश्यक' : 'Provider confirmation needed', color: 'blue' },
    { href: '/medicine-delivery', icon: 'bottle', title: language === 'hi' ? 'दवा सहायता' : 'Medicine delivery', detail: language === 'hi' ? 'पर्चा और फार्मेसी जांच' : 'Prescription & pharmacy checks', color: 'orange' },
    { href: '/services/physiotherapy-coordination', icon: 'therapy', title: language === 'hi' ? 'फिजियोथेरेपी' : 'Physiotherapy', detail: language === 'hi' ? 'योग्य प्रदाता की पूछताछ' : 'Qualified provider enquiry', color: 'purple' },
  ];
  const milestones = language === 'hi'
    ? [['01', 'ज़रूरत साझा करें', 'अपनी बात और क्षेत्र बताएँ'], ['02', 'समीक्षा और योजना', 'समन्वयक दायरा समझे'], ['03', 'विकल्प और कोट', 'लिखित जानकारी की समीक्षा'], ['04', 'आपकी मंज़ूरी', 'तभी व्यवस्था की पुष्टि'], ['05', 'देखभाल और संपर्क', 'सहमति के अनुसार फॉलो-अप']]
    : [['01', 'Share your need', 'Tell us what support matters'], ['02', 'Review & plan', 'Clarify the request and scope'], ['03', 'Options & quote', 'Review details in writing'], ['04', 'Your approval', 'Only then confirm an arrangement'], ['05', 'Care & follow-up', 'Updates with your consent']];
  const comparison = language === 'hi'
    ? [['घर और परिवार की सहायता', 'साथ, तय दिनचर्या में मदद, परिवार समन्वय', 'नैदानिक कार्य शामिल नहीं'], ['पेशेवर स्वास्थ्य सेवा', 'नर्सिंग, फिजियोथेरेपी, जांच पूछताछ', 'योग्यता व उपलब्धता की पुष्टि के बाद']]
    : [['Everyday and family support', 'Companionship, agreed routines, family coordination', 'Does not include clinical work'], ['Professional health services', 'Nursing, physiotherapy, diagnostic enquiries', 'Only after qualification and availability checks']];
  const shortLinks = shortcutServices.map(service => `<a class="quick-service quick-${service.color}" href="${service.href}"><span class="quick-icon">${icon(service.icon)}</span><span>${esc(service.title)}<small>${esc(service.detail)}</small></span>${icon('arrow', 'quick-arrow')}</a>`).join('');
  return `<section class="hero hero-premium"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">${language === 'hi' ? 'वाराणसी से शुरुआत · परिवारों के साथ' : 'A thoughtful start to care · Varanasi first'}</span><h1>${language === 'hi' ? 'अस्पताल से घर तक,<br><em>हर कदम साथ।</em>' : 'Hospital Se Ghar Tak,<br><em>Har Kadam Saath.</em>'}</h1><p>${language === 'hi' ? 'बुज़ुर्गों की देखभाल, अस्पताल से घर वापसी, अपॉइंटमेंट और परिवार समन्वय—एक स्पष्ट अगले कदम के लिए हम आपके साथ हैं।' : 'From elderly care and hospital-to-home support to appointments and family coordination, we help you find a clear next step—together.'}</p><div class="hero-actions">${link('/request-care', `${language === 'hi' ? 'देखभाल अनुरोध करें' : 'Request care'} <span aria-hidden="true">↗</span>`)}${link('/services', `${language === 'hi' ? 'सेवाएँ देखें' : 'Explore services'} <span aria-hidden="true">→</span>`, 'button button-secondary')}</div><div class="hero-promises"><span>${icon('shield')} ${language === 'hi' ? 'पहले सहमति' : 'Consent comes first'}</span><span>${icon('document')} ${language === 'hi' ? 'लिखित दायरा और कोट' : 'Written scope and quote'}</span><span>${icon('people')} ${language === 'hi' ? 'परिवार केंद्र में' : 'Family stays involved'}</span></div><p class="hero-tagline"><strong>${t('hero.tagline')}</strong></p></div><div class="hero-media"><div class="hero-image-frame"><img class="hero-photo" src="${heroPhoto}" alt="An older adult sharing a warm conversation with a family caregiver" width="1300" height="867" fetchpriority="high" referrerpolicy="no-referrer"><span class="image-caption">${icon('heart')}<span>${language === 'hi' ? 'सम्मान और साथ के साथ देखभाल' : 'Care with companionship and dignity'}</span></span></div><aside class="photo-note"><div class="photo-note-top"><span class="note-symbol">${icon('shield')}</span>${language === 'hi' ? 'आपकी पसंद, आपका निर्णय' : 'Your care. Your choice.'}</div><p>${language === 'hi' ? 'कोई सेवा तब तक तय नहीं जब तक दायरा, उपलब्धता और कीमत आप स्वीकार न करें।' : 'Nothing is arranged until you have reviewed the scope, availability and price.'}</p></aside></div></div></section>
  <section class="service-shortcuts"><div class="container"><div class="shortcut-heading"><div><span class="eyebrow">${language === 'hi' ? 'परिवार कहाँ से शुरू करें?' : 'Where could your family start?'}</span><h2>${language === 'hi' ? 'एक ही जगह से देखभाल समन्वय' : 'Care coordination, in one place'}</h2></div><a class="service-link" href="/services">${language === 'hi' ? 'सभी सेवाएँ' : 'All services'} <span aria-hidden="true">→</span></a></div><div class="shortcut-grid">${shortLinks}</div></div></section>
  <section class="section section-journey"><div class="container"><div class="section-heading"><span class="eyebrow">${language === 'hi' ? 'हम कैसे साथ चलते हैं' : 'A clear path, at your pace'}</span><h2>${language === 'hi' ? 'अनुरोध से सहमत देखभाल योजना तक' : 'From your first request to an agreed plan'}</h2><p>${language === 'hi' ? 'हर चरण समझें। अनुरोध बुकिंग नहीं है।' : 'Your family understands each step. An enquiry is not a booking.'}</p></div><div class="journey-track">${milestones.map(([number, title, body]) => `<article class="journey-step"><span>${number}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><div class="journey-foot">${icon('shield')}<span>${language === 'hi' ? 'आपकी लिखित मंज़ूरी के बिना कोई सेवा या शुल्क तय नहीं होता।' : 'No service or charge is confirmed until you approve the written plan.'}${link('/how-it-works', language === 'hi' ? 'पूरी प्रक्रिया' : 'See how it works', 'button-text')}</span></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><span class="eyebrow">${language === 'hi' ? 'सुरक्षा और विश्वास' : 'Trust, built into the process'}</span><h2>${language === 'hi' ? 'पेशेवर सेवा से पहले पात्रता जांच' : 'Professional care starts with checking the essentials'}</h2><p>${language === 'hi' ? 'पहचान, भूमिका, लागू योग्यता और सेवा दायरे की समीक्षा ज़रूरी है। इस वेबसाइट पर किसी प्रदाता को सत्यापित नहीं बताया गया है।' : 'Identity, role, relevant qualifications and scope need review before a professional service is considered. No provider is represented as verified on this website.'}</p></div><div class="trust-process"><div class="trust-photo"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85" alt="Healthcare professional speaking with a patient during a care visit" loading="lazy" referrerpolicy="no-referrer"></div><div class="trust-checklist"><article><span>${icon('people')}</span><div><h3>${language === 'hi' ? 'पहचान और भूमिका' : 'Identity and role'}</h3><p>${language === 'hi' ? 'प्रस्तावित सेवा में प्रदाता की भूमिका स्पष्ट करें।' : 'Understand who would deliver the proposed service and in what role.'}</p></div></article><article><span>${icon('document')}</span><div><h3>${language === 'hi' ? 'योग्यता और पात्रता' : 'Qualifications and eligibility'}</h3><p>${language === 'hi' ? 'नैदानिक कार्य के लिए उचित योग्यता आवश्यक।' : 'Relevant credentials and eligibility matter for clinical tasks.'}</p></div></article><article><span>${icon('check')}</span><div><h3>${language === 'hi' ? 'लिखित दायरा और शर्तें' : 'Written scope and terms'}</h3><p>${language === 'hi' ? 'उपलब्धता, शुल्क और जिम्मेदारियाँ पहले समझें।' : 'Review availability, responsibilities, fees and terms before approval.'}</p></div></article><div class="pending-banner"><strong>${language === 'hi' ? 'साझेदार सत्यापन व्यवस्था तैयार की जा रही है' : 'Partner verification workflows are being set up'}</strong><span>${language === 'hi' ? 'किसी साझेदार को सत्यापित बताने का दावा नहीं है।' : 'No partner is currently claimed as verified on this website.'}</span></div></div></div></div></section>
  <section class="section section-comparison"><div class="container"><div class="section-heading"><span class="eyebrow">${language === 'hi' ? 'सही सहायता, स्पष्ट सीमाएँ' : 'The right support, with clear boundaries'}</span><h2>${language === 'hi' ? 'समन्वय और चिकित्सा सेवा में अंतर' : 'Coordination is different from clinical care'}</h2></div><div class="comparison-grid">${comparison.map(([title, includes, excludes], index) => `<article class="comparison-card ${index ? 'comparison-pro' : 'comparison-everyday'}"><span class="service-icon">${icon(index ? 'plus' : 'heart')}</span><span class="service-category">${index ? 'PROFESSIONAL CARE' : 'EVERYDAY SUPPORT'}</span><h3>${esc(title)}</h3><p>${esc(includes)}</p><div>${icon('check')}<span>${esc(excludes)}</span></div></article>`).join('')}</div><p class="small-print">${language === 'hi' ? 'SEHASETU डॉक्टर का विकल्प नहीं है और निदान, दवा लिखने या आपातकालीन चिकित्सा सेवा नहीं देता।' : 'SEHASETU is not a doctor and does not diagnose, prescribe, or provide emergency medical response.'}</p></div></section>
  <section class="section family-section"><div class="container family-panel"><div class="family-photo"><img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85" alt="Family members spending time together across generations" loading="lazy" referrerpolicy="no-referrer"></div><div class="family-copy"><span class="eyebrow">${language === 'hi' ? 'परिवार का साथ' : 'For families, near and far'}</span><h2>${language === 'hi' ? 'देखभाल की योजना में परिवार साथ रहे।' : 'Keep the family in the care conversation.'}</h2><p>${language === 'hi' ? 'सहमति के साथ संपर्क प्राथमिकताएँ तय करें, देखभाल अनुरोध समन्वित करें और अगला कदम स्पष्ट रखें।' : 'Set contact preferences with consent, coordinate practical next steps, and make the plan easier to follow—whether family is nearby or in another city.'}</p><ul><li>${icon('check')} ${language === 'hi' ? 'मरीज़ की पसंद और सहमति' : 'The patient’s preferences and consent'}</li><li>${icon('check')} ${language === 'hi' ? 'सहमति वाले संपर्क व्यक्ति' : 'Agreed family contacts'}</li><li>${icon('check')} ${language === 'hi' ? 'स्पष्ट फॉलो-अप अनुरोध' : 'Clear follow-up requests'}</li></ul><div class="family-actions">${link('/request-care', language === 'hi' ? 'परिवार की सहायता अनुरोध करें' : 'Request family support')}${link('/family-portal', language === 'hi' ? 'पोर्टल की स्थिति' : 'Family portal status', 'button-text')}</div></div></div></section>
  <section class="section medicine-journey"><div class="container medicine-panel"><div><span class="eyebrow">${language === 'hi' ? 'पर्चे के अनुसार दवा' : 'Prescription-based medicine coordination'}</span><h2>${language === 'hi' ? 'दवा अनुरोध—ज़रूरी जांच के बाद' : 'Medicine requests, with the right checks first'}</h2><p>${language === 'hi' ? 'वैध पर्चा, अधिकृत फार्मेसी समीक्षा, उपलब्धता और कीमत पर आपकी मंज़ूरी ज़रूरी है।' : 'A valid prescription, authorized pharmacy review, medicine availability and your approval of the final price are essential before fulfillment.'}</p><div class="medicine-steps"><span>01 <b>${language === 'hi' ? 'पर्चा समीक्षा' : 'Prescription review'}</b></span><span>02 <b>${language === 'hi' ? 'कीमत की पुष्टि' : 'Price confirmed'}</b></span><span>03 <b>${language === 'hi' ? 'आपकी मंज़ूरी' : 'Your approval'}</b></span><span>04 <b>${language === 'hi' ? 'अधिकृत विक्रेता' : 'Authorized seller'}</b></span></div><p class="pending-inline">${icon('shield')} ${language === 'hi' ? 'फार्मेसी और सुरक्षित पर्चा सुविधा अभी जुड़ी नहीं है।' : 'Pharmacy integration and secure prescription handling are not connected yet.'}</p>${link('/medicine-delivery', language === 'hi' ? 'दवा अनुरोध के बारे में जानें' : 'Learn about medicine requests', 'button button-white')}</div><div class="medicine-illustration" aria-hidden="true"><span class="medicine-orbit orbit-one"></span><span class="medicine-orbit orbit-two"></span><span class="medicine-bottle">${icon('bottle')}</span><span class="medicine-shield">${icon('shield')}</span><span class="medicine-cross">+</span></div></div></section>
  <section class="section section-soft"><div class="container">${sectionHeading(t('faq.eyebrow'), t('faq.title'), t('faq.body'))}<div class="home-faq-grid"><div class="faq-list">${faqItems.slice(0, 5).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div><aside class="faq-aside"><span class="faq-aside-icon">${icon('message')}</span><h3>${language === 'hi' ? 'सवाल हैं?' : 'Need a little guidance?'}</h3><p>${language === 'hi' ? 'हमारी टीम से संपर्क करें या देखभाल अनुरोध शुरू करें।' : 'Read a family guide or start with a care request. Asking does not commit you to a service.'}</p>${link('/contact', language === 'hi' ? 'संपर्क करें' : 'Contact the care team', 'button button-secondary')}${link('/resources', language === 'hi' ? 'परिवार गाइड' : 'Read family guides', 'button-text')}</aside></div></div></section>
  <section class="section contact-band"><div class="container contact-panel"><div><span class="eyebrow">${language === 'hi' ? 'एक भरोसेमंद शुरुआत' : 'A thoughtful first step'}</span><h2>${language === 'hi' ? 'आपके परिवार को अभी किस सहायता की ज़रूरत है?' : 'What would make today a little easier for your family?'}</h2><p>${language === 'hi' ? 'अपनी ज़रूरत साझा करें। सेवा की पुष्टि और अगले कदम पर बात करने के लिए टीम संपर्क करेगी।' : 'Tell us what support you are looking for. We will follow up to discuss scope and next steps; submitting a request is not a booking.'}</p><div class="hero-actions">${link('/request-care', language === 'hi' ? 'देखभाल अनुरोध शुरू करें' : 'Start a care request')}${link('/contact', language === 'hi' ? 'संपर्क विकल्प देखें' : 'View contact options', 'button button-white-outline')}</div></div><div class="contact-side"><span class="contact-side-icon">${icon('phone')}</span><h3>${language === 'hi' ? 'संपर्क विवरण तैयार किए जा रहे हैं' : 'Official contact details are being prepared'}</h3><p>${language === 'hi' ? 'हमने अपुष्ट फोन या WhatsApp नंबर प्रकाशित नहीं किए हैं।' : 'We have not published an unverified phone number or WhatsApp link.'}</p><a href="/grievance">${language === 'hi' ? 'शिकायत और आपातकालीन जानकारी' : 'Complaints & emergency guidance'} <span>→</span></a></div></div></section>`;
}

function healthPage(kind) {
  const copy = healthText[language];
  const isMedicine = kind === 'medicine';
  const title = isMedicine ? copy.medicineTitle : copy.doctorTitle;
  const intro = isMedicine ? copy.medicineIntro : copy.doctorIntro;
  const textField = (id, name, label, attrs = '') => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${name}" ${attrs}></div>`;
  const selectField = (id, name, label, options, attrs = '') => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${name}" ${attrs}>${options.map(([value, optionLabel]) => `<option value="${value}">${optionLabel}</option>`).join('')}</select></div>`;
  const fieldGrid = (left, right) => `<div class="field-grid">${left}${right}</div>`;
  let form;
  if (isMedicine) {
    form = `<form id="medicine-request-form" class="form-shell">
      <h2>${copy.medicineRequest}</h2>
      <div class="form-note">${esc(copy.noUpload)}</div>
      ${textField('medicine-patient', 'patientName', copy.patientName, 'autocomplete="name" required maxlength="120"')}
      ${fieldGrid(textField('medicine-phone', 'phone', copy.phone, 'type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number"'), textField('medicine-email', 'email', copy.email, 'type="email" autocomplete="email" maxlength="254"'))}
      ${fieldGrid(textField('medicine-doctor', 'doctorName', copy.doctorName, 'maxlength="120"'), textField('medicine-hospital', 'hospital', copy.hospital, 'maxlength="140"'))}
      ${fieldGrid(textField('medicine-name', 'medicineName', copy.medicineName, 'maxlength="140"'), textField('medicine-quantity', 'quantity', copy.quantity, 'maxlength="80"'))}
      ${fieldGrid(textField('medicine-address', 'address', copy.address, 'autocomplete="street-address" required maxlength="300"'), textField('medicine-locality', 'locality', copy.locality, 'autocomplete="address-level3" required maxlength="120"'))}
      ${textField('medicine-instructions', 'deliveryInstructions', copy.deliveryInstructions, 'maxlength="240"')}
      ${fieldGrid(textField('medicine-date', 'requestedDate', copy.requestedDate, 'type="date"'), selectField('medicine-window', 'deliveryWindow', copy.deliveryWindow, [['Flexible', copy.flexible], ['Morning', copy.morning], ['Afternoon', copy.afternoon], ['Evening', copy.evening]], 'required'))}
      ${fieldGrid(selectField('medicine-type', 'requestType', copy.requestType, [['first', copy.firstOrder], ['refill', copy.refill]], 'required'), selectField('medicine-followup', 'followUpOptIn', copy.followUp, [['no', copy.no], ['yes', copy.yes]], 'required'))}
      ${textField('medicine-followup-date', 'followUpDate', copy.followUpDate, 'type="date"')}
      <label class="consent-row"><input type="checkbox" name="verificationAcknowledgement" value="yes" required><span>${esc(copy.verified)}</span></label>
      <label class="consent-row"><input type="checkbox" name="consent" value="yes" required><span>${esc(copy.medicineConsent)}</span></label>
      <button class="button button-primary" type="submit">${copy.submitMedicine}</button>
      <div class="form-feedback" role="status" aria-live="polite"></div>
    </form>`;
  } else {
    form = `<form id="care-coordination-form" class="form-shell">
      <h2>${copy.patientDetails}</h2>
      ${textField('coord-patient', 'patientName', copy.patientName, 'autocomplete="name" required maxlength="120"')}
      ${fieldGrid(textField('coord-age', 'age', copy.age, 'type="number" min="0" max="120" step="1"'), textField('coord-dob', 'dateOfBirth', copy.dob, 'type="date"'))}
      <p class="small-print">${language === 'hi' ? 'उम्र या जन्म तिथि में से एक दें।' : 'Provide either age or date of birth.'}</p>
      ${textField('coord-caregiver', 'caregiverName', copy.caregiverName, 'autocomplete="name" required maxlength="120"')}
      ${fieldGrid(textField('coord-phone', 'phone', copy.phone, 'type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number"'), textField('coord-email', 'email', copy.email, 'type="email" autocomplete="email" maxlength="254"'))}
      ${textField('coord-address', 'address', copy.address, 'autocomplete="street-address" required maxlength="300"')}
      ${textField('coord-locality', 'locality', copy.locality, 'autocomplete="address-level3" required maxlength="120"')}
      <h2>${copy.doctorDetails}</h2>
      ${selectField('coord-doctor-preference', 'doctorPreference', copy.doctorPreference, [['none', copy.noDoctor], ['preferred', copy.preferDoctor], ['help', copy.findDoctor]], 'required')}
      ${textField('coord-doctor', 'doctorName', copy.doctorName, 'maxlength="120"')}
      ${fieldGrid(textField('coord-specialty', 'specialty', copy.specialty, 'maxlength="100"'), textField('coord-hospital', 'hospital', copy.hospital, 'maxlength="140"'))}
      ${textField('coord-hospital-address', 'hospitalAddress', copy.hospitalAddress, 'maxlength="240"')}
      ${fieldGrid(textField('coord-last-date', 'lastConsultationDate', copy.lastVisit, 'type="date"'), textField('coord-next-date', 'nextAppointmentDate', copy.nextVisit, 'type="date"'))}
      ${fieldGrid(selectField('coord-accompaniment', 'accompaniment', copy.accompaniment, [['no', copy.no], ['yes', copy.yes]], 'required'), selectField('coord-medicine', 'medicineAssistance', copy.medicineHelp, [['no', copy.no], ['yes', copy.yes]], 'required'))}
      ${fieldGrid(selectField('coord-contact', 'contactMethod', copy.contactMethod, [['phone', copy.phoneContact], ['email', copy.emailContact]], 'required'), selectField('coord-followup', 'followUpOptIn', copy.followUp, [['no', copy.no], ['yes', copy.yes]], 'required'))}
      ${textField('coord-followup-date', 'followUpDate', copy.followUpDate, 'type="date"')}
      <div class="form-note">${esc(copy.consentNote)}</div>
      <label class="consent-row"><input type="checkbox" name="consent" value="yes" required><span>${esc(copy.consent)}</span></label>
      <button class="button button-primary" type="submit">${copy.submitCoordination}</button>
      <div class="form-feedback" role="status" aria-live="polite"></div>
    </form>`;
  }
  const requestPath = isMedicine ? '/medicine-delivery' : '/doctor-hospital-assistance';
  const noticeText = isMedicine ? copy.medicineNotice : copy.doctorNotice;
  const how = isMedicine ? `<section class="section section-soft"><div class="container">${sectionHeading(copy.how, language === 'hi' ? 'सुरक्षित दवा समन्वय के चरण' : 'A cautious prescription-to-delivery journey')}<div class="steps">${copy.steps.map(([step, description], index) => `<article class="step-card"><span class="step-number">${String(index + 1).padStart(2, '0')}</span><h3>${esc(step)}</h3><p>${esc(description)}</p></article>`).join('')}</div><p class="small-print">${esc(copy.noAuto)}</p></div></section>` : '';
  const view = `${pageHero(language === 'hi' ? 'देखभाल समन्वय' : 'Care coordination', title, intro, requestPath)}<section class="section"><div class="container"><div class="scope-note health-notice">${icon('shield')}<span>${esc(noticeText)}</span></div><div class="page-form-grid"><div class="article-body"><h2>${esc(title)}</h2><p>${esc(intro)}</p><p>${esc(copy.pending)}</p>${isMedicine ? `<div class="form-note">${esc(copy.noUpload)}</div>` : ''}</div>${form}</div></div></section>${how}`;
  shell(view, title, intro);
}

function careForm() {
  const choices = (name, values, type = 'radio') => `<div class="option-grid">${values.map(([v, key]) => `<div class="option-card"><input id="${name}-${v}" type="${type}" name="${name}" value="${v}" ${type === 'radio' && v === values[0][0] ? 'required' : ''}><label for="${name}-${v}">${t(key)}</label></div>`).join('')}</div>`;
  return `<form id="care-form" class="form-shell" novalidate><div class="progress-header"><span>${t('form.step')} <span data-step-number>1</span> ${t('form.of')} 6</span><span data-step-label>${t('form.step1')}</span></div><div class="progress-track" role="progressbar" aria-label="Care request progress" aria-valuemin="1" aria-valuemax="6" aria-valuenow="1"><div class="progress-bar"></div></div>
    <div class="honeypot" aria-hidden="true"><label for="care-website">Leave blank</label><input id="care-website" name="website" tabindex="-1" autocomplete="off"></div>
    <fieldset class="form-step form-fieldset" data-form-step="1"><legend>${t('form.step1')}</legend><span class="field-label">Select one</span>${choices('careFor', [['self', 'form.myself'], ['parent', 'form.parent'], ['grandparent', 'form.grandparent'], ['other', 'form.other']])}</fieldset>
    <fieldset class="form-step form-fieldset" data-form-step="2" hidden><legend>${t('form.step2')}</legend><span class="field-label">Select all that apply</span>${choices('support', [['companionship', 'form.companion'], ['daily-living', 'form.daily'], ['scheduled-caregiver', 'form.scheduled'], ['appointment-coordination', 'form.appointment'], ['mobility', 'form.mobility'], ['nursing-enquiry', 'form.nursing'], ['other', 'form.otherSupport']], 'checkbox')}</fieldset>
    <fieldset class="form-step form-fieldset" data-form-step="3" hidden><legend>${t('form.step3')}</legend><div class="field"><label for="care-area">${t('form.area')}</label><input id="care-area" name="locality" autocomplete="address-level3" required maxlength="120" placeholder="e.g. Lanka, Sigra"></div><div class="field-grid"><div class="field"><label for="care-date">${t('form.date')}</label><input id="care-date" name="preferredDate" type="date" required></div><div class="field"><label for="care-time">${t('form.time')}</label><select id="care-time" name="preferredTime" required><option value="">Choose a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Flexible</option></select></div></div><div class="field"><label for="care-frequency">${t('form.frequency')}</label><select id="care-frequency" name="frequency" required><option value="">Choose one</option><option value="once">${t('form.once')}</option><option value="recurring">${t('form.recurring')}</option></select></div></fieldset>
    <fieldset class="form-step form-fieldset" data-form-step="4" hidden><legend>${t('form.step4')}</legend><div class="field"><label for="care-name">${t('form.name')}</label><input id="care-name" name="fullName" autocomplete="name" required maxlength="120"></div><div class="field"><label for="care-phone">${t('form.phone')}</label><input id="care-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number" aria-describedby="care-phone-note"><small id="care-phone-note">India: +91</small></div><div class="field"><label for="care-relationship">${t('form.relationship')}</label><input id="care-relationship" name="relationship" required maxlength="80"></div><div class="field-grid"><div class="field"><label for="care-language">${t('form.language')}</label><select id="care-language" name="preferredLanguage" required><option value="English">English</option><option value="Hindi">हिन्दी</option></select></div><div class="field"><label for="care-email">${t('form.email')}</label><input id="care-email" name="email" type="email" autocomplete="email" maxlength="254"></div></div><div class="field"><label for="care-message">${t('form.message')}</label><textarea id="care-message" name="message" maxlength="1000"></textarea></div></fieldset>
    <fieldset class="form-step form-fieldset" data-form-step="5" hidden><legend>${t('form.step5')}</legend><p class="form-note">${t('form.privacy')}</p><label class="consent-row"><input name="contactConsent" type="checkbox" value="yes" required><span>${t('form.consent')} <a href="/privacy"><u>Privacy notice</u></a>.</span></label><label class="consent-row"><input name="updatesConsent" type="checkbox" value="yes"><span>${t('form.updates')}</span></label></fieldset>
    <fieldset class="form-step form-fieldset" data-form-step="6" hidden><legend>${language === 'hi' ? 'अनुरोध की समीक्षा करें' : 'Review your request'}</legend><p class="form-note">${language === 'hi' ? 'भेजने से पहले जानकारी जाँचें। यह अनुरोध सेवा की पुष्टि नहीं है।' : 'Check these details before sending. Submitting is an enquiry, not a confirmed service.'}</p><dl class="care-review" data-care-review></dl></fieldset>
    <div class="form-actions"><button class="button button-secondary" type="button" data-form-back hidden>← ${t('form.back')}</button><button class="button button-primary" type="button" data-form-next>${t('form.next')} →</button><button class="button button-primary" type="submit" data-form-submit hidden>${t('form.submit')} <span aria-hidden="true">↗</span></button></div><div class="form-feedback" role="status" aria-live="polite"></div></form>`;
}

function partnerForm() {
  return `<form id="partner-form" class="form-shell"><h2 style="margin:0 0 19px;font-family:var(--serif);font-size:26px;font-weight:500">${t('partner.formTitle')}</h2><div class="honeypot" aria-hidden="true"><label for="partner-website">Leave blank</label><input id="partner-website" name="website" tabindex="-1" autocomplete="off"></div><div class="field"><label for="partner-name">${t('partner.name')}</label><input id="partner-name" name="fullName" autocomplete="name" required maxlength="140"></div><div class="field-grid"><div class="field"><label for="partner-phone">${t('form.phone')}</label><input id="partner-phone" name="phone" type="tel" inputmode="numeric" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number"></div><div class="field"><label for="partner-email">${t('form.email')}</label><input id="partner-email" name="email" type="email" maxlength="254"></div></div><div class="field"><label for="partner-category">${t('partner.category')}</label><select id="partner-category" name="category" required><option value="">Choose a category</option><option value="caregiver">Caregiver</option><option value="agency">Care agency</option><option value="nurse">Nurse / allied health professional</option><option value="physiotherapist">Physiotherapist</option><option value="other">Other service provider</option></select></div><div class="field"><label for="partner-experience">${t('partner.experience')}</label><textarea id="partner-experience" name="experience" maxlength="600" required></textarea></div><div class="field"><label for="partner-areas">${t('partner.areas')}</label><input id="partner-areas" name="areas" required maxlength="160"></div><div class="field"><label for="partner-availability">${t('partner.availability')}</label><input id="partner-availability" name="availability" maxlength="160" placeholder="e.g. weekdays, morning"></div><div class="field"><label for="partner-qualification">${t('partner.qualification')}</label><textarea id="partner-qualification" name="qualifications" maxlength="500"></textarea></div><p class="form-note">${t('partner.noDocs')}</p><label class="consent-row"><input name="contactConsent" type="checkbox" value="yes" required><span>${t('partner.consent')}</span></label><button class="button button-primary" type="submit">${t('partner.submit')} <span aria-hidden="true">↗</span></button><div class="form-feedback" role="status" aria-live="polite"></div></form>`;
}

function shell(view, title, description) {
  document.title = `${title} | SEHASETU Healthcare`;
  document.querySelector('meta[name="description"]').content = description;
  const canonical = document.querySelector('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }));
  canonical.href = `${location.origin}${routePath()}`;
  main.innerHTML = `${view}${footer()}`;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-t]').forEach((el) => { el.innerHTML = t(el.dataset.t); });
  document.querySelectorAll('.main-nav a').forEach((el) => el.toggleAttribute('aria-current', el.getAttribute('href') === routePath()));
}

function home() {
  shell(homePage(), `Elderly care coordination in Varanasi`, t('page.home'));
}

function servicesPage() {
  const cards = serviceData.map((service, i) => serviceCard(service, i)).join('');
  const newCards = `<article class="service-card"><span class="service-icon">${icon('calendar')}</span><h3>Doctor &amp; hospital assistance</h3><p>Request appointment coordination and practical accompaniment, subject to availability.</p><a class="service-link" href="/doctor-hospital-assistance">Explore assistance <span aria-hidden="true">→</span></a></article><article class="service-card"><span class="service-icon">${icon('plus')}</span><h3>Medicine request assistance</h3><p>Prescription-based coordination is pending authorized pharmacy and secure document setup.</p><a class="service-link" href="/medicine-delivery">Learn about medicine requests <span aria-hidden="true">→</span></a></article>`;
  const view = `${pageHero('Services', 'Care options, explained with care.', 'Explore coordination and support options for older adults and families in Varanasi. A service is confirmed only after availability, provider, written scope, price, and terms are accepted.', '/services')}<section class="section"><div class="container"><div class="service-grid">${cards}${newCards}</div><div class="scope-note">${icon('shield')}<span>${t('services.scope')}</span></div></div></section><section class="section section-soft"><div class="container">${sectionHeading('Service boundaries', 'A clear understanding comes first.', 'Each enquiry is reviewed against the available service scope before we explore an option. Professional and clinical tasks are not assigned to non-clinical caregivers.')}<div class="service-detail-grid"><article class="detail-box"><h3>Non-clinical support</h3><p>Companionship and agreed everyday assistance may be available from a suitable caregiver. Availability, tasks, schedule, and terms require confirmation.</p></article><article class="detail-box"><h3>Qualified professional care</h3><p>Nursing and allied health requests are handled only as enquiries to appropriately qualified and eligible providers. There is no guaranteed appointment or clinical service.</p></article></div></div></section>`;
  shell(view, 'Elderly care and caregiver coordination services in Varanasi', t('page.services'));
}

function serviceDetail(slug) {
  const data = serviceData.find((item) => item.slug === slug);
  if (!data) return notFound();
  const displayTitle = data.displayTitle || (data.title === 'elderly' ? 'Elderly companionship and home support' : data.title === 'daily' ? 'Non-clinical daily-living support' : data.title === 'caregiver' ? 'Caregiver coordination' : data.title === 'family' ? 'Family care updates' : data.title === 'hospital' ? 'Hospital visit and appointment coordination' : data.title === 'respite' ? 'Planned respite support' : 'Qualified nursing and allied care enquiries');
  const accent = data.accent || (data.title === 'nursing' ? 'purple' : 'teal');
  const steps = [['01', 'Share the request', 'Tell us the locality, preferred timing, and support you are exploring.'], ['02', 'Review the scope', 'We clarify what is included and what requires a qualified professional.'], ['03', 'Check options and quote', 'Provider eligibility, availability, schedule, and an itemised written quote are reviewed.'], ['04', 'Approve before confirmation', 'Nothing proceeds until you accept the provider, written scope, fees, and terms.']];
  const view = `${pageHero(data.category, esc(displayTitle), esc(data.audience), `/services/${slug}`, accent)}<section class="section"><div class="container page-layout"><article class="article-body"><h2>What this service may include</h2><p>${esc(data.includes)} Every request and provider is subject to availability, suitability, appropriate verification, and written confirmation.</p><h2>Who may find this useful</h2><p>${esc(data.audience)} Families may also make an enquiry on behalf of a relative, with their involvement and permission.</p><h2>What this service does not include</h2><p>${esc(data.excludes)} SEHASETU does not offer diagnosis, prescribing, treatment decisions, emergency medical response, or clinical procedures through an unqualified person.</p><h2>How an enquiry moves forward</h2><div class="service-timeline">${steps.map(([number, title, body]) => `<div><span>${number}</span><p><strong>${title}</strong><br>${body}</p></div>`).join('')}</div><h2>Eligibility and service area</h2><p>Our initial focus is Varanasi, Uttar Pradesh. A specific locality, provider, time, and service can only be confirmed once checked. Clinical and allied health work requires an appropriately qualified and eligible provider. No partner or timeslot is represented as confirmed here.</p><h2>Pricing and quote process</h2><p>Cost depends on the agreed service, duration, frequency, locality, provider charges, additional services, applicable taxes, and any coordination fee. Request a written quote showing relevant charges and terms. Nothing is booked until you accept it.</p><h2>Frequently asked questions</h2><div class="faq-list"><details><summary>Is this service available in my neighbourhood?</summary><p>Share your Varanasi locality through the care enquiry form. Availability must be checked and cannot be assumed.</p></details><details><summary>How much does it cost?</summary><p>Request an itemised written quote before confirming. No prices are published until actual provider and coordination rates are approved.</p></details><details><summary>How do I book?</summary><p>Send an enquiry to start a conversation. An enquiry is not a confirmed placement or booking; the written scope, schedule, price, and terms must be accepted first.</p></details></div></article><aside class="page-aside"><h2>Start an enquiry</h2><p>Tell us what support you are looking for. We will check the scope and availability.</p>${link('/request-care', 'Request care ↗')}<ul class="info-list"><li>Service area: Varanasi, subject to confirmation</li><li>Service category: ${esc(data.category)}</li><li>Pricing: written quote before confirmation</li></ul></aside></div></section>`;
  shell(view, displayTitle, `${displayTitle} and home care coordination in Varanasi. Explore scope, eligibility, availability, and request a written quote.`);
}

function processPage() {
  const names = ['one', 'two', 'three', 'four', 'five'];
  const view = `${pageHero('How it works', 'A considered process, from first enquiry to agreed follow-up.', 'Your family can understand each step, ask questions, and decide whether to proceed. A request is never treated as a booking.', '/how-it-works')}<section class="section"><div class="container"><div class="steps">${names.map((n, i) => `<article class="step-card"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><h3>${t(`step.${n}.title`)}</h3><p>${t(`step.${n}.body`)}</p></article>`).join('')}</div><p class="small-print">${t('how.important')}</p><div class="scope-note">${icon('shield')}<span>Providers are responsible for the professional services they deliver. The availability, eligibility, and suitability of each service must be assessed before the family accepts an arrangement.</span></div></div></section>`;
  shell(view, 'How care coordination works', t('page.how'));
}

function aboutPage() {
  const view = `${pageHero('About SEHASETU', t('about.title'), t('about.body'), '/about')}<section class="section"><div class="container page-layout"><article class="article-body"><h2>Our mission</h2><p>Make it easier for families to find, coordinate, and manage appropriate support for older adults through a dependable point of contact.</p><h2>Our approach</h2><p>We listen to families, help clarify what is needed, explore service options that may be available, and help coordinate agreed communication and practical arrangements. Families receive a written scope, schedule, price, and applicable terms to review before making a decision.</p><h2>Respect and transparency</h2><p>We believe a person’s dignity, preferences, privacy, and involvement belong at the centre of their care. Scope and costs should be understandable before an arrangement is confirmed.</p><h2>Starting in Varanasi</h2><p>Varanasi, Uttar Pradesh is our initial service focus. Coverage in a particular locality and a particular service depend on availability and must be checked.</p><h2>Coordination is not clinical care</h2><p>SEHASETU coordinates enquiries and agreed communication. Independent providers are responsible for their own professional services. Clinical work requires an appropriately qualified and eligible professional. We are not an emergency response service.</p></article><aside class="page-aside"><h2>Our service principles</h2><ul class="info-list"><li>Dignity and individual choice</li><li>Clear, written service scope</li><li>Transparent quotes before confirmation</li><li>Consent-based family communication</li><li>A considered Varanasi focus</li></ul>${link('/request-care', 'Talk to our team ↗')}</aside></div></section>`;
  shell(view, 'About SEHASETU Healthcare', t('page.about'));
}

function familiesPage() {
  const view = `${pageHero('For families', 'Care coordination that keeps your family in the conversation.', 'If you live across the city or across the country, understanding options and arranging family communication can be a useful first step.', '/for-families')}<section class="section"><div class="container page-layout"><article class="article-body"><h2>Start with what matters to your family</h2><p>Consider what your loved one wants help with, what they would like to continue doing independently, their preferred schedule, and who they want involved in decisions.</p><h2>Make the arrangement easy to understand</h2><p>Before you confirm, ask for the provider, scope, schedule, price, cancellation terms, payment milestones, and contact process in writing. Ask questions until each detail is clear.</p><h2>Stay connected with consent</h2><p>Choose the authorised contacts for updates together with the person receiving care. Share only the personal details needed for the arrangement.</p><h2>When care requires a professional</h2><p>A caregiver and a nurse have different roles. Ask a qualified healthcare professional about clinical needs. Professional services require appropriately qualified and eligible providers and confirmation.</p></article><aside class="page-aside"><h2>Looking for support?</h2><p>Start with a brief enquiry. It is not a booking or a medical consultation.</p>${link('/request-care', 'Request care ↗')}${link('/resources', 'Browse family guides', 'button button-secondary')}</aside></div></section>`;
  shell(view, 'Support for families arranging elderly care', t('page.families'));
}

function partnersPage() {
  const view = `${pageHero('For care partners', 'Grow with SEHASETU. Help families find the right support.', t('partner.body'), '/for-partners')}<section class="section"><div class="container page-layout"><article class="article-body"><h2>Who may enquire</h2><p>Caregiver agencies, individual caregivers, appropriately qualified nurses, physiotherapists, allied health professionals, and relevant local service providers may introduce their services.</p><h2>What a review may involve</h2><ul><li>Identity and relevant experience</li><li>Appropriate qualifications or registrations for the proposed service</li><li>References and applicable checks</li><li>Service area and current availability</li><li>A written service scope and partner terms</li></ul><h2>Our shared expectations</h2><p>Partners are expected to respect each person’s dignity, privacy, and choices; work only within their qualification and agreed scope; report attendance and relevant changes; and promptly raise complaints, safeguarding concerns, or incidents through a defined process.</p><h2>Application and approval</h2><p>An application is an enquiry only. The statuses “Application Received”, “Documents Pending”, “Under Review”, “Approved”, or “Not Approved” should be displayed only after they are updated by the configured operating system. No partner status is implied here. Never email identity documents, medical records, or sensitive qualifications through an unconfigured form.</p></article><aside class="page-aside"><h2>Interested in partnering?</h2><p>Introduce your organisation, service area, experience, and relevant qualifications.</p>${link('/partner-application', 'Apply to become a partner ↗')}</aside></div></section>`;
  shell(view, 'Become a care partner in Varanasi', t('page.partners'));
}

function requestPage() {
  const view = `${pageHero('Request care', 'Tell us a little about the support you are looking for.', 'This enquiry helps us understand your request. It does not make a booking, confirm a provider, or replace professional medical advice.', '/request-care')}<section class="section"><div class="container page-form-grid"><div class="page-form-intro"><span class="eyebrow">A first step, not a commitment</span><h2 style="margin:0 0 13px;font-family:var(--serif);font-size:33px;font-weight:500;line-height:1.2">A few details help us understand what to explore.</h2><p>Your contact information is requested only to respond to your care enquiry. Do not include medical records or sensitive clinical details.</p><div class="scope-note">${icon('shield')}<span>Submitting this form is not a confirmed care arrangement. Written scope, availability, price, and terms are agreed before any service is booked.</span></div><p style="margin-top:19px"><a href="/privacy" class="button-text">Read our privacy notice →</a></p></div>${careForm()}</div></section>`;
  shell(view, 'Request elderly care in Varanasi', 'Enquire about elderly care, caregiver services, and home care coordination in Varanasi. Requests are not bookings until confirmed.');
  setWizard(wizardStep);
  const dateField = document.querySelector('#care-date');
  if (dateField) dateField.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function partnerApplicationPage() {
  const view = `${pageHero('Partner enquiry', 'Introduce your care service or organisation.', 'Share your relevant experience, service area, and any applicable professional qualifications. An application starts a review; it does not mean a partner is approved.', '/partner-application')}<section class="section"><div class="container page-form-grid"><div class="page-form-intro"><span class="eyebrow">Care partner application</span><h2 style="margin:0 0 13px;font-family:var(--serif);font-size:33px;font-weight:500;line-height:1.2">Professional boundaries, dignity, and clear communication matter.</h2><p>We may review identity, qualifications, references, availability, and written partner terms before services are introduced. Secure document collection is not configured.</p><div class="scope-note">${icon('shield')}<span>Please do not send identity documents or sensitive files until a private, approved document channel is available.</span></div></div>${partnerForm()}</div></section>`;
  shell(view, 'Care partner application', 'Introduce your caregiver, agency, nursing, or allied health services for consideration in Varanasi. Applications do not mean approval.');
}

function resourcesPage() {
  const categories = ['all', ...new Set(articles.map(article => article.category))];
  const filters = categories.map(cat => `<button class="filter-pill" type="button" data-filter="${esc(cat)}" aria-pressed="${cat === resourceCategory}">${cat === 'all' ? 'All topics' : esc(cat)}</button>`).join('');
  const view = `${pageHero('Care resources', 'Good questions can make the next step clearer.', 'Original, practical guidance for families exploring elderly care and coordinating home support. Our guides support planning and do not replace advice from a qualified healthcare professional.', '/resources')}<section class="section"><div class="container"><div class="resource-toolbar"><label class="search-control">${icon('search')}<input id="resource-search" type="search" placeholder="${t('resource.search')}" value="${esc(resourceQuery)}" autocomplete="off"></label><div class="filter-buttons" aria-label="Filter articles by topic">${filters}</div></div><div class="resource-grid" id="resource-results">${articles.map(articleCard).join('')}<p class="empty-state" hidden>${t('resource.nothing')}</p></div></div></section>`;
  shell(view, 'Elderly care guides and family resources', 'Explore original, practical guides to choosing an elderly caregiver, preparing for a care visit, and coordinating family support.');
  filterResources();
}

function articlePage(slug) {
  const article = articles.find(item => item.slug === slug);
  if (!article) return notFound();
  const related = articles.filter(item => item.category === article.category && item.slug !== slug).slice(0, 3);
  const view = `${pageHero(esc(article.category), esc(article.title), esc(article.excerpt), `/resources/${slug}`)}<section class="section"><div class="container page-layout"><article class="article-body">${article.body}<p class="small-print">This guide provides general planning information. For medical or clinical concerns, speak directly with an appropriately qualified healthcare professional.</p><h2>Related reading</h2><div class="resource-grid">${related.length ? related.map(articleCard).join('') : articles.filter(a => a.slug !== slug).slice(0, 2).map(articleCard).join('')}</div></article><aside class="page-aside"><h2>Looking for support?</h2><p>Describe your family’s care enquiry and preferred area.</p>${link('/request-care', 'Request care ↗')}${link('/resources', 'All resources', 'button button-secondary')}</aside></div></section>`;
  shell(view, article.title, article.excerpt);
}

function faqPage() {
  const view = `${pageHero('Frequently asked questions', 'A clearer view of what to expect.', 'These answers describe a developing coordination service. Availability and partner arrangements must be confirmed for each request.', '/faqs')}<section class="section"><div class="container"><div class="faq-list">${faqItems.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>`;
  shell(view, 'Frequently asked questions about elderly care in Varanasi', 'Find answers about caregiver coordination, costs, availability, service boundaries, privacy, and care requests.');
}

function contactPage() {
  const view = `${pageHero('Contact us', 'Let’s start with a conversation.', 'We are preparing a Varanasi-focused care coordination service. Official contact details have not yet been provided.', '/contact')}<section class="section"><div class="container page-layout"><article class="article-body"><h2>Request care online</h2><p>When online submissions are configured, the care request form will securely send your enquiry and show a confirmation only when it has been received.</p>${link('/request-care', 'Open the care request form ↗')}<h2>General enquiries</h2><p>Official phone, email, WhatsApp, office address, and social links are not available yet. We have not published placeholder contact details as if they were real.</p><h2>Emergency care</h2><p>SEHASETU is not an emergency response service. In an emergency, contact your local emergency services or a qualified medical professional.</p></article><aside class="page-aside"><h2>Service area</h2><p>Varanasi, Uttar Pradesh, India. Availability in a particular area is subject to confirmation.</p>${link('/services', 'Explore services ↗')}</aside></div></section>`;
  shell(view, 'Contact SEHASETU Healthcare', t('page.contact'));
}

const legalPages = {
  '/privacy': ['Privacy notice', 'Information on this page is a launch draft. Review it against the actual data flows, retention practices, security controls, and applicable legal requirements before collecting real information.', [['Information an enquiry may include', 'A care request may include your name, phone number, email (optional), locality, preferred schedule, relationship, and request details. A partner enquiry may include business contact information, experience, availability, and qualifications. Do not submit medical records or sensitive clinical details.'], ['Why information is requested', 'The intended purpose is to assess and respond to the particular enquiry. Updates require separate optional consent. Do not submit another person’s personal details without appropriate permission.'], ['Online service status', 'Personal data will not be accepted or stored online until the server is configured with an administrator password and encryption key. An unavailable service response means the request has not been received or saved.'], ['Access, storage, and retention', 'When enabled, enquiry details are encrypted before storage and are accessible only through an authenticated staff dashboard. Configure a responsible organisation, authorised staff, retention periods, secure backups, and deletion process before going live.'], ['Sharing and independent providers', 'Information should be shared with a prospective provider only when necessary to assess the requested service and with appropriate notice and consent. Do not use the enquiry data for unrelated marketing.'], ['Contact and your choices', 'An official privacy contact and a process for access, correction, or deletion requests must be supplied before launch. This draft is not a claim of legal compliance.']]],
  '/terms': ['Terms and conditions', 'This document is a launch draft and needs review against actual services, provider arrangements, and applicable legal requirements before use.', [['Enquiries are not bookings', 'Submitting an enquiry does not confirm a service, provider, schedule, price, or outcome. An arrangement is confirmed only after the provider, written scope, schedule, price, and applicable terms are accepted.'], ['Coordination and professional responsibility', 'SEHASETU coordinates enquiries and agreed communication. Independent providers remain responsible for their professional services. Clinical services require a suitably qualified and eligible provider.'], ['Availability and service area', 'The initial focus is Varanasi. A requested location, service, and time must be checked; coverage and availability are not guaranteed.'], ['Quotes and payment', 'Request a written quote before confirming. It should separate provider charges, coordination fees, additional agreed charges, applicable taxes, cancellation terms, and payment milestones. Payment collection is not configured.'], ['Emergency and clinical concerns', 'SEHASETU is not an emergency medical service and does not provide diagnosis, prescriptions, or treatment decisions. Contact an appropriately qualified professional for clinical concerns or emergency services in an emergency.'], ['Before launch', 'Actual legal entity information, approved operating procedures, partner contracts, grievance contacts, privacy language, and applicable law must be reviewed and supplied.']]],
  '/cancellation': ['Cancellation and refund policy', 'A draft for review. Actual provider terms, fee schedules, refund methods, and applicable legal requirements have not been supplied.', [['Before confirmation', 'An enquiry does not create a booking or payment obligation. Review the written quote, provider charges, any coordination fee, schedule, and cancellation terms before accepting.'], ['After confirmation', 'The actual written booking terms should specify notice periods, cancellation charges, provider and coordination fee treatment, refunds, rescheduling, and payment milestones. Those terms are not available yet, so no refund or cancellation promise is made here.'], ['Changing a booking', 'Contact the official coordination channel shown in your written confirmation. No official contact channel has been configured on this website.'], ['No payment collection', 'This website does not currently collect payments. Never enter payment card, banking, or UPI credentials into a care enquiry form.']]],
  '/grievance': ['Complaints and grievance process', 'This process is a draft; publish an accountable contact and operating response timelines before accepting care bookings.', [['Raise a concern', 'Use the official complaint contact supplied with the written care arrangement. No official grievance phone number, email, or office address has been provided yet.'], ['Provide relevant detail', 'Share the booking reference and a clear description of the issue through the approved private channel. Do not submit medical records in this website form.'], ['Safety or safeguarding concern', 'Contact appropriate local emergency or safeguarding services when there is an immediate risk. SEHASETU is not an emergency response service.'], ['Independent investigation', 'An operational team needs to record, restrict access to, investigate, and follow up complaints and incidents under an approved policy. This website does not yet provide an operational incident-reporting channel.']]],
};

function legalPage(path) {
  const [title, summary, sections] = legalPages[path];
  const displayedSections = path === '/privacy' ? [...sections, ['Doctor, hospital, and medicine-assistance requests', 'These forms may include patient age or date of birth, contact and address details, doctor and hospital preferences, appointment dates, accompaniment or medicine-assistance preferences, medicine names and quantities if known, delivery instructions, consent, and a requested follow-up date. These details are collected only to coordinate the submitted request and are encrypted at rest when server intake is configured. Do not submit diagnoses, symptoms, prescription images, or medical records; private document upload, pharmacy sharing, and deletion workflows are not connected. A request is visible only in the current administrator dashboard. A retention period, role-based staff access, and a verified access/correction/deletion contact must be established before real patient information is collected.']] : sections;
  const view = `${pageHero('Information', title, summary, path)}<section class="section"><div class="container page-layout"><article class="article-body">${displayedSections.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}</article><aside class="page-aside"><h2>Contact details</h2><p>Official phone, email, and address have not been configured.</p><p>Review this draft with appropriate professional counsel and align it to actual operations before accepting real requests.</p></aside></div></section>`;
  shell(view, title, summary);
}

function adminPage() {
  const view = `${pageHero('Staff portal', 'Staff administration', 'Restricted access to submitted care and partner enquiries. Administrator credentials and encryption keys must be configured on the server.', '/admin')}<section class="section"><div class="container admin-shell"><div id="admin-login"></div><div id="admin-results" hidden></div></div></section>`;
  shell(view, 'Staff administration', 'Restricted staff access to care enquiries and partner applications.');
  loadAdmin();
}

function notFound() {
  shell(`<section class="not-found"><span class="eyebrow">Not found</span><h1>This page isn’t here.</h1><p>The link may have changed. Return to our homepage to explore care coordination and family support.</p>${link('/', 'Back to home ↗')}</section>`, 'Page not found', 'Return to SEHASETU Healthcare to explore family care coordination in Varanasi.');
}

function render() {
  const segments = pathSegments();
  const route = routePath();
  document.body.classList.remove('menu-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('.menu-toggle').setAttribute('aria-label', 'Open menu');
  if (route === '/') home();
  else if (route === '/services') servicesPage();
  else if (route === '/doctor-hospital-assistance') healthPage('coordination');
  else if (route === '/medicine-delivery') healthPage('medicine');
  else if (segments[0] === 'services' && segments[1]) serviceDetail(segments[1]);
  else if (route === '/how-it-works') processPage();
  else if (route === '/about') aboutPage();
  else if (route === '/for-families') familiesPage();
  else if (route === '/for-partners') partnersPage();
  else if (route === '/request-care') requestPage();
  else if (route === '/partner-application') partnerApplicationPage();
  else if (route === '/resources') resourcesPage();
  else if (segments[0] === 'resources' && segments[1]) articlePage(segments[1]);
  else if (route === '/faqs') faqPage();
  else if (route === '/contact') contactPage();
  else if (route === '/admin') adminPage();
  else if (legalPages[route]) legalPage(route);
  else notFound();
  const languageButton = document.querySelector('.language-toggle');
  languageButton.setAttribute('aria-pressed', String(language === 'hi'));
  languageButton.innerHTML = language === 'hi' ? '<strong>हि</strong><span class="language-divider">/</span><span>EN</span>' : '<span>हि</span><span class="language-divider">/</span><strong>EN</strong>';
  document.querySelector('.language-toggle').setAttribute('aria-label', language === 'hi' ? 'Switch to English' : 'हिन्दी में देखें');
  document.querySelectorAll('.main-nav a').forEach(el => el.toggleAttribute('aria-current', el.getAttribute('href') === route || (route.startsWith('/services/') && el.getAttribute('href') === '/services')));
}

function setWizard(step) {
  wizardStep = Math.max(1, Math.min(6, step));
  document.querySelectorAll('[data-form-step]').forEach(el => { el.hidden = Number(el.dataset.formStep) !== wizardStep; });
  const bar = document.querySelector('.progress-bar');
  const track = document.querySelector('.progress-track');
  const number = document.querySelector('[data-step-number]');
  const label = document.querySelector('[data-step-label]');
  if (!bar || !track || !number || !label) return;
  bar.style.width = `${wizardStep / 6 * 100}%`;
  track.setAttribute('aria-valuenow', String(wizardStep));
  number.textContent = String(wizardStep);
  label.textContent = wizardStep === 6 ? (language === 'hi' ? 'अनुरोध की समीक्षा करें' : 'Review your request') : t(`form.step${wizardStep}`);
  document.querySelector('[data-form-back]').hidden = wizardStep === 1;
  document.querySelector('[data-form-next]').hidden = wizardStep === 6;
  document.querySelector('[data-form-submit]').hidden = wizardStep !== 6;
}

function updateCareReview(form) {
  const labels = language === 'hi'
    ? { careFor: 'मरीज़', support: 'सहायता', locality: 'इलाका', preferredDate: 'पसंदीदा तारीख', preferredTime: 'समय', frequency: 'आवृत्ति', fullName: 'आपका नाम', phone: 'मोबाइल नंबर', relationship: 'रिश्ता', preferredLanguage: 'भाषा', email: 'ईमेल', message: 'अतिरिक्त जानकारी' }
    : { careFor: 'Who needs care', support: 'Support requested', locality: 'Area', preferredDate: 'Preferred date', preferredTime: 'Preferred time', frequency: 'Frequency', fullName: 'Your name', phone: 'Mobile number', relationship: 'Relationship', preferredLanguage: 'Preferred language', email: 'Email', message: 'Additional details' };
  const optionNames = {
    careFor: { self: 'form.myself', parent: 'form.parent', grandparent: 'form.grandparent', other: 'form.other' },
    support: { companionship: 'form.companion', 'daily-living': 'form.daily', 'scheduled-caregiver': 'form.scheduled', 'appointment-coordination': 'form.appointment', mobility: 'form.mobility', 'nursing-enquiry': 'form.nursing', other: 'form.otherSupport' },
    frequency: { once: 'form.once', recurring: 'form.recurring' },
  };
  const entries = Object.entries(labels).flatMap(([name, label]) => {
    const fields = [...form.querySelectorAll(`[name="${name}"]`)];
    let values = fields.filter(field => field.type === 'radio' || field.type === 'checkbox')
      .filter(field => field.checked).map(field => optionNames[name]?.[field.value] ? t(optionNames[name][field.value]) : field.value);
    if (!values.length && fields.length === 1 && !['radio', 'checkbox'].includes(fields[0].type)) {
      const field = fields[0];
      const value = field.tagName === 'SELECT' ? field.selectedOptions[0]?.textContent : field.value;
      if (value?.trim()) values = [value.trim()];
    }
    return values.length ? [[label, values.join(', ')]] : [];
  });
  form.querySelector('[data-care-review]').innerHTML = entries.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
}

function showFeedback(form, message, error = false) {
  const area = form.querySelector('.form-feedback');
  area.innerHTML = typeof message === 'string' ? esc(message) : message;
  area.classList.add('is-visible');
  area.classList.toggle('is-error', error);
  area.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function validateHealthForm(form) {
  const age = form.elements.age?.value;
  const dateOfBirth = form.elements.dateOfBirth?.value;
  if (form.id === 'care-coordination-form' && !age && !dateOfBirth) {
    const field = form.elements.age;
    field.setCustomValidity(language === 'hi' ? 'उम्र या जन्म तिथि दें।' : 'Enter the patient age or date of birth.');
    field.reportValidity();
    return false;
  }
  if (form.id === 'care-coordination-form' && form.elements.doctorPreference.value === 'preferred' && !form.elements.doctorName.value.trim()) {
    form.elements.doctorName.setCustomValidity(language === 'hi' ? 'पसंदीदा डॉक्टर का नाम दें।' : 'Enter the preferred doctor name.');
    form.elements.doctorName.reportValidity();
    return false;
  }
  if (form.elements.contactMethod?.value === 'email' && !form.elements.email.value.trim()) {
    form.elements.email.setCustomValidity(language === 'hi' ? 'ईमेल से संपर्क के लिए ईमेल पता दें।' : 'Enter an email address for email contact.');
    form.elements.email.reportValidity();
    return false;
  }
  const followUp = form.elements.followUpOptIn;
  if (followUp?.value === 'yes' && !form.elements.followUpDate.value) {
    form.elements.followUpDate.setCustomValidity(language === 'hi' ? 'फॉलो-अप तारीख चुनें।' : 'Choose a follow-up date.');
    form.elements.followUpDate.reportValidity();
    return false;
  }
  return form.reportValidity();
}

async function sendForm(form, endpoint) {
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const fields = new FormData(form);
    const payload = Object.fromEntries(fields);
    if (endpoint === '/api/care-requests') payload.support = fields.getAll('support');
    const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) });
    let result = {};
    try { result = await response.json(); } catch { /* A non-JSON response is shown as an ordinary connection error. */ }
    if (response.status === 503 || result.code === 'NOT_CONFIGURED') {
      showFeedback(form, t('form.unavailable'), true);
      return;
    }
    if (response.status === 429) {
      showFeedback(form, result.error || 'Too many requests. Please wait a few minutes before trying again.', true);
      return;
    }
    if (!response.ok) {
      showFeedback(form, result.error || t('form.error'), true);
      return;
    }
    form.reset();
    showFeedback(form, `<strong>${esc(t('form.success'))}</strong>${esc(t('form.receipt'))}: ${esc(result.reference)}`);
  } catch {
    showFeedback(form, t('form.unavailable'), true);
  } finally {
    button.disabled = false;
  }
}

function filterResources() {
  const cards = [...document.querySelectorAll('#resource-results [data-resource]')];
  if (!cards.length) return;
  let visible = 0;
  for (const card of cards) {
    const matchesText = card.textContent.toLowerCase().includes(resourceQuery.trim().toLowerCase());
    const matchesCategory = resourceCategory === 'all' || card.dataset.category === resourceCategory;
    card.hidden = !matchesText || !matchesCategory;
    if (!card.hidden) visible += 1;
  }
  const empty = document.querySelector('.empty-state');
  if (empty) empty.hidden = visible > 0;
}

function savedFormState() {
  const form = main.querySelector('form');
  if (!form) return null;
  const result = {};
  for (const [name, field] of Object.entries(Object.groupBy ? Object.groupBy([...form.elements].filter(item => item.name), item => item.name) : groupFields(form))) {
    result[name] = field.length > 1 ? field.filter(item => item.checked).map(item => item.value) : (field[0].type === 'checkbox' ? field[0].checked : field[0].value);
  }
  return result;
}

function groupFields(form) {
  return [...form.elements].filter(item => item.name).reduce((groups, item) => ((groups[item.name] ||= []).push(item), groups), {});
}

function restoreFormState(snapshot) {
  if (!snapshot) return;
  const groups = groupFields(main.querySelector('form') || document.createElement('form'));
  for (const [name, value] of Object.entries(snapshot)) {
    for (const field of groups[name] || []) field.checked = Array.isArray(value) ? value.includes(field.value) : field.type === 'checkbox' ? value : field.type === 'radio' ? field.value === value : (field.value = value, false);
  }
}

function notice(message) {
  const region = document.querySelector('.toast-region');
  region.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { region.innerHTML = ''; }, 3500);
}

async function loadAdmin() {
  const login = document.querySelector('#admin-login');
  if (!login) return;
  try {
    const response = await fetch('/api/admin/requests', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    if (response.ok) {
      adminRecords = (await response.json()).items;
      showAdminRecords();
      return;
    }
    if (response.status === 503) {
      login.innerHTML = '<div class="form-shell"><h2 style="margin-top:0">Admin access is not configured.</h2><p>The site is online, but form intake and dashboard access require an administrator password and encryption key. No credentials or default account have been created.</p></div>';
      return;
    }
    login.innerHTML = '<form id="admin-login-form" class="form-shell"><h2 style="margin-top:0">Staff sign in</h2><p>Authorised staff only.</p><div class="field"><label for="admin-password">Administrator password</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required minlength="20" maxlength="256"></div><button class="button button-primary" type="submit">Sign in</button><div class="form-feedback" role="status" aria-live="polite"></div></form>';
  } catch {
    login.innerHTML = '<p role="status">The dashboard could not connect to the server.</p>';
  }
}

function showAdminRecords() {
  const panel = document.querySelector('#admin-results');
  const login = document.querySelector('#admin-login');
  if (!panel || !login) return;
  login.innerHTML = '';
  panel.hidden = false;
  const legacyStatuses = ['New Enquiry', 'Contacted', 'Assessment Pending', 'Assessment Completed', 'Matching in Progress', 'Quote Sent', 'Awaiting Approval', 'Booking Confirmed', 'Service In Progress', 'Follow-up', 'Closed'];
  const healthStatuses = {
    coordination: ['New Request', 'Coordinator Review', 'Appointment Coordination Pending', 'Accompaniment Availability Pending', 'Follow-up Scheduled', 'Closed', 'Cancelled'],
    medicine: ['New Request', 'Prescription Needed', 'Verification Pending', 'Awaiting Customer Approval', 'Confirmed by Pharmacy', 'Preparing Order', 'Out for Delivery', 'Delivered', 'Follow-up Due', 'Unavailable Medicine', 'Failed Delivery', 'Cancelled', 'Refund or Escalation', 'Closed'],
  };
  const unconnectedMedicineStatuses = ['Awaiting Customer Approval', 'Confirmed by Pharmacy', 'Preparing Order', 'Out for Delivery', 'Delivered', 'Unavailable Medicine', 'Failed Delivery'];
  const healthRows = adminRecords.filter(item => item.workflow === 'health');
  const renderPatientDetails = patient => {
    const fields = [
      ['Age', patient.age], ['Date of birth', patient.dateOfBirth], ['Caregiver', patient.caregiverName],
      ['Address', patient.address], ['Doctor preference', patient.doctorPreference], ['Doctor', patient.doctorName],
      ['Specialty', patient.specialty], ['Hospital / clinic', patient.hospital], ['Hospital location', patient.hospitalAddress],
      ['Last consultation', patient.lastConsultationDate], ['Next appointment', patient.nextAppointmentDate],
      ['Accompaniment', patient.accompaniment], ['Medicine assistance', patient.medicineAssistance],
      ['Medicine', patient.medicineName], ['Quantity', patient.quantity], ['Request type', patient.requestType],
      ['Requested delivery date', patient.requestedDate], ['Delivery window', patient.deliveryWindow],
      ['Delivery instructions', patient.deliveryInstructions], ['Preferred contact', patient.contactMethod],
    ].filter(([, value]) => value !== undefined && value !== '');
    return `<dl class="patient-record">${fields.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  };
  const renderRow = item => {
    const statuses = item.workflow === 'health' ? healthStatuses[item.kind] : legacyStatuses;
    const statusControl = `<select data-admin-status data-id="${esc(item.id)}" data-workflow="${item.workflow || 'legacy'}" aria-label="Status for ${esc(item.reference)}">${statuses.map(status => `<option ${item.status === status ? 'selected' : ''} ${item.kind === 'medicine' && unconnectedMedicineStatuses.includes(status) ? 'disabled' : ''}>${esc(status)}</option>`).join('')}</select>`;
    const followUp = item.workflow === 'health' ? `<td><label class="admin-followup">Follow-up date<input type="date" data-health-followup value="${esc(item.followUpDate)}" data-id="${esc(item.id)}"></label><label class="admin-followup"><input type="checkbox" data-health-reminder data-id="${esc(item.id)}" ${item.followUpOptIn ? 'checked' : ''}>Check-in requested</label><button class="button button-secondary button-sm" type="button" data-health-followup-save data-id="${esc(item.id)}">Save follow-up</button></td>` : '';
    const record = item.workflow === 'health' ? `<details class="patient-details"><summary>Patient/request details</summary>${renderPatientDetails(item.patientDetails)}</details>` : '';
    return `<tr><td>${esc(new Date(item.createdAt).toLocaleString())}<br>${esc(item.reference)}</td><td>${esc(item.kind)}<br>${esc(item.details)}${record}</td><td>${esc(item.fullName)}<br>${esc(item.phone)}${item.email ? `<br>${esc(item.email)}` : ''}</td><td>${esc(item.locality || '—')}</td><td>${statusControl}</td>${followUp || ''}</tr>`;
  };
  panel.innerHTML = `<div class="admin-toolbar"><p>${adminRecords.length} recent request${adminRecords.length === 1 ? '' : 's'} · All records are visible only after administrator sign-in.</p><button type="button" class="button button-secondary button-sm" data-admin-logout>Sign out</button></div>${adminRecords.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Received</th><th>Type and request</th><th>Contact</th><th>Locality</th><th>Status</th></tr></thead><tbody>${adminRecords.filter(item => item.workflow !== 'health').map(renderRow).join('')}</tbody></table></div>${healthRows.length ? `<h2>Doctor, hospital, and medicine requests</h2><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Received</th><th>Type and request</th><th>Contact</th><th>Locality</th><th>Status</th><th>Follow-up</th></tr></thead><tbody>${healthRows.map(renderRow).join('')}</tbody></table></div><p class="small-print">A follow-up date is a staff task only; this site does not send reminders. Pharmacy/customer approval, pharmacy confirmation, medicine availability, and delivery statuses are locked until the corresponding authorized integrations are established. Status changes do not verify pharmacies, payments, or delivery.</p>` : ''}` : '<div class="form-shell"><p>No requests have been received yet.</p></div>'}`;
}

document.addEventListener('click', async (event) => {
  const anchor = event.target.closest('a[href^="/"]');
  if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
    event.preventDefault();
    document.querySelector('.main-nav')?.classList.remove('is-open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.menu-toggle')?.setAttribute('aria-label', 'Open menu');
    document.querySelector('.main-nav')?.style.removeProperty('top');
    document.body.classList.remove('menu-open');
    if (routePath() !== anchor.getAttribute('href')) history.pushState({}, '', anchor.getAttribute('href'));
    window.scrollTo(0, 0);
    render();
    return;
  }
  if (event.target.closest('.language-toggle')) {
    const snapshot = savedFormState();
    language = language === 'en' ? 'hi' : 'en';
    localStorage.setItem('sehasetu-language', language);
    render();
    restoreFormState(snapshot);
    setWizard(wizardStep);
    return;
  }
  if (event.target.closest('.menu-toggle')) {
    const button = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    if (open && window.matchMedia('(max-width: 880px)').matches) nav.style.top = `${header.getBoundingClientRect().bottom}px`;
    else nav.style.removeProperty('top');
    document.body.classList.toggle('menu-open', open);
    return;
  }
  if (event.target.closest('[data-form-next]')) {
    const current = document.querySelector(`[data-form-step="${wizardStep}"]`);
    if (wizardStep === 2 && !current.querySelector('input[name="support"]:checked')) {
      const support = current.querySelector('input[name="support"]');
      support.setCustomValidity(t('form.chooseSupport'));
      support.reportValidity();
      return;
    }
    const invalid = [...current.querySelectorAll('input,select,textarea')].find(field => field.willValidate && !field.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    if (wizardStep === 5) updateCareReview(document.querySelector('#care-form'));
    setWizard(wizardStep + 1);
    document.querySelector(`#care-form legend`)?.focus?.({ preventScroll: true });
    document.querySelector('[data-form-step]:not([hidden]) legend')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }
  if (event.target.closest('[data-form-back]')) { setWizard(wizardStep - 1); return; }
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    resourceCategory = filter.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    filterResources();
    return;
  }
  if (event.target.closest('[data-admin-logout]')) {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    adminRecords = [];
    loadAdmin();
    return;
  }
  const followUpSave = event.target.closest('[data-health-followup-save]');
  if (followUpSave) {
    const id = followUpSave.dataset.id;
    const date = document.querySelector(`[data-health-followup][data-id="${CSS.escape(id)}"]`);
    const reminder = document.querySelector(`[data-health-reminder][data-id="${CSS.escape(id)}"]`);
    const current = adminRecords.find(item => item.id === id);
    if (!current || !date || !reminder) return;
    followUpSave.disabled = true;
    try {
      const response = await fetch(`/api/admin/health-requests/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ followUpDate: date.value, followUpOptIn: reminder.checked }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Follow-up settings were not saved.');
      current.followUpDate = date.value;
      current.followUpOptIn = reminder.checked;
      notice('Follow-up settings saved. No reminder was sent.');
    } catch (error) {
      notice(error.message);
    } finally {
      followUpSave.disabled = false;
    }
    return;
  }
});

document.addEventListener('input', event => {
  if (event.target.matches('#resource-search')) { resourceQuery = event.target.value; filterResources(); }
  if (event.target.matches('#care-form input[name="support"]')) event.target.setCustomValidity('');
  if (event.target.matches('#care-coordination-form input[name="age"],#care-coordination-form input[name="doctorName"],#care-coordination-form input[name="email"],#medicine-request-form input[name="followUpDate"],#care-coordination-form input[name="followUpDate"]')) event.target.setCustomValidity('');
});

document.addEventListener('change', event => {
  const form = event.target.closest('#care-coordination-form,#medicine-request-form');
  if (!form) return;
  if (event.target.matches('[name="doctorPreference"]')) form.elements.doctorName.setCustomValidity('');
  if (event.target.matches('[name="contactMethod"]')) form.elements.email.setCustomValidity('');
  if (event.target.matches('[name="followUpOptIn"]')) form.elements.followUpDate.setCustomValidity('');
});

document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.id === 'care-form') {
    event.preventDefault();
    for (let step = 1; step <= 5; step += 1) {
      const invalid = [...form.querySelector(`[data-form-step="${step}"]`).querySelectorAll('input,select,textarea')].find(field => field.willValidate && !field.checkValidity());
      if (invalid) { setWizard(step); invalid.reportValidity(); return; }
    }
    updateCareReview(form);
    setWizard(6);
    await sendForm(form, '/api/care-requests');
  } else if (form.id === 'partner-form') {
    event.preventDefault();
    if (!form.reportValidity()) return;
    await sendForm(form, '/api/partner-applications');
  } else if (form.id === 'care-coordination-form') {
    event.preventDefault();
    if (!validateHealthForm(form)) return;
    await sendForm(form, '/api/coordination-requests');
  } else if (form.id === 'medicine-request-form') {
    event.preventDefault();
    if (!validateHealthForm(form)) return;
    await sendForm(form, '/api/medicine-requests');
  } else if (form.id === 'admin-login-form') {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ password: new FormData(form).get('password') }) });
      const data = await response.json();
      if (response.ok) { loadAdmin(); }
      else showFeedback(form, data.error || 'Sign-in failed.', true);
    } catch { showFeedback(form, 'Could not reach the server. No sign-in information was sent.', true); }
    finally { submit.disabled = false; }
  }
});

document.addEventListener('change', async event => {
  if (!event.target.matches('[data-admin-status]')) return;
  const select = event.target;
  select.disabled = true;
  try {
    const route = select.dataset.workflow === 'health' ? 'health-requests' : 'requests';
    const response = await fetch(`/api/admin/${route}/${encodeURIComponent(select.dataset.id)}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ status: select.value }) });
    if (!response.ok) throw new Error('Status update was not saved.');
    const current = adminRecords.find(item => item.id === select.dataset.id);
    if (current) current.status = select.value;
    notice('Enquiry status saved.');
  } catch (error) { notice(error.message); loadAdmin(); }
  finally { select.disabled = false; }
});

window.addEventListener('popstate', () => { window.scrollTo(0, 0); render(); });
render();