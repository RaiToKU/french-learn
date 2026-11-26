/* 核心语库 · 语法字典 A1–B2
   覆盖依据：CEFR A1–B2 语法大纲（对应 Référentiels A1–B2 pour le français 与 DELF A1–B2 考查范围），
   按 8 大类系统整理；应用内「覆盖清单」由本文件自动生成，可逐项核对。
   field: id / lv / cat / fr(法语名) / title(中文名) / point(讲解) / table{head,rows} / ex[{fr,cn}] / pitfall / quiz[{q,opts,a,why}] */
window.FR = window.FR || {};

FR.GRAMMAR_META = {
  basis: '覆盖依据：CEFR A1–B2 语法大纲（Référentiels A1–B2 pour le français、DELF A1–B2 考查范围），按 8 大类系统整理。',
  categories: ['名词与限定词', '形容词与数量', '代词', '动词与时态', '语式与非谓语', '句型与从句', '介词·副词·连接', '书面表达与语域']
};

FR.GRAMMAR = [
  /* ==================== A1 ==================== */
  {
    id: 'g-a1-01', lv: 'A1', cat: '动词与时态', fr: 'Le présent d\'être et avoir', title: 'être 与 avoir 的现在时',
    point: '法语两个地基动词。说身份、状态、地点用 être；说拥有、年龄、感受用 avoir（j\'ai 20 ans / j\'ai faim）。它们同时充当助动词，变位必须到条件反射。',
    table: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [
        ['être', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
        ['avoir', 'ai', 'as', 'a', 'avons', 'avez', 'ont']
      ]
    },
    ex: [
      {fr: 'Je suis chinois et j\'ai vingt ans.', cn: '我是中国人，二十岁。'},
      {fr: 'Elle est à la maison.', cn: '她在家。'},
      {fr: 'Nous avons un chien.', cn: '我们养了一只狗。'}
    ],
    pitfall: '年龄不能说 «je suis 20 ans»，必须用 avoir。',
    quiz: [
      {q: 'Tu ___ étudiant ?', opts: ['es', 'est', 'suis', 'êtes'], a: 0, why: 'tu 对应 es。'},
      {q: 'Ils ___ deux enfants.', opts: ['ont', 'sont', 'avez', 'as'], a: 0, why: '「有孩子」用 avoir；ils → ont。'}
    ]
  },
  {
    id: 'g-a1-02', lv: 'A1', cat: '代词', fr: 'Les pronoms sujets et on', title: '主语人称代词与 on',
    point: 'je, tu, il/elle, nous, vous, ils/elles 必须与动词变位一致。on 永远配第三人称单数变位，口语里常代替 nous（on mange = 我们吃）。',
    table: {
      head: ['人称', '代词', '对应变位'],
      rows: [['第一人称单数', 'je (j\')', 'parle'], ['第二人称单数', 'tu', 'parles'], ['第三人称', 'il / elle / on', 'parle'], ['第一人称复数', 'nous', 'parlons'], ['第二人称复数/敬称', 'vous', 'parlez'], ['第三人称复数', 'ils / elles', 'parlent']]
    },
    ex: [
      {fr: 'On va au cinéma ce soir ?', cn: '我们今晚去看电影吗？'},
      {fr: 'Vous parlez français ?', cn: '您说法语吗？'}
    ],
    pitfall: 'on 后面动词永远单数：on va ✓，on allons ✗。',
    quiz: [
      {q: 'On ___ au marché samedi.', opts: ['va', 'allons', 'allez', 'vont'], a: 0, why: 'on 用第三人称单数变位。'}
    ]
  },
  {
    id: 'g-a1-03', lv: 'A1', cat: '名词与限定词', fr: 'Le genre et le nombre du nom', title: '名词的阴阳性与单复数',
    point: '法语名词分阴阳性，冠词与形容词都要跟着变。复数一般在词尾加 -s（不发音），以 -al 结尾的变 -aux，-eau 加 -x。词性只能记，规律只是参考。',
    ex: [
      {fr: 'un livre intéressant → des livres intéressants', cn: '一本有趣的书 → 一些有趣的书'},
      {fr: 'un journal → des journaux', cn: '一份报纸 → 一些报纸'},
      {fr: 'une femme → des femmes', cn: '一个女人 → 一些女人'}
    ],
    pitfall: '以 -e 结尾多为阴性，但 le musée、le lycée 是阳性；职业名词阴阳同形时靠冠词区分：un/une journaliste。',
    quiz: [
      {q: 'Choisissez la forme correcte : ___ journaux.', opts: ['des', 'des journal', 'les journal', 'de journaux'], a: 0, why: '-al → -aux，复数用 des。'}
    ]
  },
  {
    id: 'g-a1-04', lv: 'A1', cat: '名词与限定词', fr: 'Les articles définis et indéfinis', title: '定冠词与不定冠词',
    point: '首次提到、任意一个 → un / une / des；已知的或泛指整体 → le / la / les。说「喜欢某类东西」用定冠词。否定句中 un/une/des 变 de。',
    ex: [
      {fr: 'J\'ai un frère et une sœur.', cn: '我有一个哥哥和一个姐姐。'},
      {fr: 'J\'aime le fromage.', cn: '我喜欢奶酪（这一类）。'},
      {fr: 'Il n\'a pas de voiture.', cn: '他没有车。'}
    ],
    pitfall: '元音或哑音 h 前省音：le + ami → l\'ami；de + le → du。',
    quiz: [
      {q: 'Je voudrais ___ café, s\'il vous plaît.', opts: ['un', 'le', 'des', 'de'], a: 0, why: '一杯（首次提到）用 un。'},
      {q: 'Je n\'ai pas ___ temps.', opts: ['de', 'du', 'des', 'un'], a: 0, why: '否定把不定冠词变 de。'}
    ]
  },
  {
    id: 'g-a1-05', lv: 'A1', cat: '名词与限定词', fr: 'Les articles partitifs', title: '部分冠词 du / de la / de l\' / des',
    point: '不可数或「一部分」用部分冠词：du pain、de la soupe、de l\'eau、des fruits。它不强调数量，只表示「一些」；否定句一律变 de。',
    table: {
      head: ['名词', '部分冠词', '例'],
      rows: [['阳性', 'du', 'du pain'], ['阴性', 'de la', 'de la viande'], ['元音开头', 'de l\'', 'de l\'eau'], ['复数', 'des', 'des légumes']]
    },
    ex: [
      {fr: 'Je mange du pain et de la confiture.', cn: '我吃面包和果酱。'},
      {fr: 'Je ne bois pas de café le soir.', cn: '我晚上不喝咖啡。'}
    ],
    pitfall: 'aimer / préférer 后用定冠词而不是部分冠词：j\'aime le café。',
    quiz: [
      {q: 'Je voudrais ___ soupe.', opts: ['de la', 'du', 'des', 'de l\''], a: 0, why: 'soupe 阴性单数 → de la。'},
      {q: 'Je ne mange pas ___ viande.', opts: ['de', 'de la', 'des', 'du'], a: 0, why: '否定句部分冠词变 de。'}
    ]
  },
  {
    id: 'g-a1-06', lv: 'A1', cat: '名词与限定词', fr: 'Les adjectifs possessifs', title: '主有形容词 mon / ton / son',
    point: '表示「我的、你的、他的」。性数跟着后面的名词走，不跟拥有者：son père（他的/她的爸爸）、sa mère、ses parents。',
    table: {
      head: ['', '阳性单数', '阴性单数', '复数'],
      rows: [['我', 'mon', 'ma', 'mes'], ['你', 'ton', 'ta', 'tes'], ['他/她', 'son', 'sa', 'ses'], ['我们', 'notre', 'notre', 'nos'], ['你们/您', 'votre', 'votre', 'vos'], ['他们/她们', 'leur', 'leur', 'leurs']]
    },
    ex: [
      {fr: 'Mon père travaille à l\'hôpital.', cn: '我父亲在医院工作。'},
      {fr: 'Leurs enfants vont à l\'école.', cn: '他们的孩子上学。'}
    ],
    pitfall: '阴性名词以元音开头时用 mon/ton/son：mon amie（不是 ma amie）。',
    quiz: [
      {q: '___ mère est médecin.', opts: ['Ma', 'Mon', 'Mes', 'Moi'], a: 0, why: 'mère 阴性单数 → ma。'},
      {q: 'Il a oublié ___ clés.', opts: ['ses', 'son', 'sa', 'leur'], a: 0, why: 'clés 复数 → ses。'}
    ]
  },
  {
    id: 'g-a1-07', lv: 'A1', cat: '名词与限定词', fr: 'Les adjectifs démonstratifs', title: '指示形容词 ce / cet / cette / ces',
    point: '表示「这个/那个」。阳性单数 ce，元音或哑音 h 前用 cet，阴性 cette，复数 ces。后面可加 -ci / -là 区分远近。',
    table: {
      head: ['', '单数', '复数'],
      rows: [['阳性', 'ce / cet', 'ces'], ['阴性', 'cette', 'ces']]
    },
    ex: [
      {fr: 'Ce livre est très intéressant.', cn: '这本书很有意思。'},
      {fr: 'Cet homme est mon professeur.', cn: '这个男人是我的老师。'},
      {fr: 'Ces photos sont belles.', cn: '这些照片很美。'}
    ],
    quiz: [
      {q: '___ appartement est libre.', opts: ['Cet', 'Ce', 'Cette', 'Ces'], a: 0, why: 'appartement 阳性且元音开头 → cet。'}
    ]
  },
  {
    id: 'g-a1-08', lv: 'A1', cat: '形容词与数量', fr: 'Accord et place de l\'adjectif', title: '形容词的性数配合与位置',
    point: '形容词要与名词性数一致。大部分放名词后（une voiture rouge），少数短小常用形容词放前（grand, petit, bon, beau, jeune, nouveau, vieux），意义可能随位置变化。',
    ex: [
      {fr: 'une petite maison blanche', cn: '一栋白色小房子'},
      {fr: 'des étudiants français', cn: '法国学生（国籍、颜色放后）'}
    ],
    pitfall: 'beau / nouveau / vieux 在元音前有特殊形式：un bel homme、un nouvel ami、un vieil ami。',
    quiz: [
      {q: 'Choisissez la forme correcte : une ___ robe.', opts: ['belle', 'beau', 'bel', 'beaux'], a: 0, why: 'robe 阴性单数 → belle。'}
    ]
  },
  {
    id: 'g-a1-09', lv: 'A1', cat: '形容词与数量', fr: 'Les nombres, la date et l\'heure', title: '数字、日期与钟点',
    point: '70 = soixante-dix，80 = quatre-vingts，90 = quatre-vingt-dix；日期用「le + 数字 + 月」，1 号用 premier；问时间 Quelle heure est-il ?，回答 Il est + 数字 + heure(s)。',
    ex: [
      {fr: 'Le 14 juillet est la fête nationale.', cn: '7 月 14 日是国庆节。'},
      {fr: 'Il est huit heures et demie.', cn: '八点半。'},
      {fr: 'J\'ai vingt et un ans.', cn: '我二十一岁。'}
    ],
    pitfall: '21、31 等用 et un（vingt et un），81 用 quatre-vingt-un（没有 et）。',
    quiz: [
      {q: 'Il est neuf heures ___ quart.', opts: ['et', 'à', 'de', 'moins'], a: 0, why: '九点一刻 = neuf heures et quart。'}
    ]
  },
  {
    id: 'g-a1-10', lv: 'A1', cat: '动词与时态', fr: 'Le présent des verbes en -er', title: '第一组 -er 动词的现在时',
    point: '占法语动词 90%。去掉 -er，加 -e, -es, -e, -ons, -ez, -ent。词尾 -ent 不发音，所以 il parle 与 ils parlent 同音，靠主语区分。',
    table: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [['parler', 'parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']]
    },
    ex: [
      {fr: 'Je parle français tous les jours.', cn: '我每天说法语。'},
      {fr: 'Tu arrives à quelle heure ?', cn: '你几点到？'},
      {fr: 'Ils écoutent la radio le matin.', cn: '他们早上听广播。'}
    ],
    pitfall: '拼写变化：manger → nous mangeons；commencer → nous commençons；appeler → j\'appelle；acheter → j\'achète。',
    quiz: [
      {q: 'J\'___ beaucoup la musique française.', opts: ['aime', 'aimes', 'aimons', 'aiment'], a: 0, why: 'je 对应 -e；元音前省音成 j\'。'},
      {q: 'Nous ___ le français.', opts: ['étudions', 'étudiez', 'étudient', 'étudions pas'], a: 0, why: 'nous 对应 -ons。'}
    ]
  },
  {
    id: 'g-a1-11', lv: 'A1', cat: '动词与时态', fr: 'Les verbes irréguliers fréquents', title: '高频不规则动词：aller / faire / prendre',
    point: '三个使用频率极高、变位完全不规则的动词。先背熟它们的现在时，才能说清日常动作。',
    table: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [
        ['aller', 'vais', 'vas', 'va', 'allons', 'allez', 'vont'],
        ['faire', 'fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
        ['prendre', 'prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent']
      ]
    },
    ex: [
      {fr: 'Je vais au marché le samedi.', cn: '我周六去市场。'},
      {fr: 'Qu\'est-ce que tu fais ce week-end ?', cn: '你这周末做什么？'},
      {fr: 'Nous prenons le train de huit heures.', cn: '我们坐八点的火车。'}
    ],
    quiz: [
      {q: 'Nous ___ le bus tous les jours.', opts: ['prenons', 'prendons', 'prenez', 'prennent'], a: 0, why: 'prendre: nous prenons。'},
      {q: 'Ils ___ du sport le dimanche.', opts: ['font', 'faisent', 'fait', 'faites'], a: 0, why: 'faire: ils font。'}
    ]
  },
  {
    id: 'g-a1-12', lv: 'A1', cat: '动词与时态', fr: 'Le futur proche : aller + infinitif', title: '最近将来时 aller + 不定式',
    point: '表达「马上要、打算做」，比简单将来时更口语。aller 按主语变位，后面动词保持原形。',
    ex: [
      {fr: 'Je vais partir dans cinq minutes.', cn: '我五分钟后就走。'},
      {fr: 'Nous allons visiter le musée demain.', cn: '我们明天去参观博物馆。'},
      {fr: 'Il va pleuvoir.', cn: '要下雨了。'}
    ],
    pitfall: '两个动词时只变第一个：je vais partir ✓，je vais pars ✗。',
    quiz: [
      {q: 'Je ___ appeler ma mère ce soir.', opts: ['vais', 'va', 'allez', 'vont'], a: 0, why: 'je → vais + 原形。'},
      {q: 'Nous allons ___ un film.', opts: ['voir', 'vu', 'voyons', 'verrons'], a: 0, why: 'aller + 不定式。'}
    ]
  },
  {
    id: 'g-a1-13', lv: 'A1', cat: '动词与时态', fr: 'Le passé récent : venir de + infinitif', title: '最近过去时 venir de + 不定式',
    point: '表示「刚刚做完某事」。venir 按主语变位 + de + 动词原形。',
    ex: [
      {fr: 'Je viens d\'arriver.', cn: '我刚到。'},
      {fr: 'Elle vient de partir.', cn: '她刚走。'}
    ],
    quiz: [
      {q: 'Ils ___ de finir le travail.', opts: ['viennent', 'vient', 'viens', 'venez'], a: 0, why: 'venir: ils viennent。'}
    ]
  },
  {
    id: 'g-a1-14', lv: 'A1', cat: '句型与从句', fr: 'La négation ne… pas', title: '否定 ne… pas / jamais / rien',
    point: 'ne 放动词前，pas（或 jamais 从不、rien 什么也不、plus 不再）放动词后。复合时态里夹在助动词与过去分词之间。口语常省略 ne。',
    ex: [
      {fr: 'Je ne parle pas encore bien français.', cn: '我法语还说得不好。'},
      {fr: 'Il ne vient jamais en retard.', cn: '他从不迟到。'},
      {fr: 'Je n\'ai rien compris.', cn: '我什么都没听懂。'}
    ],
    pitfall: '否定后直接接名词时，un/une/des 变 de：Je n\'ai pas de temps。',
    quiz: [
      {q: 'Il ___ pas faim.', opts: ['n\'a', 'ne a', 'n\'est', 'n\'as'], a: 0, why: 'avoir 否定；ne 遇元音省音。'},
      {q: 'Je ne comprends ___ .', opts: ['rien', 'personne', 'jamais', 'plus'], a: 0, why: '「什么都不懂」用 ne…rien。'}
    ]
  },
  {
    id: 'g-a1-15', lv: 'A1', cat: '句型与从句', fr: 'L\'interrogation', title: '疑问句：est-ce que、疑问词与倒装',
    point: '三种提问方式：语调（Tu viens ?）、est-ce que（Est-ce que tu viens ?）、倒装（Viens-tu ?）。疑问词放句首：qui 谁、que 什么、où 哪里、quand 何时、comment 怎么、pourquoi 为什么、combien 多少。',
    ex: [
      {fr: 'Est-ce que tu viens ce soir ?', cn: '你今晚来吗？'},
      {fr: 'Où est la gare ?', cn: '火车站在哪？'},
      {fr: 'Pourquoi tu apprends le français ?', cn: '你为什么学法语？'}
    ],
    pitfall: 'qu\'est-ce que 后接完整句子：Qu\'est-ce que tu fais ? ✓',
    quiz: [
      {q: '___ est-ce que tu habites ?', opts: ['Où', 'Qui', 'Que', 'Quand'], a: 0, why: '问地点用 où。'},
      {q: '___-tu prêt ?', opts: ['Es', 'Est', 'As', 'A'], a: 0, why: 'être 倒装：Es-tu prêt ?'}
    ]
  },
  {
    id: 'g-a1-16', lv: 'A1', cat: '动词与时态', fr: 'L\'impératif', title: '命令式（肯定与否定）',
    point: '去掉主语直接用动词：Parle ! Parlez ! 只有 tu / nous / vous 三个人称。-er 动词在 tu 形式去掉词尾 -s（Parle !），否定把 ne…pas 放回两侧。',
    table: {
      head: ['', 'parler', 'aller', 'être'],
      rows: [['tu', 'parle', 'va', 'sois'], ['nous', 'parlons', 'allons', 'soyons'], ['vous', 'parlez', 'allez', 'soyez']]
    },
    ex: [
      {fr: 'Dépêche-toi, on est en retard !', cn: '快点，我们迟到了！'},
      {fr: 'Ne fumez pas ici, s\'il vous plaît.', cn: '请不要在这里吸烟。'}
    ],
    quiz: [
      {q: '___-toi, on est en retard !', opts: ['Dépêche', 'Dépêches', 'Dépêchez', 'Dépêchons'], a: 0, why: '-er 动词 tu 命令式去掉 -s。'}
    ]
  },
  {
    id: 'g-a1-17', lv: 'A1', cat: '介词·副词·连接', fr: 'Les prépositions à et de (+ contraction)', title: '介词 à / de 与缩合 au / du',
    point: 'à = 到、在、向；de = 的、从。与定冠词缩合：à + le = au，à + les = aux，de + le = du，de + les = des；à + la / de + la 不缩合。',
    table: {
      head: ['介词', '+ le', '+ les', '+ la / l\''],
      rows: [['à', 'au', 'aux', 'à la / à l\''], ['de', 'du', 'des', 'de la / de l\'']]
    },
    ex: [
      {fr: 'Je vais au marché et je reviens du marché.', cn: '我去市场，然后从市场回来。'},
      {fr: 'Nous parlons des vacances.', cn: '我们聊假期。'}
    ],
    quiz: [
      {q: 'Je vais ___ cinéma.', opts: ['au', 'à le', 'du', 'aux'], a: 0, why: 'à + le = au。'},
      {q: 'Il vient ___ États-Unis.', opts: ['des', 'de les', 'du', 'au'], a: 0, why: 'de + les = des。'}
    ]
  },
  {
    id: 'g-a1-18', lv: 'A1', cat: '介词·副词·连接', fr: 'Les adverbes de degré et de fréquence', title: '程度与频率副词',
    point: '程度：très 很、trop 太、assez 相当、un peu 一点、beaucoup 很多。频率：toujours 总是、souvent 经常、parfois 有时、rarement 很少、jamais 从不。频率副词一般放动词后。',
    ex: [
      {fr: 'Il fait très chaud aujourd\'hui.', cn: '今天很热。'},
      {fr: 'Nous sortons souvent le vendredi soir.', cn: '我们经常周五晚上出去。'},
      {fr: 'Je ne bois jamais d\'alcool.', cn: '我从不喝酒。'}
    ],
    pitfall: 'très 后接形容词/副词，beaucoup 后接动词（Il travaille beaucoup）。',
    quiz: [
      {q: 'Elle est ___ sympathique.', opts: ['très', 'beaucoup', 'trop de', 'assez de'], a: 0, why: '形容词前用 très（beaucoup 不接形容词）。'}
    ]
  },
  {
    id: 'g-a1-19', lv: 'A1', cat: '句型与从句', fr: 'Il y a / c\'est / il est', title: 'il y a、c\'est 与 il est 的区别',
    point: 'il y a = 有（存在）；c\'est = 这是/那是（识别、评价）；il est = 他是/它是（+ 职业、国籍、形容词，后不加名词）。',
    ex: [
      {fr: 'Il y a un supermarché au coin de la rue.', cn: '街角有一家超市。'},
      {fr: 'C\'est un médecin. / Il est médecin.', cn: '他是一名医生。（两种说法；后者不加冠词）'},
      {fr: 'Il est très gentil.', cn: '他很好。'}
    ],
    pitfall: '说职业既可用 c\'est + 冠词 + 名词，也可用 il est + 名词（不加冠词）；不能说 il est un médecin。',
    quiz: [
      {q: '___ un problème avec ma commande.', opts: ['Il y a', 'C\'est', 'Il est', 'Ils ont'], a: 0, why: '表示存在用 il y a。'},
      {q: '___ mon frère, il est étudiant.', opts: ['C\'est', 'Il y a', 'Il est', 'Ce sont'], a: 0, why: '识别用 c\'est。'}
    ]
  },
  {
    id: 'g-a1-20', lv: 'A1', cat: '动词与时态', fr: 'Les verbes pronominaux (débutant)', title: '代词式动词入门 se lever / s\'appeler',
    point: '动作作用于自己，要用代词 me, te, se, nous, vous, se + 动词。代词随主语变，否定时 ne 放代词前：je ne me lève pas。',
    table: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [['se lever', 'me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent']]
    },
    ex: [
      {fr: 'Je me lève à sept heures.', cn: '我七点起床。'},
      {fr: 'Elle ne s\'est pas couchée tard.', cn: '她没有很晚才睡。'},
      {fr: 'Comment tu t\'appelles ?', cn: '你叫什么名字？'}
    ],
    quiz: [
      {q: 'Elle ___ à huit heures.', opts: ['se lève', 'se lèves', 'me lève', 'te lève'], a: 0, why: 'elle → se lève。'},
      {q: 'Nous ___ à sept heures.', opts: ['nous levons', 'nous levez', 'se levons', 'nous lèvent'], a: 0, why: 'nous → nous levons（重音符号消失）。'}
    ]
  },

  /* ==================== A2 ==================== */
  {
    id: 'g-a2-01', lv: 'A2', cat: '动词与时态', fr: 'Le passé composé', title: '复合过去时的构成',
    point: '讲「做过的事」的主力时态：助动词 avoir / être 的现在时 + 过去分词。否定与副词夹在助动词与分词之间：n\'a pas mangé、a déjà mangé。',
    table: {
      head: ['', 'parler', 'finir', 'prendre', 'aller'],
      rows: [
        ['过去分词', 'parlé', 'fini', 'pris', 'allé'],
        ['je', 'ai parlé', 'ai fini', 'ai pris', 'suis allé(e)'],
        ['nous', 'avons parlé', 'avons fini', 'avons pris', 'sommes allé(e)s']
      ]
    },
    ex: [
      {fr: 'Hier, j\'ai travaillé jusqu\'à vingt heures.', cn: '昨天我工作到八点。'},
      {fr: 'Nous avons pris le train de sept heures.', cn: '我们坐了七点的火车。'},
      {fr: 'Elle n\'a pas encore mangé.', cn: '她还没吃。'}
    ],
    pitfall: '不规则的过去分词要单独背：faire→fait、prendre→pris、voir→vu、boire→bu、écrire→écrit、mettre→mis。',
    quiz: [
      {q: 'J\'___ un très bon film hier soir.', opts: ['ai vu', 'suis vu', 'ai voir', 'a vu'], a: 0, why: 'voir 的过去分词是 vu，助动词 avoir。'},
      {q: 'Il n\'___ pas fini son travail.', opts: ['a', 'est', 'ai', 'as'], a: 0, why: '否定：ne + 助动词 + pas + 过去分词。'}
    ]
  },
  {
    id: 'g-a2-02', lv: 'A2', cat: '动词与时态', fr: 'Avoir ou être + accord', title: '复合过去时：助动词选择与性数配合',
    point: '绝大多数动词用 avoir；表示「来去进出上下离开」以及代词式动词用 être，此时过去分词要与主语性数配合（elle est partie / ils sont partis）。',
    ex: [
      {fr: 'Elle est arrivée à huit heures.', cn: '她八点到的（arrivée 加 e）。'},
      {fr: 'Ils sont partis hier.', cn: '他们昨天走了（partis 加 s）。'},
      {fr: 'Nous avons vu Marie : nous l\'avons vue.', cn: '我们见到了玛丽：直接宾语前置时，过去分词也要配合。'}
    ],
    pitfall: '用 être 的动词不表示动作承受者：aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, rester。',
    quiz: [
      {q: 'Elles ___ parties avant midi.', opts: ['sont', 'ont', 'est', 'a'], a: 0, why: 'partir 用 être；阴性复数 parties。'},
      {q: 'Nous ___ mangé à midi.', opts: ['avons', 'sommes', 'est', 'ont'], a: 0, why: 'manger 用 avoir。'}
    ]
  },
  {
    id: 'g-a2-03', lv: 'A2', cat: '动词与时态', fr: 'L\'imparfait', title: '未完成过去时',
    point: '讲「当时是什么样」：过去的习惯、持续状态、背景描写。构成：nous 形式去掉 -ons + -ais, -ais, -ait, -ions, -iez, -aient。',
    table: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [['habiter', 'habitais', 'habitais', 'habitait', 'habitions', 'habitiez', 'habitaient'], ['être', 'étais', 'étais', 'était', 'étions', 'étiez', 'étaient']]
    },
    ex: [
      {fr: 'Quand j\'étais petit, j\'habitais à la campagne.', cn: '我小时候住在乡下。'},
      {fr: 'Avant, elle travaillait dans un hôtel.', cn: '以前她在酒店工作。'},
      {fr: 'Il pleuvait, alors nous sommes restés.', cn: '当时在下雨，所以我们留下来了。'}
    ],
    quiz: [
      {q: 'Quand il était jeune, il ___ beaucoup.', opts: ['lisait', 'a lu', 'lit', 'lira'], a: 0, why: '过去的习惯用 imparfait。'},
      {q: 'Avant, nous ___ à la plage tous les étés.', opts: ['allions', 'sommes allés', 'allons', 'irons'], a: 0, why: '重复习惯 → imparfait。'}
    ]
  },
  {
    id: 'g-a2-04', lv: 'A2', cat: '动词与时态', fr: 'Passé composé vs imparfait', title: '复合过去时 vs 未完成过去时',
    point: '一句话里两者常常搭档：imparfait 铺背景（天气、状态、习惯），复合过去时讲发生的事件（打断了背景）。',
    ex: [
      {fr: 'Je lisais quand le téléphone a sonné.', cn: '电话响的时候我正在看书。'},
      {fr: 'Il faisait beau, alors nous sommes sortis.', cn: '天气很好，所以我们出门了。'}
    ],
    pitfall: '不要用 imparfait 讲一次性完成的事：hier j\'ai vu un film ✓，hier je voyais un film ✗（除非强调当时在看）。',
    quiz: [
      {q: 'Il ___ depuis une heure quand nous sommes sortis.', opts: ['pleuvait', 'a plu', 'pleut', 'pleuvra'], a: 0, why: 'depuis + 过去的持续状态用 imparfait。'},
      {q: 'Hier, elle ___ un livre entier.', opts: ['a lu', 'lisait', 'lit', 'lira'], a: 0, why: '一次性完成的动作用复合过去时。'}
    ]
  },
  {
    id: 'g-a2-05', lv: 'A2', cat: '代词', fr: 'Les pronoms COD', title: '直接宾语代词 le / la / les',
    point: '代替前面出现的人或物，位置在动词前。复合过去时中前置宾语要配合过去分词：Ces photos ? Il les a prises.',
    table: {
      head: ['', '代词', '例'],
      rows: [['阳性单数', 'le', 'Tu le connais ?'], ['阴性单数', 'la', 'Je la vois.'], ['复数', 'les', 'Je les prends.']]
    },
    ex: [
      {fr: 'Tu connais Marie ? — Oui, je la connais.', cn: '你认识玛丽吗？——认识。'},
      {fr: 'Ces photos ? Il les a prises en Grèce.', cn: '这些照片？他在希腊拍的。'}
    ],
    quiz: [
      {q: 'Tu as vu mes clés ? Oui, je ___ ai vues sur la table.', opts: ['les', 'leur', 'la', 'lui'], a: 0, why: '直接宾语复数 → les，过去分词配合为 vues。'},
      {q: 'Cette robe est jolie, je ___ achète.', opts: ['l\'', 'la', 'le', 'les'], a: 0, why: 'robe 阴性单数，直接宾语代词 la；元音前省音 l\'。'}
    ]
  },
  {
    id: 'g-a2-06', lv: 'A2', cat: '代词', fr: 'Les pronoms COI', title: '间接宾语代词 lui / leur',
    point: '代替「à + 人」。单数用 lui（男女通用），复数用 leur。位置同样在动词前，但过去分词不配合。',
    table: {
      head: ['', '代词', '例'],
      rows: [['à + 人（单数）', 'lui', 'Je lui téléphone.'], ['à + 人（复数）', 'leur', 'Je leur écris.']]
    },
    ex: [
      {fr: 'Je lui ai téléphoné hier.', cn: '我昨天给他打了电话。'},
      {fr: 'Le prof leur explique la règle.', cn: '老师给他们解释规则。'}
    ],
    pitfall: 'parler à qqn / téléphoner à qqn / répondre à qqn 都是间接宾语 → lui / leur。',
    quiz: [
      {q: 'Il a offert des fleurs à sa mère : il ___ a offert des fleurs.', opts: ['lui', 'leur', 'la', 'les'], a: 0, why: 'à sa mère（单数）→ lui。'},
      {q: 'Je ___ écris à mes parents chaque semaine.', opts: ['leur', 'lui', 'les', 'le'], a: 0, why: 'à mes parents（复数）→ leur。'}
    ]
  },
  {
    id: 'g-a2-07', lv: 'A2', cat: '代词', fr: 'Le pronom y', title: '副代词 y',
    point: '代替「à / dans / sur + 地点或事物」：Je vais à Lyon → J\'y vais。也用于 penser à、répondre à 等结构。',
    ex: [
      {fr: 'Tu vas à Lyon ? — Oui, j\'y vais demain.', cn: '你去里昂吗？——去，明天去。'},
      {fr: 'Tu as pensé au rendez-vous ? — Oui, j\'y pense.', cn: '你想过那个预约吗？——想过。'}
    ],
    pitfall: 'y 不代替「à + 人」，那用 lui/leur。',
    quiz: [
      {q: 'Vous allez à la gare ? Oui, nous ___ allons.', opts: ['y', 'en', 'la', 'lui'], a: 0, why: 'aller à + 地点 → y。'}
    ]
  },
  {
    id: 'g-a2-08', lv: 'A2', cat: '代词', fr: 'Le pronom en', title: '副代词 en',
    point: '代替「de + 名词」或数量：Tu veux du café ? — Oui, j\'en veux. 数量词（un, deux, beaucoup）要留在后面：j\'en ai deux.',
    ex: [
      {fr: 'Tu veux du café ? — Oui, j\'en veux.', cn: '你要咖啡吗？——要。'},
      {fr: 'Combien d\'enfants a-t-elle ? — Elle en a deux.', cn: '她有几个孩子？——两个。'}
    ],
    quiz: [
      {q: 'Il veut du pain ? Oui, il ___ veut.', opts: ['en', 'y', 'le', 'des'], a: 0, why: 'vouloir de + 名词 → en。'},
      {q: 'Tu as des frères ? Oui, j\'___ ai deux.', opts: ['en', 'y', 'les', 'deux'], a: 0, why: '数量表达用 en，数字保留。'}
    ]
  },
  {
    id: 'g-a2-09', lv: 'A2', cat: '形容词与数量', fr: 'Le comparatif', title: '比较级',
    point: '形容词：plus / moins / aussi + 形容词 + que。名词用 plus de / moins de / autant de + 名词 + que。bon → meilleur，bien → mieux。',
    ex: [
      {fr: 'Le TGV est plus rapide que le bus.', cn: '高铁比公交快。'},
      {fr: 'Elle est moins fatiguée qu\'hier.', cn: '她比昨天不那么累。'},
      {fr: 'C\'est le meilleur restaurant du quartier.', cn: '这是本区最好的餐厅。'}
    ],
    pitfall: 'plus bon 不存在，用 meilleur；副词比较用 mieux。',
    quiz: [
      {q: 'Ton idée est ___ que la mienne.', opts: ['meilleure', 'meilleur', 'mieux', 'plus bonne'], a: 0, why: 'idée 阴性 → meilleure。'},
      {q: 'Il y a ___ de monde qu\'hier.', opts: ['plus', 'plusieurs', 'mieux', 'meilleur'], a: 0, why: '名词比较用 plus de + 名词。'}
    ]
  },
  {
    id: 'g-a2-10', lv: 'A2', cat: '形容词与数量', fr: 'Le superlatif', title: '最高级',
    point: '定冠词 + plus / moins + 形容词（+ de + 范围）。最高级的定冠词与名词性数一致：la plus grande ville de France。',
    ex: [
      {fr: 'Paris est la plus grande ville de France.', cn: '巴黎是法国最大的城市。'},
      {fr: 'C\'est le moins cher des trois.', cn: '这是三个里最便宜的。'}
    ],
    quiz: [
      {q: 'C\'est ___ bon restaurant de la ville.', opts: ['le plus', 'la plus', 'plus', 'le mieux'], a: 0, why: 'restaurant 阳性单数 → le plus。'}
    ]
  },
  {
    id: 'g-a2-11', lv: 'A2', cat: '动词与时态', fr: 'Le futur simple', title: '简单将来时',
    point: '表示将来要发生的事，书面与正式口语常用。构成：不定式 + -ai, -as, -a, -ons, -ez, -ont；-re 结尾去掉 e。',
    table: {
      head: ['', 'parler', 'finir', 'prendre', 'être'],
      rows: [['je', 'parlerai', 'finirai', 'prendrai', 'serai'], ['nous', 'parlerons', 'finirons', 'prendrons', 'serons']]
    },
    ex: [
      {fr: 'Je partirai en vacances en août.', cn: '我八月会去度假。'},
      {fr: 'Quand tu arriveras, appelle-moi.', cn: '你到了给我打电话。'}
    ],
    pitfall: '常见不规则词干：aller→ir-、être→ser-、avoir→aur-、faire→fer-、venir→viendr-、voir→verr-、pouvoir→pourr-、savoir→saur-。',
    quiz: [
      {q: 'L\'année prochaine, nous ___ à Paris.', opts: ['irons', 'allons', 'allions', 'irions'], a: 0, why: 'aller 将来时 → irons。'}
    ]
  },
  {
    id: 'g-a2-12', lv: 'A2', cat: '语式与非谓语', fr: 'Le conditionnel de politesse', title: '条件式现在时：礼貌与委婉',
    point: '构成同将来时词干 + imparfait 词尾。最常用在礼貌请求：Je voudrais…、Pourriez-vous…，比现在时客气。',
    ex: [
      {fr: 'Je voudrais un billet pour Lyon, s\'il vous plaît.', cn: '我想买一张去里昂的票。'},
      {fr: 'Pourriez-vous parler plus lentement ?', cn: '您能说得慢一点吗？'}
    ],
    quiz: [
      {q: '___ -vous m\'aider, s\'il vous plaît ?', opts: ['Pourriez', 'Pouvez-vous', 'Pourrez', 'Puissiez'], a: 0, why: '礼貌请求用条件式 pourriez。'}
    ]
  },
  {
    id: 'g-a2-13', lv: 'A2', cat: '句型与从句', fr: 'Les pronoms relatifs qui, que, où', title: '关系代词 qui / que / où',
    point: 'qui 在从句中作主语，que 作直接宾语（后面必须接主语），où 表地点或时间。判断口诀：缺主语用 qui，缺宾语用 que。',
    ex: [
      {fr: 'Le livre qui est sur la table est à moi.', cn: '桌上的那本书是我的。'},
      {fr: 'La femme que j\'ai rencontrée hier est médecin.', cn: '我昨天遇到的那位女士是医生。'},
      {fr: 'La ville où je suis né est petite.', cn: '我出生的城市很小。'}
    ],
    quiz: [
      {q: 'C\'est le film ___ m\'a plu.', opts: ['qui', 'que', 'dont', 'où'], a: 0, why: '从句缺主语 → qui。'},
      {q: 'La personne ___ j\'ai vue hier est ma voisine.', opts: ['que', 'qui', 'dont', 'où'], a: 0, why: '从句缺直接宾语 → que。'}
    ]
  },
  {
    id: 'g-a2-14', lv: 'A2', cat: '句型与从句', fr: 'La négation avancée', title: '否定进阶：personne / rien / aucun / jamais',
    point: '除了 ne…pas，还有 ne…personne（没人）、ne…rien（什么也没）、ne…aucun(e)（没有任何）、ne…jamais（从不）、ne…plus（不再）。复合时态中放助动词之后。',
    ex: [
      {fr: 'Il n\'y a personne dans la salle.', cn: '房间里没有人。'},
      {fr: 'Je n\'ai aucune idée.', cn: '我一点想法都没有。'},
      {fr: 'Elle n\'est plus fatiguée.', cn: '她不再累了。'}
    ],
    pitfall: 'aucun 后接名词要配合阴阳性：aucun problème / aucune question。',
    quiz: [
      {q: 'Je ne trouve ___ mon passeport.', opts: ['pas', 'personne', 'rien', 'aucun'], a: 0, why: '「找不到」用 ne…pas；rien 后不能接名词宾语。'}
    ]
  },
  {
    id: 'g-a2-15', lv: 'A2', cat: '形容词与数量', fr: 'Les quantités', title: '数量与程度：très / trop / assez / autant',
    point: 'très 很（+形容词/副词）、trop 太、assez 够、beaucoup de + 名词、un peu de + 名词、autant que 一样多。数字后接名词不加冠词：deux livres。',
    ex: [
      {fr: 'Il y a beaucoup de monde au marché.', cn: '市场里人很多。'},
      {fr: 'Tu as trop de travail.', cn: '你工作太多了。'},
      {fr: 'Elle travaille autant que moi.', cn: '她和我一样努力。'}
    ],
    quiz: [
      {q: 'Il y a ___ de bruit ici.', opts: ['beaucoup', 'très', 'bien', 'assez de'], a: 0, why: '名词前用 beaucoup de。'}
    ]
  },
  {
    id: 'g-a2-16', lv: 'A2', cat: '介词·副词·连接', fr: 'Depuis, pendant, il y a, dans', title: '时间介词：depuis / pendant / il y a / dans',
    point: 'depuis 自从（持续到现在，用现在时）；pendant 在……期间（已结束）；il y a 用于多久以前；dans 用于多久以后（将来）。',
    ex: [
      {fr: 'J\'apprends le français depuis six mois.', cn: '我学法语六个月了。'},
      {fr: 'J\'ai habité à Bordeaux pendant trois ans.', cn: '我在波尔多住了三年。'},
      {fr: 'J\'ai déménagé il y a deux ans.', cn: '我两年前搬了家。'},
      {fr: 'Je partirai dans une heure.', cn: '我一小时后出发。'}
    ],
    pitfall: 'depuis + 现在时表示持续（法语不用现在完成时来表达这个意思）：J\'apprends depuis six mois ✓。',
    quiz: [
      {q: 'Elle travaille ici ___ deux ans.', opts: ['depuis', 'pendant', 'il y a', 'dans'], a: 0, why: '持续到现在用 depuis。'},
      {q: 'Je suis arrivé ___ trois jours.', opts: ['il y a', 'depuis', 'pendant', 'dans'], a: 0, why: '「三天前」用 il y a。'}
    ]
  },
  {
    id: 'g-a2-17', lv: 'A2', cat: '代词', fr: 'Impératif + pronoms', title: '命令式与代词的位置',
    point: '肯定命令式里代词放动词后用连字符：Donne-le-moi ! Parle-lui ! Vas-y ! 否定命令式代词回到动词前：Ne le lui donne pas.',
    ex: [
      {fr: 'Parle-lui demain.', cn: '明天跟他讲。'},
      {fr: 'Vas-y, tu peux le faire !', cn: '去吧，你能做到！'},
      {fr: 'Ne me le demande pas.', cn: '别问我这个。'}
    ],
    pitfall: '肯定命令式中 me/te 变 moi/toi：Donne-moi. 且 -er 动词 tu 形式不许丢 s 后再接 en/y：Parles-en.',
    quiz: [
      {q: 'Ce livre ? ___, s\'il te plaît.', opts: ['Donne-le-moi', 'Donne-me-le', 'Me le donne', 'Donne-lui-le'], a: 0, why: '肯定命令式代词在后：le + moi。'}
    ]
  },
  {
    id: 'g-a2-18', lv: 'A2', cat: '代词', fr: 'On, tout, chacun', title: '泛指代词 on / tout / chacun',
    point: 'on 泛指「人们/我们」，配第三人称单数；tout 全部（tout le monde 所有人、tous 全体阳性复数）；chacun 每个（配单数）。',
    ex: [
      {fr: 'On dit que la ville est belle.', cn: '人们说这座城市很美。'},
      {fr: 'Tout le monde est arrivé.', cn: '所有人都到了。'},
      {fr: 'Chacun a son opinion.', cn: '每个人都有自己的看法。'}
    ],
    quiz: [
      {q: '___ le monde connaît Paris.', opts: ['Tout', 'Tous', 'Chaque', 'On'], a: 0, why: 'tout le monde 固定搭配。'}
    ]
  },
  {
    id: 'g-a2-19', lv: 'A2', cat: '句型与从句', fr: 'Quel et lequel', title: '疑问形容词 quel 与疑问代词',
    point: 'quel / quelle / quels / quelles 后接名词（Quelle heure est-il ?）。lequel / laquelle / lesquels / lesquelles 单独用（Lequel tu préfères ?）。',
    table: {
      head: ['', '阳性单数', '阴性单数', '阳性复数', '阴性复数'],
      rows: [['形容词', 'quel', 'quelle', 'quels', 'quelles'], ['代词', 'lequel', 'laquelle', 'lesquels', 'lesquelles']]
    },
    ex: [
      {fr: 'Quelle heure est-il ?', cn: '现在几点？'},
      {fr: 'Lequel de ces livres tu préfères ?', cn: '这些书里你更喜欢哪一本？'}
    ],
    quiz: [
      {q: '___ est ton plat préféré ?', opts: ['Quel', 'Lequel', 'Quelle', 'Quels'], a: 0, why: '后接名词 plat（阳性单数）→ quel。'}
    ]
  },
  {
    id: 'g-a2-20', lv: 'A2', cat: '代词', fr: 'Cela / ça', title: '中性指示代词 ce / cela / ça',
    point: 'ce 在动词前（C\'est），cela / ça 代替前面整件事，ça 是口语形式。此外 ceci 指后提到的事、cela 指前面的事。',
    ex: [
      {fr: 'C\'est très intéressant, ça !', cn: '这很有意思！'},
      {fr: 'Il pleut ? Cela ne me dérange pas.', cn: '下雨吗？我不介意。'}
    ],
    quiz: [
      {q: '___ ne me plaît pas du tout.', opts: ['Ça', 'Ce', 'Cet', 'Ces'], a: 0, why: '作主语代替整件事用 ça / cela。'}
    ]
  },

  /* ==================== B1 ==================== */
  {
    id: 'g-b1-01', lv: 'B1', cat: '动词与时态', fr: 'Le plus-que-parfait', title: '愈过去时：过去的过去',
    point: '结构：助动词的 imparfait + 过去分词。用于在已过去的叙事中交代更早发生的事，常与 quand、déjà、avant que 搭配。',
    table: {
      head: ['', 'parler', 'partir'],
      rows: [['je', 'avais parlé', 'étais parti(e)'], ['ils', 'avaient parlé', 'étaient partis']]
    },
    ex: [
      {fr: 'Quand je suis arrivé, il était déjà parti.', cn: '我到的时候，他已经走了。'},
      {fr: 'Elle avait oublié ses clés, elle a dû rentrer.', cn: '她忘带钥匙，只好回家。'}
    ],
    quiz: [
      {q: 'Quand je suis arrivé, le film ___ commencé.', opts: ['avait', 'a', 'était', 'avait été'], a: 0, why: 'commencer 用 avoir：avait commencé。'},
      {q: 'Nous ___ déjà mangé quand il a appelé.', opts: ['avions', 'avons', 'étions', 'aurons'], a: 0, why: '助动词的 imparfait → avions mangé。'}
    ]
  },
  {
    id: 'g-b1-02', lv: 'B1', cat: '动词与时态', fr: 'La voix passive', title: '被动语态',
    point: '结构：être（时态随时态变）+ 过去分词 + par（施动者）。过去分词与主语性数一致。新闻、说明文中极常见；口语常改用 on。',
    ex: [
      {fr: 'Cette maison a été construite en 1900.', cn: '这栋房子建于 1900 年。'},
      {fr: 'Le français est parlé dans vingt-neuf pays.', cn: '法语在二十九个国家被使用。'},
      {fr: 'La réunion a été annulée.', cn: '会议被取消了。'}
    ],
    quiz: [
      {q: 'La tour Eiffel ___ construite en 1889.', opts: ['a été', 'est été', 'était construire', 'a construire'], a: 0, why: '被动 + 复合过去时：a été construite。'},
      {q: 'Les déchets ___ triés par les habitants.', opts: ['sont', 'ont', 'est', 'a'], a: 0, why: '现在时被动：sont triés（复数配合）。'}
    ]
  },
  {
    id: 'g-b1-03', lv: 'B1', cat: '语式与非谓语', fr: 'Le subjonctif présent', title: '虚拟式现在时',
    point: '表达必要、意愿、情感、判断时用虚拟式，触发词：il faut que、je veux que、bien que、avant que、pour que。构成：ils 形式词干 + -e, -es, -e, -ions, -iez, -ent。',
    table: {
      head: ['', 'que je', 'que tu', 'qu\'il', 'que nous', 'que vous', 'qu\'ils'],
      rows: [
        ['parler', 'parle', 'parles', 'parle', 'parlions', 'parliez', 'parlent'],
        ['être', 'sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
        ['avoir', 'aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
        ['aller', 'aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent']
      ]
    },
    ex: [
      {fr: 'Il faut que tu partes maintenant.', cn: '你现在必须走了。'},
      {fr: 'Je veux que vous soyez à l\'heure.', cn: '我希望你们准时。'},
      {fr: 'Bien que ce soit difficile, je continue.', cn: '虽然很难，我还是继续。'}
    ],
    pitfall: 'espérer que 用直陈式；而 je souhaite que / je regrette que 用虚拟式。',
    quiz: [
      {q: 'Il faut que tu ___ .', opts: ['viennes', 'viens', 'viendras', 'venais'], a: 0, why: 'il faut que + 虚拟式：venir → viennes。'},
      {q: 'Bien qu\'il ___ fatigué, il travaille.', opts: ['soit', 'est', 'sera', 'était'], a: 0, why: 'bien que 永远接虚拟式。'}
    ]
  },
  {
    id: 'g-b1-04', lv: 'B1', cat: '句型与从句', fr: 'Le pronom relatif dont', title: '关系代词 dont',
    point: '代替「de + 名词」，用于 parler de、avoir besoin de、s\'occuper de、être fier de 等结构；也可表示所属（l\'homme dont le fils est médecin）。',
    ex: [
      {fr: 'L\'appartement dont je rêve est trop cher.', cn: '我梦想的公寓太贵了。'},
      {fr: 'C\'est un problème dont on parle souvent.', cn: '这是人们常谈起的问题。'}
    ],
    quiz: [
      {q: 'Le film ___ je te parle est sorti en 2020.', opts: ['dont', 'que', 'qui', 'où'], a: 0, why: 'parler de → dont。'}
    ]
  },
  {
    id: 'g-b1-05', lv: 'B1', cat: '句型与从句', fr: 'Lequel, auquel, duquel', title: '复合关系代词 lequel',
    point: 'lequel / laquelle / lesquels / lesquelles 与介词连用（avec lequel、sur laquelle）。与 à / de 缩合：auquel、auxquels、duquel、desquels。',
    table: {
      head: ['', '阳性', '阴性'],
      rows: [['单数', 'lequel (auquel, duquel)', 'laquelle (à laquelle, de laquelle)'], ['复数', 'lesquels (auxquels, desquels)', 'lesquelles (auxquelles, desquelles)']]
    },
    ex: [
      {fr: 'L\'outil avec lequel je travaille est vieux.', cn: '我工作用的工具很旧。'},
      {fr: 'Le sujet auquel je pense est complexe.', cn: '我想到的那个话题很复杂。'}
    ],
    quiz: [
      {q: 'La personne ___ je pense est absente.', opts: ['à laquelle', 'que', 'dont', 'qui'], a: 0, why: 'penser à → à laquelle。'}
    ]
  },
  {
    id: 'g-b1-06', lv: 'B1', cat: '语式与非谓语', fr: 'Le gérondif', title: '副动词 en + -ant',
    point: '表示「在做某事的同时 / 通过做某事 / 因为做某事」，主语必须与主句一致。是把两句话并成一句的最省力工具。',
    ex: [
      {fr: 'En arrivant à Paris, j\'ai appelé ma famille.', cn: '一到巴黎，我就给家里打了电话。'},
      {fr: 'Il étudie en écoutant de la musique.', cn: '他一边听音乐一边学习。'},
      {fr: 'Elle a appris le français en travaillant à Paris.', cn: '她在巴黎工作期间学会了法语。'}
    ],
    quiz: [
      {q: 'Elle a appris le français ___ travaillant à Paris.', opts: ['en', 'par', 'pour', 'avec'], a: 0, why: '「通过」用副动词 en + -ant。'}
    ]
  },
  {
    id: 'g-b1-07', lv: 'B1', cat: '语式与非谓语', fr: 'Le participe présent', title: '现在分词',
    point: '构成同副动词（-ant），但不用 en，多作形容词或书面语的关系从句替代：Une femme souriante、Les personnes parlant français… 书面色彩强。',
    ex: [
      {fr: 'Les étudiants parlant français peuvent participer.', cn: '会说法语的学生可以参加。'},
      {fr: 'C\'est une histoire très intéressante.', cn: '这是个很有意思的故事。'}
    ],
    pitfall: '现在分词与副动词的区别：有 en 表「同时/方式」，无 en 更接近形容词或书面从句。',
    quiz: [
      {q: 'Choisissez la forme correcte : une histoire ___.', opts: ['intéressante', 'intéressant', 'en intéressant', 'intéresser'], a: 0, why: '作形容词要与名词配合 → intéressante。'}
    ]
  },
  {
    id: 'g-b1-08', lv: 'B1', cat: '句型与从句', fr: 'Si + imparfait → conditionnel', title: '假设：si + 未完成过去时 → 条件式',
    point: '表达「与现在事实相反的假设」：si 从句用 imparfait，主句用条件式现在时。铁律：条件式不能出现在 si 从句里。',
    ex: [
      {fr: 'Si j\'avais le temps, je partirais en vacances.', cn: '如果我有时间，我就去度假。'},
      {fr: 'Si tu venais, on serait contents.', cn: '你要是来，我们会很高兴。'}
    ],
    quiz: [
      {q: 'Si j\'étais riche, je ___ le tour du monde.', opts: ['ferais', 'faisais', 'ferai', 'faire'], a: 0, why: 'si + imparfait → 条件式现在时。'},
      {q: 'S\'il ___ plus chaud, on pourrait se baigner.', opts: ['faisait', 'fait', 'fera', 'ferait'], a: 0, why: '主句条件式，si 从句必须 imparfait。'}
    ]
  },
  {
    id: 'g-b1-09', lv: 'B1', cat: '句型与从句', fr: 'L\'expression de la cause', title: '原因表达',
    point: 'parce que 回答 pourquoi（放句中）；comme / puisque 放句首；grâce à（正面的因为）、à cause de（负面的因为）+ 名词；en raison de 更正式。',
    ex: [
      {fr: 'Je suis en retard parce que le bus est bloqué.', cn: '我迟到了，因为公交堵住了。'},
      {fr: 'Comme il pleuvait, le match a été annulé.', cn: '因为下雨，比赛取消了。'},
      {fr: 'Grâce à ton aide, j\'ai fini à temps.', cn: '多亏你帮忙，我按时完成了。'}
    ],
    quiz: [
      {q: 'Le vol a été annulé ___ de la neige.', opts: ['à cause', 'grâce', 'parce que', 'comme'], a: 0, why: '负面原因 + 名词用 à cause de。'}
    ]
  },
  {
    id: 'g-b1-10', lv: 'B1', cat: '句型与从句', fr: 'L\'expression du but', title: '目的表达',
    point: 'pour / afin de + 不定式（主语相同）；pour que / afin que + 虚拟式（主语不同）。但要留意：pour + 名词只表示用途，不表示目的。',
    ex: [
      {fr: 'Je travaille pour gagner de l\'argent.', cn: '我工作是为了赚钱。'},
      {fr: 'Je te prête mon livre pour que tu puisses réviser.', cn: '我把书借给你，好让你能复习。'}
    ],
    quiz: [
      {q: 'Je parle lentement ___ vous compreniez.', opts: ['pour que', 'pour', 'afin de', 'parce que'], a: 0, why: '主从句主语不同 → pour que + 虚拟式。'}
    ]
  },
  {
    id: 'g-b1-11', lv: 'B1', cat: '句型与从句', fr: 'L\'expression de la conséquence', title: '结果表达',
    point: 'donc 所以、c\'est pourquoi 所以、si bien que 以至于、tellement… que 如此……以至于、assez… pour 足够……可以。',
    ex: [
      {fr: 'Il pleuvait, donc nous sommes restés.', cn: '下雨了，所以我们留下来了。'},
      {fr: 'Il a tellement travaillé qu\'il est tombé malade.', cn: '他工作得太拼，结果病倒了。'}
    ],
    quiz: [
      {q: 'Il fait ___ froid que je reste à la maison.', opts: ['tellement', 'tant', 'si bien', 'assez'], a: 0, why: 'tellement… que 表程度结果。'}
    ]
  },
  {
    id: 'g-b1-12', lv: 'B1', cat: '句型与从句', fr: 'La concession', title: '让步与对立',
    point: 'bien que + 虚拟式（尽管）；même si + 直陈式（即使）；quoique 书面；malgré + 名词；alors que 表对照（而……）。',
    ex: [
      {fr: 'Bien que la question soit complexe, elle mérite d\'être posée.', cn: '尽管问题复杂，仍值得提出。'},
      {fr: 'Même si les prix montent, il achète bio.', cn: '即使物价上涨，他还是买有机食品。'},
      {fr: 'Malgré la fatigue, elle a continué.', cn: '尽管很累，她继续了。'}
    ],
    quiz: [
      {q: 'Bien que nous ___ fatigués, nous continuons.', opts: ['soyons', 'sommes', 'serons', 'étions'], a: 0, why: 'bien que + 虚拟式 → soyons。'},
      {q: '___ la pluie, nous sommes sortis.', opts: ['Malgré', 'Bien que', 'Même si', 'Parce que'], a: 0, why: 'malgré + 名词短语。'}
    ]
  },
  {
    id: 'g-b1-13', lv: 'B1', cat: '句型与从句', fr: 'L\'expression du temps', title: '时间表达：avant de / après avoir',
    point: 'avant de + 不定式（同一主语）；après avoir / être + 过去分词；dès que、aussitôt que 一……就；en attendant 在等待期间。',
    ex: [
      {fr: 'Avant de partir, ferme la fenêtre.', cn: '走之前把窗关上。'},
      {fr: 'Après avoir mangé, il est sorti.', cn: '吃完饭他出去了。'},
      {fr: 'Dès que tu arrives, appelle-moi.', cn: '你一到就给我打电话。'}
    ],
    quiz: [
      {q: '___ avoir fini, elle est partie.', opts: ['Après', 'Avant', 'Depuis', 'Dès'], a: 0, why: 'après avoir + 过去分词。'}
    ]
  },
  {
    id: 'g-b1-14', lv: 'B1', cat: '句型与从句', fr: 'Le discours indirect', title: '间接引语与时态配合',
    point: '转述别人的话：主句过去时 → 引语整体后移（现在→imparfait；复合过去→愈过去；将来→条件式），时间词也变（demain→le lendemain，hier→la veille）。是非疑问用 si 转述。',
    ex: [
      {fr: 'Il a dit qu\'il viendrait le lendemain.', cn: '他说他第二天会来。'},
      {fr: 'Elle m\'a demandé si j\'avais fini.', cn: '她问我做完了没有。'},
      {fr: 'Il a expliqué qu\'il avait eu un problème.', cn: '他解释说遇到了一个问题。'}
    ],
    quiz: [
      {q: 'Il a dit qu\'il ___ le lendemain.', opts: ['viendrait', 'viendra', 'viendrais', 'vient'], a: 0, why: '主句过去时，将来时后移为条件式。'},
      {q: 'Elle m\'a demandé ___ j\'étais prêt.', opts: ['si', 'que', 'qu\'', 'ce que'], a: 0, why: '转述是非疑问用 si。'}
    ]
  },
  {
    id: 'g-b1-15', lv: 'B1', cat: '语式与非谓语', fr: 'Devoir et pouvoir : la modalisation', title: '情态推测：devoir / pouvoir',
    point: 'devoir 表示推测（il doit être là = 他应该在那儿）；pouvoir 表示可能（il peut pleuvoir = 可能会下雨）；条件式更委婉（il devrait arriver）。',
    ex: [
      {fr: 'Il est en réunion, il doit être occupé.', cn: '他在开会，应该很忙。'},
      {fr: 'Il peut pleuvoir cet après-midi.', cn: '今天下午可能会下雨。'}
    ],
    quiz: [
      {q: 'La lumière est allumée : il ___ être à la maison.', opts: ['doit', 'peut', 'veut', 'sait'], a: 0, why: 'devoir 表推测「应该」。'}
    ]
  },
  {
    id: 'g-b1-16', lv: 'B1', cat: '代词', fr: 'Le pronom neutre le', title: '中性代词 le 与 cela',
    point: 'le 可代替前面整句或形容词所表示的内容，此时不变化：Elle est fatiguée ? — Je le suis aussi. 另有 cela / ceci 指代整件事。',
    ex: [
      {fr: 'Tu es prêt ? — Oui, je le suis.', cn: '你准备好了吗？——是的。'},
      {fr: 'Il est absent, je le savais.', cn: '他缺席，我早知道。'}
    ],
    quiz: [
      {q: 'Elle est contente, et je ___ suis aussi.', opts: ['le', 'la', 'les', 'lui'], a: 0, why: '中性 le 代替形容词内容，不配合。'}
    ]
  },
  {
    id: 'g-b1-17', lv: 'B1', cat: '动词与时态', fr: 'L\'accord du participe passé', title: '过去分词配合进阶',
    point: '用 avoir 时，若直接宾语在动词前必须配合（les lettres que j\'ai écrites）；用 être 与主语配合；代词式动词若代词是直接宾语则配合（elle s\'est levée），若为间接宾语则不配合（elles se sont parlé）。',
    ex: [
      {fr: 'Les lettres que j\'ai écrites sont parties.', cn: '我写的那些信寄出了。'},
      {fr: 'Elle s\'est levée tôt.', cn: '她起得早（s\' 是直接宾语 → levée）。'},
      {fr: 'Elles se sont parlé.', cn: '她们互相说过话（se 是间接宾语 → 不配合）。'}
    ],
    quiz: [
      {q: 'Les photos que nous avons ___ sont belles.', opts: ['prises', 'pris', 'prendre', 'prennent'], a: 0, why: '直接宾语 photos 前置 → 配合 prises。'}
    ]
  },

  /* ==================== B2 ==================== */
  {
    id: 'g-b2-01', lv: 'B2', cat: '语式与非谓语', fr: 'Le subjonctif passé', title: '虚拟式过去时',
    point: '结构：que + avoir / être 的虚拟式现在时 + 过去分词。表示「到参照时点为止已经完成」的动作，仍由 il faut que、je suis content que、bien que 触发。',
    ex: [
      {fr: 'Il faut que tu aies fini avant midi.', cn: '你必须在中午前完成。'},
      {fr: 'Je suis content que tu sois venu.', cn: '我很高兴你来了。'},
      {fr: 'Bien qu\'il ait travaillé dur, il a échoué.', cn: '尽管他很努力，还是失败了。'}
    ],
    pitfall: '别与条件式过去时混淆：「本该……」用 j\'aurais dû，不用虚拟式。',
    quiz: [
      {q: 'Je suis content que tu ___ .', opts: ['sois venu', 'sois venir', 'aies venu', 'es venu'], a: 0, why: 'venir 用 être → sois venu。'},
      {q: 'Bien qu\'elle ___ beaucoup, elle n\'a pas réussi.', opts: ['ait travaillé', 'a travaillé', 'travaillait', 'avait travaillé'], a: 0, why: 'bien que + 虚拟式过去时。'}
    ]
  },
  {
    id: 'g-b2-02', lv: 'B2', cat: '语式与非谓语', fr: 'Le conditionnel passé et les trois types de si', title: '条件式过去时与 si 三式',
    point: '三组固定搭配：si + 现在时 → 将来时（可能）；si + imparfait → 条件式现在（假设）；si + 愈过去时 → 条件式过去（反事实）。',
    table: {
      head: ['类型', 'si 从句', '主句'],
      rows: [['可能', 'si + 现在时', '将来时 / 现在时'], ['假设', 'si + imparfait', '条件式现在'], ['反事实', 'si + plus-que-parfait', '条件式过去']]
    },
    ex: [
      {fr: 'Si j\'ai le temps, je viendrai.', cn: '如果我有时间，我就来。'},
      {fr: 'Si j\'avais le temps, je viendrais.', cn: '如果我有时间，我就会来。'},
      {fr: 'Si j\'avais eu le temps, je serais venu.', cn: '要是我当时有时间，我就来了。'}
    ],
    quiz: [
      {q: 'Si nous avions su, nous ___ autrement.', opts: ['aurions agi', 'agirions', 'avions agi', 'agirons'], a: 0, why: 'si + 愈过去时 → 条件式过去。'},
      {q: 'Si tu étudies, tu ___ ton examen.', opts: ['réussiras', 'réussirais', 'réussissais', 'réussis'], a: 0, why: 'si + 现在时 → 主句将来时。'}
    ]
  },
  {
    id: 'g-b2-03', lv: 'B2', cat: '句型与从句', fr: 'La concession avancée', title: '让步进阶：avoir beau / quoi que',
    point: 'avoir beau + 不定式（白费力气）、quoi que + 虚拟式（无论什么）、où que（无论哪里）、quel que soit + 名词（无论哪个）。',
    ex: [
      {fr: 'Il a beau travailler, il n\'avance pas.', cn: '他怎么努力也不见进展。'},
      {fr: 'Quoi que tu fasses, préviens-moi.', cn: '不管做什么，告诉我一声。'},
      {fr: 'Quel que soit le prix, je l\'achète.', cn: '不管什么价格我都买。'}
    ],
    quiz: [
      {q: 'Elle a ___ de demander, on a refusé.', opts: ['beau', 'bon', 'bien', 'mieux'], a: 0, why: 'avoir beau + 不定式 = 白费力气。'}
    ]
  },
  {
    id: 'g-b2-04', lv: 'B2', cat: '书面表达与语域', fr: 'La nominalisation', title: '名词化：书面语的压缩术',
    point: '把动词或形容词转成名词，句子更紧凑、更学术：augmenter → la hausse / l\'augmentation，réaliser → la réalisation，arriver → l\'arrivée。名词化后要配适当动词（provoquer、entraîner、mesurer）。',
    ex: [
      {fr: 'La hausse des loyers inquiète les habitants.', cn: '房租上涨让居民担忧。'},
      {fr: 'La réalisation du projet a été reportée.', cn: '项目实施被推迟了。'},
      {fr: 'Il faut mesurer la portée réelle de cette mesure.', cn: '需要衡量这项措施的实际影响。'}
    ],
    quiz: [
      {q: 'La ___ des loyers inquiète les habitants.', opts: ['hausse', 'hausser', 'haut', 'haussé'], a: 0, why: 'hausser 的名词形式是 la hausse。'},
      {q: 'Il faut mesurer la ___ réelle de cette réforme.', opts: ['portée', 'porter', 'porté', 'portant'], a: 0, why: 'la portée = 影响范围、分量。'}
    ]
  },
  {
    id: 'g-b2-05', lv: 'B2', cat: '句型与从句', fr: 'La mise en relief', title: '强调结构 c\'est… qui / que',
    point: '突出句子成分：c\'est + 成分 + qui（该成分作从句主语）/ que（作从句宾语）。话题化：Ce qui m\'intéresse, c\'est…',
    ex: [
      {fr: 'C\'est elle qui a tout organisé.', cn: '是她安排了一切。'},
      {fr: 'C\'est cette décision que je critique.', cn: '我批评的正是这个决定。'},
      {fr: 'Ce qui m\'intéresse, c\'est la culture française.', cn: '我感兴趣的是法国文化。'}
    ],
    quiz: [
      {q: 'C\'est mon frère ___ a téléphoné.', opts: ['qui', 'que', 'dont', 'où'], a: 0, why: '被强调成分在从句作主语 → qui。'},
      {q: 'C\'est ce livre ___ je préfère.', opts: ['que', 'qui', 'dont', 'où'], a: 0, why: '被强调成分作直接宾语 → que。'}
    ]
  },
  {
    id: 'g-b2-06', lv: 'B2', cat: '句型与从句', fr: 'Ce dont, ce à quoi, auquel', title: '复杂关系代词：ce dont / ce à quoi',
    point: '先行词是整句或抽象概念时，用 ce qui / ce que / ce dont / ce à quoi。介词 + lequel 系列用于明确先行词：le projet auquel je pense。',
    ex: [
      {fr: 'Ce dont j\'ai besoin, c\'est de calme.', cn: '我需要的正是平静。'},
      {fr: 'Ce à quoi je pense, c\'est à toi.', cn: '我想到的是你。'},
      {fr: 'Le projet auquel il participe est ambitieux.', cn: '他参与的那个项目很有野心。'}
    ],
    quiz: [
      {q: 'Ce ___ j\'ai besoin, c\'est de temps.', opts: ['dont', 'que', 'qui', 'où'], a: 0, why: 'avoir besoin de → ce dont。'}
    ]
  },
  {
    id: 'g-b2-07', lv: 'B2', cat: '句型与从句', fr: 'Le discours indirect avancé', title: '间接引语进阶：转述语气与时间',
    point: '转述命令用 de + 不定式（Il m\'a dit de partir）；转述建议用 de；转述感叹用 comme / que；时间词与指示词要同步调整（aujourd\'hui → ce jour-là，ici → là）。',
    ex: [
      {fr: 'Il m\'a demandé de ne pas fumer.', cn: '他让我别抽烟。'},
      {fr: 'Elle a dit qu\'elle partait ce jour-là.', cn: '她说她那天就走。'}
    ],
    quiz: [
      {q: 'Il m\'a dit ___ patienter.', opts: ['de', 'que', 'à', 'si'], a: 0, why: '转述命令/请求：dire de + 不定式。'}
    ]
  },
  {
    id: 'g-b2-08', lv: 'B2', cat: '介词·副词·连接', fr: 'Les connecteurs logiques avancés', title: '逻辑连接词进阶',
    point: '书面论证常用：néanmoins / toutefois 然而、en revanche 相反、par ailleurs 另外、par conséquent 因此、dans la mesure où 鉴于、étant donné que 鉴于、d\'ailleurs 再说、notamment 尤其。',
    ex: [
      {fr: 'Les prix baissent ; néanmoins, les ventes stagnent.', cn: '价格在降，然而销量停滞。'},
      {fr: 'Dans la mesure où tu es d\'accord, je commence.', cn: '既然你同意，我就开始了。'}
    ],
    quiz: [
      {q: 'Il est jeune ; ___, il a beaucoup d\'expérience.', opts: ['cependant', 'par exemple', 'en effet', 'donc'], a: 0, why: '转折用 cependant / néanmoins。'}
    ]
  },
  {
    id: 'g-b2-09', lv: 'B2', cat: '句型与从句', fr: 'Les hypothèses avancées', title: '假设进阶：au cas où / en cas de',
    point: 'au cas où + 条件式（万一）；en cas de + 名词（如遇……）；à condition que + 虚拟式（只要）；pourvu que + 虚拟式（但愿/只要）。',
    ex: [
      {fr: 'Au cas où il pleuvrait, prends un parapluie.', cn: '万一下雨，带把伞。'},
      {fr: 'En cas d\'urgence, appelez le 15.', cn: '如遇紧急情况，拨打 15。'},
      {fr: 'Le projet sera validé à condition que le budget soit voté.', cn: '只要预算通过，项目就会获批。'}
    ],
    quiz: [
      {q: '___ de retard, prévenez-nous.', opts: ['En cas', 'Au cas où', 'À condition', 'Pourvu'], a: 0, why: 'en cas de + 名词。'}
    ]
  },
  {
    id: 'g-b2-10', lv: 'B2', cat: '语式与非谓语', fr: 'La proposition participiale', title: '分词从句',
    point: '句首用「过去分词/现在分词 + 自己的主语」，书面语常见：Arrivé à Paris, il a appelé sa famille. / Le travail terminé, nous sommes partis. 主语与主句不同时也能用。',
    ex: [
      {fr: 'Le travail terminé, nous sommes partis.', cn: '工作结束后，我们离开了。'},
      {fr: 'Arrivée à Paris, elle a appelé sa famille.', cn: '一到巴黎，她就给家里打了电话。'}
    ],
    quiz: [
      {q: 'Le repas ___, nous avons discuté.', opts: ['terminé', 'terminer', 'terminant', 'se termine'], a: 0, why: '分词从句用过去分词 + 独立主语。'}
    ]
  },
  {
    id: 'g-b2-11', lv: 'B2', cat: '动词与时态', fr: 'Le passé simple (reconnaissance)', title: '简单过去时：阅读识别',
    point: '文学叙事时态，口语不用但阅读必见。第一组 -er：-ai, -as, -a, -âmes, -âtes, -èrent；高频不规则：il fut、il eut、il fit、il vint、il prit、il dit、il vit。',
    table: {
      head: ['', 'parler', 'être', 'avoir', 'faire'],
      rows: [['il / elle', 'parla', 'fut', 'eut', 'fit'], ['ils / elles', 'parlèrent', 'furent', 'eurent', 'firent']]
    },
    ex: [
      {fr: 'Il entra dans la salle et regarda les invités.', cn: '他走进大厅，看了看宾客。'},
      {fr: 'Elle fut surprise par la réponse.', cn: '她对那个回答感到惊讶。'}
    ],
    quiz: [
      {q: 'Dans un roman : « Il ___ la porte et sortit. »', opts: ['ferma', 'ferme', 'fermera', 'fermait'], a: 0, why: '叙事动作链用简单过去时 ferma。'}
    ]
  },
  {
    id: 'g-b2-12', lv: 'B2', cat: '句型与从句', fr: 'Les tournures impersonnelles', title: '无人称结构',
    point: 'il s\'agit de（涉及）、il convient de（宜于）、il reste à（还有待）、il est question de（谈到）、il vaut mieux（最好）、il suffit de（只需）。书面与报道常用。',
    ex: [
      {fr: 'Dans ce texte, il s\'agit de l\'immigration.', cn: '这篇文章谈的是移民问题。'},
      {fr: 'Il convient de rappeler les faits.', cn: '有必要回顾一下事实。'},
      {fr: 'Il reste à définir les priorités.', cn: '还有待确定优先事项。'}
    ],
    quiz: [
      {q: 'Dans ce chapitre, il ___ de la réforme.', opts: ['s\'agit', 'est', 'faut', 'convient'], a: 0, why: 'il s\'agit de = 关于、涉及。'}
    ]
  },
  {
    id: 'g-b2-13', lv: 'B2', cat: '书面表达与语域', fr: 'Registres : oral et écrit', title: '语域：口语与书面语',
    point: '同一意思三种说法：口语「Je sais pas.」、标准「Je ne sais pas.」、书面「J\'ignore.」；口语常省略 ne、用 on、用 ça；书面用 cela、nous、更正式连接词。考试写作避免口语形式。',
    ex: [
      {fr: 'Oral : « Ouais, c\'est pas terrible. »', cn: '口语：嗯，不怎么样。'},
      {fr: 'Écrit : « Cela ne me paraît pas satisfaisant. »', cn: '书面：这在我看来并不理想。'}
    ],
    quiz: [
      {q: '形式最书面的一句是：', opts: ['Cela ne me paraît pas satisfaisant.', 'C\'est pas top.', 'Ça va pas.', 'Moi, je trouve pas ça bien.'], a: 0, why: '书面用 cela + 完整否定 + 正式动词。'}
    ]
  },
  {
    id: 'g-b2-14', lv: 'B2', cat: '名词与限定词', fr: 'Article zéro et abstraction', title: '冠词省略与抽象表达',
    point: '抽象名词、列举、职务、语言与学科前常省略冠词：avoir faim、parler français、être professeur、avec plaisir。抽象表达常配 faire / avoir + 名词（faire preuve de、avoir recours à）。',
    ex: [
      {fr: 'Elle est professeure de français.', cn: '她是法语老师（职务不加冠词）。'},
      {fr: 'Il faut faire preuve de patience.', cn: '需要有耐心。'},
      {fr: 'Nous avons eu recours à un expert.', cn: '我们求助了一位专家。'}
    ],
    quiz: [
      {q: 'Elle parle ___ français couramment.', opts: ['∅ (不加冠词)', 'le', 'un', 'du'], a: 0, why: '语言名前通常省略冠词（parler français）。'}
    ]
  }

];
