
var test = new Emmet;
var str = `
  div.test#id.test2[style="ok" check="false" onclick="@func"] > 
    ( 
      p + 
      ( div.title{@time} > div.time ) * 2 +
      span{$} * $arr * @arr
    ) * 1
  `;

var str = `
  (span{$name} * 2 ) * @arr
`;

var str = `
  (  div{$name} > ( span{$} * $key ) * $words ) * @arr
`;

var str = `
  (  div{$name} + span{$} * $arr + span{$} * $arr + span{$} * $arr) * @arr
`;

var str = `
  (  div{$name} > ( span{$} * $key ) * $words + ( span{$} * $key ) * $words + p{$} * $arr + p{$} * $arr) * @arr
`;

var str = `
  ( 
     div{$name} + 
    ( span{$} * $key ) * $words
  ) * @arr 
`;

var str = `
  ( 
    (div{$name} > p{$} * $arr ) +
    div{$name} > ( span{$} * $key ) * $words
  ) * @arr
`;


var str = `
  div{$} * $level3 * $level2 * $level1 * @arr 
`;

var str = `
  ( 
    (div{$name} > p{$} * $arr )
    div{$name} > ( span{$} * $key ) * $words
  ) * @arr
`;

var str = `
  ( 
    div{$name} > p{$} * $arr ^
    div{$name} > ( span{$} * $key ) * $words
  ) * @arr + div{test}
`;

var str = `
  ( 
    div{$name} > p{$} * $arr ^
    div{$name} > ( ( span{$} ^ div ) * $key + p ) * $words + div
  ) * @arr + div{test}
`;

var str = `
  div.$class[$key=$value $attribute] * @arr
`;

var config = {
  time:'1996/11/07',
  func:function(){
    console.log('hello world');
  },
  key:'DeepKolos',
  value:'蓝精灵',
  Emmet:'div{ok} * 2',//不支持直接导入
  arr:[
    {
      name:'deepkolos',
      class:['class1','class2'],
      key:'PHP',
      value:'世界上最后的语言',
      attribute:{
        'attrKey':'attrValue'
      },
      words:[
        {
          key:[
            '000unspeakable love',
            '001some thing become my part'
          ]
        },
        {
          key:[
            '010unspeakable love',
            '011some thing become my part'
          ]
        }
      ],
      arr:[
        '蓝精灵啊, 这个parser好难啊,很锻炼debug能力啊',
        '本以为可以很快搞定了,结果打击甚大,不过今天弄高考录取查询不用两个小时搞定了,因为简单嘛~'
      ],
      level1:[
        {
          level2:[
            {
              level3:[
                'ok~000',
                'ok~001'
              ]
            },
            {
              level3:[
                'ok~010',
                'ok~011'
              ]
            }
          ]
        },
        {
          level2:[
            {
              level3:[
                'ok~100',
                'ok~101'
              ]
            },
            {
              level3:[
                'ok~110',
                'ok~111'
              ]
            }
          ]
        }
      ],
    },
    {
      name:'蓝精灵',
      words:[
        {
          key:[
            '100unspeakable love',
            '101some thing become my part'
          ]
        },
        {
          key:[
            '110unspeakable love',
            '111some thing become my part'
          ]
        }
      ],
      arr:[
        '1蓝精灵啊, 这个parser好难啊,很锻炼debug能力啊',
        '1本以为可以很快搞定了,结果打击甚大,不过今天弄高考录取查询不用两个小时搞定了,因为简单嘛~'
      ]
    }
  ]
};

console.log(str);

var result = test.parse(str,config);

// console.dir(result);
console.log(config);

result.forEach(function(elemment){
  console.log(elemment);
  // document.querySelector('body').appendChild(elemment);
});
