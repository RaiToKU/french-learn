/* 核心语库 · 精读篇目 A1–B2（两篇/级）
   目标：长文恐惧 → 逐句点击朗读、可折叠译文、生词卡、理解题 */
window.FR = window.FR || {};
FR.READINGS = [
  {
    id: 'r-a1-1', lv: 'A1', title: 'Ma journée', titleCn: '我的一天',
    fr: "Je m'appelle Sara. J'ai vingt ans et j'habite à Nantes. Le matin, je me lève à sept heures et je prends un café. À huit heures, je vais à l'université en bus. À midi, je mange avec mes amis. L'après-midi, j'étudie le français. Le soir, je rentre à la maison et je prépare le dîner. Je me couche vers onze heures.",
    cn: '我叫萨拉。我二十岁，住在南特。早上我七点起床，喝一杯咖啡。八点我坐公交去大学。中午我和朋友们一起吃饭。下午我学法语。晚上我回家做晚饭。我十一点左右睡觉。',
    vocab: [
      {w: 'se lever', cn: '起床'},
      {w: 'préparer', cn: '准备；做（饭）'},
      {w: 'rentrer', cn: '回家'},
      {w: 'vers', cn: '大约；朝向'}
    ],
    qs: [
      {q: 'À quelle heure se lève Sara ?', opts: ['À sept heures', 'À huit heures', 'À midi', 'À onze heures'], a: 0, why: '原文：je me lève à sept heures。'},
      {q: 'Comment va-t-elle à l\'université ?', opts: ['En bus', 'En métro', 'À pied', 'En voiture'], a: 0, why: '原文：je vais à l\'université en bus。'},
      {q: 'Que fait-elle le soir ?', opts: ['Elle prépare le dîner', 'Elle étudie le français', 'Elle mange avec ses amis', 'Elle va à l\'université'], a: 0, why: '原文：le soir … je prépare le dîner。'}
    ]
  },
  {
    id: 'r-a1-2', lv: 'A1', title: 'Au marché', titleCn: '在市场',
    fr: "Le samedi matin, je vais au marché avec ma mère. Il y a beaucoup de fruits et de légumes. J'achète un kilo de pommes et trois tomates. Le fromage est un peu cher, mais il est très bon. La vendeuse est très sympa. Je rentre à pied et je prépare le déjeuner pour ma famille. C'est mon moment préféré de la semaine.",
    cn: '周六早上，我和妈妈去市场。那里有很多水果和蔬菜。我买了一公斤苹果和三个西红柿。奶酪有点贵，但很好吃。女摊主很友善。我步行回家，给家人做午饭。这是我一周里最喜欢的时刻。',
    vocab: [
      {w: 'le marché', cn: '市场'},
      {w: 'un kilo de', cn: '一公斤……'},
      {w: 'la vendeuse', cn: '女售货员、摊主'},
      {w: 'préféré', cn: '最喜欢的'}
    ],
    qs: [
      {q: 'Quand va-t-il au marché ?', opts: ['Le samedi matin', 'Le dimanche soir', 'Le lundi matin', 'Tous les jours'], a: 0, why: '原文：Le samedi matin, je vais au marché。'},
      {q: 'Qu\'est-ce qu\'il achète ?', opts: ['Un kilo de pommes et trois tomates', 'Un kilo de tomates et trois pommes', 'Du fromage et du pain', 'Des fruits et du poisson'], a: 0, why: '原文：J\'achète un kilo de pommes et trois tomates。'},
      {q: 'Comment rentre-t-il ?', opts: ['À pied', 'En bus', 'En voiture', 'À vélo'], a: 0, why: '原文：Je rentre à pied。'}
    ]
  },
  {
    id: 'r-a2-1', lv: 'A2', title: 'Un week-end à Lyon', titleCn: '里昂周末',
    fr: "Le week-end dernier, nous sommes allés à Lyon avec deux amis. Nous avons pris le train à sept heures du matin ; le trajet a duré deux heures. Arrivés à Lyon, nous avons visité la vieille ville, puis nous avons déjeuné dans un petit restaurant. L'après-midi, il a commencé à pleuvoir, donc nous avons choisi un musée. Le soir, nous avons dormi dans une chambre d'hôte près de la gare. Le dimanche, nous sommes montés à Fourvière : la vue était magnifique. Nous sommes rentrés fatigués, mais très contents.",
    cn: '上个周末，我和两个朋友去了里昂。我们坐了早上七点的火车，车程两小时。到城里后我们参观了老城，然后在一家小餐馆吃午饭。下午开始下雨，所以我们选了一家博物馆。晚上我们住在火车站附近的一家民宿。周日我们上了富维耶山：景色非常美。我们回来时很累，但非常开心。',
    vocab: [
      {w: 'le trajet', cn: '路程；车程'},
      {w: 'une chambre d\'hôte', cn: '民宿'},
      {w: 'la vue', cn: '景色；视野'},
      {w: 'fatigué', cn: '疲惫的'}
    ],
    qs: [
      {q: 'Combien de temps a duré le trajet ?', opts: ['Deux heures', 'Une heure', 'Trois heures', 'Sept heures'], a: 0, why: '原文：le trajet a duré deux heures。'},
      {q: 'Pourquoi ont-ils choisi un musée ?', opts: ['Parce qu\'il a commencé à pleuvoir', 'Parce que le restaurant était fermé', 'Parce qu\'ils étaient fatigués', 'Parce que le musée était gratuit'], a: 0, why: '原文：il a commencé à pleuvoir, donc nous avons choisi un musée。'},
      {q: 'Où ont-ils dormi ?', opts: ['Dans une chambre d\'hôte près de la gare', 'Dans un hôtel de luxe', 'Chez des amis', 'Dans un camping'], a: 0, why: '原文：dans une chambre d\'hôte près de la gare。'}
    ]
  },
  {
    id: 'r-a2-2', lv: 'A2', title: 'Une très mauvaise journée', titleCn: '倒霉的一天',
    fr: "Hier, j'ai eu une très mauvaise journée. Je me suis réveillé en retard parce que mon réveil n'a pas sonné. J'ai couru pour prendre le bus, mais je l'ai raté. Au travail, j'ai oublié un rendez-vous important : mon collègue a dû me remplacer. À midi, j'ai perdu ma carte bancaire, et le restaurant n'acceptait pas les espèces. Heureusement, une collègue m'a prêté de l'argent. Le soir, j'ai voulu rentrer tôt, mais mon patron m'a demandé de rester. Je suis rentré à dix heures et je me suis couché tout de suite.",
    cn: '昨天我过得很糟。我起床晚了，因为闹钟没响。我跑着去赶公交，但还是错过了。在公司我忘了一个重要的约会，同事只好替我顶上。中午我丢了银行卡，而那家餐厅又不收现金。幸好一位同事借了我钱。晚上我想早点回家，但老板让我留下。我十点才到家，一回去就睡了。',
    vocab: [
      {w: 'rater', cn: '错过；失败'},
      {w: 'remplacer', cn: '代替'},
      {w: 'les espèces', cn: '现金'},
      {w: 'prêter', cn: '借出'}
    ],
    qs: [
      {q: 'Pourquoi s\'est-il réveillé en retard ?', opts: ['Parce que son réveil n\'a pas sonné', 'Parce qu\'il a raté le bus', 'Parce qu\'il a oublié son rendez-vous', 'Parce qu\'il a travaillé tard'], a: 0, why: '原文：parce que mon réveil n\'a pas sonné。'},
      {q: 'Qui l\'a aidé à midi ?', opts: ['Une collègue', 'Son patron', 'Un ami', 'Personne'], a: 0, why: '原文：une collègue m\'a prêté de l\'argent。'},
      {q: 'Que s\'est-il passé le soir ?', opts: ['Son patron lui a demandé de rester', 'Il est rentré très tôt', 'Il a raté le bus', 'Il a retrouvé sa carte'], a: 0, why: '原文：mon patron m\'a demandé de rester。'}
    ]
  },
  {
    id: 'r-b1-1', lv: 'B1', title: 'Le télétravail en France', titleCn: '法国的远程办公',
    fr: "Depuis la crise sanitaire, le télétravail est devenu courant dans beaucoup d'entreprises françaises. Les salariés apprécient surtout la possibilité d'organiser leur temps et d'éviter les transports. Cependant, il faut reconnaître que travailler chez soi présente aussi des inconvénients : les frontières entre vie professionnelle et vie privée deviennent floues, et certains employés se sentent isolés. D'après une enquête récente, si la majorité des salariés souhaite conserver un ou deux jours de télétravail par semaine, peu d'entre eux veulent travailler entièrement à distance. Les entreprises cherchent donc un équilibre et proposent souvent un modèle hybride.",
    cn: '疫情以来，远程办公在法国企业中变得普遍。员工尤其看重能安排自己的时间、避开通勤。然而也得承认，在家工作同样有弊端：工作与私人生活的界限变得模糊，一些员工感到孤立。根据最近一项调查，虽然多数员工希望每周保留一两天远程办公，但很少有人愿意完全远程工作。因此企业都在寻找平衡，常常提出混合办公模式。',
    vocab: [
      {w: 'courant', cn: '普遍的；常见的'},
      {w: 'les frontières floues', cn: '模糊的界限'},
      {w: 'isolé', cn: '孤立的'},
      {w: 'un modèle hybride', cn: '混合模式'}
    ],
    qs: [
      {q: 'Quel est l\'avantage principal du télétravail selon le texte ?', opts: ['Organiser son temps et éviter les transports', 'Gagner plus d\'argent', 'Travailler moins d\'heures', 'Rencontrer de nouveaux collègues'], a: 0, why: '原文：la possibilité d\'organiser leur temps et d\'éviter les transports。'},
      {q: 'Que révèle l\'enquête ?', opts: ['Peu de salariés veulent travailler entièrement à distance', 'Tous les salariés veulent rester chez eux', 'Les salariés refusent le télétravail', 'Les entreprises ont arrêté le télétravail'], a: 0, why: '原文：peu d\'entre eux veulent travailler entièrement à distance。'},
      {q: 'Que proposent souvent les entreprises ?', opts: ['Un modèle hybride', 'Une baisse de salaire', 'Des bureaux plus grands', 'La fin du télétravail'], a: 0, why: '原文：proposent souvent un modèle hybride。'}
    ]
  },
  {
    id: 'r-b1-2', lv: 'B1', title: 'La visite de l\'appartement', titleCn: '看房那天',
    fr: "Quand Léa a décidé de déménager, elle a d'abord cherché un appartement dans un quartier calme, proche de son travail. Elle a visité une dizaine de logements avant d'en trouver un qui lui plaise vraiment. Le loyer était un peu plus élevé que prévu, mais le propriétaire acceptait de réduire le dépôt de garantie. Le jour de la visite, les fenêtres étaient ouvertes et l'appartement paraissait plus grand qu'il ne l'était. « Il ne faut jamais signer le jour même », lui a conseillé sa sœur. Elle a donc attendu une nuit avant de rappeler l'agence pour confirmer.",
    cn: '蕾娅决定搬家后，先在工作附近一个安静的街区找房子。她看了十来套，才找到一套真正合意的。房租比预想的高一些，但房东愿意降低押金。看房那天窗户开着，公寓显得比实际更大。"千万不要当天就签，"她姐姐劝她。于是她等了一夜，才回电话给中介确认。',
    vocab: [
      {w: 'déménager', cn: '搬家'},
      {w: 'un dépôt de garantie', cn: '押金'},
      {w: 'paraître', cn: '显得；看起来'},
      {w: 'signer', cn: '签署'}
    ],
    qs: [
      {q: 'Que cherchait Léa ?', opts: ['Un appartement calme près de son travail', 'Une maison à la campagne', 'Un studio très bon marché', 'Un appartement loin de tout'], a: 0, why: '原文：un appartement dans un quartier calme, proche de son travail。'},
      {q: 'Qu\'a accepté le propriétaire ?', opts: ['De réduire le dépôt de garantie', 'D\'augmenter le loyer', 'De refuser la visite', 'De vendre l\'appartement'], a: 0, why: '原文：le propriétaire acceptait de réduire le dépôt de garantie。'},
      {q: 'Pourquoi l\'appartement paraissait-il plus grand ?', opts: ['Les fenêtres étaient ouvertes', 'Il était vide', 'La lumière était éteinte', 'Il n\'y avait pas de meubles'], a: 0, why: '原文：les fenêtres étaient ouvertes et l\'appartement paraissait plus grand qu\'il ne l\'était。'}
    ]
  },
  {
    id: 'r-b2-1', lv: 'B2', title: 'Réformer les transports urbains', titleCn: '改造城市交通',
    fr: "Les grandes villes françaises sont confrontées à un double défi : réduire la pollution et garantir à chacun l'accès aux transports. Dans ce contexte, la réforme des zones à faibles émissions suscite un vif débat. Certes, la mesure a été présentée comme indispensable pour la santé publique ; néanmoins, elle risque de pénaliser les ménages modestes, pour qui l'achat d'un véhicule récent représente une dépense considérable. Certains élus proposent donc des aides ciblées, tandis que d'autres plaident pour une amélioration préalable de l'offre de transports publics. Quelle que soit la solution retenue, il semble difficile de faire l'économie d'une concertation avec les habitants : faute de comprendre les raisons de la réforme, bon nombre d'entre eux risquent de s'y opposer.",
    cn: '法国大城市面对双重挑战：减少污染，同时保证人人有出行手段。在此背景下，低排放区改革引发激烈争论。诚然，这项措施被说成公共卫生所必需；然而它可能打击低收入家庭——对他们而言，买一辆较新的车是一笔巨大开支。因此一些民选官员主张定向补贴，另一些人则主张先改善公共交通供给。无论最终采用哪种方案，似乎都难以省去与居民协商这一步：如果居民不理解改革的理由，其中相当一部分人很可能会反对。',
    vocab: [
      {w: 'un défi', cn: '挑战'},
      {w: 'pénaliser', cn: '使受损；惩罚'},
      {w: 'les ménages modestes', cn: '低收入家庭'},
      {w: 'la concertation', cn: '协商；征求意见'}
    ],
    qs: [
      {q: 'Quel est le double défi mentionné ?', opts: ['Réduire la pollution et garantir l\'accès aux transports', 'Créer des emplois et construire des routes', 'Baisser les impôts et augmenter les salaires', 'Interdire les voitures et fermer les usines'], a: 0, why: '首句直接给出双重挑战。'},
      {q: 'Quelle critique est adressée à la réforme ?', opts: ['Elle risque de pénaliser les ménages modestes', 'Elle coûte trop cher à l\'État', 'Elle ne réduit pas la pollution', 'Elle favorise les voitures anciennes'], a: 0, why: '原文：elle risque de pénaliser les ménages modestes。'},
      {q: 'Que recommandent certains élus ?', opts: ['Des aides ciblées', 'Une hausse des taxes', 'La fin des transports publics', 'Une réforme plus rapide'], a: 0, why: '原文：Certains élus proposent donc des aides ciblées。'}
    ]
  },
  {
    id: 'r-b2-2', lv: 'B2', title: 'Le coût du travail émotionnel', titleCn: '情绪劳动的代价',
    fr: "Dans les métiers du service, maîtriser ses émotions fait partie des compétences exigées : un sourire constant, une voix posée et une patience à toute épreuve. Pourtant, ce travail émotionnel, longtemps invisible, a un coût. À force de refouler son agacement, le salarié s'expose à une fatigue qui n'a rien à voir avec l'effort physique. Des études récentes, conduites dans des centres d'appel, soulignent ainsi que les pauses et les marges d'autonomie pèsent davantage sur le bien-être que la durée du travail elle-même. Autrement dit, un employeur qui impose une politesse permanente sans rien offrir en retour risque d'obtenir l'inverse de ce qu'il recherche.",
    cn: '在服务行业，控制情绪属于岗位要求：始终微笑、语气平稳、耐心到极点。然而这种长期隐形的"情绪劳动"是有代价的。压抑烦躁久了，员工承受的疲惫与体力付出无关。近期针对呼叫中心的研究指出，休息安排与自主空间对幸福感的影响，比工作时长本身更大。换言之，如果雇主只强制"永远礼貌"却不给任何回报，很可能得到与初衷相反的结果。',
    vocab: [
      {w: 'refouler', cn: '压抑（情绪）'},
      {w: 'l\'agacement', cn: '烦躁'},
      {w: 'la marge d\'autonomie', cn: '自主空间'},
      {w: 'en retour', cn: '作为回报'}
    ],
    qs: [
      {q: 'Que désigne le « travail émotionnel » ?', opts: ['Maîtriser et cacher ses émotions au travail', 'Faire un travail très physique', 'Parler de ses émotions avec ses collègues', 'Travailler dans un hôpital'], a: 0, why: '第一句即定义：maîtriser ses émotions fait partie des compétences exigées。'},
      {q: 'Qu\'est-ce qui pèse le plus sur le bien-être selon les études ?', opts: ['Les pauses et les marges d\'autonomie', 'La durée du travail', 'Le salaire', 'L\'âge des salariés'], a: 0, why: '原文：les pauses et les marges d\'autonomie pèsent davantage sur le bien-être que la durée du travail。'},
      {q: 'Quelle est la conclusion de l\'auteur ?', opts: ['Imposer la politesse sans contrepartie peut nuire au résultat', 'Le sourire améliore la productivité', 'Les centres d\'appel devraient fermer', 'Les émotions n\'ont pas d\'importance au travail'], a: 0, why: '末句：risque d\'obtenir l\'inverse de ce qu\'il recherche。'}
    ]
  }
];
