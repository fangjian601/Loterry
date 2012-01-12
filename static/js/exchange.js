var exchange = function(){

    var users = {};
    var users_list = [];
    var users_exclude = ["53", "54", "55"];
    var users_vip = ["53", "54", "55"];
    var flipStep = 10;
    var flipTime = 200;
    var exchangeTableRow = 3;
    var exchangeTableColumn = 3;
    var exchangeTableSize = exchangeTableRow * exchangeTableColumn;
    var vipInterval = 1000;
    var normalInterval = 1000;
    var isVip = true;

    function arrayShuffle(theArray) {
        var len = theArray.length;
        var i = len;
        while (i--) {
            var p = parseInt(Math.random()*len);
            var t = theArray[i];
            theArray[i] = theArray[p];
            theArray[p] = t;
        }
    }

    function createCanvas(img, canvasHeight, canvasWidth, radius){
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);

        var canvasContext = canvas.getContext('2d');
        canvasContext.beginPath();
        canvasContext.moveTo(radius, 0);
        canvasContext.lineTo(canvas.width - radius, 0);
        canvasContext.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        canvasContext.lineTo(canvas.width, canvas.height - radius);
        canvasContext.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        canvasContext.lineTo(radius, canvas.height);
        canvasContext.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        canvasContext.lineTo(0, radius);
        canvasContext.quadraticCurveTo(0, 0, radius, 0);
        canvasContext.clip();
        canvasContext.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        return canvas;
        
    }

    function replaceCanvas(canvasHeight, canvasWidth, radius, canvasId, nameId){
        var centerPeopleId = $('#coverflow li.coverflow').attr('id').substring(13);
        var centerPeopleIndex = users_list.indexOf(centerPeopleId);
        if(centerPeopleIndex != -1){
            var img = $('img#people_img_'+users_list[centerPeopleIndex]).get(0);
            var name = users[users_list[centerPeopleIndex]].name;
            $('#'+canvasId+' canvas').remove();
            $('#'+canvasId).append(createCanvas(img, canvasHeight, canvasWidth, radius));
            $('#'+nameId).text(name);
            users_list.splice(centerPeopleIndex, 1);
        }
    }

    function coverflowFlip(canvasHeight, canvasWidth, radius, canvasId, nameId, step){
        if(step == 0){
            replaceCanvas(canvasHeight, canvasWidth, radius, canvasId, nameId);
            return;
        }
        
        $('#coverflow li.coverflow_end').remove();
    
        var centerPeopleId = $('#coverflow li.coverflow').attr('id').substring(13);
        var centerPeopleIndex = users_list.indexOf(centerPeopleId);
        $('#coverflow li.coverflow').attr('class', 'img coverflow_end');
        

        var peopleId = $('#coverflow li.coverflow_begin').attr('id').substring(13);
        var peopleIndex = users_list.indexOf(peopleId);
        $('#coverflow li.coverflow_begin').attr('class', 'img coverflow');
        if(peopleIndex != -1){
            $('#name-label').text(users[users_list[peopleIndex]].name);
        }

        if(peopleIndex != -1 && peopleIndex < (users_list.length - 1)){
            $('#coverflow').append(createPeopleEntry(users_list[peopleIndex+1], 'coverflow_begin'));
        }
        else if(peopleIndex != -1){
            $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow_begin'));
        }

        setTimeout(function(){coverflowFlip(canvasHeight, canvasWidth, radius, canvasId, nameId, step-1)}, flipTime);
    }

    function createExchangeUserDiv(id, nameId, userCanvas, userName, suffix){
        var userDiv = document.createElement("div");
        userDiv.setAttribute("class", "exchange-user-container"+suffix);

        var canvasDiv = document.createElement("div");
        canvasDiv.setAttribute("id", id);
        canvasDiv.setAttribute("class", "exchange-user-canvas-container"+suffix);
        canvasDiv.appendChild(userCanvas);

        var nameDiv = document.createElement("div");
        nameDiv.setAttribute("class", "exchange-username-container"+suffix);
        nameDiv.innerHTML = '<span class="exchange-username" id="'+nameId+'">'+userName+'</span>';

        userDiv.appendChild(canvasDiv);
        userDiv.appendChild(nameDiv);

        return userDiv;
    }

    function createExchangeLabelDiv(id, suffix){
        var exchangeLabelDiv = document.createElement("div");
        exchangeLabelDiv.setAttribute("id", "pair_center_"+id);
        exchangeLabelDiv.setAttribute("class", "exchange-label-container"+suffix);
        var exchangeLabel = document.createElement("p");
        exchangeLabel.setAttribute("class", "exchange-label"+suffix);
        exchangeLabel.innerHTML = "VS";
        exchangeLabelDiv.appendChild(exchangeLabel);

        return exchangeLabelDiv;

    }

    function createExchangeDiv(pairId, leftUserCanvas, leftUserName, 
                               rightUserCanvas, rightUserName, suffix){
        var exchangeDiv = document.createElement("div");
        exchangeDiv.setAttribute("id", "pair"+pairId);
        exchangeDiv.setAttribute("class", "exchange-container"+suffix+" button whitebutton");

        var leftUserDiv = createExchangeUserDiv("pair_left_"+pairId, 'pair_left_name_'+pairId, leftUserCanvas, leftUserName, suffix);
        var rightUserDiv = createExchangeUserDiv("pair_right_"+pairId, 'pair_right_name_'+pairId, rightUserCanvas, rightUserName, suffix);
        var exchangeLabelDiv = createExchangeLabelDiv(pairId, suffix);

        exchangeDiv.appendChild(leftUserDiv);
        exchangeDiv.appendChild(exchangeLabelDiv);
        exchangeDiv.appendChild(rightUserDiv);

        return exchangeDiv;

    }

    function createMultiExchangeDiv(canvasList, userNameList, suffix){
        var exchangeDiv = document.createElement("div");
        exchangeDiv.setAttribute("id", "multipair");
        exchangeDiv.setAttribute("class", "exchange-container"+suffix+" button whitebutton");

        for(i in canvasList){
            var entryDiv = createExchangeUserDiv("multipair_"+i, "multipair_name_"+i, canvasList[i], userNameList[i], suffix);
            exchangeDiv.appendChild(entryDiv);
        }

        return exchangeDiv;
    }

    function createNormalDiv(number, hasTripple){
        var normalDiv = document.createElement("div");
        normalDiv.setAttribute("id", "normal-exchange-container");

        var rowList = [];

        for(var i = 0; i < exchangeTableRow; i++){
            var normalDivRow = document.createElement("div");
            normalDivRow.setAttribute("class", "normal-exchange-row");
            var cellList = [];
            for(var j = 0; j < exchangeTableColumn; j++){
                var normalDivCell = document.createElement("div");
                normalDivCell.setAttribute("class", "normal-exchange-cell");
                cellList.push(normalDivCell);
                normalDivRow.appendChild(normalDivCell);
            }
            rowList.push(cellList);
            normalDiv.appendChild(normalDivRow);
        }

        for(var i = 0; i < number && i < exchangeTableSize; i++){
            var row = parseInt(i/exchangeTableColumn);
            var column = parseInt(i/exchangeTableRow);
            var leftCanvas = createCanvas($('img#people_img_unknown').get(0), 75, 50, 5);
            var rightCanvas = createCanvas($('img#people_img_unknown').get(0), 75, 50, 5);
            var exchangeDiv = createExchangeDiv(i, leftCanvas, "?", rightCanvas, "?", "");
            rowList[row][column].appendChild(exchangeDiv);
        }

        if(hasTripple && number < exchangeTableSize){
            var canvas1 = createCanvas($('img#people_img_unknown').get(0), 75, 50, 5);
            var canvas2 = createCanvas($('img#people_img_unknown').get(0), 75, 50, 5);
            var canvas3 = createCanvas($('img#people_img_unknown').get(0), 75, 50, 5);
            var exchangeDiv = createMultiExchangeDiv([canvas1, canvas2, canvas3], ["?", "?", "?"], "");
            rowList[parseInt(number/exchangeTableColumn)][parseInt(number/exchangeTableRow)].appendChild(exchangeDiv);
        }

        return normalDiv;
    }

    function createVipDiv(){
        var vipDiv = document.createElement("div");
        vipDiv.setAttribute("id", "vip-exchange-container");

        var listSize = users_vip.length;
        if(listSize < 3) listSize = 3;

        var vipEntryDivs = [];

        for(var i = 0; i < listSize; i++){
            var entryDiv = document.createElement("div");
            entryDiv.setAttribute("class", "vip-exchange-entry-container");
            vipDiv.appendChild(entryDiv);
            vipEntryDivs.push(entryDiv);
        }
        for (i in users_vip){
            var leftCanvas = createCanvas($('img#people_img_'+users_vip[i]).get(0), 150, 100, 10);
            var rightCanvas = createCanvas($('img#people_img_unknown').get(0), 150, 100, 10);
            var exchangeDiv = createExchangeDiv(i, leftCanvas, users[users_vip[i]].name, rightCanvas, "?", "-large");
            vipEntryDivs[i].appendChild(exchangeDiv);
        }

        return vipDiv;
    }

    function startVipExchange(index, max){
        if(index > max){
            $('#next-button').attr('class', 'button bluebutton');
            $('#next-button').removeAttr('disabled');   
            isVip = false;
            return;
        }
        coverflowFlip(150, 100, 10, "pair_right_"+index, "pair_right_name_"+index, flipStep);
        coverflowClear();
        arrayShuffle(users_list);
        coverflowInit();

        setTimeout(function(){startVipExchange(index+1, max)}, vipInterval);
    }

    function startNormalTrippleExchange(index){
        if(index > 2) return;
        coverflowFlip(75, 50, 5, "multipair_"+index, "multipair_name_"+index, flipStep);
        coverflowClear();
        arrayShuffle(users_list);
        coverflowInit();
        setTimeout(function(){startNormalTrippleExchange(index+1)}, normalInterval);
    }

    function startNormalExchange(index, max, isLeft, hasTripple, isLast){
        if(index > max){
            if(!isLast){
                $('#next-button').attr('class', 'button bluebutton');
                $('#next-button').removeAttr('disabled');   
            }
            return;
        }

        if(index == max && hasTripple){
            startNormalTrippleExchange(0);
            if(!isLast){
                $('#next-button').attr('class', 'button bluebutton');
                $('#next-button').removeAttr('disabled');   
            }
            return;
        }
        else{
            if(isLeft){
                coverflowFlip(75, 50, 5, "pair_left_"+index, "pair_left_name_"+index, flipStep);
            }
            else{
                coverflowFlip(75, 50, 5, "pair_right_"+index, "pair_right_name_"+index, flipStep);
            }

            coverflowClear();
            arrayShuffle(users_list);
            coverflowInit();

            if(isLeft){
                setTimeout(function(){startNormalExchange(index, max, false, hasTripple, isLast)}, normalInterval);
            }
            else{
                setTimeout(function(){startNormalExchange(index+1, max, true, hasTripple, isLast)}, normalInterval);
            }
        }
    }

    function createPeopleEntry(peopleEntryId, coverflowClass){
        var canvas = createCanvas($('img#people_img_'+peopleEntryId).get(0), 180, 120, 12);
        var li = $('<li class="img" />');
        li.attr('id', 'people_entry_'+peopleEntryId);
        li.addClass(coverflowClass);
        li.append(canvas);
        return li;

    }
    
    function preloadImages(){
        for(var uid in users){
            var imageElement = document.createElement('img');
            imageElement.setAttribute("id", "people_img_"+uid);
            imageElement.setAttribute("src", users[uid].picture);
            $('#img-container').append(imageElement);
        }

        var imageElement = document.createElement('img');
        imageElement.setAttribute("id", "people_img_unknown");
        imageElement.setAttribute("src", "images/unknown.jpg");
        $('#img-container').append(imageElement);
    }

    function coverflowClear(){
        $('#coverflow li').remove();
    }

    function coverflowInit(){
        if(users_list.length > 2){
            $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow_end'));
        }
        
        if(users_list.length == 2){
            $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow'));
            $('#coverflow').append(createPeopleEntry(users_list[1], 'coverflow_begin'));
            $('#name-label').text(users[users_list[0]].name);
        }
        else if(users_list.length == 1){
            $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow'));
            $('#name-label').text(users[users_list[0]].name);
        }
        else{
            $('#coverflow').append(createPeopleEntry(users_list[1], 'coverflow'));
            $('#coverflow').append(createPeopleEntry(users_list[2], 'coverflow_begin'));
            $('#name-label').text(users[users_list[1]].name);
        }
    }

    function exchangeInit(){
        $('#exchange-container').append(createVipDiv());
        $('#start-button').attr('class', 'button bluebutton');
        $('#start-button').removeAttr('disabled');

    }

    return {
        init: function(){
            jQuery.get("/user/get_all", function(data){
                var usersJSON = jQuery.parseJSON(data);
                if(usersJSON.status == 0){
                    users = usersJSON.val;
                    for(user in users){
                        if(users_exclude.indexOf(user) == -1){
                            users_list.push(user);
                        }
                    }
                    arrayShuffle(users_list);
                    preloadImages();
                    coverflowInit();
                    exchangeInit();
                }
                else{
                    throw usersJSON.error.msg;
                }
               
            });      
        },

        start: function(){
            $('#start-button').attr('class', 'button graybutton');
            $('#start-button').attr('disabled', 'disabled');
            if(isVip){
                startVipExchange(0, 2);
            }
            else{
                if(users_list.length > exchangeTableSize * 2 + 1){
                    startNormalExchange(0, exchangeTableSize - 1, true, false, false);
                }
                else if(users_list.length % 2 == 0){
                    startNormalExchange(0, parseInt(users_list.length/2)-1, true, false, true);
                }
                else{
                    startNormalExchange(0, parseInt(users_list.length/2)-1, true, true, true);
                }
            }
        },

        next: function(){
            coverflowClear();
            arrayShuffle(users_list);
            coverflowInit();

            $('#exchange-container div').remove();
            
            if(users_list.length > exchangeTableSize * 2 + 1){
                $('#exchange-container').append(createNormalDiv(exchangeTableSize, false));
            }
            else if(users_list.length % 2 == 0){
                $('#exchange-container').append(createNormalDiv(parseInt(users_list.length/2), false));
            }
            else{
                $('#exchange-container').append(createNormalDiv(parseInt(users_list.length/2) - 1, true));
            }

            $('#next-button').attr('class', 'button graybutton');
            $('#next-button').attr('disabled', 'disabled');
            $('#start-button').attr('class', 'button bluebutton');
            $('#start-button').removeAttr('disabled');

        }

    };

}();
