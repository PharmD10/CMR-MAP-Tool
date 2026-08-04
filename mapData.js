const mapOutputData = [
  {
    mapCategory: "Vaccines",
    mapCode: "IMZ06066",
    mapDiscuss:
      "Our records show that you are eligible and may be due to receive several vaccines, which will reduce the risk of developing preventable diseases.",
    mapPlan:
      "Schedule online at walgreens.com or walk in to your local Walgreens to receive the following vaccine(s): FLU, COVID-19, RSV, SHINGLES, HEPATITIS B, TETANUS.",
    mapDisplay: false,
    mapOrder: 1
  },
  {
    mapCategory: "BPH",
    mapCode: "BPH06031",
    mapDiscuss:
      "Benign prostatic hyperplasia (BPH) is a condition where the prostate gland is enlarged and can cause urinary symptoms such as frequent urination, weak stream, or difficulty starting urination.",
    mapPlan:
      "Drink less fluids, especially at night. \n Limit caffeine and alcohol. \n Stay active and keep a healthy weight. \n Practice timed and relaxed voiding. \n Eat more vegetables and whole grains; eat less red meat and dairy.",
    mapDisplay: false,
    mapOrder: 2
  },
  {
    mapCategory: "GERD",
    mapCode: "GI06032",
    mapDiscuss:
      "{{PPI}} helps reduce stomach acid production. Long-term PPI use should be reviewed with your doctor.",
    mapPlan:
      "Take your {{PPI}} 30-60 minutes before your first daily meal. \n Talk with your doctor about assessing long-term PPI use. \n Avoid foods and drinks that trigger heartburn like spicy foods, citrus, tomatoes, caffeine, and alcohol. \n Wait at least 2-3 hours after eating to lie down. Elevate the head of your bed if you have nighttime symptoms.",
    mapDisplay: false,
    mapOrder: 3
  },
  {
    mapCategory: "Osteoporosis",
    mapCode: "BONE06031",
    mapDiscuss:
      "GUIDELINE GOALS: •DEXA scan every 1-2 years or as directed. Taking {{BISPHOSPHONATE}}, along with adequate calcium and vitamin D, protects your bones health and reduces your fracture risk.",
    mapPlan:
      "Take your {{BISPHOSPHONATE}} first thing in the morning on an empty stomach with a full glass of plain water. Stay upright for the next 30 minutes, and do not eat, drink anything (except water), or take other medications during this time. \n Get daily calcium and vitamin D through diet or supplements. \n Schedule your DEXA scan every 1-2 years, or as directed. \n Report jaw pain or mouth sores that do not heal. \n Stay active with weight-bearing exercises (eg, walking, light weightlifting).",
    mapDisplay: false,
    mapOrder: 4
  },
  {
    mapCategory: "Gout",
    mapCode: "GOUT06051",
    mapDiscuss:
      "GUIDELINE GOALS: Uric acid: <6 mg/dL. This medication removes/reduces uric acid buildup in the joints, leading to gout flares consisting of sudden and severe pain, swelling, and redness.",
    mapPlan:
      "Get your uric acid and kidney levels checked as advised. \n Avoid alcohol and high-purine foods like shellfish and red meat. \n Drink plenty of water daily. \n Maintain a healthy weight.",
    mapDisplay: false,
    mapOrder: 5
  },
  {
    mapCategory: "Osteoarthritis",
    mapCode: "ARTH06031",
    mapDiscuss:
      "MELOXICAM reduces joint inflammation and pain, which may prevent long-term joint damage.",
    mapPlan:
      "Take MELOXICAM with food to reduce acid reflux. \n Report worsening joint pain, swelling, redness, or new symptoms. \n Maintain joint health with gentle movement and exercise.",
    mapDisplay: false,
    mapOrder: 6
  },
  {
    mapCategory: "Rheumatoid Arthritis",
    mapCode: "",
    mapDiscuss:
      "_RheumArthMed_ reduces joint inflammation, eases joint complication, and prevents long-term joint and potential organ damage.",
    mapPlan:
      "Exercise regularly with walking, swimming, or light strength training. \n Eat more fruits, vegetables, whole grains, nuts, and olive oil; limit sugar, salt, and processed foods.",
    mapDisplay: false,
    mapOrder: 7
  },
  {
    mapCategory: "Hypothyroidism",
    mapCode: "THY06051",
    mapDiscuss:
      "GUIDELINE GOALS: TSH goal: 0.4-4.0 mIU/L. LEVOTHYROXINE replaces thyroid hormone when your thyroid gland does not make enough on its own.",
    mapPlan:
      "Take LEVOTHYROXINE first thing in the morning on an empty stomach with a full glass of plain water. Stay upright for the next 30 minutes, and do not eat, drink anything (except water), or take other medications during this time. \n Do not take antacids, calcium, or iron supplements within 4 hours of taking LEVOTHYROXINE. \n Get your thyroid labs checked as recommended. \n Report fatigue, jitteriness, fast heartbeat, cold or hot intolerance, or significant weight changes.",
    mapDisplay: false,
    mapOrder: 8
  },
  {
    mapCategory: "Asthma",
    mapCode: "RESP06034",
    mapDiscuss:
      "GUIDELINE GOALS: ≤2 days per week of daytime symptoms or rescue inhaler use; no sleep disturbance due to asthma; unrestricted physical activity.",
    mapPlan:
      "Use your UMECLIDINIUM-VILANTEROL inhaler every day as directed. \n Rinse your mouth with water and spit after each dose to prevent thrush. \n Clean your inhaler once a week, and store at room temperature. \n Tell your pharmacist if you are having trouble using your inhaler correctly.\n Exercise regularly and eat more fruits and vegetables.",
    mapDisplay: false,
    mapOrder: 9
  },
  {
    mapCategory: "COPD",
    mapCode: "RESP06033",
    mapDiscuss:
      "GUIDELINE GOALS: symptom control (fewer breathing limitations during daily activities) and reduced number of COPD exacerbations per year. Your _controller_ inhaler improves lung function, reduces COPD symptoms, and reduces exacerbation risk.",
    mapPlan:
      "Use your _controller_ inhaler every day as directed. \n Rinse your mouth with water and spit after each _controller_ dose to prevent thrush. \n Clean your _controller_ inhaler once a week, and store at room temperature. \n Tell your pharmacist if you are having trouble using your inhaler correctly. \n Immediately report any increased shortness of breath, mucus, or frequent rescue inhaler use.",
    mapDisplay: false,
    mapOrder: 10
  },
  {
    mapCategory: "Albuterol (Rescue inhaler)",
    mapCode: "RESP06056",
    mapDiscuss:
      "ALBUTEROL is your rescue inhaler to use only when needed to quickly open your airways when you are short of breath, wheezing, or coughing.",
    mapPlan:
      "If instructed to take 2 puffs, wait 1-2 minutes between puffs to get the most relief. \n Store at room temperature with the mouthpiece down. \n Shake and spray once every few weeks to make sure it is not clogged. \n Report if you need to use ALBUTEROL more than 2 times per week.",
    mapDisplay: false,
    mapOrder: 11
  },
  {
    mapCategory: "Hyperlipidemia",
    mapCode: "LIPID06031",
    mapDiscuss:
      "GUIDELINE GOALS (2026 ACC/AHA): LDL <70 mg/dL and Non-HDL cholesterol <100 mg/dL. {{STATIN}} reduces your cholesterol levels and your risk of heart attack, stroke, and heart disease.",
    mapPlan:
      "Avoid grapefruit juice. \n Get cholesterol and liver tests as advised. \n Report any muscle pain or dark-colored urine. \n Eat more fruits, vegetables, beans, whole grains, and fiber; choose healthy fats like fish, nuts, olive oil, and avocados. \n Exercise ≥150 minutes weekly.",
    mapDisplay: false,
    mapOrder: 12
  },
  {
    mapCategory: "Hypertension",
    mapCode: "HTN06031",
    mapDiscuss:
      "GUIDELINE GOAL: BP <130/80 mmHg. Taking your BP medication(s), making lifestyle changes, and accurately checking your BP allows for greater BP control, which also reduces your risk for developing advanced conditions (eg, heart attack, stroke, kidney failure).",
    mapPlan:
      "Avoid food, caffeine, smoking, and exercise for 30 minutes before checking. \n Sit with your back supported for 5 minutes. Wrap your cuff around your arm, keep feet flat, legs uncrossed, arm at chest level on a table. Do not talk during the reading. \n Keep a blood pressure log for your appointments. \n Follow the DASH diet, reduce daily sodium (<2,300 mg) and alcohol (1-2 drinks), increase weekly exercise (150 min/week), and practice stress management.",
    mapDisplay: false,
    mapOrder: 13
  },
  {
    mapCategory: "Potassium/Kidney Monitoring",
    mapCode: "HTN06041",
    mapDiscuss:
      "RECOMMENDED POTASSIUM LEVELS: 3.5-5.0 mEq/L. {{kSparingMed}} can affect your kidney function and potassium levels.",
    mapPlan:
      "Avoid potassium supplements and NSAIDs unless advised. \n Get your potassium and kidney labs checked as advised. \n Stay well hydrated, especially during hot weather, illness, or if vomiting/having diarrhea.",
    mapDisplay: false,
    mapOrder: 14
  },
  {
    mapCategory: "Diabetes",
    mapCode: "DM06035",
    mapDiscuss:
      "GUIDELINE GOALS (ADA): {{GLYCEMIC_GOAL}}. Diabetes can lead to serious complications if blood sugar remains high, including vision loss, kidney damage, and nerve pain.",
    mapPlan:
      "{{INSULIN_INSTRUCTION}}\nRecord your readings from your {{DEVICE_NAME}} {{DEVICE_TYPE}}. \n Schedule your foot exam, eye exam, and labs (A1c, glucose, kidney function). \n Check if you received your FLU, COVID-19, PNEUMONIA, RSV, and HEPATITIS B vaccines. \n Eat healthy foods; limit added sugars, refined carbs, and processed foods. \n Exercise 150 minutes of moderate physical activity per week. \n Check your feet daily for cuts, blisters, redness, or sores. Wear properly fitting shoes. \n Report symptoms of low blood sugar (shakiness, sweating, confusion) or high blood sugar (excessive thirst, frequent urination, blurred vision).",
    mapDisplay: false,
    mapOrder: 15
  },
  {
    mapCategory: "Anxiety",
    mapCode: "MH06032",
    mapDiscuss: "RECOMMENDED GOAL: GAD-7 score <5.",
    mapPlan:
      "Do not skip or stop your medication, even if you feel better. \n Limit or avoid caffeine and alcohol; these can worsen anxiety. \n Practice deep breathing, mindfulness, regular exercise, and consistent sleep.",
    mapDisplay: false,
    mapOrder: 16
  },
  {
    mapCategory: "Depression",
    mapCode: "MH06033",
    mapDiscuss:
      "RECOMMENDED GOAL: PHQ-9 score: <5. This medicine treats depression by balancing brain chemicals that affect mood. Side effects may include decreased appetite, dry mouth, mild nausea, headache, or drowsiness. This medication may also make it harder for your body to regulate temperature.",
    mapPlan:
      "Do not skip or stop your medication, even if you feel better. \n Drink water, wear lightweight clothing, and take breaks in shade. \n Report worsening depression, behavior, or thoughts of self-harm. \n Limit or avoid alcohol; this can worsen depression and interact with your medications. \n Keep your appointment with your mental health provider. \n Exercise regularly, sleep consistently, and spend time with loved ones.",
    mapDisplay: false,
    mapOrder: 17
  },
  {
    mapCategory: "AFib",
    mapCode: "AFIB06031",
    mapDiscuss:
      "GUIDELINE GOALS:• Resting heart rate (rate control): <80 bpm; blood pressure <130/80 mmHg. AFib is a heart rhythm problem where irregular beating can allow blood to pool and clots to form. If a clot travels to the brain, it can cause a stroke.",
    mapPlan:
      "Do not stop your blood thinner without talking to your doctor — this significantly increases your stroke risk. \n Keep your follow-up appointments with your cardiologist and primary care provider.\n Know the sudden signs of stroke: weakness or numbness on one side, trouble speaking, vision changes, severe headache, dizziness or loss of balance. Call 911 immediately.\n Make lifestyle changes: healthy weight, exercise as directed, quit smoking, reduce or avoid alcohol, and control blood pressure and blood sugar.",
    mapDisplay: false,
    mapOrder: 18
  },
  {
    mapCategory: "Heart Failure",
    mapCode: "HF06035",
    mapDiscuss: "GUIDELINE GOALS: Blood pressure: <130/80 mmHg. Heart failure means your heart is not pumping as efficiently as it should, causing fluid to build up in your body. Missing doses can lead to rapid worsening.",
    mapPlan: "Weigh yourself every morning after using the bathroom and before eating and keep a daily weight log. \n Contact your doctor right away if you gain more than 2 lbs in one day or 5 lbs in one week.\n Speak with your doctor if you notice significantly less urination.\n Call your doctor or go to the ER right away if you experience worsening shortness of breath, increased leg/foot swelling, or unusual fatigue.\n Limit sodium to <2,000 mg/day — avoid canned soups, deli meats, fast food, and salty snacks.\n Limit fluid intake as directed. Avoid NSAIDs — these worsen heart failure and cause fluid retention.\nLimit or avoid alcohol.",
    mapDisplay: false,
    mapOrder: 19
  },
  {
    mapCategory: "Heart Attack",
    mapCode: "",
    mapDiscuss: "It is important to be aware of the common signs of a heart attack. These can include chest pain (discomfort, squeezing, pressure) lasting more than a few minutes, pain in the upper body (arms, back, neck, or jaw), trouble breathing, sudden onset of sweating, lightheadedness, or vomiting.",
    mapPlan: "Speak with your doctor about how long you should be on antiplatelet therapy with ASPIRIN. \n Practice all the components discussed during cardiac rehabiliatation: monitored exercise training; health and nutrition education; psychological support; personalized patient assessment.",
    mapDisplay: false,
    mapOrder: 20
  },
  {
    mapCategory: "DDI: Serotonin Syndrome",
    mapCode: "",
    mapDiscuss: "You take {{SEROSYN_A}} with {{SEROSYN_B}}, which increase serotonin levels in the body. When combined, this can raise the risk of a rare but serious condition called serotonin syndrome.",
    mapPlan: "Do not stop, change, or take any new medications without first checking with your pharmacist or doctor. \n Seek emergency care immediately if you experience: agitation, confusion, rapid heart rate, high blood pressure, dilated pupils, muscle twitching or rigidity, heavy sweating, diarrhea, or fever. Call 911 or go to the nearest ER right away.\n Make sure all of your healthcare providers know about every medication you take.",
    mapDisplay: false,
    mapOrder: 21
  },
  {
    mapCategory: "DDI: Bleeding Risk",
    mapCode: "ANT06053",
    mapDiscuss: "You take {{BLEED_A}} and {{BLEED_B}}, which may increase your risk for bleeding.",
    mapPlan: "Do not start, change, or stop any medications without first checking with your pharmacist. \n Tell all of your healthcare providers and your dentist about all of your medications before any procedure or surgery.\n Watch for signs of unusual bleeding: cuts that take longer to stop, unexplained bruising, pink/dark urine, red/black tarry stools, coughing/vomiting blood, or a severe/unusual headache. If you experience any of these, contact your doctor right away or call 911.",
    mapDisplay: false,
    mapOrder: 22
  },
  {
    mapCategory: "DDI: Clopidogrel w/PPI",
    mapCode: "ANT06053",
    mapDiscuss: "You are taking CLOPIDOGREL with {{PPI}}; which can reduce how well CLOPIDOGREL works to prevent blood clots, potentially increasing your risk of heart attack or stroke.",
    mapPlan: "Do not stop CLOPIDOGREL without talking to your doctor first, as this medication helps prevent heart attacks and stroke. \n Speak with your doctor about whether _PPI_ can be switched to PANTOPRAZOLE, which has the lowest risk of interacting with clopidogrel. \n Contact your doctor right away if you experience chest pain, sudden shortness of breath, or symptoms of a stroke.",
    mapDisplay: false,
    mapOrder: 23
  },
  {
    mapCategory: "DDI: Respiratory Depression",
    mapCode: "DI05041",
    mapDiscuss: "You take {{respDepA}} with {{respDepB}}, which may increase your risk for respiratory depression, which results in slow, shallow breathing. This serious interaction requires caution.",
    mapPlan: "If you or someone around you notices you show respiratory depression, call 911 immediately. \n Take this medicine exactly as directed — do not take more than prescribed. \n Do not drink alcohol. \n Do not drive or operate heavy machinery until you know how these medications affect you.",
    mapDisplay: false,
    mapOrder: 24
  },
  {
    mapCategory: "DDI: CNS Depression",
    mapCode: "DI05041",
    mapDiscuss: "You take {{cnsDepA}} with {{cnsDepB}}, which may increase your risk for CNS depression. This serious interaction requires caution.",
    mapPlan: "Take this medicine exactly as directed — do not take more than prescribed. \n Do not drink alcohol. \n Do not drive or operate heavy machinery until you know how these medications affect you.",
    mapDisplay: false,
    mapOrder: 25
  },
  {
    mapCategory: "Smoking Cessation",
    mapCode: "GEN0001",
    mapDiscuss: "Discussed tobacco use history, health risks, and strategies/resources for smoking cessation.",
    mapPlan: "Set a quit date and share it with family or friends for support.\nConsider over-the-counter Nicotine Replacement Therapy (patches, gum, or lozenges) or discuss prescription options with your doctor.\nCall 1-800-QUIT-NOW for free coaching and resources.",
    mapDisplay: false,
    mapOrder: 100
  }
];
