这次应该不算造轮子~ 写了比较规范的测试~ 希望**点赞**的数量有突破~~充值充值虚荣心~

## 制作的的原因
-------------
制作的的原因还是属于解决自己的遇到的麻烦事, 用于在前端便捷地生成dom结构

1. 编辑器的Emmet修改起来还是比较麻烦, 按ctrl+z , 次数有点多 , 还有为了面对后的修改会把emmet的命令储存在注释里面 
2. 同时有一些dom是储存在js里面 , 占据的空间略大, 并且代码折叠 (在VS code编辑器) , 不能完整折叠, 代码之间的跳转不方便
3. 储存在js 里面的dom里面的无论是事件绑定还是数据导入都用原生的方式挺繁琐的

## 功能概览

语法大致和Emmet的一致, 不过只是在导入数据方面我自己增加了一些, 不过只是支持了Emmet基础的语法 , 相比于Emmet少了一些限制 可以使用\n\t\r空格来格式化代码 

基础的Emmet语法就不介绍了比较简单, 看下面的例子的输入输出就能知道其作用了

推荐直接 [ git clone ](https://github.com/deepkolos/emmet-template-engine)来看 , 如果觉得有用的话 `点赞/star` 一下下~耗时5day , debug大概占了80%的时间

-------------
###### 修饰符`.`和`#`及其导入
```
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
  `<div id="id_covered" class="class_0 imported_str imported_arr_0,imported_arr_1"></div>`
];

test.parse().forEach(function(element,i){
  if(element.outerHTML != result[i]){
    tester.fail(id,element,result[i]);
  }else
    tester.success(id,element);
});
```
输出

![](http://upload-images.jianshu.io/upload_images/252050-ab2f48245258f98c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-------
###### 修饰符`[]`和`{}`及其导入
```
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
```
输出
![](http://upload-images.jianshu.io/upload_images/252050-9f5ce91ad9cd6a03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-------
###### 连接符`( ) * > ^`及其导入和寻址

`$`是这层循环的得到结果, 如果其是一个object的话先要得到其自属性使用`$attrName`做来获取 , 如果还想继续获取就之后就是使用`:`来做分割, 比如`$obj:key2:key3`

```
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
```
输出

![](http://upload-images.jianshu.io/upload_images/252050-ea4a3b3baf28d8af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://upload-images.jianshu.io/upload_images/252050-299c5e85f4bbba46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://upload-images.jianshu.io/upload_images/252050-e906df2c3364cfb4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-------
###### 修饰符`[]`的`=(nodeAttr)`属性导入, 和`=>(objAttr)`属性导入

```
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
```
输出

![](http://upload-images.jianshu.io/upload_images/252050-8dde2827439d1471.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

--------
###### `[]`中的`eventProcessor`导入
```
//测试eventProcessor导入
//暂时不支持同一个事件同时导入管线事件和通过addEventListener,只能导入其中一种~

/*
onevent=function(){} 
result:
node.onevent = function(){} 

onevent=[function(){} ]
result:
[ function(){} ].forEach(function(eventProcessor){
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
```
输出

![](http://upload-images.jianshu.io/upload_images/252050-4744c42b0f6b5883.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://upload-images.jianshu.io/upload_images/252050-a32bea4f7a0fc495.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-------

## 制作感受

弄这家伙很锻炼debug能力啊, 连续de到凌晨3点...当然最后只是显示自己逻辑不强~ 一开始测试很随意, 但后面准备完工的时候试试写测试样例, 结果发现这样写好舒服~感觉结构清晰~debug起来也方便~一边debug一边发现可以完善的特性~

其实这个应该算不上模版引擎吧 , 因为没有`if else`等语句, 也没有做数据绑定 , 虽然`if`可以通过`* @arr`来代替 ,如果if成立就以为着arr里面有一个数据 , 不过着并不直观~ 不管如果`*` 的循环应该是十分简洁方便的~ 应该可以满足最基本的前端模版需求[faceplam]~ 

最后感觉有用的话 求 `点赞/star` ~
