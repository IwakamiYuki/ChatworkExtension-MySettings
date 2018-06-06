/**
 * カスタムボタンを設置する
 */
var addMyButton = function(){
	//  TO圧縮ボタンの設置
	var span = document.createElement('span');
	span.textContent = 'TOALL 圧縮(ctrl + ,)';
	span.className='to-asshuku button';
	span.onclick = function() {
		var e = document.getElementById('_chatText')
		if (e.value.length > 0) {
			e.value=e.value.replace(/(^\[To\:[0-9]+\]).+[\s\S]/gm,'$1');
		} else {
			e.value='[toall]'
		}
	}
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);

	// キレイにするやつ
	span = document.createElement('span');
	span.textContent = '[info](ctrl + .)';
	span.className='to-asshuku button';
	span.onclick = selectedText2InfoText;
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);

	///// エモーションの追加
	// (gogo)
	var addedEmotion = document.createElement('li').cloneNode(true)
	addedEmotion. setAttribute('class', 'emoticonTooltip__emoticonContainer')
	addedEmotion.innerHTML = '<img src="https://assets.chatwork.com/images/emoticon2x/emo_gogo.gif" alt="(gogo)" data-cwtag="(gogo)" title="いけいけ！" class="emoticonTooltip__emoticon">'
	document.getElementById('_emoticonGallery').appendChild(addedEmotion)
	// (ec14)
	addedEmotion = document.createElement('li') .cloneNode(true)
	addedEmotion. setAttribute('class', 'emoticonTooltip__emoticonContainer')
	addedEmotion.innerHTML = '<img src="https://assets.chatwork.com/images/emoticon2x/emo_ceo.gif" alt="(ec14)" data-cwtag="(ec14)" title="EC14" class="emoticonTooltip__emoticon">'
	document.getElementById('_emoticonGallery').appendChild(addedEmotion)

	
	setTimeout(function() {
		// グループ絞り込みにショートカットキーを表示させる
		var searchTag = document.getElementsByClassName('roomListHeader')[1].childNodes[0]
		searchTag.setAttribute('placeholder', searchTag.getAttribute('placeholder')+'（ctrl+i）')

		// 検索窓のフォーカスを離れたときの処理
		document.getElementsByClassName('roomListHeader')[1].childNodes[0].addEventListener("blur", function( event ) {
			isSearching = false;
		}, true);
	},1000)
}

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



/**
 * 読み込みが完了するまで待機する
 */
var waitLoading = function() {
	if (document.getElementById('_chatText')) {
		addMyButton();
	} else {
		setTimeout(waitLoading,200)
	}
}

waitLoading();
