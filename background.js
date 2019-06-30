function moveTab(command="move_tab_right"){
	chrome.tabs.query({'currentWindow': true}, function(tabs){
		var tab, firstUnpinned, lastPinned;
		tabs.forEach(function(item, i, arr){
			//find active tab
			if(item.active){
				tab = item;
			}
			//find first unpinned tab
			if(item.pinned === false && firstUnpinned == undefined){
				firstUnpinned = item.index;
			}
			//find last pinned tab
			if(item.pinned == true){
				lastPinned = item.index;
			}
		});
		//find new index to move
		var newIndex;
		if(command=='move_tab_left'){
			newIndex = tab.index - 1;
			if(tab.pinned && newIndex < 0){
				newIndex = lastPinned;
			}
			if(tab.pinned == false && newIndex == lastPinned){
				newIndex = -1;
			}
		}
		if(command=='move_tab_right'){
			newIndex = tab.index + 1
			//need to aditional check
			if(newIndex >= tabs.length){
				newIndex = firstUnpinned;
			}
			if(tab.pinned && newIndex > lastPinned){
				newIndex = 0;
			}
		}
		if(command=="move_tab_start"){
			if(tab.pinned){
				newIndex = 0;
			}else{
				newIndex = firstUnpinned;
			}
		}
		if(command=="move_tab_end"){
			if(tab.pinned){
				newIndex = lastPinned;
			}else{
				newIndex = tabs.length-1;
			}
		}
		//move to the new index
		chrome.tabs.move(tab.id, {index: newIndex}, function(){});
	});
}

chrome.commands.onCommand.addListener(function(command){
    moveTab(command);
});
