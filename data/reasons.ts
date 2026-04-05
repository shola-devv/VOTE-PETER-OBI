// /data/reasons.ts
// ─────────────────────────────────────────────────────────────────────────────
// DROP YOUR JSON ARRAY HERE.
// Each object must match the Reason interface below.
// The app handles 1 – 1000+ entries without any other changes needed.
// ─────────────────────────────────────────────────────────────────────────────

export interface Reason {
  id: number;
  category: string;
  reason: string;
  source: string;
}

// ⬇⬇⬇  Replace this sample array with your full dataset  ⬇⬇⬇
export const reasons: Reason[] = [
 {
      "id": 1,
      "category": "Education",
      "reason": "He received certificates in the Senior Executive Program and Chief Executive Officers Program at the International Institute for Management Development in Switzerland.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
      
    },
    {
      "id": 2,
     "category": "Fiscal Management",
      "reason": "Anambra State became the first state in Nigeria to commence Sub-Sovereign Wealth savings — the first of its kind in all of Sub-Saharan Africa — under Peter Obi's administration.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
   
    },
    {
      "id": 3,
      "category": "Fiscal Management",
      "reason": "The Nigerian Debt Management Office (DMO) rated Anambra as the least indebted state in Nigeria during his tenure, despite visible and measurable achievements across multiple sectors.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"

     
    },
    {
      "id": 4,
      "category": "Early Life",
      "reason": "Growing up in Onitsha — a major commercial hub — instilled in him an early appreciation for trade, market dynamics, and community economic responsibility that later shaped his governance style.",
      "source": "https://novaline.com.ng/peter-obi-biography/"
    },
    {
      "id": 5,
      "category": "Early Life",
      "reason": "He attended Christ the King College (CKC), Onitsha, one of the most prestigious secondary schools in southeastern Nigeria, known for its rigorous academic and leadership culture.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 6,
      "category": "Early Life",
      "reason": "Even as a student at Christ the King College, Obi showed entrepreneurial instincts by selling goods to his classmates — a small sign of the financial discipline that would later define his governance.",
      "source": "https://thisdaylive.com/index.php/2022/10/16/thoughts-on-peter-obis-biography"
    },
    {
      "id": 7,

       "category": "Fiscal Management",
      "reason": "He left office with the equivalent of $500 million in investments in both local and foreign currency for Anambra State, including $156 million in dollar-denominated bonds — at a time when many other governors were leaving enormous debts.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 8,
      "category": "Education",
      "reason": "He earned a Bachelor of Arts with Honours in Philosophy from the University of Nigeria, Nsukka in 1984 — a discipline that sharpened his analytical thinking, ethical reasoning and decision-making.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 9,
      "category": "Education",
      "reason": "He attended Harvard Business School, completing two major programs there — demonstrating a commitment to continuous learning at the highest levels of global business education.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 10,
      "category": "Education",
      "reason": "He studied at the Lagos Business School, completing the Chief Executive Program — one of the most selective leadership programs in Africa.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 11,
      "category": "Education",
      "reason": "He completed executive programs at the London School of Economics and Columbia Business School — two of the world's most respected institutions for economics and finance.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 12,
      "category": "Early Life",
      "reason": "Peter Obi was born on July 19, 1961 in Onitsha, one of Nigeria's most important commercial cities, giving him a deep understanding of trade, commerce and economic life from childhood.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 13,
      "category": "Education",
      "reason": "He attended the Kellogg School of Management at Northwestern University, the Said Business School at Oxford University, and the Judge Business School at Cambridge University — collectively representing perhaps the most internationally educated Nigerian governor of his generation.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 14,
      "category": "Business Career",
      "reason": "Before entering politics, Obi built a genuinely successful business career in trading and banking, entering politics from a position of financial independence rather than looking for public office to enrich himself.",
      "source": "https://biography.igbopeople.org/biography/peter-obi/"
    },
    {
      "id": 15,
      "category": "Business Career",
      "reason": "He became the youngest Chairman of a publicly quoted bank in Nigeria when he took charge of Fidelity Bank — a record that speaks to his early exceptional competence in financial management.",
      "source": "https://thisdaylive.com/index.php/2022/10/16/thoughts-on-peter-obis-biography"
    },
    {
      "id": 16,
      "category": "Business Career",
      "reason": "He held senior positions at Guardian Express Bank and Paymaster Nigeria, contributing to strategic growth at both institutions before transitioning into public service.",
      "source": "https://biography.igbopeople.org/biography/peter-obi/"
    },
    {
      "id": 17,
      "category": "Business Career",
      "reason": "He served as director at Next International Nigeria Ltd, demonstrating broad corporate governance experience across multiple sectors before becoming governor.",
      "source": "https://biography.igbopeople.org/biography/peter-obi/"
    },
    {
      "id": 18,
      "category": "Political Integrity",
      "reason": "When he first ran for governor in 2003, he was robbed of his election victory by Chris Ngige of PDP who was unlawfully declared winner. Rather than accepting the injustice, Obi went to court and fought for three years to reclaim his mandate — showing extraordinary determination and faith in institutions.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 19,

      "category": "Early Life",
      "reason": "He grew up in a devout Christian family that strongly emphasized values of honesty, humility, and hard work — values he carried directly into public office.",
      "source": "https://novaline.com.ng/peter-obi-biography/"
  
    },
    {
      "id": 20,
      "category": "Political Integrity",
      "reason": "He was impeached in November 2006 — reportedly, one of the real reasons was his refusal to inflate the state government's yearly budget. He was punished for being honest. He challenged the impeachment and won it in court.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 21,
      "category": "Political Integrity",
      "reason": "When pressured to build a Presidential Lodge estimated at NGN 500 million to host then-President Obasanjo for just one week, he refused, negotiated an alternative arrangement, and moved himself into a hotel at a cost of only about NGN 200,000. This is the kind of leader who counts the people's money.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 22,
      "category": "Political Integrity",
      "reason": "When he inherited an administration in ruins with grossly inflated appropriations already in place — NGN 298 million budgeted for Government House repairs — he slashed the spending to NGN 43.2 million and got the job done. Then he was impeached for it.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 23,
      
      "category": "Political Integrity",
      "reason": "The PDP filed 425 witnesses in the case against him as a deliberate delaying tactic. He outlasted all of them in court. That level of patience and persistence is not something most Nigerian politicians would even attempt.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 24,
      "category": "Early Life",
      "reason": "His father, Josephat Obi, owned the popular Ideal Soul Super Market in Onitsha, exposing Peter Obi to entrepreneurship and business discipline from a very young age.",
      "source": "https://citizendiaryng.com/peter-obi-biography/"
    },
    {
      "id": 25,
      "category": "Fiscal Management",
      "reason": "The Senate of the Federal Republic of Nigeria rated Anambra State as the most financially stable state in the country during his tenure.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 26,
        "category": "Early Life",
      "reason": "From his earliest years, he was described as calm, observant, and thoughtful — traits that analysts have consistently pointed to as defining his measured and deliberate leadership style.",
      "source": "https://novaline.com.ng/peter-obi-biography/"
    },
    {
      "id": 27,
      "category": "Fiscal Management",
      "reason": "He left over 75 billion Naira in savings for his successor Willie Obiano — a fact confirmed when Obiano himself disclosed that part of those funds were used to build the Anambra Airport.",
      "source": "https://globalpeace.org/speaker/mr-peter-gregory-obi/"
    },
    {
      "id": 28,
      "category": "Fiscal Management",
      "reason": "At the end of his tenure, there were no unpaid pensions, no unpaid gratuities, no salary arrears, and no pending bills owed to any contractors — a feat almost unheard of in Nigerian state governance.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 29,
      "category": "Fiscal Management",
      "reason": "He achieved all of this without borrowing a single naira or raising bonds to fund state projects — a governing approach so rare in Nigeria it attracted international academic interest.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 30,
      "category": "Fiscal Management",
      "reason": "Anambra State under Obi consistently achieved budgetary surpluses — eliminating wasteful government spending and growing the state's internally generated revenue (IGR) simultaneously.",
      "source": "https://kashgain.net/blog/peter-obi-biography-family-networth-and-political-career/"
    },
    {
      "id": 31,
      "category": "Education",
      "reason": "He returned mission schools to their original owners — Voluntary Agencies (churches) — on January 1, 2009, and partnered with them in managing education. This single move saw Anambra rise from 24th position to Number One in NECO and WAEC examinations in Nigeria for three consecutive years.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 32,
      "category": "Education",
      "reason": "His government was the first in Nigeria to procure and distribute over 30,000 computers to secondary schools — including 22,500 units from HP. HP's Managing Director for Personal Systems Group described it as the biggest deployment of its kind in the Middle East and Africa.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 33,
      "category": "Education",
      "reason": "His government provided Microsoft Academies to over 500 secondary schools. Microsoft's Head in Nigeria described it as the most extensive Microsoft Academy deployment in Africa at the time.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 34,
      "category": "Education",
      "reason": "He provided internet access to over 500 secondary schools across Anambra State — connecting students who had previously been entirely offline.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 35,
      "category": "Education",
      "reason": "He provided over 700 school buses to secondary schools across the state, improving student access and attendance.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 36,
      "category": "Education",
      "reason": "He built and equipped classrooms in all 177 communities of Anambra State and installed boreholes in schools across the state.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 37,
      "category": "Education",
      "reason": "Under his administration, education funding was sent directly to schools, bypassing the Ministry of Education entirely to prevent gatekeepers from extracting funds along the way.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 38,
      "category": "Education",
      "reason": "His educational reforms were so effective that the World Bank commissioned a study of Anambra State, led by renowned Professor Paul Collier of Oxford University, to understand how the transformation was achieved.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 39,
      "category": "Education",
      "reason": "He successfully addressed the historical challenge of low male-child school enrolment in Anambra State — a social problem that previous administrations had failed to tackle.",
      "source": "https://globalpeace.org/speaker/mr-peter-gregory-obi/"
    },
    {
      "id": 40,
      "category": "Education",
      "reason": "He built the Kenneth Dike Digital State Library, earning his administration the Nigerian Library Association Golden Merit Award in 2014 for remarkable improvement of libraries in Anambra State.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 41,
      "category": "Healthcare",
      "reason": "By the end of his tenure in 2014, over 12 health institutions including two hospitals had secured professional accreditation. When he assumed office in 2006, not a single health institution in Anambra State was accredited.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 42,
      "category": "Healthcare",
      "reason": "His government won a $1 million award from the Bill and Melinda Gates Foundation as the best-performing state in immunization in the South-East region of Nigeria.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 43,
      "category": "Healthcare",
      "reason": "Using the Bill and Melinda Gates Foundation award money plus complementary government funding, his administration built 10 Maternal and Child Care Centres across the state, particularly targeting rural communities.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 44,
      "category": "Healthcare",
      "reason": "His government built the Joseph Nwilo Heart Centre in St. Joseph, Adazi-Nnukwu — a specialist facility where heart operations are now performed, something Anambra previously had no access to.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 45,
      "category": "Healthcare",
      "reason": "His government funded the transformation and upgrading of St. Charles Borromeo Hospital Onitsha, Holy Rosary Hospital Waterside Onitsha, and St. Joseph Hospital Adazi-Nnukwu — through strategic church-state partnerships.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 46,
      "category": "Healthcare",
      "reason": "He conceived and built from scratch the first state-owned Teaching Hospital in Anambra — the Chukwuemeka Odumegwu-Ojukwu Teaching Hospital in Awka.",
      "source": "https://www.legit.ng/nigeria/1498135-18-major-achievements-peter-obi-melt-hearts/"
    },
    {
      "id": 47,
      "category": "Healthcare",
      "reason": "He earned the Golden Jubilee Award from the Catholic Diocese of Onitsha in 2015 for outstanding contributions to quality healthcare delivery in Anambra State.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 48,
      "category": "Security",
      "reason": "His administration provided at least one security patrol vehicle fitted with sophisticated security gadgets to each of all 177 communities in Anambra State, as well as to markets, churches, and registered vigilance groups.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 49,
      "category": "Security",
      "reason": "He provided 250 patrol vehicles in total to security agencies and community vigilance groups across Anambra State, significantly improving grassroots security infrastructure.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 50,
      "category": "Economy and Investment",
      "reason": "Under his administration, SABMiller — the second largest brewery in the world at the time — built a $100 million green-field brewery facility in Onitsha, its first such investment in Nigeria.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 51,
      "category": "Economy and Investment",
      "reason": "Innoson Motor Manufacturing Company — Nigeria's first indigenous automobile manufacturer — was established in Anambra during his tenure, positioning the state as a hub for local manufacturing.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 52,
      "category": "Economy and Investment",
      "reason": "For the first time in Anambra State's history, ambassadors and high commissioners from the United States, United Kingdom, Russia, European Union, South Africa, Belgium, Israel, the Netherlands and Canada visited the state under his leadership. Before his tenure, Anambra was practically blacklisted by the diplomatic community.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 53,
      "category": "Economy and Investment",
      "reason": "Development partners including UNDP, UNICEF, the World Bank, DFID, and the European Union — which had previously avoided Anambra — all began working with the state under his administration.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 54,
      "category": "Economy and Investment",
      "reason": "Anambra was consistently rated one of the best states in Nigeria for development partnership and commitment to good governance reforms during his tenure.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 55,
      "category": "Infrastructure",
      "reason": "He required road contractors to sign maintenance bonds committing them to maintain roads for 5 to 7 years after construction — a policy that incentivised quality work from the start and was essentially unheard of in Nigerian state governance.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 56,
      "category": "Infrastructure",
      "reason": "He built the first state Secretariat Complex to house all State Government Ministries that were previously scattered around Anambra in different locations.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 57,
      "category": "Infrastructure",
      "reason": "His government undertook the first-ever aerial mapping of Awka and produced structure plans for the Awka Capital Territory, Onitsha, and Nnewi — foundational urban planning work that hadn't existed before.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 58,
      "category": "Infrastructure",
      "reason": "He commenced development of the Three Arms Zone in Anambra — comprising the Government House, Legislative Building, and Judiciary Building — giving the state its first proper institutional architectural framework.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 59,
      "category": "Infrastructure",
      "reason": "During his tenure and with his government's support, Anambra State became an oil-producing state for the first time in its history.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 60,
      "category": "Governance Model",
      "reason": "He introduced the Anambra Integrated Development Strategy (ANIDS) — a first-of-its-kind multi-sector development model that aligned state governance with the Millennium Development Goals and impacted virtually every sector of the state.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 61,
      "category": "Governance Model",
      "reason": "He was the first governor in Nigeria to undergo the national State Peer Review Mechanism (SPRM) — a good governance scrutiny initiative run by the Nigerian Governors' Forum in collaboration with DFID — voluntarily subjecting his administration to independent review.",
      "source": "https://dnbstories.com/2022/06/list-of-peter-obis-achievements-in-anambra-as-governor.html"
    },
    {
      "id": 62,
      "category": "Governance Model",
      "reason": "He was recognised as Best Governor by the Millennium Development Goals Office (OSSAP-MDGs) and the UNDP for MDG implementation across Nigeria.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 63,
      "category": "Governance Model",
      "reason": "Despite being the only governor in Nigeria whose political party (APGA) was in power in just one state, he was elected Vice-Chairman of the Nigeria Governors' Forum twice — a measure of the respect he commanded across party lines.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 64,
      "category": "Governance Model",
      "reason": "Despite being the only non-PDP governor in the South-East (a region of 5 states all under PDP), the other four PDP governors elected him as their Chairman for 8 consecutive years instead of the usual one-year rotation.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 65,
      "category": "Governance Model",
      "reason": "He was the first governor in Nigeria to challenge INEC when elections were scheduled in Anambra State while his tenure had not yet expired — and he won, with the already-concluded election cancelled and his tenure preserved.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 66,
      "category": "Governance Model",
      "reason": "He was the first Anambra governor — and one of the very few in all of Nigeria's history — to successfully serve a second term, almost 40 years after the state was created.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 67,
      "category": "Governance Model",
      "reason": "He was the first serving governor to be appointed a Special Adviser to the President of Nigeria while still in office — a recognition of his competence at the federal level.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 68,
      "category": "Governance Model",
      "reason": "He was the first serving governor appointed into the Presidential Economic Management Team — showing that even the federal government recognised him as an economic authority.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 69,
      "category": "Governance Model",
      "reason": "He was among the first governors in Nigeria to be honoured with a National Award (CON) while still in office, in 2011.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 70,
      "category": "Anti-Corruption",
      "reason": "Throughout his time in both business and public service, he maintained a clean record with no verified clashes with anti-corruption agencies or security services over fund misappropriation.",
      "source": "https://globalpeace.org/speaker/mr-peter-gregory-obi/"
    },
    {
      "id": 71,
      "category": "Anti-Corruption",
      "reason": "He cleared over 37 billion Naira in pension debts that the previous Anambra government owed pensioners — ordinary retired workers who had been waiting years for what they were owed.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 72,
      "category": "Anti-Corruption",
      "reason": "He maintained a consistent record of paying workers' salaries on time and paying contractors immediately upon job completion — both practices that are genuinely unusual in Nigerian state governance.",
      "source": "https://blackgeeks.com.ng/5-biggest-achievements-of-peter-obi-as-anambra-state-governor/"
    },
    {
      "id": 73,
      "category": "Anti-Corruption",
      "reason": "He has publicly argued that Nigeria's economic problems stem not just from corruption but from structural dependence on consumption and borrowing rather than production — a sophisticated economic analysis that goes beyond typical political rhetoric.",
      "source": "https://allafrica.com/stories/202601060348.html"
    },
    {
      "id": 74,
      "category": "Anti-Corruption",
      "reason": "Development economist Ifeoma Nwankwo stated publicly: 'You may disagree with Obi politically, but his record is supported by audited figures and verifiable outcomes. That is a matter of public record.'",
      "source": "https://allafrica.com/stories/202601060348.html"
    },
    {
      "id": 75,
      "category": "Anti-Corruption",
      "reason": "Political scientist Dr. Ayo Balogun noted: 'What Obi has demonstrated over the years is ideological consistency centred on prudence, transparency and production-led growth. That is not restlessness; it is continuity.'",
      "source": "https://allafrica.com/stories/202601060348.html"
    },
    {
      "id": 76,
      "category": "Awards and Recognition",
      "reason": "He won the Silverbird Man of the Year award in 2013, shared with Governor Babatunde Fashola of Lagos State — the two most widely acknowledged performing governors in Nigeria at that time.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 77,
      "category": "Awards and Recognition",
      "reason": "He received the Methodist Church of Nigeria's Golden Award on Prudence in 2012 as the Most Financially Prudent Governor in Nigeria.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 78,
      "category": "Awards and Recognition",
      "reason": "He received the Ezeife Leadership Foundation Award for Leadership and Good Governance in 2012 for restoring peace and harmony to Anambra State.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 79,
      "category": "Awards and Recognition",
      "reason": "He won the Business Hallmark Newspaper Man of the Year award in 2012.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 80,
      "category": "Awards and Recognition",
      "reason": "He received the Nigerian Library Association Golden Merit Award in 2014 for remarkable improvement of libraries across Anambra State.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 81,
      "category": "Awards and Recognition",
      "reason": "He was named Champion Newspaper's Most Outstanding Igbo Man of the Decade in 2014.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 82,
      "category": "National Leadership",
      "reason": "He served as Atiku Abubakar's vice-presidential candidate in the 2019 Nigerian presidential election under the PDP, giving him direct national campaign experience and exposure to federal governance issues at the highest level.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 83,
      "category": "National Leadership",
      "reason": "His 2023 presidential campaign under the Labour Party inspired a mass movement of young Nigerians called the 'Obidients' — one of the most significant youth-driven political mobilisations in Nigeria's democratic history.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 84,
      "category": "National Leadership",
      "reason": "He has consistently and publicly argued that Nigeria must move from being a consuming nation to a producing nation — an economic philosophy that addresses the root structural cause of Nigeria's poverty rather than just its symptoms.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 85,
      "category": "National Leadership",
      "reason": "He has called for education funding to meet UNESCO's recommended 26% of the national budget — a concrete, internationally benchmarked commitment rather than a vague promise.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 86,
      "category": "National Leadership",
      "reason": "He publicly criticized the decline of Nigeria's GDP from $500 billion to $200 billion and the fall of per capita income from $3,500 to lower levels, comparing it unfavourably to Indonesia — showing he tracks real economic data and holds leaders accountable to it.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 87,
      "category": "National Leadership",
      "reason": "He has advocated for technical and vocational education to give Nigerian youth employable skills beyond university degrees — acknowledging a structural employment problem most politicians simply ignore.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 88,
      "category": "National Leadership",
      "reason": "He publicly stated to Northern Nigerian leaders that the region must invest in education to tackle poverty — delivering a message that needed to be said even when it wasn't necessarily comfortable.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 89,
      "category": "National Leadership",
      "reason": "He visited correctional centres and pledged to pay NECO exam fees for inmates, demonstrating a belief in rehabilitation and second chances that reflects a mature, humane vision of governance.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 90,
      "category": "Personal Character",
      "reason": "He has no political godfathers to repay — having funded and driven his own political journey — meaning his loyalty, if elected, would belong entirely to the Nigerian people rather than to political benefactors.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 91,
      "category": "Personal Character",
      "reason": "His personal lifestyle has consistently reflected his own message of prudence — he lives modestly, travels economy class, and is known to be accessible in ways that most Nigerian politicians of his stature simply are not.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 92,
      "category": "Personal Character",
      "reason": "He is a Catholic of deep personal faith from a family where values were practically lived — his brother Fabian Obi is an ordained Catholic priest and was appointed acting rector of the Blessed Iwene Tansi Major Seminary in Onitsha in 2020.",
      "source": "https://citizendiaryng.com/peter-obi-biography/"
    },
    {
      "id": 93,
      "category": "Personal Character",
      "reason": "He married Margaret Brownson Obi in 1992 and has maintained a stable, low-profile family life — his personal conduct does not generate the kind of scandals that routinely distract Nigerian politicians from governance.",
      "source": "https://www.nairapen.com/posts/biography-of-peter-obi"
    },
    {
      "id": 94,
      "category": "Personal Character",
      "reason": "He is described by those who know him as a man who entered politics from a position of financial security, not financial need — removing one of the most common motivations for corruption in Nigerian public office.",
      "source": "https://thisdaylive.com/index.php/2022/10/16/thoughts-on-peter-obis-biography"
    },
    {
      "id": 95,
      "category": "Personal Character",
      "reason": "He worked as a trader and businessman in Onitsha and has always identified himself proudly as an 'Onitsha-based trader' — a groundedness that separates him from the political class that is embarrassed by anything that looks like ordinary Nigerian life.",
      "source": "https://thisdaylive.com/index.php/2022/10/16/thoughts-on-peter-obis-biography"
    },
    {
      "id": 96,
      "category": "Transferability to Federal Level",
      "reason": "The same financial discipline that took Anambra from a debt-ridden, chaotic state to the most financially stable in Nigeria is directly transferable to federal governance — and arguably more urgently needed there.",
      "source": "https://www.opinionnigeria.com/why-nigerians-must-trust-peter-obi-for-2027-a-vision-for-prosperity-and-good-governance-by-jeff-okoroafor/"
    },
    {
      "id": 97,
      "category": "Transferability to Federal Level",
      "reason": "He has executive education from Harvard, Oxford, Cambridge, Columbia, London School of Economics, Kellogg and IMD — arguably no Nigerian presidential candidate in history has arrived with equivalent preparation in global finance and management.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 98,
      "category": "Transferability to Federal Level",
      "reason": "He demonstrated at the state level that international investment, diplomatic relations, and development partnerships can be attracted through credibility and good governance alone — without oil windfalls or federal allocation windfalls.",
      "source": "https://www.vanguardngr.com/2018/10/peter-obi-a-complete-profile/"
    },
    {
      "id": 99,
      "category": "Transferability to Federal Level",
      "reason": "He showed that it is possible to govern Nigeria without corruption as the operating system — Anambra's transformation under him is the most documented, independently verified proof of that possibility in recent Nigerian history.",
      "source": "https://allafrica.com/stories/202601060348.html"
    },
    {
      "id": 100,
      "category": "Transferability to Federal Level",
      "reason": "The movement he inspired — the Obidients — was not manufactured by a political machine or fuelled by stomach infrastructure. It was driven by ordinary Nigerians, mostly young people, who read his record and decided it was worth fighting for. That kind of organic public trust is rare, and it is the most honest endorsement any Nigerian politician has received in a very long time.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
{
      "id": 101,
      "category": "Early Life & Character",
      "reason": "Peter Obi's nickname among those who know him is 'Okwute' — meaning 'Rock' in Igbo. It was given to him informally and reflects the consistency and stubbornness with which he has held to his principles across decades of business and politics.",
      "source": "https://catholicmedia.org/profile-peter-obi-fidelity-banks-youngest-chairman-winner-of-several-political-battles/"
    },
    {
      "id": 102,
      "category": "Early Life & Character",
      "reason": "He was born the fourth son of a devout Catholic family whose father, Josephat Obi, owned the popular Ideal Soul Super Market in Onitsha — a family with roots in commerce, hard work, and community standing rather than political inheritance.",
      "source": "https://citizendiaryng.com/peter-obi-biography/"
    },
    {
      "id": 103,
      "category": "Early Life & Character",
      "reason": "Growing up in Onitsha — one of Nigeria's most commercially active cities — gave him firsthand exposure to how markets work, how money moves, and how trade creates or destroys livelihoods. This is not theoretical knowledge. He lived it from childhood.",
      "source": "https://novaline.com.ng/peter-obi-biography/"
    },
    {
      "id": 104,
      "category": "Early Life & Character",
      "reason": "He openly describes himself as having started his working life as a trader — a self-identification that is both accurate and unusual for a Nigerian politician of his stature. Most politicians of his class would prefer titles. He prefers honesty.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 105,
      "category": "Early Life & Character",
      "reason": "His brother, Fabian Obi, is an ordained Catholic priest who was appointed acting rector of the Blessed Iwene Tansi Major Seminary in Onitsha in October 2020 — a family that has produced both a major businessman-politician and a man of the cloth is not a family short on values.",
      "source": "https://citizendiaryng.com/peter-obi-biography/"
    },
    {
      "id": 106,
      "category": "Business Career",
      "reason": "He served as Chairman and Director of Guardian Express Mortgage Bank Ltd and Guardian Express Bank Plc — two separate banking institutions — demonstrating a breadth of financial sector experience that went well beyond any single role.",
      "source": "https://www.nairapen.com/posts/biography-of-peter-obi"
    },
    {
      "id": 107,
      "category": "Business Career",
      "reason": "He served as Chairman of Future View Securities Ltd, Paymaster Nigeria Plc, and as a Director of Chams Nigeria Plc — companies spanning fintech, payments, and securities — giving him experience across the Nigerian financial infrastructure long before he ever held public office.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 108,
      "category": "Business Career",
      "reason": "He was the youngest Chairman of Fidelity Bank Plc — at the time a 25 billion Naira bank — a record that has been confirmed by multiple independent sources including Sahara Reporters, Catholic Media, Business Hallmark, and Simple English Wikipedia.",
      "source": "https://saharareporters.com/2018/10/13/profile-peter-obi-fidelity-banks-youngest-chairman-winner-several-political-battles"
    },
    {
      "id": 109,
      "category": "Business Career",
      "reason": "He served as Chairman of Next International Nigeria Ltd — a company with interests in IT, distribution and international brand management — giving him exposure to technology, supply chains, and international business partnerships that most Nigerian politicians have never encountered.",
      "source": "https://www.nairapen.com/posts/biography-of-peter-obi"
    },
    {
      "id": 110,
      "category": "Business Career",
      "reason": "He secured distribution rights for global brands including Ovaltine and Heinz products through his business activities — meaning he has personally navigated international licensing, brand management, and import logistics in the Nigerian market.",
      "source": "https://aclasses.org/peter-obi-worth/"
    },
    {
      "id": 111,
      "category": "Business Career",
      "reason": "He was a member of the Nigerian Economic Summit Group (NESG) and the British Institute of Directors (IOD) — two of the most credentialed business governance bodies in Nigeria and the UK respectively — before he entered politics.",
      "source": "https://www.clacified.com/lifestyle/peter-obi-net-worth-companies-houses-fidelity-bank"
    },
    {
      "id": 112,
      "category": "Business Career",
      "reason": "He was a member of the Nigerian Chartered Institute of Bankers — a professional certification that requires demonstrated competence in banking practice and ethics, not just seniority.",
      "source": "https://www.clacified.com/lifestyle/peter-obi-net-worth-companies-houses-fidelity-bank"
    },
    {
      "id": 113,
      "category": "Political Integrity",
      "reason": "He was the first gubernatorial candidate in Nigerian history to legally challenge his stolen election victory all the way to its logical conclusion and win — establishing a legal precedent that has been referenced in subsequent electoral disputes across Nigeria.",
      "source": "https://kachiogbonna.com/who-is-this-peter-obi-sef/"
    },
    {
      "id": 114,
      "category": "Political Integrity",
      "reason": "He was the first governor in Nigerian history to legally challenge a wrongful impeachment through the courts and be reinstated — showing that the judiciary could still function as a check on legislative abuse when pushed hard enough.",
      "source": "https://kachiogbonna.com/who-is-this-peter-obi-sef/"
    },
    {
      "id": 115,
      "category": "Political Integrity",
      "reason": "His impeachment in November 2006 was carried out by the Speaker of the Anambra House of Assembly at 5:30am under heavy police presence — an action so procedurally questionable that 23 of the same lawmakers who voted for it later denied being present. He challenged it and won.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 116,
      "category": "Political Integrity",
      "reason": "When Andy Uba was declared governor after the 2007 election — with Obi still legally entitled to complete his first four-year term — Obi went back to court again. The Supreme Court upheld his argument and nullified Uba's election, setting a landmark constitutional precedent on gubernatorial tenures.",
      "source": "https://saharareporters.com/2018/10/13/profile-peter-obi-fidelity-banks-youngest-chairman-winner-several-political-battles"
    },
    {
      "id": 117,
      "category": "Political Integrity",
      "reason": "His 2010 re-election victory came against Professor Charles Soludo — the former Central Bank of Nigeria Governor — one of the most credentialed opponents he could have faced. He won on his record, against a man with national economic credibility.",
      "source": "https://www.nairapen.com/posts/biography-of-peter-obi"
    },
    {
      "id": 118,
      "category": "Political Integrity",
      "reason": "He left office on March 17, 2014 and handed power to Willie Obiano in a peaceful, orderly transition — completing the full constitutional process with no drama, no outgoing interference, and no attempt to influence his successor's administration from behind the scenes.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 119,
      "category": "Governance — Historical Firsts",
      "reason": "His choice of Virginia Etiaba as deputy governor led — indirectly but consequentially — to Nigeria producing its first ever female governor when Etiaba was sworn in following his impeachment in November 2006. No other Nigerian governor's political arrangement has produced a first female governor.",
      "source": "https://businessday.ng/politics/article/meet-virginia-etiaba-nigerias-first-and-only-female-governor/"
    },
    {
      "id": 120,
      "category": "Governance — Historical Firsts",
      "reason": "His government was the first to carry out Poverty Mapping in Nigeria as a guide for targeted poverty-alleviation spending — replacing guesswork with data in a country that has historically allocated poverty funds without knowing where the poor actually are.",
      "source": "https://nnpo.org/about-peter-obi/"
    },
    {
      "id": 121,
      "category": "Governance — Federal Committees",
      "reason": "As governor, he served on the Federal Government Committee on Minimum Wage — meaning he was trusted by the federal government to help negotiate what Nigerian workers should be paid, while simultaneously running one of Nigeria's most financially stable states.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 122,
      "category": "Governance — Federal Committees",
      "reason": "He served on the Federal Government Committee on Negotiation with Labour on Subsidy — one of the most politically explosive economic issues in Nigeria — giving him direct experience with the mechanics of subsidy policy that is directly relevant to Nigeria's current crisis.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 123,
      "category": "Governance — Federal Committees",
      "reason": "He served on the Federal Government Committee on Mass Transit — experience in national transportation policy that is directly relevant to the infrastructure challenges of governing a country of over 200 million people.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 124,
      "category": "Governance — Federal Committees",
      "reason": "He served on the National Economic Council Committee on Accurate Data on Nigeria's Oil Import and Export — a committee whose mandate is to prevent the statistical manipulation that has historically allowed billions of dollars in oil revenue to go unaccounted for.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 125,
      "category": "Governance — Federal Committees",
      "reason": "He served on the National Economic Council Committee on Sharing of MDGs Funds — meaning he oversaw how federal poverty-reduction money was being distributed across states, giving him direct insight into the mechanics of federal-state fiscal relationships.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 126,
      "category": "Governance — Federal Committees",
      "reason": "He served on the Sub-Committee on Needs Analysis of Public Universities in Nigeria — one of the most important education policy bodies in the country — giving him a documented, hands-on understanding of what is actually broken in Nigeria's public university system.",
      "source": "https://blerf.org/index.php/biography/obi-peter-gregory-onwubuasi/"
    },
    {
      "id": 127,
      "category": "Governance — Federal Committees",
      "reason": "He served on the Agricultural Transformation Implementation Council — a body designed to modernise Nigerian agriculture and reduce food import dependency — giving him policy experience in the sector that employs the largest percentage of Nigerians.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 128,
      "category": "Governance — Federal Committees",
      "reason": "He served on the National Economic Council Review Committee on the Power Sector — the single biggest infrastructure challenge facing Nigerian economic development — giving him policy-level experience of Nigeria's electricity crisis that goes well beyond talking points.",
      "source": "https://labourparty.com.ng/peter-gregory-obi/"
    },
    {
      "id": 129,
      "category": "Governance — Transparency",
      "reason": "He renovated Government House at a cost of NGN 43.2 million and the Governor's Lodge at NGN 81 million — against pre-existing inflated appropriations of NGN 298 million and NGN 486 million respectively. He saved the state over NGN 650 million on just two repair jobs. Then he was impeached.",
      "source": "https://www.samuelmarete.com/2023/02/24/the-incredible-candidacy-of-peter-obi/"
    },
    {
      "id": 130,
      "category": "Governance — Transparency",
      "reason": "He conducted local government elections across all 21 LGAs in Anambra State on January 11, 2014 — just two months before leaving office — and personally swore in the newly elected council chairpersons three days later. A claim that he never conducted LG elections has been independently fact-checked and found to be false.",
      "source": "https://factcheck.thecable.ng/fact-check-wike-erred-peter-obi-conducted-lg-election-as-anambra-governor/"
    },
    {
      "id": 131,
      "category": "Governance — Awards",
      "reason": "He received the Thisday Newspaper Most Prudent Governor in Nigeria award in 2009 — recognition from a major national newspaper at the mid-point of his tenure, not in retrospect, confirming the prudence was visible and documented while it was happening.",
      "source": "https://kachiogbonna.com/who-is-this-peter-obi-sef/"
    },
    {
      "id": 132,
      "category": "Governance — Awards",
      "reason": "He received the Outstanding Financial Planner and Manager award from the Church of Nigeria, Anglican Communion in 2012 — a recognition from a Protestant institution for a Catholic governor, which says something about how non-partisan his financial reputation actually was.",
      "source": "https://kachiogbonna.com/who-is-this-peter-obi-sef/"
    },
    {
      "id": 133,
      "category": "Governance — Awards",
      "reason": "He received the Zik Leadership Prize — named after Nigeria's first President, Nnamdi Azikiwe — one of the most historically resonant leadership awards in Nigeria, given to leaders whose work reflects the founding ideals of the Nigerian state.",
      "source": "https://aclasses.org/peter-obi-worth/"
    },
    {
      "id": 134,
      "category": "Post-Governor Period",
      "reason": "After leaving office as governor in 2014, President Goodluck Jonathan appointed him Chairman of the Securities and Exchange Commission (SEC) — Nigeria's apex capital markets regulator — based specifically on his banking and financial sector background, not just his political profile.",
      "source": "https://pmnewsnigeria.com/2015/04/27/why-jonathan-appointed-peter-obi-sec-chairman/"
    },
    {
      "id": 135,
      "category": "Post-Governor Period",
      "reason": "His appointment as SEC Chairman was reported by Business Day, Vanguard, Channels Television, and Business Hallmark — four independent media outlets — all confirming the appointment and its immediate effect, with multiple noting his banking background as the primary qualification.",
      "source": "https://businessday.ng/exclusives/article/president-jonathan-names-peter-obi-as-chairman-of-sec/"
    },
    {
      "id": 136,
      "category": "Post-Governor Period",
      "reason": "He was selected as Atiku Abubakar's vice-presidential running mate in the 2019 Nigerian presidential election — a role that gave him direct exposure to national campaign strategy, policy development at federal scale, and the full machinery of a Nigerian presidential contest.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 137,
      "category": "Post-Governor Period",
      "reason": "He resigned from the PDP ahead of the 2023 presidential election specifically citing massive bribing of delegates and vote buying at the party's presidential primary — a decision that cost him significant political capital but showed he was not willing to participate in a corrupt selection process.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 138,
      "category": "Post-Governor Period",
      "reason": "His comparison to Emmanuel Macron — who won the French presidency from outside the two established parties — was made by political commentators because both men built genuinely cross-party coalitions of voters who were done with the traditional options.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 139,
      "category": "2023 Presidential Campaign",
      "reason": "His 2023 campaign inspired the 'Obidient Movement' — described by the London School of Economics Africa at LSE blog as triggering 'an unprecedented upsurge in voter registration' with nearly 10 million first-time registrants, 84% of whom were under 35 years old.",
      "source": "https://blogs.lse.ac.uk/africaatlse/2023/02/23/the-obidient-movement-will-shape-nigerian-politics-beyond-the-2023-presidential-election/"
    },
    {
      "id": 140,
      "category": "2023 Presidential Campaign",
      "reason": "Volunteer One Million Man Marches for Peter Obi were held in multiple Nigerian cities including Makurdi, Calabar, Lafia, Port Harcourt, Afikpo, Owerri, Enugu, Auchi, Abuja, Kano, Ilorin, Abakaliki and Ibadan — none of them organised or paid for by his official campaign.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 141,
      "category": "2023 Presidential Campaign",
      "reason": "Al Jazeera reported that 'hundreds of thousands' were attending his campaign events, describing it as catching 'the country by surprise' — international media was covering his movement as a genuine political phenomenon, not just domestic Nigerian noise.",
      "source": "https://www.aljazeera.com/features/2023/2/4/nigerias-peter-obi-started-a-movement-can-he-become-president"
    },
    {
      "id": 142,
      "category": "2023 Presidential Campaign",
      "reason": "Activist Aisha Yesufu — who had never publicly endorsed a Nigerian presidential candidate before — endorsed Peter Obi in the 2023 election. When someone who has spent their career criticising politicians endorses a politician, that is worth paying attention to.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 143,
      "category": "2023 Presidential Campaign",
      "reason": "He received 6.1 million votes in the 2023 presidential election — finishing third — and critically won in both Lagos (APC's political home) and Abuja. Winning in the capital city and in his main opponent's stronghold simultaneously is not something that happens to a candidate with no cross-regional appeal.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 144,
      "category": "2023 Presidential Campaign",
      "reason": "Ebenezer Obadare of the Council on Foreign Relations stated: 'Whether he wins the presidency or not, Peter Obi has already changed the course of Nigerian politics for good.' This came from a foreign policy institution, not a domestic partisan source.",
      "source": "https://blogs.lse.ac.uk/africaatlse/2023/02/23/the-obidient-movement-will-shape-nigerian-politics-beyond-the-2023-presidential-election/"
    },
    {
      "id": 145,
      "category": "2023 Presidential Campaign",
      "reason": "His political mantra — 'a new Nigeria is possible' — became a rallying call described by LSE researchers as successfully inspiring 'a generation to be politically conscious', which they called 'a great victory for Nigeria's democracy' regardless of the election outcome.",
      "source": "https://blogs.lse.ac.uk/africaatlse/2023/02/23/the-obidient-movement-will-shape-nigerian-politics-beyond-the-2023-presidential-election/"
    },
    {
      "id": 146,
      "category": "2023 Presidential Campaign",
      "reason": "His campaign was described by Coda Story as a 'gathering threat to Nigeria's political establishment' — international investigative media was watching it closely enough to devote in-depth reporting to the movement and its structural significance.",
      "source": "https://www.codastory.com/disinformation/nigeria-obi-presidential-elections-2023/"
    },
    {
      "id": 147,
      "category": "Post-2023 Period",
      "reason": "He launched 'Operation Rescue Nigeria' in 2026 ahead of the 2027 elections under the ADC platform — signalling that his political engagement is long-term and mission-driven, not a one-election vanity project.",
      "source": "https://www.megastarmagazine.com/politics/peter-obi-officially-launches-operation-rescue-nigeria-ahead-of-the-2027-elections-aligning-the-obidient-movement-with-the-adc-platform/"
    },
    {
      "id": 148,
      "category": "Post-2023 Period",
      "reason": "The Obidient Movement in Abia State organised a One Million Man March to celebrate his 64th birthday in July 2025 — a spontaneous, unsolicited show of public support that no political machine organised. Movements that survive their candidate's electoral defeat are movements built on something real.",
      "source": "https://ikengaonline.com/2025/07/13/obidient-movement-in-abia-plans-one-million-man-march-to-mark-obis-64th-birthday/"
    },
    {
      "id": 149,
      "category": "Post-2023 Period",
      "reason": "He publicly visited the California State University Sacramento in April 2025 and called on Nigeria's federal government to replicate programs for formerly incarcerated people and foster children — a man thinking about social policy with international benchmarks while out of office is a man who has not stopped governing in his head.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
      "id": 150,
      "category": "Post-2023 Period",
      "reason": "He pledged personally to pay NECO exam fees for 148 inmates across all correctional centres in Anambra State during a visit to the Nigerian Correctional Centre in Onitsha — a small, practical, personal act of dignity that costs him real money and earns him no political votes.",
      "source": "https://en.wikipedia.org/wiki/Peter_Obi"
    },
    {
    "id": 160,
    "category": "",
    "reason": "Personally visited and inspected project sites during construction to ensure contractor accountability — an unusual practice for a Nigerian governor.",
    "source": ""
  },
  {
    "id": 161,
    "category": "",
    "reason": "Refused to award contracts to cronies or political loyalists, insisting on competitive and transparent procurement processes.",
    "source": ""
  },
  {
    "id": 162,
    "category": "",
    "reason": "Moved out of the Government House and into a hotel himself rather than spend half a billion naira building a Presidential Lodge for a one-week visit from President Obasanjo.",
    "source": ""
  },
  {
    "id": 163,
    "category": "",
    "reason": "Paid all outstanding contractor debts before leaving office so his successor would inherit a clean financial slate.",
    "source": ""
  },
  {
    "id": 164,
    "category": "",
    "reason": "Established a culture of reading and intellectual engagement in public schools through library development programs.",
    "source": ""
  },
  {
    "id": 165,
    "category": "",
    "reason": "Personally championed the cause of widows and vulnerable citizens within Anambra State through targeted welfare programs.",
    "source": ""
  },
  {
    "id": 166,
    "category": "",
    "reason": "Introduced a performance management system for civil servants that tied promotions to measurable outcomes rather than seniority alone.",
    "source": ""
  },
  {
    "id": 167,
    "category": "",
    "reason": "Engaged youth groups and students directly throughout his tenure, visiting campuses and listening to grievances without the usual layers of protocol.",
    "source": ""
  },
  {
    "id": 168,
    "category": "",
    "reason": "Consistently lived below his political status — flying economy class, staying in modest accommodations, and rejecting the culture of political extravagance.",
    "source": ""
  },
  {
    "id": 169,
    "category": "",
    "reason": "Ensured that WAEC and NECO examination fees were paid for indigent students across Anambra who could not afford them.",
    "source": ""
  },
  {
    "id": 170,
    "category": "",
    "reason": "Championed the rehabilitation of public markets and trading centres in Onitsha and Awka to support small traders and market women.",
    "source": ""
  },
  {
    "id": 171,
    "category": "",
    "reason": "Introduced free medical outreach programs in rural communities that were underserved by existing health infrastructure.",
    "source": ""
  },
  {
    "id": 172,
    "category": "",
    "reason": "Worked to reduce the cost of governance in Anambra by cutting frivolous government expenditures and trimmimg an overly bloated state budget.",
    "source": ""
  },
  {
    "id": 173,
    "category": "",
    "reason": "Promoted the teaching of entrepreneurship and business skills in Anambra secondary schools to prepare students for a productive life beyond certificates.",
    "source": ""
  },
  {
    "id": 174,
    "category": "",
    "reason": "Ensured that government contractors who failed to deliver quality work were held to bond agreements and made to repair or redo poor infrastructure.",
    "source": ""
  },
  {
    "id": 175,
    "category": "",
    "reason": "Implemented a transparent payroll system that eliminated ghost workers from the Anambra State Government payroll.",
    "source": ""
  },
  {
    "id": 176,
    "category": "",
    "reason": "Donated personal funds to the rehabilitation of schools in his community after leaving office, without publicising it as a political act.",
    "source": ""
  },
  {
    "id": 177,
    "category": "",
    "reason": "Regularly engaged with traditional rulers and community leaders across Anambra to resolve disputes and align governance with community priorities.",
    "source": ""
  },
  {
    "id": 178,
    "category": "",
    "reason": "Supported the establishment of agricultural processing zones to add value to farm produce within Anambra rather than exporting raw materials.",
    "source": ""
  },
  {
    "id": 179,
    "category": "",
    "reason": "Actively promoted internally generated revenue by formalising parts of the informal economy, reducing Anambra's dependence on federal allocations.",
    "source": ""
  },
  {
    "id": 180,
    "category": "",
    "reason": "Established skills acquisition centres across Anambra to train unemployed youth in technical and vocational trades.",
    "source": ""
  },
  {
    "id": 181,
    "category": "",
    "reason": "Personally negotiated with international investors to establish businesses in Anambra, presenting the state's data and governance record as its strongest pitch.",
    "source": ""
  },
  {
    "id": 182,
    "category": "",
    "reason": "Facilitated the establishment of cottage industries and small manufacturing businesses in rural Anambra communities.",
    "source": ""
  },
  {
    "id": 183,
    "category": "",
    "reason": "Created a state bursary program that supported bright students from poor families to attend secondary and tertiary education.",
    "source": ""
  },
  {
    "id": 184,
    "category": "",
    "reason": "Worked to reduce maternal mortality in Anambra through targeted funding of midwifery services and rural health outreach.",
    "source": ""
  },
  {
    "id": 185,
    "category": "",
    "reason": "Championed the digitisation of government records in Anambra to improve transparency and reduce the possibility of document manipulation.",
    "source": ""
  },
  {
    "id": 186,
    "category": "",
    "reason": "Helped reconstruct the state radio service and public broadcasting infrastructure that had been looted and burned before his assumption of office.",
    "source": ""
  },
  {
    "id": 187,
    "category": "",
    "reason": "Introduced public accountability forums where citizens could directly question government officials on project delivery.",
    "source": ""
  },
  {
    "id": 188,
    "category": "",
    "reason": "Supported local Anambra artisans and craft makers by creating market linkages and exhibition opportunities.",
    "source": ""
  },
  {
    "id": 189,
    "category": "",
    "reason": "Ensured that water supply infrastructure was repaired and extended to underserved communities across Anambra during his tenure.",
    "source": ""
  },
  {
    "id": 190,
    "category": "",
    "reason": "Provided direct intervention funds to improve the Onitsha Head Bridge and other key transport infrastructure linking Anambra to neighbouring states.",
    "source": ""
  },
  {
    "id": 191,
    "category": "",
    "reason": "Promoted inter-faith harmony in Anambra State by engaging both Christian and traditional institutions in governance consultations.",
    "source": ""
  },
  {
    "id": 192,
    "category": "",
    "reason": "Pledged publicly to pay NECO examination fees for inmates in correctional centres across Anambra, demonstrating a commitment to human dignity even for incarcerated citizens.",
    "source": ""
  },
  {
    "id": 193,
    "category": "",
    "reason": "Pushed for Anambra's inclusion in Nigeria's oil-producing state map, which was eventually achieved during his tenure — unlocking additional revenue for the state.",
    "source": ""
  },
  {
    "id": 194,
    "category": "",
    "reason": "Refused to use state resources to fund his personal political campaigns, drawing a firm line between government funds and party politics.",
    "source": ""
  },
  {
    "id": 195,
    "category": "",
    "reason": "Worked with civil society organisations in Anambra to strengthen community policing and grassroots conflict resolution.",
    "source": ""
  },
  {
    "id": 196,
    "category": "",
    "reason": "Promoted women's participation in governance by ensuring female representation in his appointments and advisory councils.",
    "source": ""
  },
  {
    "id": 197,
    "category": "",
    "reason": "Provided solar energy installations to some rural schools and health centres in Anambra that were off the national electricity grid.",
    "source": ""
  },
  {
    "id": 198,
    "category": "",
    "reason": "Built and renovated police stations across Anambra to improve the operational capacity of law enforcement in the state.",
    "source": ""
  },
  {
    "id": 199,
    "category": "",
    "reason": "Worked to standardise teachers' qualifications and remove unqualified staff from public school payrolls.",
    "source": ""
  },
  {
    "id": 200,
    "category": "",
    "reason": "Supported the formation of a state-level investment promotion agency to attract and retain domestic and foreign investment in Anambra.",
    "source": ""
  },
  {
    "id": 201,
    "category": "",
    "reason": "Improved the conditions of Anambra correctional facilities and advocated for the rights and welfare of awaiting-trial prisoners.",
    "source": ""
  },
  {
    "id": 202,
    "category": "",
    "reason": "Ensured consistent distribution of WAEC and NECO results to schools, which historically had been disrupted by administrative dysfunction.",
    "source": ""
  },
  {
    "id": 203,
    "category": "",
    "reason": "Worked to reduce the influence of secret cults in Anambra schools and tertiary institutions through targeted security and counselling programs.",
    "source": ""
  },
  {
    "id": 204,
    "category": "",
    "reason": "Established scholarship programs to send exceptional Anambra students to study in universities abroad and contribute to the state on their return.",
    "source": ""
  },
  {
    "id": 205,
    "category": "",
    "reason": "Introduced periodic stakeholder summits that brought together business leaders, academics, community heads, and government to assess state governance performance.",
    "source": ""
  },
  {
    "id": 206,
    "category": "",
    "reason": "Fought and won multiple legal battles without abandoning democratic institutions — demonstrating that the courts, when properly engaged, can still deliver justice in Nigeria.",
    "source": ""
  },
  {
    "id": 207,
    "category": "",
    "reason": "After leaving office, continued to speak publicly on Nigerian economic governance, offering detailed data-driven analyses rather than retreating into private life like most former governors.",
    "source": ""
  },
  {
    "id": 208,
    "category": "",
    "reason": "Has consistently refused to endorse or enable the politics of ethnic supremacy, positioning himself as a Nigerian leader first — a stance that cost him some regional support but earned him national credibility.",
    "source": ""
  },
  {
    "id": 209,
    "category": "",
    "reason": "Left office in 2014 with a successor who immediately acknowledged that the financial savings left behind by Peter Obi were being actively used for state development — a legacy confirmed not by Peter Obi himself, but by the man who came after him.",
    "source": ""
  }

];
// ⬆⬆⬆  End of sample — paste your 1000 objects above this line  ⬆⬆⬆

// Derived helpers (no edits needed below)
export const categories = Array.from(
  new Set(reasons.map((r) => r.category))
).sort();

export const getReasonById = (id: number) =>
  reasons.find((r) => r.id === id) ?? null;

export const getReasonByIndex = (index: number) =>
  reasons[((index % reasons.length) + reasons.length) % reasons.length];

export const searchReasons = (query: string, category?: string) => {
  const q = query.toLowerCase();
  return reasons.filter((r) => {
    const matchesQuery =
      !q ||
      r.reason.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    const matchesCategory = !category || r.category === category;
    return matchesQuery && matchesCategory;
  });
};
