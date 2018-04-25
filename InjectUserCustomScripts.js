/**
 * TO圧縮ボタンの設置
 */
setTimeout(function()  {
	var span = document.createElement('span');
	span.textContent = 'TO圧縮';
	span.className='to-asshuku button';
	span.onclick = function() {
		var e = document.getElementById('_chatText')
		e.value=e.value.replace(/(^\[To\:[0-9]+\]).+[\s\S]/gm,'$1');
	}
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);

	// キレイにするやつ
	span = document.createElement('span');
	span.textContent = '[info]';
	span.className='to-asshuku button';
	span.onclick = selectedText2InfoText;
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);
}, 1000)

/**
 * 1行目タイトル、2行目移行内容に変換する
 */
var selectedText2InfoText = function() {
	var chatTextNode = document.getElementById('_chatText');
	var chatTextValue = chatTextNode.value;
	var startPos = chatTextNode.selectionStart;
	var endPos = chatTextNode.selectionEnd;
	if (startPos == endPos) {
			return;
	}

	var chatTextList = chatTextValue.substring(startPos,endPos).split('\n');
	var infoText = '[info]';
	if (chatTextList.length > 1){
		var titleTextFlag = true;
		for (var i = 0; i < chatTextList.length; i++){
			if (titleTextFlag) {
				infoText += '[title]' + chatTextList[i] + '[/title]';
				titleTextFlag = false;
				continue;
			}
			infoText += chatTextList[i] + '\n';
		}
		infoText = infoText.substr(0, infoText.length - 1) + '[/info]';
	} else {
		infoText += chatTextList[0] + '[/info]';
	}
	chatTextNode.value = chatTextValue.substring(0, startPos) + infoText + chatTextValue.substring(endPos, chatTextValue.length);
}

var roomMoreButtonClickCount = 0;
/**
 * グループ一覧を全部読み込む
 */
var roomMoreButtonClick = function() {
	if (roomMoreButtonClickCount >= 2) return; // 開きすぎると重くなっちゃうので2回くらいで止めておく
	roomMoreButtonClickCount++
	document.getElementById('_roomMore').click()
	if (document.getElementById('_roomMore')) setTimeout(roomMoreButtonClick,100);
}

/**
 * キーを押したときの処理
 */
var isSearching = false;
document.onkeydown = function (e){
	// TO圧縮
	if (e.ctrlKey && e.key==',') {
		document.getElementsByClassName('to-asshuku')[0].click();
	}
	// title~codeをつける
	if (e.ctrlKey && e.key=='.') {
		selectedText2InfoText();
	}

	// ctrl + i でグループ名で絞り込み。入力後、Enterキーでその部屋を表示する。
	if (e.ctrlKey && e.key=='i') {
		document.getElementsByClassName('roomListHeader')[1].children[0].focus();
		isSearching = true;
		roomMoreButtonClick();
	}
	if (isSearching && e.key == 'Enter') {
		isSearching = false;
		var roomItemList = document.getElementById('_roomListItems').getElementsByClassName('roomListItem')
		for (var i = 0; i < roomItemList.length; i++) {
			if (roomItemList[i].style.length == 0) {
				roomItemList[i].click();
				break;
			}
		}
		document.getElementsByClassName('roomListHeader')[1].children[0].blur();
	}
};
