const path = require("path");
const vscode = require("vscode");
const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions
} = require("vscode-languageclient/node");

function activate(context) {
  const serverExe = path.join(context.extensionPath,"bin1","mpler.exe");

  const serverOptions = {run: { command: serverExe, args: [] },debug: { command: serverExe, args: ["--debug"] }};

  const clientOptions = {documentSelector: [{ scheme: "file", language: "mp" }]};

  const client = new LanguageClient("mp_server","mp Language Server",serverOptions,clientOptions);

  client.start();
  context.subscriptions.push(client);

  const provider = vscode.languages.registerCompletionItemProvider('mp', 
  {
    provideCompletionItems(document, position)
    {
      const items = [];

      const regex = /[\p{L}\p{N}_]+/gu;

      const text = document.getText();

      const identifiers = new Set(text.match(regex) || []);

      const keywords = 
      [
        "if","elif","else","loop","func","end","def","return","break","continue","num","decimal","void","var","char","text","type","bool","typeof","is",
        "もし","さらにもし","ほか","ループ","関数","おわり","定義","返す","抜ける","続ける","整数","小数","なし","変数","文字","テキスト","タイプ","真偽","タイプ取得","が"
      ];
      for (const k of keywords)
      {
        items.push(new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword));
      }

      const consts =
    [
        { label: "true", detail: "真を表す（「bool」型）" },
        { label: "false", detail: "偽を表す（「bool」型）" },
        { label: "はい", detail: "真を表す（「真偽」型）" },
        { label: "いいえ", detail: "偽を表す（「真偽」型）" },

        { label: "e", detail: "ネイピア数を表す（「小数」型）" },

        { label: "hpi", detail: "円周率の半分（π/2=1.57...）を表す（「小数」型）" },

        { label: "pi", detail: "円周率（π=3.14...）を表す（「decimal」型）" },
        { label: "パイ", detail: "円周率（π=3.14...）を表す（「小数」型）" },
        { label: "tau", detail: "円周率の2倍（τ=2π=6.28...）を表す（「decimal」型）" },
        { label: "タウ", detail: "円周率の2倍（τ=2π=6.28...）を表す（「小数」型）" },
        { label: "root2", detail: "√2（1.4...）を表す（「decimal」型）" },
        { label: "ルート２", detail: "2の平方根（√2=1.4...）を表す（「小数」型）" },
        { label: "ln2", detail: "log2（eを底、真数を2とする対数）を表す（「小数」型）" },
        { label: "ln3", detail: "log3（eを底、真数を3とする対数）を表す（「小数」型）" },
        { label: "NaN", detail: "非数（Not a number）を表す（「decimal」型）" },
        { label: "非数", detail: "非数を表す（「小数」型）" },
        { label: "PosInfinity", detail: "正の無限大（+∞）を表す（「decimal」型）" },
        { label: "正の無限大", detail: "正の無限大（+∞）を表す（「小数」型）" },
        { label: "NegInfinity", detail: "負の無限大（-∞）を表す（「decimal」型）" },
        { label: "負の無限大", detail: "負の無限大（-∞）を表す（「小数」型）" },
        { label: "PosZero", detail: "正の０（+0）を表す（「decimal」型）" },
        { label: "正のゼロ", detail: "正の０（+0）を表す（「小数」型）" },
        { label: "NegZero", detail: "負の０（-0）を表す（「decimal」型）" },
        { label: "負のゼロ", detail: "負の０（-0）を表す（「小数」型）" },

        { label: "TextArray_MarkChar", detail: "テキスト配列の区切り文字を表す（「char」型）＜TextArray＞" },
        { label: "テキスト配列_区切り文字", detail: "テキスト配列の区切り文字を表す（「文字」型）＜TextArray＞" },
        { label: "TextArray_MarkText", detail: "テキスト配列の区切り文字を表す（「text」型）＜TextArray＞" },
        { label: "テキスト配列_区切りテキスト", detail: "テキスト配列の区切り文字を表す（「テキスト」型）＜TextArray＞" },
        { label: "TextArray_Default", detail: "テキスト配列のデフォルト値（テキスト配列）＜TextArray＞" },
        { label: "テキスト配列_初期値", detail: "テキスト配列の初期値（テキスト配列）＜TextArray＞" },


    ];

      for (const k of consts)
      {
        let item = new vscode.CompletionItem(k.label, vscode.CompletionItemKind.Constant);
        item.detail = k.detail;
        items.push(item);
      }

      const funcs =
    [
        { label: "len", detail: "配列の長さ（要素数）を取得します｜len(array) : num" },
        { label: "要素数", detail: "配列の要素数を取得します｜要素数（配列）：整数" },
        { label: "IsNaN", detail: "「NaN」かどうかを返します｜IsNaN(decimal) : bool" },
        { label: "非数か", detail: "「非数」かどうかを返します｜非数か（小数）：真偽" },
        { label: "Random", detail: "ランダムな値（｛最小値｝以上｛最大値｝以下）を返します｜Random(num, num) : num" },
        { label: "ランダム", detail: "ランダムな値（｛最小値｝以上｛最大値｝以下）を返します｜ランダム（整数、整数）：整数" },

        { label: "TextToNum", detail: "「text」型を「num」型に変換します｜TextToNum（text） : num" },
        { label: "CharToText", detail: "「char」型を「text」型に変換します｜CharToText（char） : text" },
        { label: "NumToText", detail: "「num」型を「text」型に変換します｜NumToText（num） : text" },
        { label: "DecimalToNum", detail: "「decimal」型を「num」型に変換します｜DecimalToNum（decimal） : num" },
        { label: "NumToDecimal", detail: "「num」型を「decimal」型に変換します｜NumToDecimal（num） : decimal" },
        { label: "textTochar", detail: "「text」型を「char」型に変換します｜TextToChar（text） : char" },
        { label: "DecimalToText", detail: "「decimal」型を「text」型に変換します｜DecimalToText（decimal） : text" },
        { label: "TextToDecimal", detail: "「text」型を「decimal」型に変換します｜TextToDecimal（text） : decimal" },

        { label: "テキストを整数にする", detail: "「テキスト」型を「整数」型に変換します｜テキストを整数にする（テキスト）：整数" },
        { label: "文字をテキストにする", detail: "「文字」型を「テキスト」型に変換します｜文字をテキストにする（文字）：テキスト" },
        { label: "整数をテキストにする", detail: "「整数」型を「テキスト」型に変換します｜整数をテキストにする（整数）：テキスト" },
        { label: "小数を整数にする", detail: "「小数」型を「整数」型に変換します｜小数を整数にする（小数）：整数" },
        { label: "整数を小数にする", detail: "「整数」型を「小数」型に変換します｜整数を小数にする（整数）：小数" },
        { label: "テキストを文字にする", detail: "「テキスト」型を「文字」型に変換します｜テキストを文字にする（テキスト）：文字" },
        { label: "小数をテキストにする", detail: "「小数」型を「テキスト」型に変換します｜小数をテキストにする（小数）：テキスト" },
        { label: "テキストを小数にする", detail: "「テキスト」型を「小数」型に変換します｜テキストを小数にする（テキスト）：小数" },

        { label: "Delay", detail: "指定時間（ミリ秒）待機します｜Delay(num)" },
        { label: "Write", detail: "コンソールに出力を書きます｜Write(text)" },
        { label: "Read", detail: "コンソールから入力を読み込みます｜Read(num) : text" },
        { label: "Clear", detail: "コンソールをクリアします｜Clear()" },
        { label: "SetTitle", detail: "コンソールのタイトルを設定します｜SetTitle(text)" },
        { label: "待つ", detail: "指定時間（ミリ秒）待機します｜待つ（整数）" },
        { label: "書き込む", detail: "コンソールに出力を書き込みます｜書き込む（テキスト）" },
        { label: "読み込む", detail: "コンソールから入力を読み込みます（｛最大｝は最大文字数）｜読み込む（整数｛最大｝）：テキスト" },
        { label: "クリア", detail: "コンソールをクリアします｜クリア（）" },
        { label: "タイトルの設定", detail: "コンソールのタイトルを設定します｜タイトルの設定（テキスト）" },

        { label: "Pow", detail: "累乗を求めます｜Pow(decimal, decimal) : decimal" },
        { label: "Log", detail: "底がeの対数（log）を求めます｜Log(decimal) : decimal" },
        { label: "Exp", detail: "底がeの累乗を求めます｜Exp(decimal) : decimal" },
        { label: "Root", detail: "平方根を求めます｜Root(decimal) : decimal" },
        { label: "Sin", detail: "sin（正弦）を求めます｜Sin(decimal radian) : decimal" },
        { label: "Cos", detail: "cos（余弦）を求めます｜Cos(decimal radian) : decimal" },
        { label: "Tan", detail: "tan（正接）を求めます｜Tan(decimal radian) : decimal" },

        { label: "べき乗", detail: "累乗を求めます｜べき乗（小数、小数）：小数" },
        { label: "対数", detail: "底がeの対数（log）を求めます｜対数（小数）：小数" },
        { label: "指数", detail: "底がeの累乗を求めます｜指数（小数）：小数" },
        { label: "ルート", detail: "平方根（√）を求めます｜ルート（小数）：小数" },
        { label: "サイン", detail: "sin（正弦）を求めます｜サイン（小数　ラジアン）：小数" },
        { label: "コサイン", detail: "cos（余弦）を求めます｜コサイン（小数　ラジアン）：小数" },
        { label: "タンジェント", detail: "tan（正接）を求めます｜タンジェント（小数　ラジアン）：小数" },

        { label: "Ceil", detail: "+∞方向に丸めます｜Ceil(decimal) : decimal" },
        { label: "Floor", detail: "-∞方向に丸めます｜Floor(decimal) : decimal" },
        { label: "Truncate", detail: "0方向に丸めます｜Truncate(decimal) : decimal" },
        { label: "Round", detail: "四捨五入します｜Round(decimal) : decimal" },
        { label: "EvenRound", detail: "最近接偶数に丸めます｜Evenround(decimal) : decimal" },

        { label: "切り上げ", detail: "切り上げます（+∞方向に丸めます）｜切り上げ（小数）：小数" },
        { label: "切り捨て", detail: "切り捨てます（-∞方向に丸めます）｜切り捨て（小数）：小数" },
        { label: "ゼロ丸め", detail: "0方向に丸めます｜ゼロ丸め（小数）：小数" },
        { label: "四捨五入", detail: "四捨五入します｜四捨五入（小数）：小数" },
        { label: "偶数丸め", detail: "近くの偶数に丸めます｜偶数丸め（小数）：小数" },

        { label: "ReplaceText", detail: "テキスト内の｛対象｝を｛値｝に置き換えます｜ReplaceText(text, text {対象}, text {値}) : text" },
        { label: "ReplaceItem", detail: "配列内の｛対象｝を｛値｝に置き換えます｜ReplaceItem(array, item {対象}, item {値}) : array" },

        { label: "テキストの置き換え", detail: "テキスト内の｛対象｝を｛値｝に置き換えます｜テキストの置き換え（テキスト、テキスト｛対象｝、テキスト｛値｝）：テキスト" },
        { label: "要素の置き換え", detail: "配列内の｛対象｝を｛値｝に置き換えます｜要素の置き換え（配列、要素｛対象｝、要素｛値｝）：配列" },

        { label: "CountText", detail: "テキスト内の｛対象｝の出現回数を取得します｜CountText(text, text {対象}) : num" },
        { label: "CountItem", detail: "配列内の｛対象｝の出現回数を取得します｜CountItem(array, item {対象}) : num" },

        { label: "テキストの個数", detail: "テキスト内の｛対象｝の出現回数を取得します｜テキストの個数（テキスト、テキスト｛対象｝）：整数" },
        { label: "要素の個数", detail: "配列内の｛対象｝の出現回数を取得します｜要素の個数（配列、要素｛対象｝）：整数" },

        { label: "SearchText", detail: "テキスト内の｛対象｝のインデックスを取得します｜SearchText(text, text {対象}, num {開始位置}) : num" },
        { label: "SearchItem", detail: "配列内の｛対象｝のインデックスを取得します｜SearchItem(array, item {対象}, num {開始位置}) : num" },

        { label: "テキストの場所", detail: "テキスト内の｛対象｝の場所（インデックス）を取得します｜テキストの場所（テキスト、テキスト｛対象｝、整数｛開始場所｝）：整数" },
        { label: "要素の場所", detail: "配列内の｛対象｝の場所（インデックス）を取得します｜要素の場所（配列、要素｛対象｝、整数｛開始場所｝）：整数" },

        { label: "RemoveText", detail: "テキスト内の｛対象｝と一致する部分を削除します｜RemoveText(text, text {対象}) : text" },
        { label: "RemoveItem", detail: "配列内の｛対象｝と一致する要素を削除します｜RemoveItem(array, item {対象}) : array" },

        { label: "テキストの削除", detail: "テキスト内の一致する部分を削除します｜テキストの削除（テキスト、テキスト｛対象｝）：テキスト" },
        { label: "要素の削除", detail: "配列内の｛対象｝と一致する要素を削除します｜要素の削除（配列、要素｛対象｝）：配列" },

        { label: "DeleteItem", detail: "配列内のインデックスが｛場所｝の要素を削除します｜DeleteItem(array, num {場所}) : array" },

        { label: "要素の消去", detail: "配列内の場所（インデックス）が｛場所｝の要素を削除します｜要素の消去（配列、整数｛場所｝）：配列" },

        { label: "AddItem", detail: "配列内の｛場所｝に要素を追加します｜AddItem(array, item, num {場所}) : array" },
        { label: "AppendItem", detail: "配列の末尾に要素を追加します｜AppendItem(array, item) : array" },

        { label: "要素の追加", detail: "配列内の｛場所｝に要素を追加します｜要素の追加（配列、要素、整数｛場所｝）：配列" },
        { label: "要素の末尾追加", detail: "配列の末尾に要素を追加します｜要素の末尾追加（配列、要素）：配列" },

        { label: "ClipArray", detail: "配列の｛場所｝から｛要素数｝の部分を切り取ります｜ClipArray(array, num {場所}, num {要素数}) : array" },
        { label: "ReverseArray", detail: "配列の要素の順番を反転します｜ReverseArray(array) : array" },

        { label: "配列の切り取り", detail: "配列の｛場所｝から｛要素数｝の部分を切り取ります｜配列の切り取り（配列、整数｛場所｝、整数｛要素数｝）：配列" },
        { label: "配列の反転", detail: "配列の要素の順番を反転します｜配列の反転（配列）：配列" },


        { label: "GetFileSize", detail: "ファイルのサイズを取得します｜GetFileSize(text {パス}) : num" },
        { label: "ファイルサイズの取得", detail: "ファイルのサイズを取得します｜ファイルサイズの取得（テキスト｛パス｝）：整数" },
        { label: "FileExists", detail: "ファイルが存在するかどうかを取得します｜FileExists(text {パス}) : bool" },
        { label: "ファイルが存在するか", detail: "ファイルが存在するかどうかを取得します｜ファイルが存在するか（テキスト｛パス｝）：真偽" },

        { label: "LoadCharArray", detail: "ファイルを指定して保存された配列の要素を読み込みます｜LoadArray(text {パス}) : array" },
        { label: "LoadNumArray", detail: "ファイルを指定して保存された配列の要素を読み込みます｜LoadArray(text {パス}) : array" },
        { label: "LoadDecimalArray", detail: "ファイルを指定して保存された配列の要素を読み込みます｜LoadArray(text {パス}) : array" },
        { label: "LoadTypeArray", detail: "ファイルを指定して保存された配列の要素を読み込みます｜LoadArray(text {パス}) : array" },
        { label: "LoadBoolArray", detail: "ファイルを指定して保存された配列の要素を読み込みます｜LoadArray(text {パス}) : array" },

        { label: "文字配列の読み込み", detail: "ファイルを指定して保存された配列の要素を読み込みます｜配列の読み込み（テキスト｛パス｝）：配列" },
        { label: "整数配列の読み込み", detail: "ファイルを指定して保存された配列の要素を読み込みます｜配列の読み込み（テキスト｛パス｝）：配列" },
        { label: "小数配列の読み込み", detail: "ファイルを指定して保存された配列の要素を読み込みます｜配列の読み込み（テキスト｛パス｝）：配列" },
        { label: "タイプ配列の読み込み", detail: "ファイルを指定して保存された配列の要素を読み込みます｜配列の読み込み（テキスト｛パス｝）：配列" },
        { label: "真偽配列の読み込み", detail: "ファイルを指定して保存された配列の要素を読み込みます｜配列の読み込み（テキスト｛パス｝）：配列" },

        { label: "SaveArray", detail: "ファイルを指定して配列の要素を保存します｜SaveArray(text {パス}, array {データ})" },
        { label: "配列の保存", detail: "ファイルを指定して配列の要素を保存します｜配列の保存（テキスト｛パス｝、配列｛データ｝）" },

        { label: "CreateFile", detail: "ファイルを作成します｜CreateFile(text {パス})" },
        { label: "WriteFile", detail: "ファイルに書き込みます（既存のデータは破棄されます）（ファイルがなければ作成します）｜WriteFile(text {パス}, text {データ})" },
        { label: "ReadFile", detail: "ファイルを読み込みます（ファイルがなければ空のテキストを返します）｜ReadFile(text {パス}) : text" },

        { label: "ファイル作成", detail: "ファイルを作成します｜ファイル作成（テキスト｛パス｝）" },
        { label: "ファイル書き込み", detail: "ファイルに書き込みます（上書きで以前のデータが破棄されます）（ファイルがなければ作成します）｜ファイル書き込み（テキスト｛パス｝、テキスト｛データ｝）" },
        { label: "ファイル読み込み", detail: "ファイルを読み込みます（ファイルがなければ空のテキストを返します）｜ファイル読み込み（テキスト｛パス｝）：テキスト" },

        { label: "UpperChar", detail: "文字を大文字化します｜UpperChar(char) : char" },
        { label: "UpperText", detail: "文字列を大文字化します｜UpperText(text) : text" },
        { label: "LowerChar", detail: "文字を小文字化します｜LowerChar(char) : char" },
        { label: "LowerText", detail: "文字列を小文字化します｜LowerText(text) : text" },

        { label: "文字の大文字化", detail: "文字を大文字化します｜文字の大文字化（文字）：文字" },
        { label: "テキストの大文字化", detail: "文字列を大文字化します｜テキストの大文字化（テキスト）：テキスト" },
        { label: "文字の小文字化", detail: "文字を小文字化します｜文字の小文字化（文字）：文字" },
        { label: "テキストの小文字化", detail: "文字列を小文字化します｜テキストの小文字化（テキスト）：テキスト" },

        { label: "GetYear", detail: "現在の年を取得します｜GetYear() : num" },
        { label: "年の取得", detail: "現在の年を取得します｜年の取得（）：整数" },
        { label: "GetMonth", detail: "現在の月を取得します｜GetMonth() : num" },
        { label: "月の取得", detail: "現在の月を取得します｜月の取得（）：整数" },
        { label: "GetDayOfWeek", detail: "現在の曜日（数値）を取得します｜GetDayOfWeek() : num" },
        { label: "曜日の取得", detail: "現在の曜日（数値）を取得します｜曜日の取得（）：整数" },
        { label: "GetDay", detail: "現在の日を取得します｜GetDay() : num" },
        { label: "日の取得", detail: "現在の日を取得します｜日の取得（）：整数" },
        { label: "GetHour", detail: "現在の時（時間）を取得します｜GetHour() : num" },
        { label: "時の取得", detail: "現在の時（時間）を取得します｜時の取得（）：整数" },
        { label: "GetMinute", detail: "現在の分を取得します｜GetMinute() : num" },
        { label: "分の取得", detail: "現在の分を取得します｜分の取得（）：整数" },
        { label: "GetSecond", detail: "現在の秒を取得します｜GetSecond() : num" },
        { label: "秒の取得", detail: "現在の秒を取得します｜時の取得（）：整数" },
        { label: "GetMilliseconds", detail: "現在のミリ秒を取得します｜GetMilliseconds() : num" },
        { label: "ミリ秒の取得", detail: "現在のミリ秒（1/1000秒）を取得します｜ミリ秒の取得（）：整数" },

        { label: "TextArray_Length", detail: "テキスト配列の要素数（長さ）を取得します＜TextArray＞" },
        { label: "テキスト配列_要素数", detail: "テキスト配列の要素数を取得します＜TextArray＞" },
        { label: "TextArray_AppendItem", detail: "テキスト配列の末尾に要素を追加します＜TextArray＞" },
        { label: "テキスト配列_要素の末尾追加", detail: "テキスト配列の末尾に要素を追加します＜TextArray＞" },
        { label: "TextArray_AddItem", detail: "テキスト配列の指定場所に要素を追加します＜TextArray＞" },
        { label: "テキスト配列_要素の追加", detail: "テキスト配列の指定場所に要素を追加します＜TextArray＞" },
        { label: "TextArray_CountItem", detail: "テキスト配列内の要素の個数を取得します＜TextArray＞" },
        { label: "テキスト配列_要素の個数", detail: "テキスト配列内の要素の個数を取得します＜TextArray＞" },
        { label: "TextArray_SearchItem", detail: "テキスト配列内の要素の場所を取得します＜TextArray＞" },
        { label: "テキスト配列_要素の場所", detail: "テキスト配列内の要素の場所を取得します＜TextArray＞" },
        { label: "TextArray_GetItem", detail: "テキスト配列の要素を取得します＜TextArray＞" },
        { label: "テキスト配列_要素の取得", detail: "テキスト配列の要素を取得します＜TextArray＞" },
        { label: "TextArray_SetItem", detail: "テキスト配列に要素を設定します＜TextArray＞" },
        { label: "テキスト配列_要素の設定", detail: "テキスト配列に要素を設定します＜TextArray＞" },
        { label: "TextArray_ReplaceItem", detail: "テキスト配列内の一致する要素を置き換えます＜TextArray＞" },
        { label: "テキスト配列_要素の置き換え", detail: "テキスト配列内の一致する要素を置き換えます＜TextArray＞" },
        { label: "TextArray_RemoveItem", detail: "テキスト配列内の一致する要素を削除します＜TextArray＞" },
        { label: "テキスト配列_要素の削除", detail: "テキスト配列内の一致する要素を削除します＜TextArray＞" },
        { label: "TextArray_DeleteItem", detail: "テキスト配列内の指定場所の要素を削除します＜TextArray＞" },
        { label: "テキスト配列_要素の消去", detail: "テキスト配列内の指定場所の要素を削除します＜TextArray＞" },
        { label: "TextArray_SplitText", detail: "テキストを分割したテキスト配列を返します＜TextArray＞｜SplitText(text, text) : data" },
        { label: "テキスト配列_テキストの分割", detail: "テキストを分割したテキスト配列を返します＜TextArray＞｜テキストの分割（テキスト、テキスト）：データ" },

        { label: "TextArray_ClipArray", detail: "テキスト配列の｛場所｝から｛要素数｝の部分を切り取ります＜TextArray＞｜ClipArray(data, num {場所}, num {要素数}) : data" },
        { label: "テキスト配列_配列の切り取り", detail: "テキスト配列の｛場所｝から｛要素数｝の部分を切り取ります＜TextArray＞｜配列の切り取り（データ、整数｛場所｝、整数｛要素数｝）：データ" },
        { label: "TextArray_ReverseArray", detail: "テキスト配列内の要素の順序を反転させます＜TextArray＞｜ReverseArray(data) : data" },
        { label: "テキスト配列_配列の反転", detail: "テキスト配列内の要素の順序を反転させます＜TextArray＞｜配列の反転（データ）：データ" },
        { label: "TextArray_ToText", detail: "テキスト配列をテキストにします＜TextArray＞｜ToText(data) : text" },
        { label: "テキスト配列_テキストにする", detail: "テキスト配列をテキストにします＜TextArray＞｜テキストにする（データ）：テキスト" },


        { label: "ParseNumExpr", detail: "計算式（整数で構成される式）のテキストを解析／計算します｜ParseNumExpr(text) : decimal" },
        { label: "整数式の解析", detail: "計算式（整数で構成される式）のテキストを解析／計算します｜整数式の解析（テキスト）：データ" },
        { label: "ParseDecimalExpr", detail: "計算式（小数で構成される式）のテキストを解析／計算します｜ParseDecimalExpr(text) : decimal" },
        { label: "小数式の解析", detail: "計算式（小数で構成される式）のテキストを解析／計算します｜小数式の解析（テキスト）：小数" },

        { label: "GetTimeValue", detail: "システムの稼働時間（単位はミリ秒）を取得します／経過時間を取得する場合はこれを使用します｜GetTimeValue() : num" },
        { label: "時間値の取得", detail: "システムの稼働時間（単位はミリ秒）を取得します／経過時間を取得する場合はこれを使用します｜時間値の取得（）：整数" },
    
        { label: "TextArray", detail: "要素を指定してテキスト配列を作成します＜TextArray＞｜TextArray(text, text, ...) : data" },
{ label: "テキスト配列", detail: "要素を指定してテキスト配列を作成します｜テキスト配列（テキスト、テキスト、...）：データ" },
      ];

      for (const k of funcs)
      {
        let item = new vscode.CompletionItem(k.label, vscode.CompletionItemKind.Function);
        item.detail = k.detail;
        items.push(item);
      }

      const snippets = 
      [
        {label:"if",body:"if(${1:condition})\n\t$0\nend",detail:"if statement"},
        {label:"loop",body:"loop(${1:number})\n\t$0\nend",detail:"loop statement with number"},
        {label:"loop",body:"loop\n\t$0\nend",detail:"loop statement"},
        {label:"func",body:"func ${1:name}(${2:params}) : ${3:type}\n\t$0\n\treturn ${4:value}\nend",detail:"function statement"},
        {label:"var",body:"var ${1:name} = ${2:value}",detail:"var statement"},
        {label:"def",body:"def ${1:type} ${2:name} = ${3:value}",detail:"constant statement"},

        {label:"もし",body:"もし(${1:条件})\n\t$0\nおわり",detail:"もし文"},
        {label:"ループ",body:"ループ(${1:回数})\n\t$0\nおわり",detail:"ループ文（回数あり）"},
        {label:"ループ",body:"ループ\n\t$0\nおわり",detail:"ループ文"},
        {label:"関数",body:"関数　${1:名前}（${1:引数}）　：　${3:型}\n\t$0\n\t返す　${4:返り値}\nおわり",detail:"関数の宣言"},
        {label:"変数",body:"変数　${1:名前}　＝　${2:値}",detail:"変数の宣言"},
        {label:"定義",body:"定義　${1:型}　${2:名前}　=　${3:値}",detail:"定数の宣言"}
      ];

      for (const k of snippets)
      {
        let item = new vscode.CompletionItem(k.label, vscode.CompletionItemKind.Snippet);
        item.insertText = new vscode.SnippetString(k.body);
        item.detail = k.detail;
        items.push(item);
      }

      keywords.forEach(k => identifiers.delete(k));
      consts.forEach(k => identifiers.delete(k.label));
      funcs.forEach(k => identifiers.delete(k.label));

      identifiers.forEach(k => items.push(new vscode.CompletionItem(k, vscode.CompletionItemKind.Variable)));

      return items;
    }
  }, ' ', '　');

  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = { activate, deactivate };
