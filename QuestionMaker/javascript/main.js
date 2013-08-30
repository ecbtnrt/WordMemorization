$(function(){
 //隠したり表示したり
 $(".myhead>button.mystatus").on("click",function(e){
  var mybody=$(this).parent().nextAll(".mybody");
  mybody.slideToggle("",function(){
   var button=$(this).prev(".myhead").children("button.mystatus");
   if($(this).is(":hidden")){
    button.text("show");
   }else{
    button.text("hide");
   }
  });
 });

 //ツールバーの追加ボタン
 $("#questionEditorToolBoxAdd").on("click",function(e){
  var editorTableBody=$("#questionEditor>table>tbody");
  var contentTr=$('<tr></tr>');
  var question=$('<td></td>').addClass("editable");
  var answer=$('<td></td>').addClass("editable");
  contentTr.append($('<td></td>').text(editorTableBody.children("tr").length)).append(question).append(answer);
  editorTableBody.append(contentTr);
  question.click();
 });

 //ツールバーのセーブ
 //ここで警告を表示する
 $("#questionEditorToolBoxSave").on("click",function(e){
  $(this).focus();
  var data=JSON.stringify(questionData);
  var blob=new Blob([data]);
  var url=webkitURL||URL;
  var blobURL=url.createObjectURL(blob);
  var fileName=($("#FileName").val()+".json");
  var flag=true;
  var messages="";

  fileName+=((!fileName)?"questionData.json":"");
  if($(this).attr("download")!=void(0)){
   $(this).attr("download",fileName);
  }
  $(this).attr("href",blobURL);

  //metaデータ入力欄に空白が有る
  if(metaDataHasEmpty()){
   flag=flag&&false;
   messages+="いくつかの問題に必要な情報が足りません";
   //表示
   if($("#questionStatus>.mybody").is(":hidden")){
    $("#questionStatus>.myhead button").click();
   }
  }

  if(messages!=""){
   var button=$("<button />").attr("data-dismiss","alert").attr("aria-hidden","true").html("&times;").addClass("close");
   console.log(button);
   var alertDOM=$("<div />").text(messages).addClass("alert-dismissable").addClass("alert").addClass("alert-danger").addClass("fade").addClass("in").prependTo("body").prepend(button);
  }

  if(!flag){
   e.preventDefault();
  }
 });

 //テーブル内のフォーカスが外されたら
 $(document).on("blur","#questionEditor>table .editable>input",function(e){
  var thisTr=$(this).closest("tr").removeClass("active");
  var index=thisTr.parent().children("tr").index(thisTr);
  var type=thisTr.children("td").index($(this).closest("td"));
  var typeStr=( ["questionSentence","answer"] )[type-1];
  //もしundefinedなら
  if(questionData.question[index]==void(0)){
   questionData.question[index]={};
  }
  questionData.question[index][typeStr]=$(this).val();
  if(dataHasEmpty(index)){
   thisTr.addClass("danger");
  }
 });

 //focusが当たればactiveに
 $(document).on("focus","#questionEditor>table .editable>input",function(e){
  $(this).closest("tr").removeClass("danger").addClass("active");
 });

 //editableをクリックさせてinputを追加(要素削除)
 $(document).on("click",".editable",function(e){
  var value;
  if($(this).has("input").length==0){
   value=$(this).text();
   var input=$('<input />').attr('type','text').val(value);
   input.addClass("form-control");
   $(this).empty();
   $(this).append(input);
   input.focus();
  }
 });

 //inputのフォーカスを外す(要素削除)
 $(document).on("blur",".editable>input",function(e){
  var parentElem=$(this).parent();
  value=$(this).val();
  parentElem.empty();
  parentElem.text(value);
 }).on("keydown",".editable>input",function(e){
   //キーによる動作てk義
  var flag=true;
  var parentElem=$(this).parent();

  //Enter or Tab
  if(e.keyCode==13||e.keyCode==9){
   $(this).blur();
   //Shift+Tabなら前へ
   if(e.shiftKey&&e.keyCode==9){
    parentElem.prev(".editable").click();
   }else{
    parentElem.next(".editable").click();
   }
   flag=false;
  }

  return flag;
 });

 //メタ情報 変更時にquestionDataに保存される
 //File Name以外は空白でも構わないがそれ以外は空白だったらhaserrorを
 $("#questionStatus>.mybody input:not(#FileName)").on("blur",function(e){
  var value=$(this).val();
  var id=$(this).attr("id");
  var formGroup=$(this).closest(".form-group");
  if(value.match(/^\s*$/)){
   formGroup.addClass("has-error");
  }else{
   formGroup.removeClass("has-error");
   questionData[id]=value;
  }
 });

 function dataHasEmpty(dataId){
  var flag=false;
  var data=questionData.question[dataId];

  flag=flag||((data.questionSentence==void(0))||(!!data.questionSentence.match(/^\s*$/)));
  flag=flag||((data.answer==void(0))||(!!data.answer.match(/^\s*$/)));

  return flag;
 }

 function metaDataHasEmpty(){
  var flag=false;
  var properties=["QuestionID","QuestionName","Author","version"];
  for(var i=0;i<properties.length;i++){
   flag=flag||((questionData[properties[i]]==void(0))||(!!questionData[properties[i]].match(/^\s*$/)));
  }
  return flag;
 }

 //ショートカットキー
 $(document).on("keydown",function(e){
  if(e.ctrlKey){
   switch(e.which){
    case 83:
     $("#questionEditorToolBoxSave").click();
     break;
    case 65:
     $("#questionEditorToolBoxAdd").click();
     console.log("add");
     break;
   }
  }
 });

 $("#questionStatus>.myhead>button.mystatus").click();
});

function debugMode(){
 $('#questionEditorToolBoxSave').removeAttr("download").attr("type","text/plain");
}

var questionData={
 question:[],
 QuestionID:"",
 QuestionName:"",
 DataType:"QuestionData",
 Author:"",
 version:"",
};