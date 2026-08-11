const monarchTokens = {
    defaultToken : "invalid",

    keywords : [
        "if", "elif", "else", "return", "func", "loop", "end"
    ],

    tokenizer : {
            root: [
                [/\/\/\//, { token: "comment", next: "@dcom" }],
                [/\/\/.*/, "comment"], 

                [/\b(typeof|is|true|false)\b/, "keyword.operator"], 
                [/(タイプ取得|が|はい|いいえ)/, "keyword.operator"], 

                [/\b(def|func|loop|if|elif|else|return|break|continue|end)\b/, "keyword.control"], 
                [/(定義|関数|ループ|もし|さらにもし|ほか|返す|抜ける|続ける|おわり)/, "keyword.control"], 

                [/\b(num|char|decimal|text|bool|type|var|void)\b/, "keyword.type"], 
                [/(整数|文字|小数|テキスト|真偽|タイプ|変数|なし)/, "keyword.type"], 

                [/[+\-*/=<>!&|%]+/, "operator"],
                [/[％｜＆＋－×÷＝＜＞！]+/, "operator"],

                [/\b\d+(\.\d+)?([eE][+-]?\d+)\b/, "number.float"],
                [/0x[0-9A-Fa-f]+/, "number.hex"],
                [/0x[0-7]+/, "number.oct"],
                [/0b[0-1]+/, "number.bin"],
                [/\d+\.\d+/, "number.float"],
                [/\d+/, "number"],

                [/\\./, "string.escape"],
                [/".*?"/, "string"], 
                [/'[^'\\]?'/, "string"], 
                [/'\\./, "string"],
            
                [/[a-zA-Z_]\w*/, "identifier"], 
            ],
            dcom: [
                [/\/\/\//, { token: "comment", next: "@pop" }], 
                [/.*/, "comment"],
            ]
    }
}

module.exports = monarchTokens;