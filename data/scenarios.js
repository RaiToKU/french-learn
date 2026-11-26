/* 情景口语语库：12 个真实场景
   field: id / title / titleFr / icon / lv / goal / chunks[{fr,cn,note}] / dialogue[{who,side,fr,cn}] / vocab[{w,cn}] / tip */
window.FR = window.FR || {};
FR.SCENES = [
  {
    id: 'cafe', icon: '☕', title: '在咖啡馆点单', titleFr: 'Au café', lv: 'A1–A2',
    goal: '坐下点单、问推荐、结账走人，全程不用换语言。',
    chunks: [
      {fr: 'Bonjour, je voudrais un café et un croissant, s\'il vous plaît.', cn: '您好，我要一杯咖啡和一个牛角包。', note: '点单万能句：je voudrais（比 je veux 礼貌得多）'},
      {fr: 'Qu\'est-ce que vous me conseillez ?', cn: '您给我推荐点什么？'},
      {fr: 'Est-ce que je peux m\'asseoir ici ?', cn: '我可以坐这里吗？'},
      {fr: 'C\'est combien, s\'il vous plaît ?', cn: '请问多少钱？'},
      {fr: 'Je peux payer par carte ?', cn: '我可以刷卡吗？'},
      {fr: 'L\'addition, s\'il vous plaît.', cn: '麻烦结账。'}
    ],
    dialogue: [
      {who: '服务员', side: 'b', fr: 'Bonjour, qu\'est-ce que je vous sers ?', cn: '您好，您要点什么？'},
      {who: '你', side: 'a', fr: 'Bonjour, je voudrais un café et un croissant, s\'il vous plaît.', cn: '您好，我要一杯咖啡和一个牛角包。'},
      {who: '服务员', side: 'b', fr: 'Très bien. Vous le prenez ici ou à emporter ?', cn: '好的。您在这儿吃还是带走？'},
      {who: '你', side: 'a', fr: 'Sur place, merci. Je peux m\'asseoir près de la fenêtre ?', cn: '在这儿吃，谢谢。我可以坐窗边吗？'},
      {who: '服务员', side: 'b', fr: 'Bien sûr. Autre chose ?', cn: '当然。还要别的吗？'},
      {who: '你', side: 'a', fr: 'Non, merci. C\'est combien ?', cn: '不用了，谢谢。多少钱？'},
      {who: '服务员', side: 'b', fr: 'Ça fait six euros vingt.', cn: '一共六欧二十。'},
      {who: '你', side: 'a', fr: 'Par carte, s\'il vous plaît. Merci beaucoup, bonne journée !', cn: '刷卡，谢谢。非常感谢，祝您愉快！'}
    ],
    vocab: [
      {w: 'un croissant', cn: '牛角包'},
      {w: 'sur place', cn: '堂食'},
      {w: 'à emporter', cn: '外带'},
      {w: 's\'asseoir', cn: '坐下'},
      {w: 'autre chose', cn: '别的东西'}
    ],
    tip: '进店先说 Bonjour，直接说 "un café" 会显得生硬。法国咖啡馆坐下来通常更贵，站着喝便宜。'
  },
  {
    id: 'gare', icon: '🚄', title: '买火车票与问站台', titleFr: 'À la gare', lv: 'A1–A2',
    goal: '说清单程/往返、时间、换乘，听清站台和晚点信息。',
    chunks: [
      {fr: 'Un aller-retour pour Lyon, s\'il vous plaît.', cn: '一张去里昂的往返票。', note: 'aller simple = 单程 / aller-retour = 往返'},
      {fr: 'À quelle heure part le prochain train ?', cn: '下一班火车几点发车？'},
      {fr: 'Il y a une correspondance ?', cn: '需要换乘吗？'},
      {fr: 'Sur quel quai ?', cn: '在几号站台？'},
      {fr: 'Le train a du retard ?', cn: '火车晚点了吗？'},
      {fr: 'Combien de temps dure le trajet ?', cn: '车程多长时间？'}
    ],
    dialogue: [
      {who: '你', side: 'a', fr: 'Bonjour, je voudrais un aller-retour pour Lyon demain matin.', cn: '您好，我要一张明天早上到里昂的往返票。'},
      {who: '售票员', side: 'b', fr: 'À quelle heure souhaitez-vous partir ?', cn: '您想几点出发？'},
      {who: '你', side: 'a', fr: 'Vers huit heures, si possible. En seconde classe.', cn: '如果可能，八点左右。二等座。'},
      {who: '售票员', side: 'b', fr: 'Il y a un train à 8 h 12, avec un changement à Dijon.', cn: '8 点 12 分有一班，在第戎换乘。'},
      {who: '你', side: 'a', fr: 'Combien de temps dure le trajet ?', cn: '车程多久？'},
      {who: '售票员', side: 'b', fr: 'Deux heures dix. Départ quai numéro 7.', cn: '两小时十分钟。7 号站台发车。'},
      {who: '你', side: 'a', fr: 'Parfait. C\'est combien ?', cn: '太好了。多少钱？'},
      {who: '售票员', side: 'b', fr: 'Quarante-cinq euros. Bon voyage !', cn: '四十五欧。旅途愉快！'}
    ],
    vocab: [
      {w: 'un aller simple', cn: '单程票'},
      {w: 'la seconde classe', cn: '二等座'},
      {w: 'un changement', cn: '换乘'},
      {w: 'un quai', cn: '站台'},
      {w: 'composter', cn: '打票（上车前）'}
    ],
    tip: 'TER 等无订位纸质票上车前要打票（composter）；TGV 有订位票不需要打票，但建议提前 20 分钟到。'
  },
  {
    id: 'hotel', icon: '🛎', title: '酒店入住与退房', titleFr: 'À l\'hôtel', lv: 'A2',
    goal: '报预订、问早餐与 wifi、确认退房时间、寄存行李。',
    chunks: [
      {fr: 'J\'ai réservé une chambre au nom de Wang.', cn: '我用王的名字订了一间房。'},
      {fr: 'Le petit-déjeuner est compris ?', cn: '含早餐吗？'},
      {fr: 'À quelle heure faut-il libérer la chambre ?', cn: '几点退房？'},
      {fr: 'Le code du wifi, s\'il vous plaît ?', cn: '请问 wifi 密码是多少？'},
      {fr: 'Est-ce que je peux laisser ma valise ici cet après-midi ?', cn: '我下午可以把行李寄存在这里吗？'},
      {fr: 'Je voudrais régler la note.', cn: '我想结账。'}
    ],
    dialogue: [
      {who: '前台', side: 'b', fr: 'Bonsoir, vous avez une réservation ?', cn: '晚上好，您有预订吗？'},
      {who: '你', side: 'a', fr: 'Oui, j\'ai réservé une chambre double au nom de Wang.', cn: '有，我用王的名字订了一间双人房。'},
      {who: '前台', side: 'b', fr: 'Très bien. Deux nuits, c\'est ça ? Voici votre clé, chambre 304.', cn: '好的。住两晚，对吗？这是您的钥匙，304 房。'},
      {who: '你', side: 'a', fr: 'Merci. Le petit-déjeuner est compris ?', cn: '谢谢。含早餐吗？'},
      {who: '前台', side: 'b', fr: 'Oui, de sept à dix heures, au premier étage.', cn: '含，七点到十点，在二层（法式一层）。'},
      {who: '你', side: 'a', fr: 'Parfait. Le code du wifi, s\'il vous plaît ?', cn: '很好。请问 wifi 密码？'},
      {who: '前台', side: 'b', fr: 'Il est sur la carte-clé. Bon séjour !', cn: '在房卡上。祝您住得愉快！'},
      {who: '你', side: 'a', fr: 'Merci. À quelle heure faut-il libérer la chambre ?', cn: '谢谢。几点退房？'},
      {who: '前台', side: 'b', fr: 'Avant midi. Si vous voulez, on garde vos bagages.', cn: '中午之前。如果需要，我们可以帮您寄存行李。'}
    ],
    vocab: [
      {w: 'une chambre double', cn: '双人房（一张大床）'},
      {w: 'compris', cn: '包含在内的'},
      {w: 'libérer la chambre', cn: '退房'},
      {w: 'la note', cn: '账单'},
      {w: 'un bagage', cn: '行李'}
    ],
    tip: '法国 "double" 是一张大床，"twin" 才是两张单人床；退房时间多为 11–12 点。'
  },
  {
    id: 'route', icon: '🗺', title: '问路与方向', titleFr: 'Demander son chemin', lv: 'A1–A2',
    goal: '开口求助、听懂方向描述、请对方重复。',
    chunks: [
      {fr: 'Excusez-moi, je cherche la gare.', cn: '打扰一下，我在找火车站。'},
      {fr: 'Je suis perdu, vous pouvez m\'aider ?', cn: '我迷路了，您能帮我吗？'},
      {fr: 'C\'est loin d\'ici ?', cn: '离这儿远吗？'},
      {fr: 'C\'est à combien de minutes à pied ?', cn: '步行要几分钟？'},
      {fr: 'Tournez à gauche au feu, puis tout droit.', cn: '在红绿灯左转，然后一直走。'},
      {fr: 'C\'est juste en face de la banque.', cn: '就在银行正对面。'}
    ],
    dialogue: [
      {who: '路人', side: 'b', fr: 'Vous cherchez quelque chose ?', cn: '您在找什么吗？'},
      {who: '你', side: 'a', fr: 'Oui, je cherche le musée d\'Orsay. Je suis un peu perdu.', cn: '是的，我在找奥赛博物馆。我有点迷路了。'},
      {who: '路人', side: 'b', fr: 'Ce n\'est pas loin. Allez tout droit jusqu\'au feu, puis tournez à droite.', cn: '不远。一直走到红绿灯，然后右转。'},
      {who: '你', side: 'a', fr: 'D\'accord. Et ensuite ?', cn: '好的。然后呢？'},
      {who: '路人', side: 'b', fr: 'Après le pont, prenez la deuxième rue à gauche. Le musée est en face d\'un jardin.', cn: '过桥之后，走左边第二条街。博物馆在一个花园对面。'},
      {who: '你', side: 'a', fr: 'C\'est à combien de minutes à pied ?', cn: '步行要几分钟？'},
      {who: '路人', side: 'b', fr: 'Dix minutes environ.', cn: '大约十分钟。'},
      {who: '你', side: 'a', fr: 'Merci beaucoup de votre aide !', cn: '非常感谢您的帮助！'},
      {who: '路人', side: 'b', fr: 'Je vous en prie. Bonne visite !', cn: '不客气。参观愉快！'}
    ],
    vocab: [
      {w: 'tout droit', cn: '一直（往前）'},
      {w: 'au feu', cn: '在红绿灯处'},
      {w: 'en face de', cn: '在……对面'},
      {w: 'à gauche / à droite', cn: '左边 / 右边'},
      {w: 'environ', cn: '大约'}
    ],
    tip: '方向描述核心词：tout droit、au feu、après le pont、la deuxième rue。听不懂就说 « plus lentement, s\'il vous plaît »。'
  },
  {
    id: 'marche', icon: '🥕', title: '市场买菜与付款', titleFr: 'Au marché', lv: 'A1–A2',
    goal: '报数量、问价格、应对"刷卡限额"的小尴尬。',
    chunks: [
      {fr: 'Je voudrais un kilo de tomates, s\'il vous plaît.', cn: '我要一公斤西红柿。'},
      {fr: 'C\'est tout ?', cn: '就这些吗？'},
      {fr: 'Ça fait combien ?', cn: '一共多少钱？'},
      {fr: 'Vous avez des œufs frais ?', cn: '你们有新鲜的鸡蛋吗？'},
      {fr: 'Je le prends.', cn: '我要这个。', note: '决定购买时用 prendre，不用 acheter 的变位'},
      {fr: 'Vous pouvez me mettre ça dans un sac ?', cn: '能帮我装个袋吗？'}
    ],
    dialogue: [
      {who: '你', side: 'a', fr: 'Bonjour, je voudrais un kilo de tomates et deux courgettes.', cn: '您好，我要一公斤西红柿和两根西葫芦。'},
      {who: '摊主', side: 'b', fr: 'Voilà. Et avec ça ?', cn: '给您。还要别的吗？'},
      {who: '你', side: 'a', fr: 'Vous avez des œufs frais ?', cn: '有新鲜鸡蛋吗？'},
      {who: '摊主', side: 'b', fr: 'Bien sûr, six ou douze ?', cn: '当然，六个还是十二个？'},
      {who: '你', side: 'a', fr: 'Six, s\'il vous plaît. Ça fait combien ?', cn: '六个，谢谢。一共多少？'},
      {who: '摊主', side: 'b', fr: 'Sept euros quarante.', cn: '七欧四十。'},
      {who: '你', side: 'a', fr: 'Je peux payer par carte ?', cn: '可以刷卡吗？'},
      {who: '摊主', side: 'b', fr: 'La carte, à partir de dix euros, désolé.', cn: '抱歉，要满十欧才能刷卡。'},
      {who: '你', side: 'a', fr: 'Alors je prends aussi ce fromage. Voilà.', cn: '那我把这块奶酪也买了。给您。'}
    ],
    vocab: [
      {w: 'un kilo de', cn: '一公斤……'},
      {w: 'des œufs frais', cn: '新鲜鸡蛋'},
      {w: 'je le prends', cn: '我买这个'},
      {w: 'à partir de', cn: '从……起'},
      {w: 'un sac', cn: '袋子'}
    ],
    tip: '市场里 « je voudrais » 和 « je vais prendre » 最自然；小摊常设刷卡最低金额，带点现金。'
  },
  {
    id: 'vetement', icon: '👕', title: '试衣服与换货', titleFr: 'Essayer et échanger', lv: 'A2',
    goal: '要尺码、试穿、问换货与退款政策。',
    chunks: [
      {fr: 'Je peux essayer cette chemise ?', cn: '我可以试一下这件衬衫吗？'},
      {fr: 'Vous l\'avez en taille M ?', cn: '有 M 码吗？'},
      {fr: 'Elle est un peu trop serrée.', cn: '有点太紧了。'},
      {fr: 'C\'est possible de l\'échanger si ça ne va pas ?', cn: '如果不合适可以换吗？'},
      {fr: 'Je voudrais un remboursement.', cn: '我想退款。'},
      {fr: 'Je peux avoir la facture, s\'il vous plaît ?', cn: '可以给我开发票吗？'}
    ],
    dialogue: [
      {who: '店员', side: 'b', fr: 'Bonjour, je peux vous aider ?', cn: '您好，需要帮忙吗？'},
      {who: '你', side: 'a', fr: 'Oui, je cherche une chemise blanche en taille M.', cn: '是的，我在找一件白色 M 码衬衫。'},
      {who: '店员', side: 'b', fr: 'Voilà, les cabines sont au fond.', cn: '给您，试衣间在里边。'},
      {who: '你', side: 'a', fr: 'Merci. … Elle est un peu trop serrée. Vous avez la taille au-dessus ?', cn: '谢谢。……有点紧。有大一号的吗？'},
      {who: '店员', side: 'b', fr: 'Je vais voir. Tenez, la L.', cn: '我去看看。给您，L 码。'},
      {who: '你', side: 'a', fr: 'C\'est parfait. Si ça ne va pas, je peux l\'échanger ?', cn: '正好。如果不合适可以换吗？'},
      {who: '店员', side: 'b', fr: 'Oui, sous quinze jours, avec le ticket de caisse.', cn: '可以，十五天内，带小票。'},
      {who: '你', side: 'a', fr: 'Très bien, je la prends.', cn: '好，我买了。'}
    ],
    vocab: [
      {w: 'une cabine', cn: '试衣间'},
      {w: 'la taille', cn: '尺码'},
      {w: 'serré', cn: '紧的'},
      {w: 'le ticket de caisse', cn: '购物小票'},
      {w: 'un remboursement', cn: '退款'}
    ],
    tip: '法国多数商店退货给的是购物券（avoir）或换货，想退钱必须说 « un remboursement » 并带小票。'
  },
  {
    id: 'sante', icon: '🩺', title: '药店描述症状', titleFr: 'À la pharmacie', lv: 'A2',
    goal: '说清症状与过敏史、问用法用量、决定是否看医生。',
    chunks: [
      {fr: 'J\'ai mal à la tête depuis deux jours.', cn: '我头疼两天了。', note: 'avoir mal à + 身体部位：à la tête / au ventre / à la gorge'},
      {fr: 'J\'ai de la fièvre et je tousse.', cn: '我发烧、咳嗽。'},
      {fr: 'Vous avez quelque chose sans ordonnance ?', cn: '有非处方药吗？'},
      {fr: 'Je suis allergique aux antibiotiques.', cn: '我对抗生素过敏。'},
      {fr: 'Il faut le prendre combien de fois par jour ?', cn: '这个一天吃几次？'},
      {fr: 'Je voudrais prendre rendez-vous avec un médecin.', cn: '我想预约看医生。'}
    ],
    dialogue: [
      {who: '你', side: 'a', fr: 'Bonjour, j\'ai mal à la gorge et je tousse depuis trois jours.', cn: '您好，我嗓子疼、咳嗽三天了。'},
      {who: '药剂师', side: 'b', fr: 'Vous avez de la fièvre ?', cn: '发烧吗？'},
      {who: '你', side: 'a', fr: 'Un peu, oui. Trente-huit.', cn: '有一点，三十八度。'},
      {who: '药剂师', side: 'b', fr: 'Je peux vous donner un sirop sans ordonnance.', cn: '我可以给您一种非处方糖浆。'},
      {who: '你', side: 'a', fr: 'Je suis allergique à certains antibiotiques, c\'est un problème ?', cn: '我对某些抗生素过敏，会有问题吗？'},
      {who: '药剂师', side: 'b', fr: 'Non, ce n\'est pas un antibiotique. Une cuillère trois fois par jour.', cn: '不会，这不是抗生素。一天三次，每次一勺。'},
      {who: '你', side: 'a', fr: 'Merci. Si ça ne va pas mieux, je dois voir un médecin ?', cn: '谢谢。如果不见好，我需要看医生吗？'},
      {who: '药剂师', side: 'b', fr: 'Oui, après trois jours, prenez rendez-vous.', cn: '是的，三天之后请预约。'}
    ],
    vocab: [
      {w: 'avoir mal à', cn: '……疼'},
      {w: 'tousser', cn: '咳嗽'},
      {w: 'la fièvre', cn: '发烧'},
      {w: 'sans ordonnance', cn: '无需处方'},
      {w: 'une cuillère', cn: '一勺'}
    ],
    tip: '小病直接找药剂师（pharmacien）即可；急诊说 « c\'est urgent »；医生必须预约。'
  },
  {
    id: 'logement', icon: '🏠', title: '租房与看房', titleFr: 'Chercher un logement', lv: 'B1',
    goal: '问清房租包含项、押金、担保人与入住时间。',
    chunks: [
      {fr: 'Je cherche un studio meublé.', cn: '我在找一间带家具的单间公寓。'},
      {fr: 'Le loyer comprend les charges ?', cn: '房租含水电网等杂费吗？'},
      {fr: 'Il y a un dépôt de garantie ?', cn: '有押金吗？'},
      {fr: 'L\'appartement est disponible à partir de quand ?', cn: '公寓什么时候可以入住？'},
      {fr: 'Je peux visiter demain en fin d\'après-midi ?', cn: '我明天傍晚可以来看房吗？'},
      {fr: 'Qu\'est-ce qui est inclus dans le loyer ?', cn: '房租里包含什么？'}
    ],
    dialogue: [
      {who: '中介', side: 'b', fr: 'Bonjour, vous appelez pour le studio du 12e ?', cn: '您好，您是来问 12 区那间单间的吗？'},
      {who: '你', side: 'a', fr: 'Oui, je cherche un studio meublé pour septembre.', cn: '是的，我在找一间九月起租的带家具单间。'},
      {who: '中介', side: 'b', fr: 'Il fait vingt-deux mètres carrés, au troisième étage.', cn: '二十二平米，三层。'},
      {who: '你', side: 'a', fr: 'Le loyer comprend les charges ?', cn: '房租含杂费吗？'},
      {who: '中介', side: 'b', fr: 'Oui, sauf l\'électricité. Il y a un dépôt de garantie d\'un mois.', cn: '含，除了电费。押金一个月。'},
      {who: '你', side: 'a', fr: 'Je peux visiter demain en fin d\'après-midi ?', cn: '我明天傍晚能来看房吗？'},
      {who: '中介', side: 'b', fr: 'Disons dix-huit heures. Vous avez des garants ?', cn: '就定十八点。您有担保人吗？'},
      {who: '你', side: 'a', fr: 'Oui, mes parents. Je vous envoie les documents ce soir.', cn: '有，我父母。我今晚把材料发给您。'}
    ],
    vocab: [
      {w: 'meublé', cn: '带家具的'},
      {w: 'les charges', cn: '杂费（水电物业）'},
      {w: 'un dépôt de garantie', cn: '押金'},
      {w: 'un garant', cn: '担保人'},
      {w: 'disponible', cn: '可用的；可入住的'}
    ],
    tip: '法国房东几乎都要求担保人；« charges comprises » 要问清不含什么；签约前别付任何「预留费」。'
  },
  {
    id: 'travail', icon: '💼', title: '求职面试', titleFr: 'Un entretien d\'embauche', lv: 'B1',
    goal: '介绍经历、说明动机与到岗时间、主动提问。',
    chunks: [
      {fr: 'Je vous remercie de me recevoir.', cn: '感谢您接待我。'},
      {fr: 'Pouvez-vous me parler de votre expérience ?', cn: '能谈谈您的经验吗？'},
      {fr: 'J\'ai travaillé trois ans dans une entreprise de transport.', cn: '我在一家运输公司工作过三年。'},
      {fr: 'Je suis disponible dès le mois prochain.', cn: '我下个月就能到岗。'},
      {fr: 'Quel est le salaire proposé ?', cn: '提供的薪资是多少？'},
      {fr: 'Quand aurai-je une réponse ?', cn: '什么时候能有答复？'}
    ],
    dialogue: [
      {who: '面试官', side: 'b', fr: 'Bonjour, asseyez-vous. Parlez-moi de votre parcours.', cn: '您好，请坐。谈谈您的经历吧。'},
      {who: '你', side: 'a', fr: 'J\'ai fait des études de commerce, puis j\'ai travaillé trois ans dans la logistique.', cn: '我学的是商科，之后在物流行业工作了三年。'},
      {who: '面试官', side: 'b', fr: 'Pourquoi voulez-vous rejoindre notre entreprise ?', cn: '您为什么想加入我们公司？'},
      {who: '你', side: 'a', fr: 'Parce que vos projets à l\'international m\'intéressent beaucoup.', cn: '因为你们的国际项目让我很感兴趣。'},
      {who: '面试官', side: 'b', fr: 'Quelles sont vos disponibilités ?', cn: '您什么时候可以到岗？'},
      {who: '你', side: 'a', fr: 'Je suis disponible dès le mois prochain.', cn: '我下个月就能到岗。'},
      {who: '面试官', side: 'b', fr: 'Très bien. Avez-vous des questions ?', cn: '很好。您有问题吗？'},
      {who: '你', side: 'a', fr: 'Oui, quel est le salaire proposé et quand aurai-je une réponse ?', cn: '有，请问薪资是多少？什么时候能有答复？'}
    ],
    vocab: [
      {w: 'un parcours', cn: '（职业）经历'},
      {w: 'rejoindre', cn: '加入'},
      {w: 'les disponibilités', cn: '可到岗时间'},
      {w: 'une embauche', cn: '录用'},
      {w: 'le salaire brut / net', cn: '税前 / 税后工资'}
    ],
    tip: '法国面试必谈 « parcours »，结尾一定要问薪资与答复时间，否则显得不专业。'
  },
  {
    id: 'reclamation', icon: '😤', title: '投诉与售后', titleFr: 'Faire une réclamation', lv: 'B1–B2',
    goal: '陈述问题、要求退款、要求书面确认、要求上级。',
    chunks: [
      {fr: 'Il y a un problème avec ma commande.', cn: '我的订单有问题。'},
      {fr: 'Je voudrais être remboursé.', cn: '我想退款。'},
      {fr: 'Ce n\'est pas normal, j\'ai payé pour un service que je n\'ai pas reçu.', cn: '这不正常，我付了钱却没有得到服务。'},
      {fr: 'Pouvez-vous me passer un responsable ?', cn: '能帮我转接负责人吗？'},
      {fr: 'Je vais devoir écrire une réclamation.', cn: '我恐怕得正式书面投诉。'},
      {fr: 'Merci de votre compréhension.', cn: '感谢您的理解。'}
    ],
    dialogue: [
      {who: '你', side: 'a', fr: 'Bonjour, il y a un problème avec ma commande : elle est arrivée abîmée.', cn: '您好，我的订单有问题：到货时已经损坏。'},
      {who: '客服', side: 'b', fr: 'Je suis désolé. Vous avez le numéro de commande ?', cn: '很抱歉。您有订单号吗？'},
      {who: '你', side: 'a', fr: 'Oui, c\'est le 45 892.', cn: '有，45892。'},
      {who: '客服', side: 'b', fr: 'Je peux vous proposer un échange ou un bon d\'achat.', cn: '我们可以给您换货或购物券。'},
      {who: '你', side: 'a', fr: 'J\'aimerais plutôt être remboursé.', cn: '我更希望退款。'},
      {who: '客服', side: 'b', fr: 'Dans ce cas, il faut renvoyer l\'article.', cn: '那样的话需要把商品寄回。'},
      {who: '你', side: 'a', fr: 'Ce n\'est pas normal : j\'ai payé des frais de livraison et le produit est cassé.', cn: '这不合理：我付了运费，而商品是坏的。'},
      {who: '客服', side: 'b', fr: 'Je comprends. Je vous rembourse aussi les frais.', cn: '我理解。运费我也一并退还给您。'},
      {who: '你', side: 'a', fr: 'Merci. Pouvez-vous me confirmer ça par écrit ?', cn: '谢谢。您能书面确认一下吗？'}
    ],
    vocab: [
      {w: 'abîmé', cn: '损坏的'},
      {w: 'un bon d\'achat', cn: '购物券'},
      {w: 'les frais de livraison', cn: '运费'},
      {w: 'par écrit', cn: '以书面形式'},
      {w: 'un responsable', cn: '负责人'}
    ],
    tip: '口头投诉后要 « par écrit » 的确认；正式投诉用法语写挂号信（lettre recommandée）。'
  },
  {
    id: 'social', icon: '🎉', title: '自我介绍与闲聊', titleFr: 'Faire connaissance', lv: 'A1–A2',
    goal: '从「蹦单词」到能撑住 5 分钟寒暄，并自然结束对话。',
    chunks: [
      {fr: 'Enchanté(e), moi c\'est …', cn: '很高兴认识你，我叫……'},
      {fr: 'Tu fais quoi dans la vie ?', cn: '你是做什么工作的？', note: '不是问"在干什么"，是问职业'},
      {fr: 'Je suis étudiant, j\'apprends le français.', cn: '我是学生，在学法语。'},
      {fr: 'Tu es ici depuis longtemps ?', cn: '你在这儿待很久了吗？'},
      {fr: 'On s\'échange nos numéros ?', cn: '我们交换一下号码？'},
      {fr: 'Moi aussi, j\'adore ça.', cn: '我也一样，我超喜欢。'}
    ],
    dialogue: [
      {who: 'Léa', side: 'b', fr: 'Salut, je ne crois pas qu\'on se connaisse. Moi, c\'est Léa.', cn: '嗨，我们好像还不认识。我叫蕾娅。'},
      {who: '你', side: 'a', fr: 'Enchanté, moi c\'est … Je suis arrivé en France il y a trois mois.', cn: '很高兴认识你，我叫……我三个月前到法国。'},
      {who: 'Léa', side: 'b', fr: 'Ah bon ? Tu fais quoi dans la vie ?', cn: '真的？你是做什么的？'},
      {who: '你', side: 'a', fr: 'Je suis étudiant, j\'apprends le français et je travaille un peu.', cn: '我是学生，学法语，也打点零工。'},
      {who: 'Léa', side: 'b', fr: 'Et tu aimes Paris ?', cn: '你喜欢巴黎吗？'},
      {who: '你', side: 'a', fr: 'Beaucoup, même si le métro est parfois compliqué !', cn: '很喜欢，虽然地铁有时候有点复杂！'},
      {who: 'Léa', side: 'b', fr: 'Tu veux boire quelque chose ?', cn: '要不要喝点什么？'},
      {who: '你', side: 'a', fr: 'Avec plaisir, merci. On s\'échange nos numéros ?', cn: '好啊，谢谢。我们交换一下号码？'}
    ],
    vocab: [
      {w: 'enchanté(e)', cn: '很高兴认识（你）'},
      {w: 'faire connaissance', cn: '结识'},
      {w: 'avoir l\'habitude de', cn: '习惯……'},
      {w: 'avec plaisir', cn: '乐意；好啊'},
      {w: 'se tenir au courant', cn: '保持联系'}
    ],
    tip: '寒暄三步：回应 + 补充信息 + 抛回问题（et toi ?）。只说「oui」对话就会断。'
  },
  {
    id: 'telephone', icon: '☎️', title: '打电话约时间', titleFr: 'Au téléphone', lv: 'A2',
    goal: '无法看口型时也能完成一次电话预约/改期。',
    chunks: [
      {fr: 'Allô, bonjour, je voudrais parler à M. Dubois.', cn: '喂，您好，我想找杜布瓦先生。'},
      {fr: 'C\'est de la part de …', cn: '我是……（替……打来）。'},
      {fr: 'Est-ce que ce serait possible de décaler le rendez-vous ?', cn: '有可能把预约往后挪吗？'},
      {fr: 'Je vous entends mal, pouvez-vous répéter ?', cn: '我听不清，能重复一下吗？'},
      {fr: 'Vous pourriez me rappeler demain ?', cn: '您能明天打给我吗？'},
      {fr: 'Je rappelle plus tard.', cn: '我稍后再打。'}
    ],
    dialogue: [
      {who: '秘书', side: 'b', fr: 'Cabinet Dubois, bonjour.', cn: '杜布瓦诊所，您好。'},
      {who: '你', side: 'a', fr: 'Bonjour, je voudrais parler à M. Dubois, s\'il vous plaît.', cn: '您好，我想找杜布瓦先生。'},
      {who: '秘书', side: 'b', fr: 'Il est en réunion. C\'est de la part de qui ?', cn: '他正在开会。请问您是哪位？'},
      {who: '你', side: 'a', fr: 'De la part de … J\'avais rendez-vous jeudi à dix heures.', cn: '我是……我约了周四十点。'},
      {who: '秘书', side: 'b', fr: 'Un instant… Oui, je vous écoute.', cn: '请稍等……好了，您说。'},
      {who: '你', side: 'a', fr: 'Est-ce que ce serait possible de le décaler à vendredi ?', cn: '能把预约挪到周五吗？'},
      {who: '秘书', side: 'b', fr: 'Vendredi quatorze heures, ça vous va ?', cn: '周五十四点，可以吗？'},
      {who: '你', side: 'a', fr: 'Parfait. Merci beaucoup, bonne journée.', cn: '很好。非常感谢，祝您愉快。'}
    ],
    vocab: [
      {w: 'allô', cn: '喂（电话）'},
      {w: 'être en réunion', cn: '在开会'},
      {w: 'décaler', cn: '推迟；挪动'},
      {w: 'de la part de', cn: '受……之托；以……名义'},
      {w: 'un instant', cn: '稍等'}
    ],
    tip: '电话无法看口型，先说自己名字与来意；听不清立刻说 « je vous entends mal »，别硬撑。'
  }
];
