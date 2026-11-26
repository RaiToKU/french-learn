/* 核心语库 · 句型骨架（口语语块）
   解决「只会蹦单词、连不成句」：按交际功能组织的可复用句子框架。
   field: fr 法语 / cn 中文 / note 用法提示（中文） / lv 适用等级 */
window.FR = window.FR || {};
FR.FRAMES = [
  {
    cat: '开口与过渡',
    hint: '开口先说一句完整的话，把话题接住，别只吐一个单词。',
    items: [
      {fr: 'Alors, voilà…', cn: '那个，是这样的……', note: '思考或组织语言时的填充语，比沉默更好。', lv: 'A2'},
      {fr: 'En fait, c\'est assez simple.', cn: '其实这挺简单的。', note: 'en fait 用来纠正或补充对方预期。', lv: 'A2'},
      {fr: 'Je vais vous expliquer.', cn: '我来给您解释一下。', note: '承接话题，给自己铺开的时间。', lv: 'A2'},
      {fr: 'Bon, écoutez…', cn: '好吧，您听我说……', note: '略带催促的开场，柜台与服务场合常见。', lv: 'B1'},
      {fr: 'Pour ce qui est de…', cn: '至于……', note: '自然地从上一个话题转到下一个。', lv: 'B1'},
      {fr: 'Ça me fait penser que…', cn: '这让我想到……', note: '把对话往前推，展示联想能力。', lv: 'B2'}
    ]
  },
  {
    cat: '没听懂时',
    hint: '听不懂不要只说 "Comment?"，用完整句子争取听懂。',
    items: [
      {fr: 'Pardon, vous pouvez répéter plus lentement ?', cn: '抱歉，您能慢一点再说一遍吗？', note: '最实用的救命句，一定要背熟。', lv: 'A1'},
      {fr: 'Je n\'ai pas bien compris le dernier mot.', cn: '最后一个词我没听清。', note: '精确指出难点，比 "je ne comprends pas" 有效。', lv: 'A2'},
      {fr: 'Qu\'est-ce que ça veut dire, « … » ?', cn: '「……」是什么意思？', note: '听到生词直接问，别慌。', lv: 'A2'},
      {fr: 'Comment ça s\'écrit ?', cn: '这怎么拼写？', note: '电话、报名字时必需。', lv: 'A1'},
      {fr: 'Vous pouvez parler un peu moins vite ?', cn: '您能说慢一点吗？', note: '礼貌且直接。', lv: 'A2'},
      {fr: 'Si j\'ai bien compris, vous voulez dire que… ?', cn: '如果我理解得对，您的意思是……？', note: '确认理解，同时争取思考时间。', lv: 'B1'},
      {fr: 'Désolé, je suis encore débutant en français.', cn: '抱歉，我的法语还是初级水平。', note: '先降低对方语速预期。', lv: 'A1'}
    ]
  },
  {
    cat: '卡词时',
    hint: '想不起词时用缓冲语，让句子不断，而不是停下来说「嗯……」。',
    items: [
      {fr: 'Euh… laissez-moi réfléchir deux secondes.', cn: '呃……让我想两秒。', note: '合法的口语填充，法国人天天用。', lv: 'A2'},
      {fr: 'Comment dire…', cn: '怎么说呢……', note: '卡住时的万能缓冲。', lv: 'A2'},
      {fr: 'Je cherche mes mots.', cn: '我在找合适的词。', note: '坦诚说明，对方通常会帮你。', lv: 'B1'},
      {fr: 'Je ne trouve pas le mot exact, mais…', cn: '我找不到确切的词，但是……', note: '允许自己用近似说法继续表达。', lv: 'B1'},
      {fr: 'Ce que je veux dire, c\'est que…', cn: '我想说的是……', note: '把零散想法重新组织成一句完整话。', lv: 'B1'},
      {fr: 'Attendez, je reformule.', cn: '等一下，我换个说法。', note: '说错了就用它，不用道歉半天。', lv: 'B1'},
      {fr: 'Enfin, bref…', cn: '总之，就那样吧……', note: '口语收束，适合朋友间。', lv: 'B2'}
    ]
  },
  {
    cat: '表达观点',
    hint: '从「Je pense」升级到带立场、带理由的一句话。',
    items: [
      {fr: 'À mon avis, …', cn: '在我看来……', note: '最常用的观点开头，后面必须跟完整句子。', lv: 'A2'},
      {fr: 'Personnellement, je pense que…', cn: '个人而言，我认为……', note: '强调主观立场，讨论时常用。', lv: 'A2'},
      {fr: 'J\'ai l\'impression que…', cn: '我感觉……', note: '语气比 "je pense" 更软。', lv: 'B1'},
      {fr: 'Ce qui me gêne, c\'est que…', cn: '让我不舒服的是……', note: '把不满说得有条理。', lv: 'B1'},
      {fr: 'Franchement, …', cn: '说实话……', note: '口语中表明坦率。', lv: 'B1'},
      {fr: 'Je ne suis pas sûr, mais il me semble que…', cn: '我不确定，但我觉得……', note: '留余地的表达，避免绝对化。', lv: 'B2'},
      {fr: 'C\'est un point de vue défendable, mais…', cn: '这个观点站得住脚，但是……', note: '议论文、辩论的加分句式。', lv: 'B2'}
    ]
  },
  {
    cat: '举例与说明',
    hint: '抽象话术配一个例子，别人才跟得上。',
    items: [
      {fr: 'Par exemple…', cn: '例如……', note: '最基础，但请配上完整的例子句。', lv: 'A2'},
      {fr: 'Typiquement, …', cn: '典型的情况是……', note: '口语中替代 par exemple。', lv: 'B1'},
      {fr: 'Prenons un exemple simple.', cn: '举个简单的例子。', note: '把对方拉回具体情境。', lv: 'B1'},
      {fr: 'C\'est comme…', cn: '这就像……', note: '类比解释，跨文化解释时很好用。', lv: 'A2'},
      {fr: 'Autrement dit, …', cn: '换言之……', note: '把刚说过的话说得更清楚。', lv: 'B1'},
      {fr: 'Pour vous donner une idée, …', cn: '让您有个概念……', note: '引出数字或对比。', lv: 'B2'},
      {fr: 'Il y a deux cas : d\'un côté…, de l\'autre…', cn: '有两种情况：一边是……，另一边是……', note: '结构清晰的分类表达。', lv: 'B2'}
    ]
  },
  {
    cat: '比较与对比',
    hint: '中法对比、今昔对比，是口语和写作最容易产出长句的抓手。',
    items: [
      {fr: 'C\'est plus … que …', cn: '这比……更……', note: '注意形容词与名词的比较结构区别。', lv: 'A2'},
      {fr: 'Alors qu\'en France, on…', cn: '而在法国，人们……', note: 'alors que 对比两件事，非常高频。', lv: 'B1'},
      {fr: 'Par contre, …', cn: '相反……', note: '口语中的转折，书面可用 en revanche。', lv: 'A2'},
      {fr: 'Ça dépend de…', cn: '这取决于……', note: '避免绝对化，显得成熟。', lv: 'A2'},
      {fr: 'C\'est différent de…', cn: '这和……不一样。', note: '后面接名词即可，别接句子。', lv: 'A2'},
      {fr: 'Les deux se ressemblent, sauf que…', cn: '两者相似，只是……', note: 'sauf que 后面必须接完整从句。', lv: 'B2'},
      {fr: 'Si on compare avec…, on voit que…', cn: '如果和……比较，可以看出……', note: '写作与口头报告都好用。', lv: 'B2'}
    ]
  },
  {
    cat: '同意与温和反对',
    hint: '先接住对方，再给立场，法国人对话里非常看重这一步。',
    items: [
      {fr: 'Tout à fait d\'accord.', cn: '完全同意。', note: '短句也要说得完整，比 "oui oui" 有力。', lv: 'A2'},
      {fr: 'Je suis d\'accord sur le principe, mais…', cn: '原则上我同意，但是……', note: '经典礼貌分歧开场。', lv: 'B1'},
      {fr: 'Je vois ce que vous voulez dire, mais…', cn: '我明白您的意思，但是……', note: '表示听懂再反驳，讨论不伤和气。', lv: 'B1'},
      {fr: 'Je ne suis pas tout à fait d\'accord.', cn: '我不完全同意。', note: '比 "non" 委婉得多。', lv: 'B1'},
      {fr: 'C\'est vrai, sauf que…', cn: '这是真的，只不过……', note: '承认对方一半，再提出保留。', lv: 'B2'},
      {fr: 'Je comprends, mais je vois les choses autrement.', cn: '我理解，但我看法不同。', note: '语气平稳，适合职场。', lv: 'B2'}
    ]
  },
  {
    cat: '委婉拒绝',
    hint: '拒绝时先表态再解释，别只说「不行」。',
    items: [
      {fr: 'Je suis désolé, mais ce n\'est pas possible pour moi.', cn: '抱歉，这对我来说不行。', note: '万能拒绝句。', lv: 'A2'},
      {fr: 'Ça m\'embête un peu de…', cn: '……让我有点为难。', note: '拒绝熟人的软化说法。', lv: 'B1'},
      {fr: 'J\'aurais préféré…', cn: '我本来更希望……', note: '条件式表达不满又不撕破脸。', lv: 'B1'},
      {fr: 'Je ne suis pas sûr de pouvoir.', cn: '我不确定我能不能。', note: '不承诺但也不硬拒。', lv: 'B1'},
      {fr: 'Ce n\'est pas que je ne veuille pas, c\'est que…', cn: '不是我不想，而是……', note: '解释原因，避免误会。', lv: 'B2'},
      {fr: 'Laissez-moi vérifier et je vous rappelle.', cn: '我确认一下，再给您回电话。', note: '需要时间拖延时的标准应答。', lv: 'B1'}
    ]
  },
  {
    cat: '请求与建议',
    hint: '用条件式与疑问句式，礼貌度立刻上一个档次。',
    items: [
      {fr: 'Est-ce que ce serait possible de… ?', cn: '……可以吗？', note: '条件式让请求更委婉。', lv: 'B1'},
      {fr: 'Vous pourriez me rappeler demain ?', cn: '您能明天打给我吗？', note: '条件式 + 您，职场标准。', lv: 'B1'},
      {fr: 'Je vous conseille de…', cn: '我建议您……', note: '给建议时搭配不定式。', lv: 'A2'},
      {fr: 'Si j\'étais vous, je…', cn: '如果我是您，我会……', note: '委婉建议，不指挥对方。', lv: 'B1'},
      {fr: 'Ça te dirait de… ?', cn: '你想……吗？', note: '熟人间邀请，接不定式。', lv: 'B1'},
      {fr: 'On pourrait…', cn: '我们可以……', note: '提议一起做事的常用开头。', lv: 'A2'},
      {fr: 'Vous auriez un instant ?', cn: '您有片刻时间吗？', note: '打扰别人前的礼貌开场。', lv: 'B1'}
    ]
  },
  {
    cat: '收尾与礼貌',
    hint: '会结束对话，是「能连贯交流」的一半。',
    items: [
      {fr: 'Merci beaucoup, bonne journée !', cn: '非常感谢，祝您今天愉快！', note: '法国人离开商店必说。', lv: 'A1'},
      {fr: 'Excusez-moi de vous déranger.', cn: '抱歉打扰您。', note: '插入别人对话或提问前。', lv: 'A2'},
      {fr: 'Je vous remercie de votre aide.', cn: '感谢您的帮助。', note: '书面或正式场合用 vous remercier。', lv: 'A2'},
      {fr: 'On se tient au courant.', cn: '我们保持联系。', note: '结束约定、不再细聊时用。', lv: 'B1'},
      {fr: 'Je vous en prie.', cn: '不客气；请便。', note: '回应 merci，非常常用。', lv: 'A2'},
      {fr: 'À bientôt !', cn: '回头见！', note: '比 au revoir 更轻松。', lv: 'A1'}
    ]
  },
  {
    cat: '长句骨架',
    hint: '把两句并成一句：连接词 × 完整从句 = 连贯表达。',
    items: [
      {fr: 'D\'abord…, ensuite…, et enfin…', cn: '首先……，然后……，最后……', note: '叙事、流程说明的三段式。', lv: 'A2'},
      {fr: 'Non seulement…, mais aussi…', cn: '不仅……而且……', note: '议论文高频结构。', lv: 'B1'},
      {fr: 'C\'est pour ça que…', cn: '所以……', note: '口语中的因果连接，简洁。', lv: 'A2'},
      {fr: 'Tout ça pour dire que…', cn: '总而言之，我想说的是……', note: '一段话说完后的收束。', lv: 'B2'},
      {fr: 'Quand j\'étais petit, je…, alors que maintenant…', cn: '我小时候……，而现在……', note: '未完成过去时 × 现在时，讲个人变化。', lv: 'B1'},
      {fr: 'Ce qui est intéressant, c\'est que…', cn: '有意思的是……', note: '强调结构，口语与写作通用。', lv: 'B1'}
    ]
  }
];
