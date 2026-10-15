/**
 * 欲求の4タイプ性格診断 アプリケーションロジック
 * Based on Toshio Okada's "Law of Life - 4 Types of Desires"
 */

// ============================================================
// 1. 質問データ定義 (全10問)
// ============================================================
const QUESTIONS = [
  {
    id: 1,
    category: "モチベーション・勝負",
    text: "人と競い合ったり勝負事になると熱が入り、やるからには「一番になりたい」「勝ちたい」と強く思う。",
    scores: {
      yes: { commander: 3, attention: 1, idealist: 0, analyst: 0, extrovert: 1.5, concrete: 1.5 },
      no: { commander: 0, attention: 0, idealist: 2, analyst: 2, extrovert: -1.0, concrete: -0.5 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 2,
    category: "人間関係・コミュニケーション",
    text: "その場の空気を盛り上げたり、みんなが楽しそうに笑っているのを見るのが好きで、自分の話に注目してもらえるととても嬉しい。",
    scores: {
      yes: { commander: 0, attention: 3, idealist: 0, analyst: 0, extrovert: 2.0, concrete: -1.0 },
      no: { commander: 0, attention: 0, idealist: 1, analyst: 2, extrovert: -1.5, concrete: 0.5 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 3,
    category: "価値観・評価基準",
    text: "世間や他人にどう評価されるかよりも、「自分が心から納得できるか」「自分の美学やこだわりを貫けたか」が一番大切だ。",
    scores: {
      yes: { commander: 0, attention: 0, idealist: 3, analyst: 1, extrovert: -1.5, concrete: -1.5 },
      no: { commander: 2, attention: 1, idealist: 0, analyst: 0, extrovert: 1.0, concrete: 1.0 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 4,
    category: "トラブル・思考パターン",
    text: "問題やトラブルが起きた時、感情的になるよりも「なぜそれが起きたのか」「どこに原因や仕組みの欠陥があるのか」を冷静に分析したくなる。",
    scores: {
      yes: { commander: 1, attention: 0, idealist: 0, analyst: 3, extrovert: -1.0, concrete: 2.0 },
      no: { commander: 0, attention: 2, idealist: 1, analyst: 0, extrovert: 1.0, concrete: -1.0 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 5,
    category: "仕事・成果への姿勢",
    text: "努力のプロセスや熱意といった曖昧なものよりも、数字や実績、目に見える地位・肩書きなどの「結果」を重視する。",
    scores: {
      yes: { commander: 3, attention: 0, idealist: 0, analyst: 1, extrovert: 1.0, concrete: 2.0 },
      no: { commander: 0, attention: 1, idealist: 3, analyst: 0, extrovert: -0.5, concrete: -2.0 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 6,
    category: "作業スタイル・エネルギー",
    text: "ひとりで黙々と没頭するよりも、気の合う仲間たちと一緒にワイワイ感情や進捗を共有しながら進める方がやる気が湧く。",
    scores: {
      yes: { commander: 1, attention: 3, idealist: 0, analyst: 0, extrovert: 2.0, concrete: -0.5 },
      no: { commander: 0, attention: 0, idealist: 2, analyst: 2, extrovert: -2.0, concrete: 0.5 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 7,
    category: "こだわり・アイデンティティ",
    text: "流行や他人のマナー・常識に合わせるのが窮屈で、自分だけの独自ルールや世界観、オリジナルなスタイルを大切に守りたい。",
    scores: {
      yes: { commander: 0, attention: 0, idealist: 3, analyst: 1, extrovert: -1.5, concrete: -1.5 },
      no: { commander: 1, attention: 2, idealist: 0, analyst: 0, extrovert: 1.0, concrete: 0.5 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 8,
    category: "人間関係の距離感",
    text: "人間関係のしがらみや感情的な押し付けに巻き込まれるのが嫌で、誰からも干渉されない客観的で自由なポジションを好む。",
    scores: {
      yes: { commander: 0, attention: 0, idealist: 1, analyst: 3, extrovert: -2.0, concrete: 1.0 },
      no: { commander: 2, attention: 2, idealist: 0, analyst: 0, extrovert: 2.0, concrete: 0.0 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 9,
    category: "失敗時の心理",
    text: "一生懸命やって失敗した時、「原因や改善策を分析しよう」と言われるよりも、「あなたの頑張りをちゃんと見てたよ」と気持ちに寄り添ってほしい。",
    scores: {
      yes: { commander: 0, attention: 3, idealist: 1, analyst: 0, extrovert: 0.5, concrete: -2.0 },
      no: { commander: 2, attention: 0, idealist: 0, analyst: 2, extrovert: 0.0, concrete: 2.0 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  },
  {
    id: 10,
    category: "リーダーシップ・決断",
    text: "チームの方針がまとまらない時、周りの顔色をうかがって様子見するより、自分が主導権を握ってビシッと方向性を決めてしまいたい。",
    scores: {
      yes: { commander: 3, attention: 1, idealist: 0, analyst: 0, extrovert: 2.0, concrete: 1.5 },
      no: { commander: 0, attention: 0, idealist: 1, analyst: 2, extrovert: -1.0, concrete: -0.5 },
      unknown: { commander: 0, attention: 0, idealist: 0, analyst: 0, extrovert: 0, concrete: 0 }
    }
  }
];

// ============================================================
// 2. 4タイプ定義マスターデータ
// ============================================================
const TYPE_DEFINITIONS = {
  commander: {
    id: "commander",
    name: "司令型",
    english: "Commander",
    icon: "👑",
    themeClass: "theme-commander",
    color: "#ef4444",
    catchphrase: "「勝負に勝ち、目に見える成果と序列の頂点を目指すリーダー」",
    tags: ["勝負師", "リーダーシップ", "結果主義", "序列重視", "現実主義", "有言実行"],
    quadrant: "外向的 × 具体的",
    coreDesire: "「勝ちたい」「他者より上に立ちたい」「目に見える成果を出したい」。明確な目標に向かって合理的に突き進み、序列のトップに立つことや勝利を得ることで最大の充実感を覚えます。権力や実利を愛するリアリストです。",
    strengths: [
      "高い目標達成力とスピーディな実行力",
      "現実的でブレない合理的な判断ができる",
      "集団を引っ張る強力な統率力と決断力",
      "自分の仕事と結果に対して責任感を持つ"
    ],
    weaknesses: [
      "勝ち負けや上下関係にこだわりすぎて人間関係がギスギスする",
      "成果の出ない努力や精神論を無駄と切り捨てがち",
      "他人に弱みを見せられず、限界まで抱え込んでしまう"
    ],
    motivation: "「これを達成したら1番になれる」「具体的な数字や役職、明確な報酬が得られる」という勝負の舞台やライバルが存在する時。",
    trigger: "「負け犬扱いされること」「努力したのに結果が出ず、無能と思われること」「他人に主導権を握られ指図されること」。",
    examples: "織田信長、勝海舟、孫正義、本田圭佑",
    dynamics: {
      admire: {
        type: "法則型",
        desc: "自分がいっぱいいっぱいになりがちな「冷静な分析力」や「客観的な知性・仕組み化」を持つ法則型に強いリスペクトと憧れを抱きます。"
      },
      admiredBy: {
        type: "注目型",
        desc: "注目型からは、自分にはない圧倒的な決断力や社会的推進力を持つ頼もしいリーダーとして熱烈に憧れられます。"
      },
      lookDown: {
        type: "注目型",
        desc: "成果や実利よりもノリや世間体ばかり気にして群れたがる注目型を「口先ばかりで中身がない」「能天気だ」と見下しがちです。"
      },
      opposite: {
        type: "理想型",
        desc: "結果や勝敗を無視して「自分のこだわり」だけに陶酔する理想型が最も理解不能。「現実を見ろ」「勝てなきゃ意味がない」と深く衝突します。"
      }
    }
  },

  attention: {
    id: "attention",
    name: "注目型",
    english: "Attention",
    icon: "🌟",
    themeClass: "theme-attention",
    color: "#f59e0b",
    catchphrase: "「みんなに愛され、場を明るく盛り上げる情熱のムードメーカー」",
    tags: ["愛されキャラ", "ムードメーカー", "感情共有", "承認欲求", "情熱的", "社交家"],
    quadrant: "外向的 × 抽象的",
    coreDesire: "「人から好かれたい」「注目されたい」「頼られたい」。人々との感情的なつながりや、自分の情熱が伝わってその場が笑顔と熱気で満たされることに無上の喜びを感じます。寂しがり屋で人間味あふれる人気者です。",
    strengths: [
      "人を自然と惹きつける天性の明るさと愛嬌",
      "相手の感情や場の空気を敏感に察知する高い共感力",
      "チームの一体感やモチベーションを高めるムードメイク力",
      "誰とでもすぐに打ち解けられるオープンな社交性"
    ],
    weaknesses: [
      "他人の評価や視線に一喜一憂し、振り回されやすい",
      "一人ぼっちに耐えにくく、過剰に構ってほしいアピールをしてしまう",
      "感情が先走って論理的な一貫性や計画性に欠けることがある"
    ],
    motivation: "「あなたが必要」「見てるよ、いつもありがとう！」と人から感謝されたり、スポットライトを浴びて歓声を浴びた時。",
    trigger: "「無視されること」「仲間外れにされること」「自分の存在意義や熱意を否定されること」。",
    examples: "坂本龍馬、明石家さんま、ルフィ（ONE PIECE）、中居正広",
    dynamics: {
      admire: {
        type: "司令型",
        desc: "自分にはないブレない胆力と、目に見える結果をバシッと叩き出す司令型の圧倒的な頼もしさに惹かれ憧れます。"
      },
      admiredBy: {
        type: "理想型",
        desc: "孤高になりがちな理想型から、誰からも自然と愛され人を巻き込む天真爛漫なコミュ力を密かに羨ましがられます。"
      },
      lookDown: {
        type: "理想型",
        desc: "人の輪に入らず、自分の殻に閉じこもって孤高を気取る理想型を「協調性がない」「頑固で付き合いにくい」と軽視しがちです。"
      },
      opposite: {
        type: "法則型",
        desc: "感情や空気を無視して冷たい正論や理屈ばかりを突きつけてくる法則型が天敵。「血も涙もない冷たいロボット」と感じてしまいます。"
      }
    }
  },

  idealist: {
    id: "idealist",
    name: "理想型",
    english: "Idealist",
    icon: "🎨",
    themeClass: "theme-idealist",
    color: "#8b5cf6",
    catchphrase: "「妥協なき美学と信念を胸に、自分の世界を貫く求道者・職人」",
    tags: ["職人気質", "美意識", "こだわり派", "自己納得", "妥協しない", "求道者"],
    quadrant: "内向的 × 抽象的",
    coreDesire: "「自分の理想を追求したい」「自分が心から納得できる仕事・生き方をしたい」。世間の評価や効率よりも、自分の内なる美意識や道徳観、プロセスを貫くことに命を懸けます。魂を売らない孤高の表現者です。",
    strengths: [
      "妥協のない高いクオリティと完成度への執念",
      "ブレない独自の信念と唯一無二のオリジナリティ",
      "ひとつの道を深く極め続ける並外れた集中力",
      "嘘や不正を嫌い、誠実に物事と向き合う純粋さ"
    ],
    weaknesses: [
      "こだわりが強すぎて融通が利かず、頑固と思われやすい",
      "自分の高い基準を他人にも無意識に要求してしまう",
      "世俗的な成功や効率を軽視し、損な役回りになりやすい"
    ],
    motivation: "「これこそが自分の信じた最高のものだ」と内面から100%納得できた時、美意識を遺憾なく発揮できる環境。",
    trigger: "「妥協を強いられること」「信念や美学をバカにされること」「中身のない薄っぺらい流行に合わせさせられること」。",
    examples: "宮崎駿、イチロー、手塚治虫、スティーブ・ジョブズ",
    dynamics: {
      admire: {
        type: "注目型",
        desc: "孤高になりがちな自分と違って、自然体でみんなに好かれ、世間を味方につける注目型の明るさ・華やかさに憧れを持ちます。"
      },
      admiredBy: {
        type: "法則型",
        desc: "理屈ばかりで動けない法則型から、損得を超えて己の信念に命を燃やす生き様を「神聖な存在」のように憧れられます。"
      },
      lookDown: {
        type: "法則型",
        desc: "自分では何も生み出さず、安全な場所から理屈や評論ばかりこねる法則型を「情熱がない」「評論家気取りでダサい」と見下しがちです。"
      },
      opposite: {
        type: "司令型",
        desc: "数値や勝ち負け、ステータスばかりで中身の美しさを理解しようとしない司令型が天敵。「俗物」「品がない」と深く反発します。"
      }
    }
  },

  analyst: {
    id: "analyst",
    name: "法則型",
    english: "Analyst",
    icon: "🔬",
    themeClass: "theme-analyst",
    color: "#06b6d4",
    catchphrase: "「世界の仕組みと因果関係を解き明かす、冷静沈着な自由人・参謀」",
    tags: ["知性派", "参謀役", "合理主義", "自由人", "客観的観察", "マイペース"],
    quadrant: "内向的 × 具体的",
    coreDesire: "「物事の仕組みや法則を理解したい」「理不尽に縛られず自由でいたい」。感情や思い込みに左右されず、因果関係や原理原則を冷静に解き明かし、合理的に生きることを望みます。執着を持たない自由な観察者です。",
    strengths: [
      "感情に流されない圧倒的な客観性と論理的思考",
      "複雑な問題をシンプルに分解・仕組み化する分析力",
      "他人に執着せず、精神的に自立した安定感",
      "リスクや盲点を先回りして見抜く参謀としての才能"
    ],
    weaknesses: [
      "感情の機微や共感に疎く「冷たい」「人間味がない」と思われやすい",
      "理屈に納得できないと一歩も動けなくなる（行動が遅い）",
      "自ら先頭に立って熱く人を引っ張るリーダーシップは好まない"
    ],
    motivation: "「なるほど、そういう仕組みだったのか！」と世界の謎や因果関係が腑に落ちた瞬間、誰にも干渉されず自由に観察・思考できる時間。",
    trigger: "「感情論や精神論を押し付けられること」「理不尽で非合理なルールに従わされること」「プライベートの自由や時間を侵されること」。",
    examples: "タモリ、野村克也、ひろゆき、養老孟司",
    dynamics: {
      admire: {
        type: "理想型",
        desc: "打算や理屈を超えて、自分の信じた世界に没頭して突き進む理想型のピュアな情熱に、強い憧れとコンプレックスを抱きます。"
      },
      admiredBy: {
        type: "司令型",
        desc: "感情的になりがちな司令型から、全体を冷静に見通し最適な戦略を授けてくれる頼れるブレインとしてリスペクトされます。"
      },
      lookDown: {
        type: "司令型",
        desc: "頭を使って仕組みを整えるより、根性や権力・力技で無理やり通そうとする司令型を「頭が悪い」「野蛮だ」と見下しがちです。"
      },
      opposite: {
        type: "注目型",
        desc: "情緒やその場のノリ、みんなの空気だけで動き、理屈が全く通じない注目型が天敵。「なぜそんなに群れたがるのか」「中身がない」と呆れてしまいます。"
      }
    }
  }
};

// ============================================================
// 3. アプリケーション状態管理
// ============================================================
const state = {
  currentQuestionIndex: 0,
  answers: new Array(QUESTIONS.length).fill(null),
  scores: {
    commander: 0,
    attention: 0,
    idealist: 0,
    analyst: 0
  },
  coordinates: {
    extrovert: 0, // > 0: 外向, < 0: 内向
    concrete: 0   // > 0: 具体, < 0: 抽象
  },
  resultType: null,
  subtype: null
};

// ============================================================
// 4. DOM要素の参照
// ============================================================
const screens = {
  start: document.getElementById("start-screen"),
  question: document.getElementById("question-screen"),
  result: document.getElementById("result-screen")
};

const dom = {
  startBtn: document.getElementById("start-btn"),
  prevBtn: document.getElementById("prev-btn"),
  restartBtn: document.getElementById("restart-btn"),
  copyBtn: document.getElementById("copy-btn"),
  shareXBtn: document.getElementById("share-x-btn"),
  toast: document.getElementById("toast"),

  // Progress
  progressBar: document.getElementById("progress-bar"),
  currentQNum: document.getElementById("current-q-num"),
  progressPercentage: document.getElementById("progress-percentage"),

  // Question
  qCategory: document.getElementById("q-category"),
  qText: document.getElementById("q-text"),
  choiceBtns: document.querySelectorAll(".choice-btn"),

  // Result
  resultHero: document.getElementById("result-hero"),
  typeIcon: document.getElementById("type-icon"),
  typeName: document.getElementById("type-name"),
  typeCatchphrase: document.getElementById("type-catchphrase"),
  typeTags: document.getElementById("type-tags"),
  subtypeName: document.getElementById("subtype-name"),
  coordinatesText: document.getElementById("coordinates-text"),

  // Details
  typeCoreDesire: document.getElementById("type-core-desire"),
  typeStrengths: document.getElementById("type-strengths"),
  typeWeaknesses: document.getElementById("type-weaknesses"),
  typeMotivation: document.getElementById("type-motivation"),
  typeTrigger: document.getElementById("type-trigger"),
  typeExamples: document.getElementById("type-examples"),

  // Dynamics
  dynAdmireName: document.getElementById("dyn-admire-name"),
  dynAdmireDesc: document.getElementById("dyn-admire-desc"),
  dynAdmiredByName: document.getElementById("dyn-admiredby-name"),
  dynAdmiredByDesc: document.getElementById("dyn-admiredby-desc"),
  dynLookDownName: document.getElementById("dyn-lookdown-name"),
  dynLookDownDesc: document.getElementById("dyn-lookdown-desc"),
  dynOppositeName: document.getElementById("dyn-opposite-name"),
  dynOppositeDesc: document.getElementById("dyn-opposite-desc"),

  // Charts
  scoreBars: document.getElementById("score-bars"),
  matrixCanvas: document.getElementById("matrix-canvas"),
  scoreCanvas: document.getElementById("score-canvas")
};

// ============================================================
// 5. 画面遷移 & イベント処理
// ============================================================
function showScreen(screenName) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });
  if (screens[screenName]) {
    screens[screenName].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// 診断開始
dom.startBtn.addEventListener("click", () => {
  resetTest();
  showScreen("question");
  renderQuestion();
});

// 前の質問に戻る
dom.prevBtn.addEventListener("click", () => {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderQuestion();
  }
});

// 回答選択
dom.choiceBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.dataset.answer;
    handleAnswer(answer);
  });
});

// もう一度診断する
dom.restartBtn.addEventListener("click", () => {
  resetTest();
  showScreen("start");
});

// 診断結果をテキストコピー
dom.copyBtn.addEventListener("click", copyResultText);

// ============================================================
// 6. 質問ロジック
// ============================================================
function renderQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  const num = state.currentQuestionIndex + 1;
  const total = QUESTIONS.length;
  const percent = Math.round((num / total) * 100);

  // Update Progress
  dom.progressBar.style.width = `${percent}%`;
  dom.currentQNum.textContent = num;
  dom.progressPercentage.textContent = `${percent}%`;

  // Update Question Content
  dom.qCategory.textContent = q.category;
  dom.qText.textContent = q.text;

  // Previous Button State
  dom.prevBtn.disabled = (state.currentQuestionIndex === 0);

  // Active Choice state if answered previously
  const currentAnswer = state.answers[state.currentQuestionIndex];
  dom.choiceBtns.forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.answer === currentAnswer);
  });
}

function handleAnswer(answer) {
  state.answers[state.currentQuestionIndex] = answer;

  if (state.currentQuestionIndex < QUESTIONS.length - 1) {
    state.currentQuestionIndex++;
    setTimeout(() => {
      renderQuestion();
    }, 180);
  } else {
    // 診断終了・集計
    calculateResult();
    setTimeout(() => {
      showScreen("result");
      renderResult();
    }, 250);
  }
}

function resetTest() {
  state.currentQuestionIndex = 0;
  state.answers = new Array(QUESTIONS.length).fill(null);
  state.scores = { commander: 0, attention: 0, idealist: 0, analyst: 0 };
  state.coordinates = { extrovert: 0, concrete: 0 };
  state.resultType = null;
  state.subtype = null;
}

// ============================================================
// 7. スコア集計 & タイプ判定ロジック
// ============================================================
function calculateResult() {
  // スコア初期化（ベース点数を均等に付与して0割りを防止）
  const scores = { commander: 2, attention: 2, idealist: 2, analyst: 2 };
  let extrovertSum = 0;
  let concreteSum = 0;

  state.answers.forEach((ans, idx) => {
    if (!ans) return;
    const qScores = QUESTIONS[idx].scores[ans];
    if (qScores) {
      scores.commander += qScores.commander || 0;
      scores.attention += qScores.attention || 0;
      scores.idealist += qScores.idealist || 0;
      scores.analyst += qScores.analyst || 0;
      extrovertSum += qScores.extrovert || 0;
      concreteSum += qScores.concrete || 0;
    }
  });

  state.scores = scores;
  state.coordinates = {
    extrovert: extrovertSum,
    concrete: concreteSum
  };

  // ソートして第1位と第2位を判定
  const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  state.resultType = sortedTypes[0][0];
  state.subtype = sortedTypes[1][0];
}

// ============================================================
// 8. 結果画面のレンダリング
// ============================================================
function renderResult() {
  const typeKey = state.resultType;
  const typeData = TYPE_DEFINITIONS[typeKey];
  const subData = TYPE_DEFINITIONS[state.subtype];

  // Theme Class
  dom.resultHero.className = `card result-hero-card ${typeData.themeClass}`;

  // Hero Card Info
  dom.typeIcon.textContent = typeData.icon;
  dom.typeName.textContent = typeData.name;
  dom.typeCatchphrase.textContent = typeData.catchphrase;

  // Tags
  dom.typeTags.innerHTML = typeData.tags
    .map(tag => `<span class="tag-item">#${tag}</span>`)
    .join("");

  // Quick Summary
  const totalScore = Object.values(state.scores).reduce((a, b) => a + b, 0);
  const subPercent = Math.round((state.scores[state.subtype] / totalScore) * 100);
  dom.subtypeName.textContent = `${subData.name} (${subPercent}%)`;

  const xLabel = state.coordinates.concrete >= 0 ? "具体的" : "抽象的";
  const yLabel = state.coordinates.extrovert >= 0 ? "外向的" : "内向的";
  dom.coordinatesText.textContent = `${yLabel} × ${xLabel}`;

  // Details
  dom.typeCoreDesire.textContent = typeData.coreDesire;
  dom.typeStrengths.innerHTML = typeData.strengths.map(s => `<li>${s}</li>`).join("");
  dom.typeWeaknesses.innerHTML = typeData.weaknesses.map(w => `<li>${w}</li>`).join("");
  dom.typeMotivation.textContent = typeData.motivation;
  dom.typeTrigger.textContent = typeData.trigger;
  dom.typeExamples.textContent = typeData.examples;

  // Dynamics (相性力学)
  dom.dynAdmireName.textContent = typeData.dynamics.admire.type;
  dom.dynAdmireDesc.textContent = typeData.dynamics.admire.desc;

  dom.dynAdmiredByName.textContent = typeData.dynamics.admiredBy.type;
  dom.dynAdmiredByDesc.textContent = typeData.dynamics.admiredBy.desc;

  dom.dynLookDownName.textContent = typeData.dynamics.lookDown.type;
  dom.dynLookDownDesc.textContent = typeData.dynamics.lookDown.desc;

  dom.dynOppositeName.textContent = typeData.dynamics.opposite.type;
  dom.dynOppositeDesc.textContent = typeData.dynamics.opposite.desc;

  // Render Score Bars
  renderScoreBars(totalScore);

  // Render Canvas Visualizations
  renderMatrixCanvas();
  renderRadarCanvas();

  // Update Share Link
  updateShareLinks(typeData);
}

// スコアバーの描画
function renderScoreBars(totalScore) {
  dom.scoreBars.innerHTML = Object.entries(TYPE_DEFINITIONS).map(([key, def]) => {
    const score = state.scores[key];
    const pct = Math.round((score / totalScore) * 100);
    return `
      <div class="score-bar-row">
        <div class="score-bar-meta">
          <span>${def.icon} ${def.name}</span>
          <span>${pct}% (${score}pt)</span>
        </div>
        <div class="score-bar-bg">
          <div class="score-bar-fill" style="width: ${pct}%; background-color: ${def.color};"></div>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================================
// 9. Canvas描画：マトリクス & レーダーチャート
// ============================================================
function renderMatrixCanvas() {
  const canvas = dom.matrixCanvas;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = 360;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const padding = 28;
  const w = size - padding * 2;
  const h = size - padding * 2;

  // Background
  ctx.clearRect(0, 0, size, size);

  // 4象限の淡い塗り分け
  // 左上: 注目型 (外向 × 抽象)
  ctx.fillStyle = "rgba(245, 158, 11, 0.08)";
  ctx.fillRect(padding, padding, w / 2, h / 2);

  // 右上: 司令型 (外向 × 具体)
  ctx.fillStyle = "rgba(239, 68, 68, 0.08)";
  ctx.fillRect(cx, padding, w / 2, h / 2);

  // 左下: 理想型 (内向 × 抽象)
  ctx.fillStyle = "rgba(139, 92, 246, 0.08)";
  ctx.fillRect(padding, cy, w / 2, h / 2);

  // 右下: 法則型 (内向 × 具体)
  ctx.fillStyle = "rgba(6, 182, 212, 0.08)";
  ctx.fillRect(cx, cy, w / 2, h / 2);

  // 外枠
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(padding, padding, w, h);

  // 十字軸
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding, cy);
  ctx.lineTo(size - padding, cy);
  ctx.moveTo(cx, padding);
  ctx.lineTo(cx, size - padding);
  ctx.stroke();

  // 軸ラベル
  ctx.font = "bold 11px 'Noto Sans JP', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#94a3b8";

  ctx.fillText("外向的 ↑", cx, padding - 14);
  ctx.fillText("内向的 ↓", cx, size - padding + 14);
  ctx.fillText("← 抽象的", padding + 30, cy - 10);
  ctx.fillText("具体的 →", size - padding - 30, cy - 10);

  // 象限ラベル
  ctx.font = "bold 13px 'Noto Sans JP', sans-serif";
  ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
  ctx.fillText("🌟 注目型", padding + w * 0.25, padding + h * 0.25);

  ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
  ctx.fillText("👑 司令型", cx + w * 0.25, padding + h * 0.25);

  ctx.fillStyle = "rgba(139, 92, 246, 0.8)";
  ctx.fillText("🎨 理想型", padding + w * 0.25, cy + h * 0.25);

  ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
  ctx.fillText("🔬 法則型", cx + w * 0.25, cy + h * 0.25);

  // ユーザーの座標計算 (X: concrete, Y: extrovert)
  // concrete: -15 ~ +15 -> padding ~ size-padding
  // extrovert: -15 ~ +15 -> size-padding ~ padding (上がプラス)
  const maxRange = 12;
  const clampedX = Math.max(-maxRange, Math.min(maxRange, state.coordinates.concrete));
  const clampedY = Math.max(-maxRange, Math.min(maxRange, state.coordinates.extrovert));

  const userX = cx + (clampedX / maxRange) * (w / 2 * 0.85);
  const userY = cy - (clampedY / maxRange) * (h / 2 * 0.85);

  // ユーザープロットの波紋エフェクト
  const mainColor = TYPE_DEFINITIONS[state.resultType].color;
  ctx.beginPath();
  ctx.arc(userX, userY, 16, 0, Math.PI * 2);
  ctx.fillStyle = mainColor + "33"; // opacity 20%
  ctx.fill();

  ctx.beginPath();
  ctx.arc(userX, userY, 9, 0, Math.PI * 2);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 「YOU」ラベル
  ctx.font = "bold 11px 'Outfit', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("YOU", userX, userY - 15);
}

function renderRadarCanvas() {
  const canvas = dom.scoreCanvas;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = 360;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;

  ctx.clearRect(0, 0, size, size);

  // 4頂点の角度（上: 司令型、右: 法則型、下: 理想型、左: 注目型）
  // 順序: 司令(上: -PI/2) -> 法則(右: 0) -> 理想(下: PI/2) -> 注目(左: PI)
  const typesOrder = [
    { key: "commander", angle: -Math.PI / 2 },
    { key: "analyst",   angle: 0 },
    { key: "idealist",  angle: Math.PI / 2 },
    { key: "attention", angle: Math.PI }
  ];

  // グリッド線（多角形レベル 3段階）
  const levels = [0.33, 0.66, 1.0];
  levels.forEach(lvl => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    typesOrder.forEach((t, i) => {
      const r = maxR * lvl;
      const x = cx + r * Math.cos(t.angle);
      const y = cy + r * Math.sin(t.angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  });

  // 放射状の軸線
  typesOrder.forEach(t => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(t.angle), cy + maxR * Math.sin(t.angle));
    ctx.stroke();
  });

  // ユーザーのスコアポリゴン
  const maxVal = Math.max(...Object.values(state.scores), 8);
  ctx.beginPath();
  typesOrder.forEach((t, i) => {
    const val = state.scores[t.key] || 0;
    const ratio = Math.max(0.15, Math.min(1.0, val / maxVal));
    const r = maxR * ratio;
    const x = cx + r * Math.cos(t.angle);
    const y = cy + r * Math.sin(t.angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();

  const mainColor = TYPE_DEFINITIONS[state.resultType].color;
  ctx.fillStyle = mainColor + "44"; // 27% opacity
  ctx.fill();
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 各頂点のポイントとラベル
  typesOrder.forEach(t => {
    const val = state.scores[t.key] || 0;
    const ratio = Math.max(0.15, Math.min(1.0, val / maxVal));
    const r = maxR * ratio;
    const px = cx + r * Math.cos(t.angle);
    const py = cy + r * Math.sin(t.angle);

    // 点
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = TYPE_DEFINITIONS[t.key].color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 外側ラベル
    const labelR = maxR + 24;
    const lx = cx + labelR * Math.cos(t.angle);
    const ly = cy + labelR * Math.sin(t.angle);

    ctx.font = "bold 12px 'Noto Sans JP', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TYPE_DEFINITIONS[t.key].color;
    ctx.fillText(`${TYPE_DEFINITIONS[t.key].icon} ${TYPE_DEFINITIONS[t.key].name}`, lx, ly);
  });
}

// ============================================================
// 10. クリップボードコピー & シェア
// ============================================================
function copyResultText() {
  const type = TYPE_DEFINITIONS[state.resultType];
  const sub = TYPE_DEFINITIONS[state.subtype];
  const text = `【欲求の4タイプ性格診断 結果】
私のタイプは【${type.icon} ${type.name}】でした！
キャッチコピー：${type.catchphrase}

サブタイプ：${sub.name}
座標軸：${dom.coordinatesText.textContent}

▼人間関係の力学
・憧れるタイプ：${type.dynamics.admire.type}
・憧れてくれるタイプ：${type.dynamics.admiredBy.type}
・理解不能な天敵：${type.dynamics.opposite.type}

参考元：岡田斗司夫「人生の法則」
#欲求の4タイプ #岡田斗司夫 #性格診断`;

  navigator.clipboard.writeText(text).then(() => {
    showToast();
  }).catch(err => {
    console.error("Copy failed", err);
  });
}

function showToast() {
  dom.toast.classList.add("show");
  setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 2200);
}

function updateShareLinks(typeData) {
  const shareText = encodeURIComponent(
    `【欲求の4タイプ診断】私の本質的な欲求は『${typeData.name}』でした！\n${typeData.catchphrase}\n#欲求の4タイプ #性格診断 #岡田斗司夫`
  );
  dom.shareXBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;
}
