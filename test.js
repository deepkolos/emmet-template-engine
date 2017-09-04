
//定义console输出样式

var console_fail_style = 'color:#e91e63;font-family:微软雅黑;';
var console_success_style = 'color:#009688;font-family:微软雅黑;';

//定义简单的测试控制器

var tester = [];
tester.__proto__ = [];

tester.__proto__.fail = function(id,wrong,right){
  console.log('%cFail-'+id , console_fail_style);
  console.log('%c ' + wrong.outerHTML , console_fail_style);
  console.log('%c %o ', console_fail_style , wrong);
  console.log('%c %o ', console_success_style , right);
};

tester.__proto__.success = function(id,right){
  console.log('%cPass-'+id , console_success_style);
  console.log('%c %o ', console_success_style , right);
};

tester.__proto__.run = function(which){
  if(which === undefined)
    this.forEach(function(test,key){
      test(key);
    });
  else
    this[which](which);
};

tester.push(function(id){
  //测试修饰符.和#及其导入

  var test = new Emmet(`
    div.class_0.@class_import_str.@class_import_arr#id#id_covered
  `);

  test.bindData({
    class_import_str:'imported_str',
    class_import_arr:[
      'imported_arr_0',
      'imported_arr_1'
    ]
  });

  var result = [
    `<div id="id_covered" class="class_0 imported_str imported_arr_0 imported_arr_1"></div>`
  ];

  test.parse().forEach(function(element,i){
    if(element.outerHTML != result[i]){
      tester.fail(id,element,result[i]);
    }else
      tester.success(id,element);
  });
});

tester.push(function(id){
  //测试修饰符[]和{}及其导入

  var test = new Emmet(`
    div.class_0#id_0[key_0="value_0" key_1='value_1' key_2=value2 =@key_value_imported]{@content_str} +
    div{@content_nodeObj}
  `);

  test.bindData({
    key_value_imported:{
      imported_key:'imported_value',
      key_0:'covered_value_0'
    },
    content_str:'string_0',
    content_nodeObj:(new Emmet(`div>span{ok}`)).parse()
  });

  var result = [
    `<div id="id_0" class="class_0" key_0="covered_value_0" key_1="value_1" key_2="value2" imported_key="imported_value">string_0</div>`,
    `<div><div><span>ok</span></div></div>`
  ];

  test.parse().forEach(function(element,i){
    if(element.outerHTML != result[i]){
      tester.fail(id,element,result[i]);
    }else
      tester.success(id,element);
  });

  //出错原因,正则?吃掉字符 ,改为['"]*([^'"]*)['"]*
  //出错原因,同层连接符为+,空格回车不算,本来打算回车空格作用等同于+但是这回影响上一个connectSymbol的判断
  //出错原因,直接量string不能使用instanceof来判断,该为typeof
  //未解bug,修改空格和+等同作用,出现死循环,由于原因2,不需要修复了
});

tester.push(function(id){
  //测试连接符()*>^及其导入和寻址

  var test = new Emmet(`
    div > (span > a ^ p) * 3 ^ 
    div > 
      (
        span{$name} + i{$obj:key} + div.$obj:key2:key3
        (
          ( span > a{$} ) * $level3 + p{$name}
        )* $level2 
      ) * @level1
  `);

  test.bindData({
    level1:[{
        name:'level1-0',
        obj:{
          key:'value-00',
          key2:{
            key3:'value-10'
          }
        },
        level2:[{
            name:'level2-0',
            level3:[
              'level3-0',
              'level3-1'
            ]
          },{
            name:'level2-1',
            level3:[
              'level3-2',
              'level3-3'
            ]
          }
        ]
      },{
        name:'level1-1',
        obj:{
          key:'value-01',
          key2:{
            key3:'value-11'
          }
        },
        level2:[{
            name:'level2-2',
            level3:[
              'level3-4',
              'level3-5'
            ]
          },{
            name:'level2-3',
            level3:[
              'level3-6',
              'level3-7'
            ]
          }
        ]
      }
    ]
  });

  var result = [
    `<div><span><a></a></span><p></p><span><a></a></span><p></p><span><a></a></span><p></p></div>`,
    `<div><span>level1-0</span><i>value-00</i><div class="value-10"></div><span><a>level3-0</a></span><span><a>level3-1</a></span><p>level2-0</p><span><a>level3-2</a></span><span><a>level3-3</a></span><p>level2-1</p><span>level1-1</span><i>value-01</i><div class="value-11"></div><span><a>level3-4</a></span><span><a>level3-5</a></span><p>level2-2</p><span><a>level3-6</a></span><span><a>level3-7</a></span><p>level2-3</p></div>`
  ];

  test.parse().forEach(function(element,i){
    if(element.outerHTML != result[i]){
      tester.fail(id,element,result[i]);
    }else
      tester.success(id,element);
  });
  
  //出错原因,直接量mutiple时没有NDM
  //补漏,支持HTMLElement的Array导入
  //出错原因,bindElementValue没有处理element的childs,还有忘记child处理完加delete NDV
});

tester.push(function(id){
  //测试修饰符[]的=(nodeAttr)属性导入,和=>(objAttr)属性导入

  var test = new Emmet(`
    div[key="nodeAttrValue" key=>"objAttrValue" =@import_to_nodeAttr =>@import_to_objAttr =$import_to_nodeAttr_inloop =>$import_to_objAttr_inloop] * @loop
  `);

  test.bindData({
    import_to_nodeAttr:{
      nodeKey_0:'nodeValue_0',
      nodeKey_1:'nodeValue_1',
    },
    import_to_objAttr:{
      objKey_0:'objValue_0',
      objKey_1:'objValue_1',
    },
    loop:[
      {
        import_to_nodeAttr_inloop:{
          nodeKey_inloop_0:'nodeValue_inloop_0',
          nodeKey_inloop_1:'nodeValue_inloop_1',
        },
        import_to_objAttr_inloop:{
          objKey_inloop_0:'objValue_inloop_0',
          objKey_inloop_1:'objValue_inloop_1',
        }
      }
    ]
  });

  var resultStr = [
    `<div key="nodeAttrValue" nodekey_0="nodeValue_0" nodekey_1="nodeValue_1" nodekey_inloop_0="nodeValue_inloop_0" nodekey_inloop_1="nodeValue_inloop_1"></div>`
  ];

  var resultObj = [
    {
      objKey_0:'objValue_0',
      objKey_1:'objValue_1',
      objKey_inloop_0:'objValue_inloop_0',
      objKey_inloop_1:'objValue_inloop_1'
    }
  ];

  test.parse().forEach(function(element,i){
    var objAttrTestPass = true;
    forEachObject(resultObj[i],function(value,key){
      if(element[key] != value)
        objAttrTestPass = false;
    })
    
    if(element.outerHTML != resultStr[i] || !objAttrTestPass){
      tester.fail(id,element,resultStr[i]);
    }else
      tester.success(id,element);
  });

  //出错原因,因为[] 使用了 => 符号, 而其中 > 是一个连接符,需要在cloestSymbol里面做排除
});

tester.push(function(id){
  //测试eventProcessor导入
  //暂时不支持同一个事件同时导入管线事件和通过addEventListener,只能导入其中一种~

  /*
  onevent=function(){} 
  result:
  node.onevent = function(){}

  onevent=[function(){}]
  result:
  [function(){}].forEach(function(eventProcessor){
    node.addEventListener(onevent.slice(2),eventProcessor)
  });
  */

  var test = new Emmet(`
    div[onclick=>@clickProcessor onmousemove=>@mousemoveProcessor]{click and mousemove}
  `);

  test.bindData({
    clickProcessor:function(){
      console.log('clickProcessor');
    },
    mousemoveProcessor:[
      function(e){
        console.log('mousemoveProcessor_0');
      },
      function(e){
        console.log('mousemoveProcessor_1');
      },
    ]
  });

  var result = [
    `<div>click and mousemove</div>`
  ];

  test.parse().forEach(function(element,i){
    if(element.outerHTML != result[i]){
      tester.fail(id,element,result[i]);
    }else
      tester.success(id,element);
    
    console.log('%c事件绑定需要人工判断结果~',console_success_style);
    document.querySelector('body').appendChild(element);
  });
});

tester.push(function (id) {
  var test = new Emmet(`
    div[style="width:100vw;height:100vh;"] > (
      div.topBar.flex > ( 
          div.back
            [click="#back"]
            {特殊图} 
              >img[
                src="/data/littleChat/topbar-back-icon.png"
                alt=""
              ]
        ) + (
          div.center.flex >
            div.inputBar.flex > (
              div.icon.search >
                img[
                  src="/data/littleChat/search-small-icon.png"
                  alt=""
                ]
            ) + (
              input.input[
                type="text" 
                placeholder="搜索"
              ]
            ) + (
              div.icon.voice >
                img[
                  src="/data/littleChat/voice-small-icon.png"
                  alt=""
                ]
            )
        )
    ) +
      div.main[style="height:calc(100vh - 45px);" 123=>#$123]
  `);

  test.bindData({
    
  });

  var result = [
    `<div style="width:100vw;height:100vh;"><div class="topBar flex"><div class="back" click="#back">特殊图<img src="/data/littleChat/topbar-back-icon.png" alt=""></div><div class="center flex"><div class="inputBar flex"><div class="icon search"><img src="/data/littleChat/search-small-icon.png" alt=""></div><input class="input" type="text" placeholder="搜索"><div class="icon voice"><img src="/data/littleChat/voice-small-icon.png" alt=""></div></div></div></div><div class="main" style="height:calc(100vh - 45px);"></div></div>`
  ];

  test.parse().forEach(function (element, i) {
    if (element.outerHTML != result[i]) {
      tester.fail(id, element, result[i]);
    } else
      tester.success(id, element);

  });
});

tester.push(function (id) {
  //测试修饰符.和#及其导入

  var test = new Emmet(`
    (
      div#$commentId.comment_row.comment_list > (
        img.photo[src=$avatarUrl onclick=$avatarClick] +
        div.info > (
          div.name{$nickName} +
          div.time{$time} > 
            div.firstCom.iconfont[onclick=@newReplayToComment]{@fix0} ^
          div.comment{$content} + 
          div.info.secInfo > (
            div.iconfont{@fix1} +
            div.subCommentsContainer{@subCommentsDom} +
            div.togglrmore.openmore[onclick=@openmore]{$replayLen} +
            div.togglrmore.closemore[onclick=@closemore]{收起}
          )
        )
      )
    ) * @comments
  `);

  var comments = [
    {
      id: '评论id',//应该是需要的,用于关联子评论
      useId: '评论用户id',
      avatar: '头像url',
      nickName: '名字',
      created_time: '创建时间,时间戳形式,后期可以该为xxx分钟前,并且动态更新',
      content: '评论内容',
      subComment: [//数组
        {
          formName: '发送回复用户名字',
          formId: '发送回复用户id',//如果是直接回复评论的话, 就返回NULL
          toName: '接受用户名字',
          toId: '接受用户Id',
          content: '回复内容'
        }
      ]
    }
  ];

  test.bindData({
    comments: comments,
    fix0: '&#xe63b;',
    fix1: '&#xe638;',
    newReplayToComment: function () {

    },
    openmore: function () {
      console.log(this);
    },
    closemore: function () {

    }
  });

  var result = [
    `<div id="id_covered" class="class_0 imported_str imported_arr_0 imported_arr_1"></div>`
  ];

  test.parse().forEach(function (element, i) {
    if (element.outerHTML != result[i]) {
      tester.fail(id, element, result[i]);
    } else
      tester.success(id, element);
  });
});

tester.push(function (id) {
  //测试修饰符.和#及其导入

  var test = new Emmet(`
    div.class_0.$class_import_str.$class_import_str.$class_import_arr#id#id_covered * @arr
  `);

  test.bindData({
    arr:[{
      class_import_str: 'imported_str',
      class_import_arr: [
        'imported_arr_0',
        'imported_arr_1'
      ]
    }]
  });

  var result = [
    `<div id="id_covered" class="class_0 imported_str imported_str imported_arr_0 imported_arr_1"></div>`
  ];

  test.parse().forEach(function (element, i) {
    if (element.outerHTML != result[i]) {
      tester.fail(id, element, result[i]);
    } else
      tester.success(id, element);
  });
});


// tester.run(tester.length-1);
tester.run();