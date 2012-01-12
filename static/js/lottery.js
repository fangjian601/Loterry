
var lottery = function(){
    
    var coverflowWindowSize = 9;
    var users = null;
    var users_list = [];
    var rewards = [];
    var flipStop = false;
    var flipInitTime = 100;
    var flipMaxTime = 1300;
    var flipStepTime = 400;
    var flipTime = flipInitTime;
    var currentStage = 1;

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

    function arrayRemove(theArray, element){
        var index = theArray.indexOf(element);
        if(index != -1){
            theArray.splice(index,1);
        }
    }

    function createCanvas(img){
        var canvasHeight = 300;
        var canvasWidth = 200;
        var radius = 20;
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

    function createPeopleEntry(peopleEntryId, coverflowClass){
        var canvas = createCanvas($('img#people_img_'+peopleEntryId).get(0));
        var li = $('<li class="img" />');
        li.attr('id', 'people_entry_'+peopleEntryId);
        li.addClass(coverflowClass);
        li.append(canvas);
        return li;

    }

    function coverflowFlipStopped(){
        var centerPeopleId = $('#coverflow li.coverflow'+parseInt(coverflowWindowSize/2)).attr('id').substring(13);
        var centerPeopleIndex = users_list.indexOf(centerPeopleId);
        if(centerPeopleIndex != -1){
            users_list.splice(centerPeopleIndex, 1);
            rewards.push(centerPeopleId);
            jQuery.get("/reward/add/"+centerPeopleId);
        }
        $('#start-button').attr('class', 'button bluebutton');
        $('#start-button').removeAttr('disabled');
        $('#reset-button').attr('class', 'button bluebutton');
        $('#reset-button').removeAttr('disabled');

    }
    
    function buttonInit(){
        $('#start-button').attr('class', 'button bluebutton');
        $('#start-button').removeAttr('disabled');
        $('#reset-button').attr('class', 'button bluebutton');
        $('#reset-button').removeAttr('disabled');
        $(window).keydown(function(e) {
            if(e.keyCode == 32){
                if(currentStage == 1){
                    lottery.start();
                    currentStage = 0;
                }
                else{
                    lottery.stop();
                    currentStage = 1;
                }
            }
        });
    }

    function coverflowFlip(){

        if(flipStop && flipTime >= flipMaxTime){
            coverflowFlipStopped();
            return;
        }

        if(flipStop) flipTime = flipTime + flipStepTime;

        var peopleId = $('#coverflow li.coverflow_begin').attr('id').substring(13);
        var peopleIndex = users_list.indexOf(peopleId);
        $('#coverflow li.coverflow_end').remove();
        $('#coverflow li').each(function(index){
            var entryClass = $(this).attr('class');
            if(entryClass.indexOf('coverflow_begin') != -1){
                $(this).attr('class', 'img coverflow0');
            }
            else{
                var coverflowId = -1;
                for(var i = coverflowWindowSize - 1; i >= 0; i--){
                    if(entryClass.indexOf('coverflow'+i) != -1){
                        coverflowId = i;
                        break;
                    }
                }

                if(coverflowId == (coverflowWindowSize - 1)){
                    $(this).attr('class', 'img coverflow_end');
                }

                else if(coverflowId < coverflowWindowSize - 1 && coverflowId >= 0){
                    $(this).attr('class', 'img coverflow'+(coverflowId+1));
                    if(coverflowId == (parseInt(coverflowWindowSize/2) - 1)){
                        var centerPeopleId = $(this).attr('id').substring(13);
                        var centerPeopleIndex = users_list.indexOf(centerPeopleId);
                        if(centerPeopleIndex != -1){
                            $('#name-label').text(users[users_list[centerPeopleIndex]].name);
                        }
                    }
                }
            } 
        });

        if(peopleIndex != -1 && peopleIndex < (users_list.length - 1)){
            $('#coverflow').append(createPeopleEntry(users_list[peopleIndex+1], 'coverflow_begin'));
        }
        else if(peopleIndex != -1) {
            $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow_begin'));
        }

        setTimeout(coverflowFlip, flipTime);
    }

    function pictureInit(){
        $('#coverflow').append(createPeopleEntry(users_list[0], 'coverflow_end'));
        for(var i = 1; i <= coverflowWindowSize; i++){
            $('#coverflow').append(createPeopleEntry(users_list[i], 'coverflow'+(coverflowWindowSize-i)));
            if(i == (parseInt(coverflowWindowSize/2) + 1)){
                $('#name-label').text(users[users_list[i]].name);
            }
        }
        $('#coverflow').append(createPeopleEntry(users_list[coverflowWindowSize+1], 'coverflow_begin'));

    }

    function pictureClear(){
        $('#coverflow li').remove();
    }

    function coverflowInit(){
        for(var uid in users){
            var imageElement = document.createElement('img');
            imageElement.setAttribute("id", "people_img_"+uid);
            imageElement.setAttribute("src", "images/people/"+users[uid].picture);
            $('#img-container').append(imageElement);
        }
        pictureInit(); 
    }

   
    return {
        init: function(){
            jQuery.get("/user/get_all", function(data){
                var usersJSON = jQuery.parseJSON(data);
                if(usersJSON.status == 0){
                    users = usersJSON.val;
                    for(user in users){
                        users_list.push(user);
                    }
                    jQuery.get("/reward/get", function(data){
                        var rewardsJSON = jQuery.parseJSON(data);
                        if(rewardsJSON.status == 0){
                            rewards = rewardsJSON.val;
                            for(var i in rewards){
                                arrayRemove(users_list, rewards[i]);
                            }
                            arrayShuffle(users_list);
                            coverflowInit();
                            buttonInit();
                        }
                        else{
                            throw rewardsJSON.error.msg;
                        }
                    });
                }
                else{
                    throw usersJSON.error.msg;
                }
            });
        },
        
        start: function(){
            $('#start-button').attr('class', 'button graybutton');
            $('#start-button').attr('disabled', 'disabled');
            $('#stop-button').attr('class', 'button bluebutton');
            $('#stop-button').removeAttr('disabled');
            $('#reset-button').attr('class', 'button graybutton');
            $('#reset-button').attr('disabled', 'disabled');
            pictureClear();
            arrayShuffle(users_list);
            pictureInit();
            flipStop = false;
            flipTime = flipInitTime;
            coverflowFlip();
        },

        stop: function(){
            flipStop = true; 
            $('#stop-button').attr('class', 'button graybutton');
            $('#stop-button').attr('disabled', 'disabled');

        },

        reset: function(){
            $('#start-button').attr('class', 'button graybutton');
            $('#start-button').attr('disabled', 'disabled');
            $('#reset-button').attr('class', 'button graybutton');
            $('#reset-button').attr('disabled', 'disabled');
            jQuery.get("/reward/clear", function(data){
                var dataJSON = jQuery.parseJSON(data);
                if(dataJSON.status == 0){
                    for(i in rewards){
                        if(users_list.indexOf(rewards[i]) == -1){
                            users_list.push(rewards[i]);
                        }
                    }
                    rewards = [];
                    $('#start-button').attr('class', 'button bluebutton');
                    $('#start-button').removeAttr('disabled');
                    $('#reset-button').attr('class', 'button bluebutton');
                    $('#reset-button').removeAttr('disabled');
                    alert("All records are removed");
                    pictureClear();
                    arrayShuffle(users_list);
                    pictureInit();
                }
                else{
                    alert("Clear records error: "+dataJSON.error.msg);
                }
            });
        }
    };
}();


