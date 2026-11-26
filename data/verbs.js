/* 核心语库 · 动词变位速查（22 个高频动词 × 5 个时式）
   表格列：je / tu / il-elle / nous / vous / ils-elles
   pronominal 为 true 时，单元格内含自反代词（如「me lève」），渲染时与主语拼接 */
window.FR = window.FR || {};

FR.VERB_TENSES = [
  {key: 'pres', label: '现在时', fr: 'présent'},
  {key: 'imp', label: '未完成过去时', fr: 'imparfait'},
  {key: 'fut', label: '简单将来时', fr: 'futur simple'},
  {key: 'cond', label: '条件式现在时', fr: 'conditionnel présent'},
  {key: 'subj', label: '虚拟式现在时', fr: 'subjonctif présent'}
];

FR.VERBS = [
  {
    inf: 'être', cn: '是', group: 3, aux: 'avoir', pp: 'été',
    pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    imp: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
    fut: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    cond: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
    subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
    note: '最不规则也最常用；作助动词时构成被动语态与代词式动词的复合时态。',
    ex: {fr: 'Je suis étudiant et je suis content.', cn: '我是学生，我很开心。'}
  },
  {
    inf: 'avoir', cn: '有', group: 3, aux: 'avoir', pp: 'eu',
    pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    imp: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
    fut: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
    cond: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'],
    subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
    note: '年龄、感受、拥有都用它；复合过去时的主要助动词。',
    ex: {fr: 'J\'ai vingt ans et j\'ai faim.', cn: '我二十岁，我饿了。'}
  },
  {
    inf: 'aller', cn: '去', group: 3, aux: 'être', pp: 'allé',
    pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    imp: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
    fut: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
    cond: ['irais', 'irais', 'irait', 'irions', 'iriez', 'iraient'],
    subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
    note: 'aller + 不定式 = 最近将来时；复合过去时用 être。',
    ex: {fr: 'Je vais au marché, tu viens ?', cn: '我去市场，你来吗？'}
  },
  {
    inf: 'faire', cn: '做；使', group: 3, aux: 'avoir', pp: 'fait',
    pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    imp: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
    fut: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
    cond: ['ferais', 'ferais', 'ferait', 'ferions', 'feriez', 'feraient'],
    subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
    note: '天气句式 il fait beau / il fait froid 用它；faire du sport 等搭配极多。',
    ex: {fr: 'Qu\'est-ce que tu fais ce week-end ?', cn: '你这周末做什么？'}
  },
  {
    inf: 'prendre', cn: '拿；乘坐；吃喝', group: 3, aux: 'avoir', pp: 'pris',
    pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    imp: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
    fut: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
    cond: ['prendrais', 'prendrais', 'prendrait', 'prendrions', 'prendriez', 'prendraient'],
    subj: ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'],
    note: 'prendre le train / le bus、prendre un café 都是高频搭配。',
    ex: {fr: 'Nous prenons le train de huit heures.', cn: '我们坐八点的火车。'}
  },
  {
    inf: 'venir', cn: '来', group: 3, aux: 'être', pp: 'venu',
    pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    imp: ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient'],
    fut: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
    cond: ['viendrais', 'viendrais', 'viendrait', 'viendrions', 'viendriez', 'viendraient'],
    subj: ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'],
    note: 'venir de + 不定式 = 刚刚做完；复合过去时用 être。',
    ex: {fr: 'Je viens d\'arriver.', cn: '我刚到。'}
  },
  {
    inf: 'pouvoir', cn: '能；可以', group: 3, aux: 'avoir', pp: 'pu',
    pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    imp: ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient'],
    fut: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
    cond: ['pourrais', 'pourrais', 'pourrait', 'pourrions', 'pourriez', 'pourraient'],
    subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
    note: '条件式 pourriez-vous… 是礼貌请求的核心句式。',
    ex: {fr: 'Pourriez-vous répéter, s\'il vous plaît ?', cn: '您能重复一遍吗？'}
  },
  {
    inf: 'vouloir', cn: '想要', group: 3, aux: 'avoir', pp: 'voulu',
    pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    imp: ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient'],
    fut: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
    cond: ['voudrais', 'voudrais', 'voudrait', 'voudrions', 'voudriez', 'voudraient'],
    subj: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
    note: '点单、买东西一律用 je voudrais（条件式），比 je veux 礼貌。',
    ex: {fr: 'Je voudrais un café, s\'il vous plaît.', cn: '请给我一杯咖啡。'}
  },
  {
    inf: 'devoir', cn: '必须；应该', group: 3, aux: 'avoir', pp: 'dû',
    pres: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    imp: ['devais', 'devais', 'devait', 'devions', 'deviez', 'devaient'],
    fut: ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront'],
    cond: ['devrais', 'devrais', 'devrait', 'devrions', 'devriez', 'devraient'],
    subj: ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent'],
    note: '除「必须」外还表推测：il doit être là（他应该在那儿）。',
    ex: {fr: 'Tu dois prendre ce médicament deux fois par jour.', cn: '这个药你一天要吃两次。'}
  },
  {
    inf: 'savoir', cn: '知道；会', group: 3, aux: 'avoir', pp: 'su',
    pres: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    imp: ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient'],
    fut: ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront'],
    cond: ['saurais', 'saurais', 'saurait', 'saurions', 'sauriez', 'sauraient'],
    subj: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
    note: 'savoir + 事实/技能；connaître + 人或地方，别混。',
    ex: {fr: 'Je sais nager, mais je ne sais pas skier.', cn: '我会游泳，但不会滑雪。'}
  },
  {
    inf: 'dire', cn: '说', group: 3, aux: 'avoir', pp: 'dit',
    pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    imp: ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
    fut: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
    cond: ['dirais', 'dirais', 'dirait', 'dirions', 'diriez', 'diraient'],
    subj: ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent'],
    note: 'vous dites 是例外（不是 disez）；转述常用 il a dit que…',
    ex: {fr: 'Qu\'est-ce que vous dites ?', cn: '您说什么？'}
  },
  {
    inf: 'voir', cn: '看见', group: 3, aux: 'avoir', pp: 'vu',
    pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    imp: ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
    fut: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
    cond: ['verrais', 'verrais', 'verrait', 'verrions', 'verriez', 'verraient'],
    subj: ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient'],
    note: '将来时词干 verr-，与 voir 拼写差别大，容易写错。',
    ex: {fr: 'On se voit demain ?', cn: '我们明天见？'}
  },
  {
    inf: 'mettre', cn: '放；穿', group: 3, aux: 'avoir', pp: 'mis',
    pres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    imp: ['mettais', 'mettais', 'mettait', 'mettions', 'mettiez', 'mettaient'],
    fut: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'],
    cond: ['mettrais', 'mettrais', 'mettrait', 'mettrions', 'mettriez', 'mettraient'],
    subj: ['mette', 'mettes', 'mette', 'mettions', 'mettiez', 'mettent'],
    note: 'mettre 的双 t 是拼写标志：il met 但 nous mettons。',
    ex: {fr: 'Mets ton manteau, il fait froid.', cn: '穿上外套，天很冷。'}
  },
  {
    inf: 'partir', cn: '出发；离开', group: 3, aux: 'être', pp: 'parti',
    pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    imp: ['partais', 'partais', 'partait', 'partions', 'partiez', 'partaient'],
    fut: ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront'],
    cond: ['partirais', 'partirais', 'partirait', 'partirions', 'partiriez', 'partiraient'],
    subj: ['parte', 'partes', 'parte', 'partions', 'partiez', 'partent'],
    note: '用 être 作助动词，过去分词配合：elle est partie。',
    ex: {fr: 'Le train part à quatorze heures.', cn: '火车十四点发车。'}
  },
  {
    inf: 'sortir', cn: '出去；拿出', group: 3, aux: 'être', pp: 'sorti',
    pres: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'],
    imp: ['sortais', 'sortais', 'sortait', 'sortions', 'sortiez', 'sortaient'],
    fut: ['sortirai', 'sortiras', 'sortira', 'sortirons', 'sortirez', 'sortiront'],
    cond: ['sortirais', 'sortirais', 'sortirait', 'sortirions', 'sortiriez', 'sortiraient'],
    subj: ['sorte', 'sortes', 'sorte', 'sortions', 'sortiez', 'sortent'],
    note: '作及物动词（拿出某物）时用 avoir：j\'ai sorti les poubelles。',
    ex: {fr: 'On sort ce soir ?', cn: '今晚我们出去吗？'}
  },
  {
    inf: 'connaître', cn: '认识；了解', group: 3, aux: 'avoir', pp: 'connu',
    pres: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    imp: ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient'],
    fut: ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront'],
    cond: ['connaîtrais', 'connaîtrais', 'connaîtrait', 'connaîtrions', 'connaîtriez', 'connaîtraient'],
    subj: ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent'],
    note: '长音符只出现在 il/elle（il connaît）与将来时/条件式词干（il connaîtra）。',
    ex: {fr: 'Tu connais ce restaurant ?', cn: '你认识这家餐厅吗？'}
  },
  {
    inf: 'boire', cn: '喝', group: 3, aux: 'avoir', pp: 'bu',
    pres: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    imp: ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient'],
    fut: ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront'],
    cond: ['boirais', 'boirais', 'boirait', 'boirions', 'boiriez', 'boiraient'],
    subj: ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent'],
    note: 'nous / vous 变成 buv-，其他形式是 boi-。',
    ex: {fr: 'Je bois de l\'eau, merci.', cn: '我喝水，谢谢。'}
  },
  {
    inf: 'écrire', cn: '写', group: 3, aux: 'avoir', pp: 'écrit',
    pres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    imp: ['écrivais', 'écrivais', 'écrivait', 'écrivions', 'écriviez', 'écrivaient'],
    fut: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'],
    cond: ['écrirais', 'écrirais', 'écrirait', 'écririons', 'écririez', 'écriraient'],
    subj: ['écrive', 'écrives', 'écrive', 'écrivions', 'écriviez', 'écrivent'],
    note: '过去分词 écrit；写信 écrire à qqn 用间接宾语。',
    ex: {fr: 'Je vous écris pour confirmer le rendez-vous.', cn: '我写信确认预约。'}
  },
  {
    inf: 'parler', cn: '说话（-er 组范例）', group: 1, aux: 'avoir', pp: 'parlé',
    pres: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'],
    imp: ['parlais', 'parlais', 'parlait', 'parlions', 'parliez', 'parlaient'],
    fut: ['parlerai', 'parleras', 'parlera', 'parlerons', 'parlerez', 'parleront'],
    cond: ['parlerais', 'parlerais', 'parlerait', 'parlerions', 'parleriez', 'parleraient'],
    subj: ['parle', 'parles', 'parle', 'parlions', 'parliez', 'parlent'],
    note: '第一组 -er 动词占 90%，掌握它就能推及大部分动词。',
    ex: {fr: 'Je parle un peu français.', cn: '我会说一点法语。'}
  },
  {
    inf: 'finir', cn: '结束（-ir 组范例）', group: 2, aux: 'avoir', pp: 'fini',
    pres: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'],
    imp: ['finissais', 'finissais', 'finissait', 'finissions', 'finissiez', 'finissaient'],
    fut: ['finirai', 'finiras', 'finira', 'finirons', 'finirez', 'finiront'],
    cond: ['finirais', 'finirais', 'finirait', 'finirions', 'finiriez', 'finiraient'],
    subj: ['finisse', 'finisses', 'finisse', 'finissions', 'finissiez', 'finissent'],
    note: '第二组以 -ir 结尾且复数带 -iss-：nous finissons。',
    ex: {fr: 'Le film finit à dix heures.', cn: '电影十点结束。'}
  },
  {
    inf: 'attendre', cn: '等待（-dre 组范例）', group: 3, aux: 'avoir', pp: 'attendu',
    pres: ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent'],
    imp: ['attendais', 'attendais', 'attendait', 'attendions', 'attendiez', 'attendaient'],
    fut: ['attendrai', 'attendras', 'attendra', 'attendrons', 'attendrez', 'attendront'],
    cond: ['attendrais', 'attendrais', 'attendrait', 'attendrions', 'attendriez', 'attendraient'],
    subj: ['attende', 'attendes', 'attende', 'attendions', 'attendiez', 'attendent'],
    note: 'attendre qqn / qqch（直接宾语，不加 à，与中文习惯不同）。',
    ex: {fr: 'J\'attends le bus depuis dix minutes.', cn: '我等公交等了十分钟。'}
  },
  {
    inf: 'se lever', cn: '起床（代词式范例）', group: 1, aux: 'être', pp: 'levé', pronominal: true,
    pres: ['me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent'],
    imp: ['me levais', 'te levais', 'se levait', 'nous levions', 'vous leviez', 'se levaient'],
    fut: ['me lèverai', 'te lèveras', 'se lèvera', 'nous lèverons', 'vous lèverez', 'se lèveront'],
    cond: ['me lèverais', 'te lèverais', 'se lèverait', 'nous lèverions', 'vous lèveriez', 'se lèveraient'],
    subj: ['me lève', 'te lèves', 'se lève', 'nous levions', 'vous leviez', 'se lèvent'],
    note: '代词随主语变；复合过去时用 être 且配合：elle s\'est levée。',
    ex: {fr: 'Je me lève à sept heures.', cn: '我七点起床。'}
  }
];
