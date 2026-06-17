import React, { useState } from 'react';
import './TermsModal.css';

const TermsModal = ({ isOpen, onClose, onAccept, language = 'en', isChecked }) => {
  const [localChecked, setLocalChecked] = useState(isChecked);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (localChecked) {
      onAccept(localChecked);
      onClose();
    }
  };

  const handleCancel = () => {
    setLocalChecked(false);
    onAccept(false);
    onClose();
  };

  const content = language === 'ar' ? {
    title: 'الشروط والأحكام',
    subtitle: 'ما هي سياسة الخصوصية؟',
    termsText: `تولي الهيئة السعودية للمياه أهمية كبيرة لخصوصيتك وتظل ملتزمة بضمان حمايتها. إدراكاً لأهمية خصوصية بياناتك واهتمامك بفهم كيفية استخدام معلوماتك عند تصفح موقعها الرسمي، تم تطوير هذه السياسة لتوضيح أنواع البيانات التي قد يتم جمعها والأغراض التي تُستخدم من أجلها والآليات للتعامل معها، مع ضمان أعلى معايير الحماية والشفافية.

دور الهيئة في تعزيز استدامة قطاع المياه والبيئة وأداء عدة أدوار هي:

- **حماية المستهلك:**
من خلال تنظيم الموارد المائية وضمان استخدامها المستدام، ومراقبة جودة الخدمات المقدمة، والعمل على زيادة الوعي المجتمعي حول أهمية الحفاظ على المياه، وتوفير قنوات اتصال متنوعة لاستقبال الشكاوى والملاحظات.

- **إشراف على تنفيذ التوجهات الاستراتيجية:**
التكامل مع الاستراتيجيات الوطنية وبرامج توطين صناعة قطاع المياه وزيادة المحتوى المحلي، وبرامج تطبيق المعايير البيئية والاجتماعية وجودة الحياة، وبرامج تعزيز البحث والابتكار والتعاون الدولي لحلول المياه.

- **تنظيم قطاع المياه:**
إصدار التراخيص والتأشيرات والإرشادات المتعلقة بالكيانات والأصول التشغيلية، وتحديد المواصفات والضوابط لجودة المياه والخدمات المرتبطة بها، وتنظيم الاتفاقيات التجارية في قطاع المياه.

- **تخطيط وإدارة الأمن المائي:**
تكامل مشاريع وسلسلة إمدادات المياه والخدمات وتعظيم الفوائد، وضمان توفر متطلبات الأمن المائي وتطوير الخطط والبرامج اللازمة، ومراقبة وتحليل البيانات وقياس أداء الخدمات والمشاريع.

بناءً على اهتمام الهيئة بأهمية حماية البيانات الشخصية المتعلقة بالمستخدمين والزوار، تم إعداد هذه الوثيقة وفقاً لقانون حماية البيانات الشخصية ولائحته التنفيذية لغرض توضيح آلية جمع البيانات الشخصية وكيفية تعامل الهيئة معها.

**ما هي البيانات الشخصية التي سيتم جمعها؟**
تشير البيانات الشخصية، حيثما ورد ذكرها، إلى البيانات التي تتم مشاركتها مع الهيئة لغرض تقديم خدمة معينة، بما في ذلك:

**أولاً: بيانات الشكاوى والتقارير:**
- الاسم الكامل، رقم الهوية الوطنية أو الإقامة، رقم الهاتف، المنطقة، السلطة ذات الصلة، رقم الشكوى، موضوع الشكوى، المرفقات*، الموقع، النوع (مياه/صرف صحي)، مقدار التسرب، الوصف*، صورة التسرب.

**ثانياً: بيانات حساب الفواتير:**
- فئة العميل، قطر عد المياه (مم)، عدد الوحدات، اتصال الصرف الصحي، دورة الفوترة (أيام)، فترة الاستهلاك.

**ثالثاً: البيانات الإلكترونية:**
- عنوان IP، معلومات الحساب الإلكتروني: اسم المستخدم، البريد الإلكتروني، كلمة المرور، معلومات الموقع الجغرافي.

**رابعاً: البيانات المستخدمة في طلبات التدريب التعاوني:**
- البيانات الشخصية: الاسم، رقم الجوال، البريد الإلكتروني، تاريخ الميلاد، المدينة، الجنسية، رقم الهوية، الجنس.
- بيانات التدريب: خطاب التدريب من الجامعة، المؤهل الأكاديمي (المؤهل الأكاديمي، اسم الجامعة، سنة التخرج المتوقعة، التخصص، المعدل التراكمي)، ملف السيرة الذاتية*.

**خامساً: البيانات المستخدمة في طلبات التوظيف (الخريجين الجدد):**
- البيانات الشخصية: الاسم، تاريخ الميلاد، الجنس، رقم الهوية/الإقامة/جواز السفر، نوع الهوية*، الجنسية، العنوان*، المدينة، رقم الجوال، البريد الإلكتروني.
- بيانات الوظيفة: المسمى الوظيفي، اللغة، الشهادات، المهارات والمؤهلات الأكاديمية، ملف السيرة الذاتية.

**سادساً: البيانات المستخدمة في طلبات التوظيف (ذوي الخبرة):**
- البيانات الشخصية: الاسم، تاريخ الميلاد، الجنس، رقم الهوية/الإقامة/جواز السفر، نوع الهوية*، الجنسية، العنوان*، رقم الجوال، البريد الإلكتروني.
- بيانات الوظيفة: المسمى الوظيفي، الخبرة العملية السابقة، التاريخ الوظيفي، اللغات، الشهادات، المهارات، المؤهلات المهنية والأكاديمية، سنوات الخبرة، ملف السيرة الذاتية، الراتب المتوقع*.
- بيانات ما بعد التوظيف: سجل عائلة الموظف، هوية الوالدين، سجل أسرة الأب، رقم الحساب المصرفي، العنوان الوطني، السجلات الطبية أو الحالات الصحية (للموظفين)، الصورة الشخصية الحديثة.

**سابعاً: البيانات الاجتماعية:**
- معلومات عن الحالة الاجتماعية (مثل الحالة الاجتماعية، عدد الأطفال)*.

**ملاحظة:** جميع الحقول المنتهية بـ "*" اختيارية (غير إلزامية).

**ما هو الأساس القانوني لجمع ومعالجة البيانات الشخصية؟**
وفقاً لقانون حماية البيانات الشخصية في المملكة العربية السعودية ولائحته التنفيذية، تعتمد الهيئة السعودية للمياه على الأسس القانونية التالية لجمع ومعالجة البيانات الشخصية:

**1. الامتثال للأنظمة واللوائح:**
- يتم جمع البيانات الشخصية وفقاً لقانون حماية البيانات الشخصية ولائحته التنفيذية.
- يتم جمع البيانات الشخصية لضمان الامتثال للقوانين واللوائح ذات الصلة، مثل مراقبة الامتثال وجمع الرسوم وإصدار التراخيص.

**2. أداء الواجبات والمسؤوليات:**
- يتم جمع ومعالجة البيانات لأداء الواجبات والمسؤوليات الموكلة للهيئة، مثل تقديم الخدمات والبرامج والمبادرات التي تقدمها الهيئة من خلال موقعها الرسمي والمواقع التابعة لها. وهذا يشمل إصدار التراخيص وتحسين تجربة المستفيد وضمان جودة الخدمات المقدمة.

**3. تحقيق أهداف التنمية:**
- يتم جمع ومعالجة البيانات الشخصية لدعم استراتيجية المياه التي تتماشى مع رؤية السعودية 2030، بما في ذلك تحقيق الأهداف التنموية والاقتصادية.

**4. الموافقة الصريحة:**
- يتم جمع ومعالجة البيانات الشخصية بناءً على موافقة صريحة من صاحب البيانات أو ممثله القانوني.
- في حالات محددة، يتم جمع ومعالجة البيانات الشخصية بناءً على المصلحة العامة أو أغراض الأمن، وفقاً لقانون حماية البيانات الشخصية ولائحته التنفيذية.

**5. الاستجابة للطلبات الرسمية:**
- يتم جمع ومعالجة البيانات الشخصية عند استلام طلب رسمي من كيان حكومي مخول في الحالات المتعلقة بالمصلحة العامة أو أغراض الأمن، وفقاً للوائح والقوانين ذات الصلة المتبعة في المملكة العربية السعودية.

**6. تنفيذ الاتفاقيات:**
- يتم جمع ومعالجة البيانات الشخصية عندما يكون صاحب البيانات طرفاً في اتفاقية مع الهيئة، ويتم ذلك وفقاً لشروط الاتفاقية واللوائح ذات الصلة.

**7. إجراء الدراسات والبحوث:**
- يتم جمع ومعالجة البيانات الشخصية لإجراء الاستبيانات والمقابلات وإصدار التقارير الإحصائية التي تخدم متطلبات العمل وتحسين الخدمات، بما في ذلك دراسة وتطوير قطاع المياه في المملكة العربية السعودية.

**ما هي طرق جمع البيانات الشخصية والغرض من جمعها؟**
تلتزم الهيئة بمعالجة البيانات الشخصية وفقاً لأحكام قانون حماية البيانات الشخصية ولائحته التنفيذية. يُعتبر جمع ومعالجة البيانات الشخصية ضرورياً لتقديم أفضل مستوى من الخدمات.

• تجمع الهيئة البيانات الشخصية مباشرة أو غير مباشرة:

**جمع مباشر:**
- جمع مباشر من صاحب البيانات أو ممثله القانوني من خلال تقديم الخدمات والمبادرات والبرامج أو التراخيص. على سبيل المثال وليس على سبيل الحصر (الاسم، رقم الهاتف، اسم المستخدم، المؤهل الأكاديمي، العنوان الوطني، رقم الهوية، السجل التجاري، رقم الترخيص).

**جمع غير مباشر:**
- جمع غير مباشر من خلال الخوادم وملفات تعريف الارتباط لتحسين تجربة المستخدم. على سبيل المثال وليس على سبيل الحصر (إحصائيات زيارة المستخدمين لموقع الهيئة).

**ما هي عواقب عدم تقديم البيانات الشخصية؟**
• عدم قدرتنا على تقديم الخدمات بما في ذلك وليس على سبيل الحصر (الشكاوى والتقارير، حسابات الفواتير، التدريب، التوظيف).
• منع الوصول إلى ميزات معينة، أو التأثير على تجربة المستخدم وضمان الامتثال للمتطلبات التنظيمية.

**كيف تتم معالجة البيانات الشخصية؟**
يتم معالجة البيانات الشخصية المجمعة لأداء المهام والمسؤوليات الموكلة للهيئة وبطريقة تحقق الأغراض المحددة في هذه الوثيقة. لن تتم معالجة البيانات الشخصية إلا من قبل المصرح لهم بذلك وفقاً لكفاءاتهم ووفقاً لما تحدده السياسات المعتمدة لهذا الغرض. قد يؤثر عدم جمع بياناتك الشخصية على قدرتك على الاستفادة من الخدمات التي تقدمها الهيئة.

**هل يتم مشاركة البيانات الشخصية؟**
تلتزم الهيئة بقانون حماية البيانات الشخصية ولائحته التنفيذية وسياسات وضوابط مشاركة البيانات الصادرة عن السلطات التنظيمية. لن تتم مشاركة البيانات الشخصية أو الكشف عنها لأي طرف خارج الهيئة إلا وفقاً لحالات الكشف المحددة في قانون حماية البيانات الشخصية ولائحته التنفيذية.

**كيف يتم تخزين وحفظ وتدمير بياناتك الشخصية؟**
• التخزين الآمن:
تُخزن بياناتك الشخصية بشكل آمن في مقر الهيئة أو على الخوادم المعتمدة داخل المملكة العربية السعودية، مع تطبيق أعلى معايير الأمن مثل التشفير وإدارة الوصول.

• فترة الاحتفاظ:
تحتفظ الهيئة بالبيانات للفترة اللازمة لتحقيق الأغراض التي تم جمعها من أجلها، أو للوفاء بالالتزامات القانونية والتنظيمية.

• تدمير البيانات:
بعد انتهاء غرض جمع البيانات أو انتهاء الفترة القانونية، يتم تدمير البيانات بشكل آمن بطريقة لا تسمح باسترجاعها أو الوصول إليها مرة أخرى.

• حالات استثنائية:
قد تحتفظ الهيئة بالبيانات لفترات أطول في حالات محددة، مثل وجود متطلب قانوني أو ربط البيانات بالقضايا التنظيمية.

**ما هي حقوق أصحاب البيانات الشخصية؟**
يتمتع المستخدمون بالحقوق التالية:

**1. الحق في المعرفة:**
لديك الحق في معرفة كيفية جمعنا للبيانات الشخصية والأساس القانوني لجمعها، وكيفية معالجتها وتخزينها وتدميرها، ولمن سيتم الإفصاح عنها.

**2. الحق في الوصول:**
يمكنك طلب عرض بياناتك الشخصية.

**3. الحق في التصحيح:**
يمكنك طلب تصحيح أي بيانات غير دقيقة، وسيتم مراجعتها وتحديثها وسيتم إشعارك خلال ثلاثين يوماً.

**4. الحق في المحو:**
يمكنك طلب حذف بياناتك بعد انتهاء الغرض الذي تم جمعها من أجله، بطريقة لا تتعارض مع المتطلبات التنظيمية وقيود التدمير.

**5. الحق في الاعتراض:**
يمكنك الاعتراض على معالجة بياناتك في حالات معينة.

**6. الحق في سحب الموافقة:**
يمكنك سحب موافقتك على معالجة بياناتك في أي وقت، ما لم تكن هناك متطلبات تنظيمية تفرض خلاف ذلك.`,
    checkboxText: 'أقر بأنني قرأت وأوافق على الشروط والأحكام',
    contactText: 'للاستفسارات أو المساعدة بخصوص سياسة الخصوصية، يرجى الاتصال بنا:',
    cancel: 'إلغاء',
    continue: 'متابعة'
  } : {
    title: 'Terms and Conditions',
    subtitle: 'What is the Privacy Policy?',
    termsText: `
The Saudi Water Authority highly values your privacy and remains dedicated to ensuring its protection. Recognizing the significance of your data privacy and your interest in understanding how your information is used when browsing its official website, this policy has been developed to clarify the types of data that may be collected, the purposes for which they are used, and the mechanisms for handling them, ensuring the highest standards of protection and transparency.

The authority's role in promoting the sustainability of the water and environment sector and performing several roles are:

- Consumer Protection:

Through regulating water resources and ensuring their sustainable use, monitoring the quality of services provided, working to raise community awareness about the importance of water conservation, and providing various communication channels to receive complaints and feedback.

- Supervision of Strategic Directions Implementation:

Integration with national strategies, programs for localizing the water sector industry and increasing local content, programs for applying environmental and social standards and quality of life, and programs to enhance research, innovation and international cooperation for water solutions.

- Water Sector Regulation:

Issuing licenses, permits and guidelines related to entities and operational assets, determining specifications and controls for water quality and associated services, and regulating commercial agreements in the water sector.

- Water Security Planning and Management:

Integration of water supply chain projects and services and maximizing benefits, ensuring the availability of water security requirements and developing necessary plans and programs, and monitoring and analyzing data and measuring the performance of services and projects.

Based on the Authority's concern for the importance of protecting personal data related to users and visitors, this document was prepared in accordance with the Personal Data Protection Law and its executive regulations for the purpose of clarifying the mechanism for collecting personal data and how it is handled by the Authority.

What personal data will be collected?
Personal data, wherever mentioned, refers to data that is shared with the Authority for the purpose of providing a specific service, including:

First: Complaints and Reports Data:
- Full name, national ID or residence number, phone number, region, relevant authority, complaint number, complaint subject, file attachments*, location, type (water/sewage), leakage amount, description*, leakage image.

Second: Billing Account Data:
- Customer category, Water Meter Diameter (mm), number of units, sewage connection, billing cycle (days), Consumption Period.

Third: Electronic Data:
- IP address, electronic account information: username, email, password, geographic location information.

Fourth: Data Used in Cooperative Training Applications:
- Personal data: Name, mobile number, email, date of birth, city, nationality, ID number, gender.
- Training data: Training letter from university, academic qualification (academic qualification, university name, expected graduation year, specialization, GPA), CV file*.

Fifth: Data Used in Job Applications (Recent Graduates):
- Personal data: Name, date of birth, gender, ID/residence/passport number, ID type*, nationality, address*, city, mobile number, email.
- Job data: Job title, language, certificates, skills and academic qualifications, CV file.

Sixth: Data Used in Job Applications (Experienced):
- Personal data: Name, date of birth, gender, ID/residence/passport number, ID type*, nationality, address*, mobile number, email.
- Job data: Job title, previous work experience, employment history, languages, certificates, skills, professional and academic qualifications, years of experience, CV file, expected salary*.
- Post-employment data: Employee family record, parents' ID, father's family record, bank account number, national address, medical records or health conditions (for employees), recent personal photo.

Seventh: Social Data:
- Information about social status (such as marital status, number of children)*.

Note: All fields ending with "*" are optional (not mandatory).

What is the legal basis for collecting and processing personal data?
In accordance with the Personal Data Protection Law in the Kingdom of Saudi Arabia and its executive regulations, the Saudi Water Authority relies on the following legal bases for collecting and processing personal data:

1. Compliance with regulations and bylaws:
- Personal data collection is carried out in accordance with the Personal Data Protection Law and its executive regulations.
- Personal data is collected to ensure compliance with relevant laws and regulations, such as compliance monitoring, fee collection, and issuance of licenses.

2. Fulfillment of duties and responsibilities:
- Data is collected and processed to fulfill the duties and responsibilities assigned to the Authority, such as providing services, programs, and initiatives offered by the Authority through its official website and affiliated sites. This includes issuing licenses, improving beneficiary experience, and ensuring the quality of services provided.

3. Achievement of development goals:
- Personal data is collected and processed to support the water strategy that aligns with Saudi Vision 2030, including achieving developmental and economic goals.

4. Explicit consent:
- Personal data is collected and processed based on explicit consent from the data owner or their legal representative.
- In specific cases, personal data is collected and processed based on public interest or security purposes, in accordance with the Personal Data Protection Law and its executive regulations.

5. Responding to official requests:
- Personal data is collected and processed when receiving an official request from an authorized government entity in cases related to public interest or security purposes, in accordance with relevant regulations and laws followed in the Kingdom of Saudi Arabia.

6. Implementation of agreements:
- Personal data is collected and processed when the data owner is a party to an agreement with the Authority, and this is done in accordance with the terms of the agreement and relevant regulations.

7. Conducting studies and research:
- Personal data is collected and processed for conducting surveys, interviews, and issuing statistical reports that serve work requirements and improve services, including studying and developing the water sector in the Kingdom of Saudi Arabia.

What are the methods of collecting personal data and the purpose of its collection?
The Authority is committed to processing personal data in accordance with the provisions of the Personal Data Protection Law and its executive regulations. The collection and processing of personal data is considered necessary to provide the best level of services.

• Personal data is collected by the Authority directly or indirectly:

Direct Collection:
- Direct collection from the data owner or their legal representative through providing services, initiatives, programs, or licenses. For example, but not limited to (name, phone number, username, academic qualification, national address, ID number, commercial registration, license number).

Indirect Collection:
- Indirect collection through servers and cookies to improve user experience. For example, but not limited to (statistics of user visits to the Authority's website).

What are the consequences of not providing personal data?
• Our inability to provide services including but not limited to (complaints and reports, billing accounts, training, employment).
• Preventing access to certain features, or affecting the user experience and ensuring compliance with regulatory requirements.

How is personal data processed?
The personal data collected is processed to perform the tasks and responsibilities assigned to the Authority and in a manner that achieves the purposes specified in this document. Personal data will not be processed except by those authorized to do so according to their competencies, and according to what is specified by the approved policies for this purpose. Failure to collect your personal data may affect your ability to benefit from the services provided by the Authority.

Is personal data shared?
The Authority is committed to the Personal Data Protection Law and its executive regulations and the data sharing policies and controls issued by regulatory authorities. Personal data will not be shared or disclosed to any party outside the Authority except in accordance with the disclosure cases specified in the Personal Data Protection Law and its executive regulations.

How is your personal data stored, retained, and destroyed?
• Secure Storage:
Your personal data is securely stored at the Authority's headquarters or on approved servers within the Kingdom of Saudi Arabia, with the application of the highest security standards such as encryption and access management.

• Retention Period:
The Authority retains data for the period necessary to achieve the purposes for which it was collected, or to fulfill legal and regulatory obligations.

• Data Destruction:
After the purpose of data collection has ended or the legal period has expired, data is destroyed securely in a way that does not allow it to be retrieved or accessed again.

• Exceptional Cases:
The Authority may retain data for longer periods in specific cases, such as the existence of a legal requirement or data being associated with regulatory matters.

What are the rights of personal data subjects?
Users enjoy the following rights:

1. Right to Know:
You have the right to know how we collect personal data, the legal basis for its collection, how it is processed, stored, destroyed, and to whom it will be disclosed.

2. Right to Access:
You can request to view your personal data.

3. Right to Rectification:
You can request to correct any inaccurate data, and it will be reviewed, updated, and you will be notified within thirty days.

4. Right to Erasure:
You can request the deletion of your data after the purpose for which it was collected has ended, in a manner that does not conflict with regulatory requirements and destruction restrictions.

5. Right to Object:
You can object to the processing of your data in certain cases.

6. Right to Withdraw Consent:
You can withdraw your consent to the processing of your data at any time, unless there are regulatory requirements that require otherwise.`,
    checkboxText: 'I have read and accept the Terms and Conditions',
    contactText: 'For inquiries or assistance regarding the Privacy Policy, please contact us:',
    cancel: 'Cancel',
    continue: 'Continue'
  };

  return (
    <div className="CAterms-modal-overlay" onClick={handleCancel}>
      <div className={`CAterms-modal-content ${language === 'ar' ? 'rtl' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2 className="CAterms-modal-title">{content.title}</h2>
        <div className="CAterms-modal-text">
          <h3 className="CAterms-modal-subtitle">{content.subtitle}</h3>
          <p>{content.termsText}</p>
        </div>
        
        <div className="CAterms-modal-info">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99984 15.3337C12.0499 15.3337 15.3332 12.0504 15.3332 8.00033C15.3332 3.95024 12.0499 0.666992 7.99984 0.666992C3.94975 0.666992 0.666504 3.95024 0.666504 8.00033C0.666504 12.0504 3.94975 15.3337 7.99984 15.3337Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99984 15.3337C12.0499 15.3337 15.3332 12.0504 15.3332 8.00033C15.3332 3.95024 12.0499 0.666992 7.99984 0.666992C3.94975 0.666992 0.666504 3.95024 0.666504 8.00033C0.666504 12.0504 3.94975 15.3337 7.99984 15.3337ZM7.99984 7.33366C7.63165 7.33366 7.33317 7.63214 7.33317 8.00033V10.667C7.33317 11.0352 7.63165 11.3337 7.99984 11.3337C8.36803 11.3337 8.6665 11.0352 8.6665 10.667V8.00033C8.6665 7.63214 8.36803 7.33366 7.99984 7.33366ZM7.99984 4.66699C7.63165 4.66699 7.33317 4.96547 7.33317 5.33366C7.33317 5.70185 7.63165 6.00033 7.99984 6.00033C8.36803 6.00033 8.6665 5.70185 8.6665 5.33366C8.6665 4.96547 8.36803 4.66699 7.99984 4.66699Z" fill="#384250"/>
</svg>
          <span>{content.contactText} <a href="mailto:CMP@swa.gov.sa" className="CAterms-modal-email">CMP@swa.gov.sa</a></span>
        </div>
        
        <div className="CAterms-modal-checkbox">
          <input
            type="checkbox"
            id="termsModalCheckbox"
            checked={localChecked}
            onChange={(e) => setLocalChecked(e.target.checked)}
          />
          <label htmlFor="termsModalCheckbox">{content.checkboxText}</label>
        </div>
        
        <div className="CAterms-modal-buttons">
          <button className="CAterms-modal-cancel" onClick={handleCancel}>
            {content.cancel}
          </button>
          <button 
            className="CAterms-modal-continue" 
            onClick={handleContinue}
            disabled={!localChecked}
          >
            {content.continue}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

