/* ============================================================
   Survey Data — 25 sections of COACHE-style faculty survey results
   Lakewood University, 2025
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  /* Seeded PRNG for reproducible "random" data */
  var _seed = 42;
  function rand() { _seed = (_seed * 16807 + 0) % 2147483647; return (_seed - 1) / 2147483646; }
  function randBetween(a, b) { return +(a + rand() * (b - a)).toFixed(2); }
  function randInt(a, b) { return Math.floor(a + rand() * (b - a + 1)); }
  function pctSet(n) {
    var parts = []; var rem = 100;
    for (var i = 0; i < n - 1; i++) {
      var v = randInt(5, Math.floor(rem / (n - i)));
      parts.push(v); rem -= v;
    }
    parts.push(rem);
    return parts;
  }
  function likertDist(bias) {
    var b = bias || 0;
    var sa = randInt(10 + b, 25 + b), a = randInt(20 + b, 35 + b);
    var n = randInt(10, 20);
    var rem = 100 - sa - a - n;
    var d = randInt(Math.floor(rem * 0.4), Math.floor(rem * 0.7));
    var sd = rem - d;
    return [sa, a, n, d, sd];
  }

  var LIKERT_LABELS = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
  var LIKERT_COLORS = ['#1b7a3d', '#4caf50', '#9e9e9e', '#ef5350', '#b71c1c'];
  var DEPTS = ['Arts & Humanities', 'Social Sciences', 'Natural Sciences', 'Engineering', 'Business', 'Education', 'Health Sciences', 'Law'];
  var RANKS = ['Full Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct'];

  SR.LIKERT_LABELS = LIKERT_LABELS;
  SR.LIKERT_COLORS = LIKERT_COLORS;
  SR.CHART_COLORS = ['#2c7be5', '#00b8d9', '#00c853', '#ff9100', '#e53e3e', '#7c4dff', '#ff6d00', '#26a69a', '#ab47bc', '#5c6bc0'];

  SR.meta = {
    institution: 'Lakewood University',
    surveyTitle: 'Faculty Climate & Satisfaction Survey',
    surveyYear: 2025,
    previousYear: 2022,
    responseRate: 67,
    totalFaculty: 1842,
    respondents: 1234,
    adminDate: 'March – April 2025',
    peerInstitutions: ['Mapleton State University', 'Crestview College', 'Ridgedale University', 'Pinehurst Institute', 'Brookfield University']
  };

  function deptScores(base, spread) {
    return DEPTS.map(function (d) { return { label: d, value: randBetween(base - spread, base + spread) }; });
  }
  function rankScores(base, spread) {
    return RANKS.map(function (r) { return { label: r, value: randBetween(base - spread, base + spread) }; });
  }
  function trendData(base, years) {
    var pts = [];
    for (var i = 0; i < years.length; i++) {
      base = +(base + randBetween(-0.2, 0.25)).toFixed(2);
      if (base > 5) base = 5;
      if (base < 1) base = 1;
      pts.push({ label: '' + years[i], value: base });
    }
    return pts;
  }
  function likertQuestions(questions, bias) {
    return questions.map(function (q) {
      return { label: q, segments: likertDist(bias || 0) };
    });
  }
  function tableRows(headers, rows) { return { headers: headers, rows: rows }; }

  /* -------------------------------------------------------
     SECTION DEFINITIONS — 25 pages
     ------------------------------------------------------- */
  SR.sections = [
    /* 1 */ {
      id: 'executive-summary',
      title: 'Executive Summary',
      icon: '📊',
      description: 'High-level overview of the 2025 Faculty Climate & Satisfaction Survey results for Lakewood University.',
      kpis: [
        { label: 'Overall Satisfaction', value: '3.82', format: '/5', change: +0.14, benchmark: 3.68 },
        { label: 'Response Rate', value: '67%', change: +5, benchmark: 62 },
        { label: 'Respondents', value: '1,234', change: null },
        { label: 'Recommend LU', value: '74%', change: +3, benchmark: 70 }
      ],
      charts: [
        { type: 'bar', title: 'Satisfaction by Domain', data: [
          { label: 'Teaching', value: 4.01 }, { label: 'Research', value: 3.65 },
          { label: 'Governance', value: 3.22 }, { label: 'Compensation', value: 3.08 },
          { label: 'Culture', value: 3.91 }, { label: 'Facilities', value: 3.74 },
          { label: 'Work-Life', value: 3.55 }, { label: 'DEI', value: 3.48 }
        ]},
        { type: 'donut', title: 'Overall Rating Distribution', data: [
          { label: 'Very Satisfied', value: 28, color: '#1b7a3d' },
          { label: 'Satisfied', value: 34, color: '#4caf50' },
          { label: 'Neutral', value: 18, color: '#9e9e9e' },
          { label: 'Dissatisfied', value: 14, color: '#ef5350' },
          { label: 'Very Dissatisfied', value: 6, color: '#b71c1c' }
        ]}
      ],
      tables: [{
        title: 'Key Metrics Summary',
        headers: ['Domain', '2025 Score', '2022 Score', 'Change', 'Peer Avg'],
        rows: [
          ['Teaching Environment', '4.01', '3.88', '+0.13', '3.82'],
          ['Research Support', '3.65', '3.51', '+0.14', '3.58'],
          ['Governance & Leadership', '3.22', '3.30', '−0.08', '3.35'],
          ['Compensation & Benefits', '3.08', '2.96', '+0.12', '3.15'],
          ['Department Culture', '3.91', '3.78', '+0.13', '3.72'],
          ['Facilities', '3.74', '3.60', '+0.14', '3.65'],
          ['Work-Life Balance', '3.55', '3.40', '+0.15', '3.50'],
          ['DEI', '3.48', '3.35', '+0.13', '3.42']
        ]
      }],
      insights: [
        'Overall satisfaction increased from 3.68 to 3.82, surpassing the peer benchmark of 3.68.',
        'Teaching remains the highest-rated domain; compensation continues as the lowest.',
        'Governance satisfaction dipped slightly, driven by concerns over shared governance processes.',
        'The response rate of 67% exceeds the 60% threshold recommended for reliable survey data.',
        'Year-over-year improvements observed in 7 of 8 major domains.'
      ]
    },

    /* 2 */ {
      id: 'methodology',
      title: 'Methodology & Demographics',
      icon: '🔬',
      description: 'Survey design, administration, and respondent demographics.',
      kpis: [
        { label: 'Survey Items', value: '142', change: null },
        { label: 'Admin Window', value: '6 wks', change: null },
        { label: 'Reminders Sent', value: '3', change: null },
        { label: 'Margin of Error', value: '±2.1%', change: null }
      ],
      charts: [
        { type: 'donut', title: 'Respondents by Rank', data: [
          { label: 'Full Professor', value: 31, color: '#2c7be5' },
          { label: 'Associate', value: 24, color: '#00b8d9' },
          { label: 'Assistant', value: 22, color: '#00c853' },
          { label: 'Lecturer', value: 14, color: '#ff9100' },
          { label: 'Adjunct', value: 9, color: '#7c4dff' }
        ]},
        { type: 'hbar', title: 'Response Rate by Department', data: deptScores(67, 12).map(function(d){ return { label: d.label, value: Math.round(d.value) }; }) }
      ],
      tables: [{
        title: 'Demographic Breakdown',
        headers: ['Characteristic', 'Respondents', '% of Sample', 'University %'],
        rows: [
          ['Tenured', '512', '41.5%', '40.1%'],
          ['Tenure-Track', '298', '24.1%', '23.8%'],
          ['Non-Tenure-Track', '424', '34.4%', '36.1%'],
          ['Female', '586', '47.5%', '46.2%'],
          ['Male', '612', '49.6%', '50.8%'],
          ['Non-Binary / Other', '36', '2.9%', '3.0%'],
          ['URM Faculty', '218', '17.7%', '18.4%'],
          ['International', '164', '13.3%', '14.0%']
        ]
      }],
      insights: [
        'The sample closely mirrors the overall faculty population across all demographic categories.',
        'Non-tenure-track faculty response rate improved by 8 percentage points from 2022.',
        'Response rates were highest in Health Sciences (78%) and lowest in Law (54%).'
      ]
    },

    /* 3 */ {
      id: 'response-rates',
      title: 'Response Rates',
      icon: '📬',
      description: 'Detailed response rate analysis across departments, ranks, and demographics.',
      kpis: [
        { label: 'Overall Rate', value: '67%', change: +5, benchmark: 62 },
        { label: 'Highest Dept', value: '78%', change: null },
        { label: 'Lowest Dept', value: '54%', change: null },
        { label: 'Completion Rate', value: '89%', change: +3 }
      ],
      charts: [
        { type: 'bar', title: 'Response Rate by Department', data: [
          { label: 'Arts & Hum.', value: 65 }, { label: 'Social Sci.', value: 71 },
          { label: 'Natural Sci.', value: 68 }, { label: 'Engineering', value: 62 },
          { label: 'Business', value: 58 }, { label: 'Education', value: 72 },
          { label: 'Health Sci.', value: 78 }, { label: 'Law', value: 54 }
        ]},
        { type: 'line', title: 'Response Rate Trend', data: [
          { label: '2013', value: 51 }, { label: '2016', value: 55 },
          { label: '2019', value: 60 }, { label: '2022', value: 62 },
          { label: '2025', value: 67 }
        ]}
      ],
      tables: [{
        title: 'Response Rate by Rank',
        headers: ['Rank', 'Invited', 'Responded', 'Rate', 'vs 2022'],
        rows: [
          ['Full Professor', '412', '298', '72%', '+4%'],
          ['Associate Professor', '348', '252', '72%', '+6%'],
          ['Assistant Professor', '310', '214', '69%', '+3%'],
          ['Lecturer', '398', '260', '65%', '+7%'],
          ['Adjunct', '374', '210', '56%', '+5%']
        ]
      }],
      insights: [
        'Response rates improved across all ranks and departments compared to 2022.',
        'Targeted outreach to lecturers and adjuncts yielded significant gains (+7% and +5%).',
        'Law school response rates remain below 60%; the dean has committed to focused follow-up for 2028.'
      ]
    },

    /* 4 */ {
      id: 'overall-satisfaction',
      title: 'Overall Satisfaction',
      icon: '⭐',
      description: 'Global satisfaction measures and institution-wide sentiment.',
      kpis: [
        { label: 'Mean Satisfaction', value: '3.82', format: '/5', change: +0.14, benchmark: 3.68 },
        { label: '% Satisfied', value: '62%', change: +4 },
        { label: '% Dissatisfied', value: '20%', change: -3 },
        { label: 'Net Promoter', value: '+38', change: +6 }
      ],
      charts: [
        { type: 'gauge', title: 'Overall Satisfaction Score', data: { value: 3.82, max: 5, thresholds: [2.5, 3.5, 4.2] } },
        { type: 'hbar', title: 'Satisfaction by Department', data: deptScores(3.82, 0.4) }
      ],
      likert: {
        title: 'Overall Satisfaction Items',
        data: likertQuestions([
          'I am satisfied with my position at LU',
          'I would recommend LU to a colleague',
          'I feel valued as a faculty member',
          'LU is a good place to work',
          'I plan to stay at LU for the next 5 years'
        ], 5)
      },
      tables: [{
        title: 'Satisfaction by Rank',
        headers: ['Rank', '2025 Mean', '2022 Mean', 'Change', 'Peer Avg'],
        rows: [
          ['Full Professor', '4.05', '3.91', '+0.14', '3.88'],
          ['Associate Professor', '3.78', '3.62', '+0.16', '3.70'],
          ['Assistant Professor', '3.82', '3.70', '+0.12', '3.64'],
          ['Lecturer', '3.68', '3.55', '+0.13', '3.58'],
          ['Adjunct', '3.41', '3.28', '+0.13', '3.42']
        ]
      }],
      insights: [
        'Overall satisfaction rose to 3.82/5, the highest score recorded since the survey began in 2007.',
        'Full professors report the highest satisfaction; adjuncts the lowest, though their scores also improved.',
        'The Net Promoter Score of +38 indicates strong advocacy, up from +32 in 2022.'
      ]
    },

    /* 5 */ {
      id: 'teaching',
      title: 'Teaching Environment',
      icon: '📚',
      description: 'Faculty perceptions of teaching quality, support, course load, and classroom resources.',
      kpis: [
        { label: 'Teaching Score', value: '4.01', format: '/5', change: +0.13, benchmark: 3.82 },
        { label: 'Course Load Fair', value: '68%', change: +5 },
        { label: 'TA Support', value: '3.45', format: '/5', change: +0.22 },
        { label: 'Class Size OK', value: '71%', change: +4 }
      ],
      charts: [
        { type: 'bar', title: 'Teaching Satisfaction by Department', data: deptScores(4.01, 0.35) },
        { type: 'hbar', title: 'Teaching Satisfaction by Rank', data: rankScores(4.01, 0.3) }
      ],
      likert: {
        title: 'Teaching Environment Items',
        data: likertQuestions([
          'I have appropriate autonomy in designing my courses',
          'Teaching is valued in promotion and tenure decisions',
          'My course load is reasonable',
          'I receive adequate TA/grader support',
          'Classroom technology meets my teaching needs',
          'I have access to useful teaching development resources'
        ], 8)
      },
      tables: [{
        title: 'Course Load by Rank (Average per Year)',
        headers: ['Rank', 'Courses/Yr', 'Prep New', 'Avg Size', 'Satisfaction'],
        rows: [
          ['Full Professor', '3.2', '0.4', '38', '4.18'],
          ['Associate Professor', '4.1', '0.8', '42', '3.95'],
          ['Assistant Professor', '4.4', '1.2', '45', '3.88'],
          ['Lecturer', '6.2', '1.5', '52', '3.72'],
          ['Adjunct', '5.8', '1.8', '48', '3.58']
        ]
      }],
      insights: [
        'Teaching satisfaction remains the highest-rated domain at 4.01/5.',
        'Faculty strongly affirm course design autonomy (82% agree or strongly agree).',
        'TA/grader support showed the largest year-over-year improvement (+0.22).',
        'Lecturers and adjuncts carry notably higher course loads, correlating with lower satisfaction.'
      ]
    },

    /* 6 */ {
      id: 'research',
      title: 'Research Support & Resources',
      icon: '🔬',
      description: 'Assessment of research funding, infrastructure, time allocation, and mentoring.',
      kpis: [
        { label: 'Research Score', value: '3.65', format: '/5', change: +0.14, benchmark: 3.58 },
        { label: 'Funding Access', value: '58%', change: +6 },
        { label: 'Protected Time', value: '3.28', format: '/5', change: +0.10 },
        { label: 'Lab Quality', value: '3.78', format: '/5', change: +0.18 }
      ],
      charts: [
        { type: 'bar', title: 'Research Support by Department', data: deptScores(3.65, 0.45) },
        { type: 'donut', title: 'Research Funding Sources', data: [
          { label: 'Federal Grants', value: 38, color: '#2c7be5' },
          { label: 'Internal Funds', value: 22, color: '#00b8d9' },
          { label: 'Private/Industry', value: 18, color: '#00c853' },
          { label: 'Foundation', value: 14, color: '#ff9100' },
          { label: 'Other', value: 8, color: '#7c4dff' }
        ]}
      ],
      likert: {
        title: 'Research Support Items',
        data: likertQuestions([
          'I have adequate time for research',
          'Institutional funding for research is sufficient',
          'Research infrastructure meets my needs',
          'I receive useful mentoring for grant writing',
          'Sabbatical policies support my research goals'
        ], 2)
      },
      tables: [{
        title: 'Research Metrics by Department',
        headers: ['Department', 'Avg Grants', 'Pub/Faculty', 'Satisfaction', 'Peer Avg'],
        rows: [
          ['Natural Sciences', '2.8', '3.4', '3.92', '3.78'],
          ['Engineering', '2.4', '2.9', '3.85', '3.72'],
          ['Health Sciences', '2.1', '2.7', '3.71', '3.65'],
          ['Social Sciences', '1.6', '2.1', '3.55', '3.48'],
          ['Arts & Humanities', '0.8', '1.5', '3.22', '3.25'],
          ['Business', '1.4', '1.8', '3.58', '3.55'],
          ['Education', '1.2', '1.6', '3.48', '3.42'],
          ['Law', '0.9', '1.4', '3.35', '3.38']
        ]
      }],
      insights: [
        'Research support improved modestly (+0.14) but remains below the teaching satisfaction score.',
        'Access to internal funding saw the biggest improvement, with the Provost\'s seed grant program cited frequently.',
        'Protected research time remains a concern, especially for associate and assistant professors.',
        'Natural Sciences and Engineering report the highest research satisfaction.'
      ]
    },

    /* 7 */ {
      id: 'governance',
      title: 'Governance & Leadership',
      icon: '🏛️',
      description: 'Faculty perceptions of institutional governance, leadership effectiveness, and shared decision-making.',
      kpis: [
        { label: 'Governance Score', value: '3.22', format: '/5', change: -0.08, benchmark: 3.35 },
        { label: 'Voice in Decisions', value: '48%', change: -2 },
        { label: 'Trust in Admin', value: '3.15', format: '/5', change: -0.12 },
        { label: 'Transparency', value: '3.08', format: '/5', change: -0.05 }
      ],
      charts: [
        { type: 'bar', title: 'Governance Satisfaction by Department', data: deptScores(3.22, 0.38) },
        { type: 'line', title: 'Governance Satisfaction Trend', data: trendData(3.45, [2013, 2016, 2019, 2022, 2025]) }
      ],
      likert: {
        title: 'Governance & Leadership Items',
        data: likertQuestions([
          'Faculty have a meaningful voice in institutional decisions',
          'Senior leadership communicates openly and transparently',
          'Shared governance structures function effectively',
          'Department chairs are effective leaders',
          'I trust institutional leadership to act in faculty interests'
        ], -2)
      },
      tables: [{
        title: 'Leadership Effectiveness Ratings',
        headers: ['Level', '2025', '2022', 'Change', 'Peer Avg'],
        rows: [
          ['President/Chancellor', '3.35', '3.42', '−0.07', '3.40'],
          ['Provost', '3.18', '3.28', '−0.10', '3.32'],
          ['Deans', '3.45', '3.40', '+0.05', '3.38'],
          ['Department Chairs', '3.72', '3.65', '+0.07', '3.58'],
          ['Faculty Senate', '3.02', '3.15', '−0.13', '3.20']
        ]
      }],
      insights: [
        'Governance is the only domain to decline year-over-year, driven by perceived reductions in shared governance.',
        'Department chairs received the highest leadership ratings and continued to improve.',
        'Faculty Senate effectiveness declined notably; reform discussions are underway.',
        'Only 48% of faculty feel they have a meaningful voice in institutional decisions.'
      ]
    },

    /* 8 */ {
      id: 'compensation',
      title: 'Compensation & Benefits',
      icon: '💰',
      description: 'Faculty satisfaction with salary, benefits, retirement, and financial support.',
      kpis: [
        { label: 'Compensation Score', value: '3.08', format: '/5', change: +0.12, benchmark: 3.15 },
        { label: 'Salary Fair', value: '42%', change: +4 },
        { label: 'Benefits Score', value: '3.55', format: '/5', change: +0.08 },
        { label: 'Retirement Score', value: '3.62', format: '/5', change: +0.05 }
      ],
      charts: [
        { type: 'hbar', title: 'Salary Satisfaction by Rank', data: rankScores(3.08, 0.4) },
        { type: 'bar', title: 'Benefits Satisfaction Components', data: [
          { label: 'Health Ins.', value: 3.72 }, { label: 'Dental', value: 3.58 },
          { label: 'Retirement', value: 3.62 }, { label: 'Tuition Rem.', value: 3.88 },
          { label: 'Leave Policy', value: 3.45 }, { label: 'Childcare', value: 2.85 }
        ]}
      ],
      likert: {
        title: 'Compensation & Benefits Items',
        data: likertQuestions([
          'My salary is competitive with peer institutions',
          'The benefits package is comprehensive',
          'Merit pay processes are fair and transparent',
          'I am satisfied with retirement plan options',
          'Travel/conference funding is adequate'
        ], -3)
      },
      tables: [{
        title: 'Salary Competitiveness by Rank',
        headers: ['Rank', 'LU Median', 'Peer Median', 'Difference', 'Satisfaction'],
        rows: [
          ['Full Professor', '$128,500', '$132,000', '−2.7%', '3.22'],
          ['Associate Professor', '$95,200', '$97,800', '−2.7%', '3.05'],
          ['Assistant Professor', '$82,400', '$84,100', '−2.0%', '3.12'],
          ['Lecturer', '$62,800', '$64,500', '−2.6%', '2.88'],
          ['Adjunct (per course)', '$4,200', '$4,800', '−12.5%', '2.65']
        ]
      }],
      insights: [
        'Compensation remains the lowest-rated domain, though it improved from 2.96 to 3.08.',
        'Salary competitiveness is the primary concern; LU trails peer medians by 2–3% for full-time ranks.',
        'Adjunct pay is 12.5% below peer median, driving the lowest satisfaction scores.',
        'Tuition remission (3.88) and health insurance (3.72) are the best-rated benefit components.'
      ]
    },

    /* 9 */ {
      id: 'tenure-promotion',
      title: 'Tenure & Promotion',
      icon: '🎯',
      description: 'Clarity, fairness, and transparency of tenure and promotion processes.',
      kpis: [
        { label: 'T&P Score', value: '3.48', format: '/5', change: +0.10, benchmark: 3.42 },
        { label: 'Criteria Clear', value: '61%', change: +5 },
        { label: 'Process Fair', value: '55%', change: +3 },
        { label: 'Mentoring', value: '3.35', format: '/5', change: +0.15 }
      ],
      charts: [
        { type: 'hbar', title: 'T&P Satisfaction by Rank', data: rankScores(3.48, 0.35) },
        { type: 'bar', title: 'T&P Process Components', data: [
          { label: 'Criteria Clarity', value: 3.52 }, { label: 'Timeline', value: 3.68 },
          { label: 'Feedback Quality', value: 3.22 }, { label: 'Mentoring', value: 3.35 },
          { label: 'Equity', value: 3.42 }, { label: 'Documentation', value: 3.58 }
        ]}
      ],
      likert: {
        title: 'Tenure & Promotion Items',
        data: likertQuestions([
          'Tenure criteria are clearly communicated',
          'The promotion process is fair and equitable',
          'I receive adequate feedback on my progress',
          'Senior colleagues mentor junior faculty effectively',
          'Work-life considerations are accommodated in the tenure clock'
        ], 0)
      },
      tables: [{
        title: 'Recent T&P Outcomes',
        headers: ['Year', 'Applied', 'Granted', 'Rate', 'Satisfaction'],
        rows: [
          ['2024-25', '48', '42', '87.5%', '3.55'],
          ['2023-24', '52', '44', '84.6%', '3.42'],
          ['2022-23', '45', '38', '84.4%', '3.38'],
          ['2021-22', '50', '41', '82.0%', '3.32'],
          ['2020-21', '38', '32', '84.2%', '3.28']
        ]
      }],
      insights: [
        'Tenure and promotion satisfaction improved moderately, with clearer criteria cited as a key driver.',
        'Assistant professors report the greatest need for clearer feedback and mentoring.',
        'Tenure success rates have been stable at 82–88% over the past five years.',
        'Work-life accommodations in the tenure clock received mixed reviews (55% agreement).'
      ]
    },

    /* 10 */ {
      id: 'department-culture',
      title: 'Department Culture & Climate',
      icon: '🤝',
      description: 'Collegiality, intellectual vitality, and interpersonal climate within departments.',
      kpis: [
        { label: 'Culture Score', value: '3.91', format: '/5', change: +0.13, benchmark: 3.72 },
        { label: 'Collegiality', value: '78%', change: +4 },
        { label: 'Belonging', value: '72%', change: +5 },
        { label: 'Conflict Low', value: '65%', change: +3 }
      ],
      charts: [
        { type: 'bar', title: 'Culture Score by Department', data: deptScores(3.91, 0.3) },
        { type: 'hbar', title: 'Climate Dimensions', data: [
          { label: 'Collegiality', value: 3.98 }, { label: 'Intellectual Vitality', value: 3.85 },
          { label: 'Sense of Belonging', value: 3.78 }, { label: 'Respect', value: 3.92 },
          { label: 'Collaboration', value: 3.82 }, { label: 'Low Conflict', value: 3.55 }
        ]}
      ],
      likert: {
        title: 'Department Climate Items',
        data: likertQuestions([
          'My department is collegial and supportive',
          'I feel a strong sense of belonging in my department',
          'Intellectual discourse is valued and encouraged',
          'Interpersonal conflicts are handled constructively',
          'New faculty are welcomed and integrated effectively'
        ], 6)
      },
      tables: [{
        title: 'Climate by Department',
        headers: ['Department', 'Collegiality', 'Belonging', 'Vitality', 'Overall'],
        rows: DEPTS.map(function(d) { return [d, randBetween(3.5,4.3).toFixed(2), randBetween(3.4,4.1).toFixed(2), randBetween(3.3,4.0).toFixed(2), randBetween(3.5,4.2).toFixed(2)]; })
      }],
      insights: [
        'Department culture is the second-highest-rated domain at 3.91/5.',
        'Collegiality and respect scores are particularly strong across most departments.',
        'Conflict resolution remains an area for improvement, especially in larger departments.',
        'New faculty integration received notably higher scores than in 2022 (+0.18).'
      ]
    },

    /* 11 */ {
      id: 'mentoring',
      title: 'Mentoring & Professional Development',
      icon: '🌱',
      description: 'Availability and quality of mentoring, professional growth, and career development opportunities.',
      kpis: [
        { label: 'Mentoring Score', value: '3.42', format: '/5', change: +0.18, benchmark: 3.35 },
        { label: 'Has Mentor', value: '58%', change: +8 },
        { label: 'PD Useful', value: '64%', change: +6 },
        { label: 'Career Support', value: '3.38', format: '/5', change: +0.12 }
      ],
      charts: [
        { type: 'bar', title: 'Mentoring Satisfaction by Rank', data: rankScores(3.42, 0.4) },
        { type: 'hbar', title: 'Professional Development Areas', data: [
          { label: 'Teaching Workshops', value: 3.72 }, { label: 'Grant Writing', value: 3.28 },
          { label: 'Leadership Training', value: 3.15 }, { label: 'Tech Training', value: 3.55 },
          { label: 'Conference Support', value: 3.45 }, { label: 'Sabbatical Support', value: 3.38 }
        ]}
      ],
      likert: {
        title: 'Mentoring & PD Items',
        data: likertQuestions([
          'I have access to an effective mentor',
          'Professional development opportunities are relevant to my career',
          'My institution invests in my professional growth',
          'I receive constructive feedback from colleagues',
          'Leadership development programs are accessible'
        ], 0)
      },
      tables: [{
        title: 'Mentoring Participation by Rank',
        headers: ['Rank', 'Has Mentor', 'Formal Program', 'Informal', 'Satisfaction'],
        rows: [
          ['Full Professor', '32%', '8%', '28%', '3.55'],
          ['Associate Professor', '48%', '15%', '38%', '3.42'],
          ['Assistant Professor', '72%', '45%', '52%', '3.48'],
          ['Lecturer', '55%', '22%', '42%', '3.28'],
          ['Adjunct', '28%', '5%', '25%', '2.95']
        ]
      }],
      insights: [
        'Mentoring saw the largest year-over-year improvement of any sub-domain (+0.18).',
        'The new Provost\'s mentoring initiative increased formal mentoring participation by 12 percentage points.',
        'Adjunct faculty remain underserved, with only 28% reporting access to a mentor.',
        'Teaching workshops are the most valued PD offering; leadership training has the most room for growth.'
      ]
    },

    /* 12 */ {
      id: 'work-life',
      title: 'Work-Life Balance',
      icon: '⚖️',
      description: 'Faculty experiences with work-life integration, workload, flexibility, and family support.',
      kpis: [
        { label: 'Work-Life Score', value: '3.55', format: '/5', change: +0.15, benchmark: 3.50 },
        { label: 'Workload Fair', value: '56%', change: +4 },
        { label: 'Flexibility', value: '3.72', format: '/5', change: +0.18 },
        { label: 'Burnout Risk', value: '32%', change: -4 }
      ],
      charts: [
        { type: 'bar', title: 'Work-Life Balance by Department', data: deptScores(3.55, 0.35) },
        { type: 'hbar', title: 'Work-Life Components', data: [
          { label: 'Schedule Flexibility', value: 3.72 }, { label: 'Workload Manageability', value: 3.38 },
          { label: 'Family Support', value: 3.45 }, { label: 'Parental Leave', value: 3.52 },
          { label: 'Childcare Access', value: 2.85 }, { label: 'Elder Care Support', value: 2.68 }
        ]}
      ],
      likert: {
        title: 'Work-Life Balance Items',
        data: likertQuestions([
          'My workload allows for a healthy work-life balance',
          'Flexible work arrangements are supported',
          'Family-friendly policies are adequate',
          'I feel pressure to work beyond reasonable hours',
          'I have experienced burnout in the past year'
        ], 1)
      },
      tables: [{
        title: 'Average Weekly Hours by Rank',
        headers: ['Rank', 'Teaching', 'Research', 'Service', 'Admin', 'Total', 'Satisfaction'],
        rows: [
          ['Full Professor', '12', '18', '8', '6', '44', '3.68'],
          ['Associate Professor', '15', '14', '10', '5', '44', '3.52'],
          ['Assistant Professor', '16', '16', '6', '4', '42', '3.55'],
          ['Lecturer', '24', '4', '6', '4', '38', '3.42'],
          ['Adjunct', '20', '2', '2', '1', '25', '3.38']
        ]
      }],
      insights: [
        'Work-life balance improved across all ranks, aided by post-pandemic flexibility policies.',
        'Childcare and elder care support remain significant pain points (scores below 3.0).',
        'Burnout risk decreased from 36% to 32%, but remains elevated among assistant professors (38%).',
        'Schedule flexibility received the strongest scores in this domain.'
      ]
    },

    /* 13 */ {
      id: 'facilities',
      title: 'Facilities & Infrastructure',
      icon: '🏫',
      description: 'Quality of office space, laboratories, classrooms, and campus infrastructure.',
      kpis: [
        { label: 'Facilities Score', value: '3.74', format: '/5', change: +0.14, benchmark: 3.65 },
        { label: 'Office Quality', value: '3.68', format: '/5', change: +0.12 },
        { label: 'Lab Quality', value: '3.82', format: '/5', change: +0.18 },
        { label: 'Classroom Tech', value: '3.72', format: '/5', change: +0.22 }
      ],
      charts: [
        { type: 'bar', title: 'Facilities Satisfaction by Department', data: deptScores(3.74, 0.35) },
        { type: 'hbar', title: 'Facility Components', data: [
          { label: 'Office Space', value: 3.68 }, { label: 'Labs', value: 3.82 },
          { label: 'Classrooms', value: 3.72 }, { label: 'Library', value: 4.05 },
          { label: 'IT Infrastructure', value: 3.58 }, { label: 'Parking', value: 2.92 }
        ]}
      ],
      tables: [{
        title: 'Facility Ratings Detail',
        headers: ['Facility', '2025', '2022', 'Change', 'Priority Rank'],
        rows: [
          ['Library Resources', '4.05', '3.92', '+0.13', '6'],
          ['Laboratory Equipment', '3.82', '3.64', '+0.18', '3'],
          ['Classroom Technology', '3.72', '3.50', '+0.22', '2'],
          ['Office Space', '3.68', '3.56', '+0.12', '4'],
          ['IT Infrastructure', '3.58', '3.42', '+0.16', '1'],
          ['Parking & Transit', '2.92', '2.85', '+0.07', '5']
        ]
      }],
      insights: [
        'Classroom technology saw the largest improvement (+0.22) following the AV upgrade initiative.',
        'Library resources are the highest-rated facility component at 4.05/5.',
        'Parking remains the lowest-rated infrastructure element; a new garage is planned for 2027.',
        'STEM facilities benefited most from the 2023 capital campaign investments.'
      ]
    },

    /* 14 */ {
      id: 'dei',
      title: 'Diversity, Equity & Inclusion',
      icon: '🌍',
      description: 'Faculty perceptions of DEI climate, inclusive practices, and equity in policies and procedures.',
      kpis: [
        { label: 'DEI Score', value: '3.48', format: '/5', change: +0.13, benchmark: 3.42 },
        { label: 'Inclusive Climate', value: '65%', change: +4 },
        { label: 'Equity in T&P', value: '58%', change: +3 },
        { label: 'URM Satisfaction', value: '3.22', format: '/5', change: +0.15 }
      ],
      charts: [
        { type: 'bar', title: 'DEI Score by Department', data: deptScores(3.48, 0.4) },
        { type: 'hbar', title: 'DEI Components', data: [
          { label: 'Inclusive Climate', value: 3.55 }, { label: 'Equitable Policies', value: 3.42 },
          { label: 'Diverse Hiring', value: 3.38 }, { label: 'Cultural Competency', value: 3.52 },
          { label: 'Bias Reporting', value: 3.22 }, { label: 'Accessibility', value: 3.48 }
        ]}
      ],
      likert: {
        title: 'DEI Climate Items',
        data: likertQuestions([
          'My department values diversity and inclusion',
          'Faculty from underrepresented groups are treated equitably',
          'DEI training is effective and well-received',
          'Hiring practices promote diversity',
          'I can report bias or discrimination without fear of retaliation'
        ], 1)
      },
      tables: [{
        title: 'Satisfaction by Demographic Group',
        headers: ['Group', 'Overall', 'DEI Climate', 'Equity', 'Belonging'],
        rows: [
          ['White Faculty', '3.88', '3.62', '3.55', '3.82'],
          ['URM Faculty', '3.52', '3.22', '3.15', '3.35'],
          ['International', '3.72', '3.45', '3.38', '3.58'],
          ['Female', '3.75', '3.42', '3.32', '3.68'],
          ['Male', '3.88', '3.58', '3.52', '3.82'],
          ['Non-Binary', '3.55', '3.28', '3.18', '3.42']
        ]
      }],
      insights: [
        'DEI scores improved but gaps persist between majority and underrepresented groups.',
        'URM faculty satisfaction trails overall satisfaction by 0.30 points.',
        'Bias reporting mechanisms need strengthening; only 58% feel safe reporting.',
        'The new DEI strategic plan launched in 2024 shows early positive impacts.'
      ]
    },

    /* 15 */ {
      id: 'engagement',
      title: 'Faculty Engagement',
      icon: '🔥',
      description: 'Measures of faculty engagement, motivation, institutional commitment, and professional energy.',
      kpis: [
        { label: 'Engagement Score', value: '3.72', format: '/5', change: +0.10, benchmark: 3.62 },
        { label: 'Highly Engaged', value: '45%', change: +4 },
        { label: 'Intent to Stay', value: '78%', change: +3 },
        { label: 'Job Enthusiasm', value: '3.82', format: '/5', change: +0.08 }
      ],
      charts: [
        { type: 'donut', title: 'Engagement Levels', data: [
          { label: 'Highly Engaged', value: 45, color: '#1b7a3d' },
          { label: 'Moderately Engaged', value: 32, color: '#4caf50' },
          { label: 'Somewhat Engaged', value: 15, color: '#ff9100' },
          { label: 'Disengaged', value: 8, color: '#e53e3e' }
        ]},
        { type: 'bar', title: 'Engagement by Department', data: deptScores(3.72, 0.3) }
      ],
      tables: [{
        title: 'Engagement Drivers (Ranked by Impact)',
        headers: ['Driver', 'Importance', 'Satisfaction', 'Gap', 'Priority'],
        rows: [
          ['Sense of Purpose', '4.52', '3.95', '0.57', 'Medium'],
          ['Collegial Environment', '4.38', '3.91', '0.47', 'Low'],
          ['Research Autonomy', '4.45', '3.72', '0.73', 'High'],
          ['Compensation Fairness', '4.42', '3.08', '1.34', 'Critical'],
          ['Voice in Governance', '4.15', '3.22', '0.93', 'High'],
          ['Career Growth', '4.28', '3.42', '0.86', 'High'],
          ['Work-Life Balance', '4.35', '3.55', '0.80', 'High']
        ]
      }],
      insights: [
        '77% of faculty are moderately to highly engaged, up from 73% in 2022.',
        'Compensation fairness has the largest importance-satisfaction gap (1.34 points).',
        'Intent to stay at LU is strong at 78%, a positive retention indicator.',
        'Engagement is highest among full professors and lowest among adjuncts.'
      ]
    },

    /* 16 */ {
      id: 'students',
      title: 'Student Interaction',
      icon: '👨‍🎓',
      description: 'Faculty satisfaction with student quality, advising load, and student engagement.',
      kpis: [
        { label: 'Student Score', value: '3.78', format: '/5', change: +0.08, benchmark: 3.68 },
        { label: 'Student Quality', value: '3.65', format: '/5', change: +0.05 },
        { label: 'Advising Load OK', value: '55%', change: +3 },
        { label: 'Student Engaged', value: '62%', change: +4 }
      ],
      charts: [
        { type: 'bar', title: 'Student Interaction by Department', data: deptScores(3.78, 0.32) },
        { type: 'hbar', title: 'Student Interaction Components', data: [
          { label: 'Student Preparedness', value: 3.52 }, { label: 'Classroom Engagement', value: 3.72 },
          { label: 'Advising Quality', value: 3.68 }, { label: 'Research Collaboration', value: 3.42 },
          { label: 'Mentoring Students', value: 3.85 }, { label: 'Advising Load', value: 3.22 }
        ]}
      ],
      tables: [{
        title: 'Advising Load by Rank',
        headers: ['Rank', 'Advisees', 'Hours/Wk', 'Satisfaction', 'vs 2022'],
        rows: [
          ['Full Professor', '8', '3.2', '3.82', '+0.08'],
          ['Associate Professor', '14', '4.5', '3.65', '+0.10'],
          ['Assistant Professor', '12', '4.0', '3.72', '+0.05'],
          ['Lecturer', '18', '5.2', '3.42', '+0.12'],
          ['Adjunct', '4', '1.5', '3.55', '+0.04']
        ]
      }],
      insights: [
        'Faculty-student mentoring scored highest in this domain at 3.85/5.',
        'Advising load concerns are most acute among lecturers, who average 18 advisees.',
        'Student preparedness scores remain moderate, with STEM departments reporting lowest ratings.',
        'Classroom engagement improved, attributed to active learning pedagogies.'
      ]
    },

    /* 17 */ {
      id: 'interdisciplinary',
      title: 'Interdisciplinary Collaboration',
      icon: '🔗',
      description: 'Opportunities and barriers for cross-departmental and interdisciplinary work.',
      kpis: [
        { label: 'Collab Score', value: '3.38', format: '/5', change: +0.12, benchmark: 3.30 },
        { label: 'Cross-Dept Work', value: '42%', change: +6 },
        { label: 'Joint Grants', value: '28%', change: +5 },
        { label: 'Barriers', value: '3.15', format: '/5', change: +0.08 }
      ],
      charts: [
        { type: 'bar', title: 'Collaboration Score by Department', data: deptScores(3.38, 0.35) },
        { type: 'hbar', title: 'Collaboration Barriers', data: [
          { label: 'Time Constraints', value: 4.12 }, { label: 'Funding Structure', value: 3.85 },
          { label: 'Geographic Distance', value: 3.42 }, { label: 'Cultural Differences', value: 3.18 },
          { label: 'Admin Obstacles', value: 3.55 }, { label: 'Credit/Recognition', value: 3.72 }
        ]}
      ],
      tables: [{
        title: 'Interdisciplinary Activity',
        headers: ['Metric', '2025', '2022', 'Change'],
        rows: [
          ['Joint Publications', '186', '152', '+22%'],
          ['Cross-Dept Grants', '42', '31', '+35%'],
          ['Shared Courses', '28', '22', '+27%'],
          ['Joint Appointments', '18', '14', '+29%'],
          ['Research Centers', '12', '10', '+20%']
        ]
      }],
      insights: [
        'Cross-departmental collaboration increased significantly, with joint grants up 35%.',
        'Time constraints and funding structures remain the top barriers to collaboration.',
        'The Interdisciplinary Research Fund launched in 2024 helped catalyze 15 new partnerships.',
        'Natural Sciences and Engineering report the highest collaboration rates.'
      ]
    },

    /* 18 */ {
      id: 'technology',
      title: 'Technology & Digital Resources',
      icon: '💻',
      description: 'Faculty satisfaction with educational technology, IT support, and digital infrastructure.',
      kpis: [
        { label: 'Tech Score', value: '3.62', format: '/5', change: +0.20, benchmark: 3.55 },
        { label: 'LMS Satisfaction', value: '72%', change: +8 },
        { label: 'IT Support', value: '3.55', format: '/5', change: +0.15 },
        { label: 'Remote Tools', value: '3.78', format: '/5', change: +0.25 }
      ],
      charts: [
        { type: 'bar', title: 'Technology Satisfaction by Department', data: deptScores(3.62, 0.32) },
        { type: 'hbar', title: 'Technology Components', data: [
          { label: 'Learning Management System', value: 3.72 }, { label: 'Video Conferencing', value: 3.82 },
          { label: 'Research Computing', value: 3.48 }, { label: 'IT Help Desk', value: 3.55 },
          { label: 'Cybersecurity', value: 3.42 }, { label: 'AI/ML Tools', value: 3.28 }
        ]}
      ],
      tables: [{
        title: 'Technology Adoption Rates',
        headers: ['Technology', 'Users', 'Satisfaction', 'Training Need'],
        rows: [
          ['LMS (Canvas)', '92%', '3.72', 'Low'],
          ['Video Conferencing', '88%', '3.82', 'Low'],
          ['Research Computing', '45%', '3.48', 'Medium'],
          ['AI/ML Tools', '32%', '3.28', 'High'],
          ['Data Visualization', '38%', '3.42', 'High'],
          ['Digital Assessment', '62%', '3.58', 'Medium']
        ]
      }],
      insights: [
        'Technology satisfaction saw the second-largest improvement (+0.20), driven by pandemic-era investments.',
        'AI/ML tools have low adoption (32%) but high training demand, presenting a growth opportunity.',
        'Video conferencing satisfaction is strong at 3.82, reflecting institutional commitment to hybrid work.',
        'Research computing needs vary dramatically by discipline.'
      ]
    },

    /* 19 */ {
      id: 'admin-support',
      title: 'Administrative Support',
      icon: '📋',
      description: 'Quality and responsiveness of administrative and staff support for faculty.',
      kpis: [
        { label: 'Admin Score', value: '3.45', format: '/5', change: +0.08, benchmark: 3.40 },
        { label: 'Staff Helpful', value: '72%', change: +3 },
        { label: 'Processes Clear', value: '55%', change: +4 },
        { label: 'Bureaucracy Low', value: '38%', change: +2 }
      ],
      charts: [
        { type: 'bar', title: 'Admin Support by Department', data: deptScores(3.45, 0.35) },
        { type: 'hbar', title: 'Administrative Functions', data: [
          { label: 'Dept Staff Support', value: 3.72 }, { label: 'HR Services', value: 3.28 },
          { label: 'Grant Administration', value: 3.35 }, { label: 'Purchasing', value: 3.15 },
          { label: 'Travel Reimbursement', value: 2.95 }, { label: 'Event Planning', value: 3.55 }
        ]}
      ],
      tables: [{
        title: 'Administrative Process Ratings',
        headers: ['Process', 'Ease of Use', 'Timeliness', 'Satisfaction'],
        rows: [
          ['Course Scheduling', '3.52', '3.48', '3.50'],
          ['Expense Reports', '2.85', '2.72', '2.78'],
          ['Grant Submission', '3.28', '3.32', '3.30'],
          ['HR/Benefits Inquiries', '3.35', '3.22', '3.28'],
          ['Space Requests', '3.12', '2.95', '3.02'],
          ['IT Support Tickets', '3.62', '3.55', '3.58']
        ]
      }],
      insights: [
        'Department-level staff support is strong (3.72), but central administrative processes lag behind.',
        'Travel reimbursement and expense reporting are the lowest-rated administrative functions.',
        'IT support tickets receive the fastest and most satisfactory resolution.',
        '62% of faculty feel administrative burden has increased over the past three years.'
      ]
    },

    /* 20 */ {
      id: 'communication',
      title: 'Communication & Transparency',
      icon: '📢',
      description: 'Institutional communication effectiveness, transparency, and information flow.',
      kpis: [
        { label: 'Communication Score', value: '3.28', format: '/5', change: +0.05, benchmark: 3.32 },
        { label: 'Well Informed', value: '52%', change: +3 },
        { label: 'Transparency', value: '3.08', format: '/5', change: -0.02 },
        { label: 'Feedback Loop', value: '3.15', format: '/5', change: +0.08 }
      ],
      charts: [
        { type: 'bar', title: 'Communication Score by Department', data: deptScores(3.28, 0.35) },
        { type: 'hbar', title: 'Communication Channels', data: [
          { label: 'Email Updates', value: 3.52 }, { label: 'Town Halls', value: 3.28 },
          { label: 'Website/Intranet', value: 3.15 }, { label: 'Dept Meetings', value: 3.72 },
          { label: 'Social Media', value: 2.85 }, { label: 'Newsletter', value: 3.42 }
        ]}
      ],
      likert: {
        title: 'Communication & Transparency Items',
        data: likertQuestions([
          'Institutional decisions are communicated clearly',
          'Budget and financial information is shared transparently',
          'Faculty input is sought before major decisions',
          'Communication from leadership is timely',
          'I know where to find important institutional information'
        ], -2)
      },
      tables: [{
        title: 'Communication Effectiveness by Level',
        headers: ['Level', 'Clarity', 'Timeliness', 'Transparency', 'Overall'],
        rows: [
          ['President\'s Office', '3.28', '3.15', '3.02', '3.15'],
          ['Provost', '3.22', '3.18', '3.08', '3.16'],
          ['Dean\'s Office', '3.52', '3.45', '3.38', '3.45'],
          ['Department', '3.82', '3.78', '3.72', '3.77'],
          ['Faculty Senate', '3.12', '3.05', '2.95', '3.04']
        ]
      }],
      insights: [
        'Department-level communication is strong; institutional-level transparency needs improvement.',
        'Budget transparency is the weakest communication area, a recurring theme in open-ended responses.',
        'Faculty Senate communication effectiveness declined, correlating with governance concerns.',
        'Department meetings are the most effective communication channel (3.72).'
      ]
    },

    /* 21 */ {
      id: 'peer-comparison',
      title: 'Peer Comparison & Benchmarking',
      icon: '📈',
      description: 'How Lakewood University compares to peer institutions across key metrics.',
      kpis: [
        { label: 'Above Peer Avg', value: '6 of 8', change: null },
        { label: 'Strongest Gap', value: 'Culture +0.19', change: null },
        { label: 'Weakest Gap', value: 'Governance −0.13', change: null },
        { label: 'Overall vs Peers', value: '+0.14', change: null }
      ],
      charts: [
        { type: 'bar', title: 'Lakewood vs Peer Average', grouped: true, data: [
          { label: 'Teaching', value: 4.01, peer: 3.82 },
          { label: 'Research', value: 3.65, peer: 3.58 },
          { label: 'Governance', value: 3.22, peer: 3.35 },
          { label: 'Compensation', value: 3.08, peer: 3.15 },
          { label: 'Culture', value: 3.91, peer: 3.72 },
          { label: 'Facilities', value: 3.74, peer: 3.65 },
          { label: 'Work-Life', value: 3.55, peer: 3.50 },
          { label: 'DEI', value: 3.48, peer: 3.42 }
        ]},
        { type: 'hbar', title: 'Gap Analysis (LU − Peer Avg)', data: [
          { label: 'Teaching', value: 0.19 }, { label: 'Culture', value: 0.19 },
          { label: 'Facilities', value: 0.09 }, { label: 'Research', value: 0.07 },
          { label: 'DEI', value: 0.06 }, { label: 'Work-Life', value: 0.05 },
          { label: 'Compensation', value: -0.07 }, { label: 'Governance', value: -0.13 }
        ]}
      ],
      tables: [{
        title: 'Detailed Peer Comparison',
        headers: ['Domain', 'LU 2025', 'Peer Avg', 'Gap', 'Percentile'],
        rows: [
          ['Teaching Environment', '4.01', '3.82', '+0.19', '78th'],
          ['Research Support', '3.65', '3.58', '+0.07', '58th'],
          ['Governance', '3.22', '3.35', '−0.13', '35th'],
          ['Compensation', '3.08', '3.15', '−0.07', '42nd'],
          ['Department Culture', '3.91', '3.72', '+0.19', '82nd'],
          ['Facilities', '3.74', '3.65', '+0.09', '62nd'],
          ['Work-Life Balance', '3.55', '3.50', '+0.05', '55th'],
          ['DEI', '3.48', '3.42', '+0.06', '56th']
        ]
      }],
      insights: [
        'Lakewood exceeds peer averages in 6 of 8 domains, with Teaching and Culture as standout strengths.',
        'Governance and Compensation are the two areas where LU falls below peer benchmarks.',
        'LU ranks in the 82nd percentile for Department Culture — a significant competitive advantage.',
        'The overall satisfaction score of 3.82 places LU in the 72nd percentile among peers.'
      ]
    },

    /* 22 */ {
      id: 'trends',
      title: 'Trends Over Time',
      icon: '📉',
      description: 'Longitudinal analysis of survey results across the 2013–2025 administration cycles.',
      kpis: [
        { label: '5-Cycle Trend', value: 'Improving', change: null },
        { label: 'Avg Annual Gain', value: '+0.04/yr', change: null },
        { label: 'Most Improved', value: 'Technology', change: null },
        { label: 'Most Stable', value: 'Teaching', change: null }
      ],
      charts: [
        { type: 'line', title: 'Overall Satisfaction Trend', data: [
          { label: '2013', value: 3.42 }, { label: '2016', value: 3.51 },
          { label: '2019', value: 3.62 }, { label: '2022', value: 3.68 },
          { label: '2025', value: 3.82 }
        ]},
        { type: 'line', title: 'Domain Trends', multiline: true, series: [
          { name: 'Teaching', color: '#2c7be5', data: [
            { label: '2013', value: 3.72 }, { label: '2016', value: 3.78 },
            { label: '2019', value: 3.85 }, { label: '2022', value: 3.88 }, { label: '2025', value: 4.01 }
          ]},
          { name: 'Research', color: '#00b8d9', data: [
            { label: '2013', value: 3.28 }, { label: '2016', value: 3.35 },
            { label: '2019', value: 3.45 }, { label: '2022', value: 3.51 }, { label: '2025', value: 3.65 }
          ]},
          { name: 'Governance', color: '#e53e3e', data: [
            { label: '2013', value: 3.45 }, { label: '2016', value: 3.42 },
            { label: '2019', value: 3.38 }, { label: '2022', value: 3.30 }, { label: '2025', value: 3.22 }
          ]},
          { name: 'Compensation', color: '#ff9100', data: [
            { label: '2013', value: 2.78 }, { label: '2016', value: 2.82 },
            { label: '2019', value: 2.88 }, { label: '2022', value: 2.96 }, { label: '2025', value: 3.08 }
          ]}
        ]}
      ],
      tables: [{
        title: 'Score History by Domain',
        headers: ['Domain', '2013', '2016', '2019', '2022', '2025', 'Total Δ'],
        rows: [
          ['Overall', '3.42', '3.51', '3.62', '3.68', '3.82', '+0.40'],
          ['Teaching', '3.72', '3.78', '3.85', '3.88', '4.01', '+0.29'],
          ['Research', '3.28', '3.35', '3.45', '3.51', '3.65', '+0.37'],
          ['Governance', '3.45', '3.42', '3.38', '3.30', '3.22', '−0.23'],
          ['Compensation', '2.78', '2.82', '2.88', '2.96', '3.08', '+0.30'],
          ['Culture', '3.52', '3.60', '3.68', '3.78', '3.91', '+0.39'],
          ['Facilities', '3.32', '3.40', '3.48', '3.60', '3.74', '+0.42'],
          ['Work-Life', '3.18', '3.25', '3.32', '3.40', '3.55', '+0.37']
        ]
      }],
      insights: [
        'Overall satisfaction has improved by 0.40 points over the 12-year survey history.',
        'Governance is the only domain with a sustained downward trend (−0.23 total).',
        'Facilities showed the greatest total improvement (+0.42), reflecting capital investments.',
        'The pace of improvement accelerated in the 2022–2025 cycle.'
      ]
    },

    /* 23 */ {
      id: 'open-ended',
      title: 'Open-Ended Response Themes',
      icon: '💬',
      description: 'Qualitative analysis of free-text responses, coded by theme and sentiment.',
      kpis: [
        { label: 'Comments Received', value: '2,847', change: null },
        { label: 'Response Rate', value: '72%', change: +5 },
        { label: 'Themes Identified', value: '18', change: null },
        { label: '% Positive', value: '54%', change: +3 }
      ],
      charts: [
        { type: 'hbar', title: 'Most Frequent Themes', data: [
          { label: 'Compensation Concerns', value: 342 }, { label: 'Governance Issues', value: 298 },
          { label: 'Teaching Support Praise', value: 275 }, { label: 'Work-Life Balance', value: 248 },
          { label: 'DEI Efforts', value: 215 }, { label: 'Facility Improvements', value: 198 },
          { label: 'Administrative Burden', value: 185 }, { label: 'Technology Needs', value: 168 }
        ]},
        { type: 'donut', title: 'Overall Sentiment', data: [
          { label: 'Positive', value: 54, color: '#4caf50' },
          { label: 'Neutral', value: 22, color: '#9e9e9e' },
          { label: 'Negative', value: 24, color: '#e53e3e' }
        ]}
      ],
      tables: [{
        title: 'Top Themes with Example Quotes',
        headers: ['Theme', 'Count', 'Sentiment', 'Representative Quote'],
        rows: [
          ['Compensation', '342', 'Negative', '"Salaries have not kept pace with cost of living…"'],
          ['Governance', '298', 'Negative', '"Faculty Senate feels disconnected from real decisions…"'],
          ['Teaching Support', '275', 'Positive', '"The teaching center has been transformative…"'],
          ['Work-Life Balance', '248', 'Mixed', '"Flexibility improved but workload remains high…"'],
          ['DEI Climate', '215', 'Mixed', '"Progress is visible but there is still much work to do…"'],
          ['Facilities', '198', 'Positive', '"New lab equipment has been a game-changer…"']
        ]
      }],
      insights: [
        'Compensation and governance dominate negative themes, consistent with quantitative findings.',
        'Teaching support and facilities received the most positive commentary.',
        'The proportion of positive comments increased from 51% to 54%.',
        'Work-life balance comments frequently mention the tension between flexibility policies and workload.'
      ]
    },

    /* 24 */ {
      id: 'recommendations',
      title: 'Recommendations & Action Items',
      icon: '✅',
      description: 'Strategic recommendations based on survey findings, prioritized by impact and feasibility.',
      kpis: [
        { label: 'Recommendations', value: '12', change: null },
        { label: 'High Priority', value: '4', change: null },
        { label: 'Medium Priority', value: '5', change: null },
        { label: 'Quick Wins', value: '3', change: null }
      ],
      charts: [
        { type: 'hbar', title: 'Priority Matrix (Impact Score)', data: [
          { label: 'Salary Competitiveness Review', value: 4.8 },
          { label: 'Governance Reform', value: 4.5 },
          { label: 'Adjunct Support Package', value: 4.3 },
          { label: 'Childcare Expansion', value: 4.1 },
          { label: 'DEI Action Plan', value: 3.9 },
          { label: 'Communication Strategy', value: 3.8 },
          { label: 'Mentoring Expansion', value: 3.6 },
          { label: 'AI/Technology Training', value: 3.5 }
        ]}
      ],
      tables: [{
        title: 'Action Items',
        headers: ['#', 'Recommendation', 'Priority', 'Owner', 'Timeline'],
        rows: [
          ['1', 'Conduct comprehensive salary equity review', 'High', 'Provost/HR', 'Fall 2025'],
          ['2', 'Reform Faculty Senate structure and bylaws', 'High', 'Senate/President', 'AY 2025-26'],
          ['3', 'Develop adjunct faculty support package', 'High', 'Provost/Deans', 'Spring 2026'],
          ['4', 'Expand on-campus childcare capacity', 'High', 'VP Operations', 'AY 2026-27'],
          ['5', 'Implement DEI strategic plan Phase 2', 'Medium', 'CDO', 'AY 2025-26'],
          ['6', 'Redesign institutional communication strategy', 'Medium', 'President/Comms', 'Fall 2025'],
          ['7', 'Scale faculty mentoring programs', 'Medium', 'Provost', 'AY 2025-26'],
          ['8', 'Launch AI/ML training initiative', 'Medium', 'CIO/Provost', 'Spring 2026'],
          ['9', 'Streamline travel reimbursement process', 'Medium', 'CFO', 'Fall 2025'],
          ['10', 'Improve Faculty Senate communications', 'Low', 'Senate Chair', 'Immediate'],
          ['11', 'Create interdisciplinary grant fund', 'Low', 'VP Research', 'AY 2025-26'],
          ['12', 'Upgrade parking infrastructure', 'Low', 'VP Operations', 'AY 2027-28']
        ]
      }],
      insights: [
        'Salary competitiveness is the highest-impact recommendation, requiring a comprehensive equity review.',
        'Governance reform should focus on Faculty Senate effectiveness and shared governance processes.',
        'Quick wins include streamlining travel reimbursement and improving Senate communications.',
        'All recommendations link directly to survey findings and include measurable success criteria.'
      ]
    },

    /* 25 */ {
      id: 'appendix',
      title: 'Appendix: Detailed Data Tables',
      icon: '📎',
      description: 'Complete data tables for all survey items, organized by domain.',
      kpis: [
        { label: 'Total Items', value: '142', change: null },
        { label: 'Domains', value: '8', change: null },
        { label: 'Sub-Scales', value: '32', change: null },
        { label: 'Data Points', value: '14,200+', change: null }
      ],
      charts: [],
      tables: [
        {
          title: 'All Domain Scores — Complete Summary',
          headers: ['Domain', 'Items', '2025 Mean', 'SD', '2022 Mean', 'Change', 'Peer Avg', 'Percentile'],
          rows: [
            ['Teaching Environment', '18', '4.01', '0.82', '3.88', '+0.13', '3.82', '78th'],
            ['Research Support', '16', '3.65', '0.95', '3.51', '+0.14', '3.58', '58th'],
            ['Governance & Leadership', '14', '3.22', '1.08', '3.30', '−0.08', '3.35', '35th'],
            ['Compensation & Benefits', '12', '3.08', '1.12', '2.96', '+0.12', '3.15', '42nd'],
            ['Department Culture', '16', '3.91', '0.78', '3.78', '+0.13', '3.72', '82nd'],
            ['Facilities', '10', '3.74', '0.88', '3.60', '+0.14', '3.65', '62nd'],
            ['Work-Life Balance', '14', '3.55', '0.98', '3.40', '+0.15', '3.50', '55th'],
            ['DEI', '12', '3.48', '1.05', '3.35', '+0.13', '3.42', '56th'],
            ['Overall Satisfaction', '8', '3.82', '0.85', '3.68', '+0.14', '3.68', '72nd'],
            ['Technology', '10', '3.62', '0.92', '3.42', '+0.20', '3.55', '60th'],
            ['Mentoring', '8', '3.42', '0.98', '3.24', '+0.18', '3.35', '58th'],
            ['Communication', '8', '3.28', '1.02', '3.23', '+0.05', '3.32', '48th']
          ]
        },
        {
          title: 'Response Summary by Demographic',
          headers: ['Group', 'N', 'Overall', 'Teaching', 'Research', 'Governance', 'Culture'],
          rows: [
            ['All Faculty', '1234', '3.82', '4.01', '3.65', '3.22', '3.91'],
            ['Tenured', '512', '3.92', '4.08', '3.78', '3.28', '3.98'],
            ['Tenure-Track', '298', '3.78', '3.95', '3.68', '3.18', '3.88'],
            ['Non-Tenure-Track', '424', '3.68', '3.92', '3.42', '3.15', '3.82'],
            ['Female', '586', '3.75', '3.98', '3.58', '3.15', '3.85'],
            ['Male', '612', '3.88', '4.05', '3.72', '3.28', '3.95'],
            ['URM', '218', '3.52', '3.85', '3.42', '3.02', '3.68'],
            ['International', '164', '3.72', '3.92', '3.62', '3.18', '3.82']
          ]
        }
      ],
      insights: [
        'This appendix provides the complete dataset for all 142 survey items across 8 domains.',
        'Standard deviations range from 0.78 (Culture) to 1.12 (Compensation), indicating greater consensus on culture.',
        'Demographic breakdowns reveal persistent gaps for URM and non-tenure-track faculty.',
        'Full item-level data is available upon request from the Office of Institutional Research.'
      ]
    }
  ];

})(window.SurveyReport);
