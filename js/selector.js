class selector {
	constructor(attr,tags) {
		if(Object.prototype.toString.call(tags) !== '[object Array]')
			throw new Error('Whoops!, seems like your developer mess it up, this is not an Array.');
		for(var iA=0,tagsLength=tags.length; iA<tagsLength; iA++) {
			var tagElements = document.getElementsByTagName(tags[iA]);
			for(var iB=0,tagElemLength=tagElements.length; iB<tagElemLength; iB++) {
				var tagId = tagElements[iB].getAttribute(attr); 	
				if(tagId) {
					if(typeof this[tagId] === 'undefined'){
						this[tagId] = tagElements[iB];
					}else if(typeof this[tagId] === 'string'){
						var tempSelectObj = [this[tagId],tagElements[iB]];
						this[tagId] = tempSelectObj;
					}else{
						this[tagId].push(tagElements[iB]);
					}
				}
			}
		}
	}
}