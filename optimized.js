const key = "AIzaSyDE1b3X8rcNjoQhbuUpAsgNNDAD8SZrK6c";
var channelIdWhoUploadedVideo;
var arrayID = new Array();  //for unique ids
var IdNameLikeComment = new Array();    // for all data
var winnerInfo = new Array();   //store the info of winner
var arrayFilterID = new Array(); //filtered array having all duplicate comments removed
var winnerID;  //id of the winner
var video;
var Like;   //like count on user comment
var Comment;    //comment of user
var arrayLikes = new Array();   //store the array of likes

//remove the owners comment
function removeA(arr) {
   var what, a = arguments, L = a.length, ax;
   while (L > 1 && arr.length) {
       what = a[--L];
       while ((ax= arr.indexOf(what)) !== -1) {
           arr.splice(ax, 1);
       }
   }
   return arr;
}

//PICK A RANDOM NUMBER AND DECLARE WINNER
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//fetch the Profile Details like DP
function getProfileDetails(){
    $.ajax({
        url : "https://www.googleapis.com/youtube/v3/channels",
        method: "GET",
        data:{
            part: "snippet,contentDetails,statistics",
            key: key,
            id: winnerID
        },
        success: function(data){
            var dpURL = data.items[0].snippet.thumbnails.high.url;
            var channelName = data.items[0].snippet.localized.title;
            var channelId = data.items[0].id;
            var channelDesc = data.items[0].snippet.localized.description;
            var subscriberCount = data.items[0].statistics.subscriberCount;
            var videoUploaded = data.items[0].statistics.videoCount;
            var totalViews = data.items[0].statistics.viewCount;
            var str = `
            <div class="row">
                <div class="col-md-4 mb-2">
                    <img src="${dpURL}" height="300" width="100%" class="thumbnail border border-dark">
                    <a href="https://www.youtube.com/channel/${channelId}" target="_blank" class="btn btn-dark btn-block my-2"><i class="fa fa-user-circle"></i> Visit Channel</a>
                </div>
                <div class="col-md-8">
                    <div class="card bg-dark" style="width: 100%; min-height:320px" id="Card">
                        <div class="card-header text-white">
                            <h4>${channelName}</h4>
                            <div class="row">
                                <div class="col-sm-12">
                                    <span class="badge badge-pill badge-danger mr-3 ml-auto">Subscribers ${subscriberCount}</span>
                                </div>
                                <div class="col-sm-12">
                                    <span class="badge badge-pill badge-success mr-3">Videos ${videoUploaded}</span>
                                </div>
                                <div class="col-sm-12">
                                    <span class="badge badge-pill badge-warning">Views ${totalViews}</span>
                                </div>
                            </div>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Channel Desc: </strong>${ channelDesc ? channelDesc: '-'}</li>
                            <li class="list-group-item"><strong>Likes: </strong>${Like}</li>
                            <li class="list-group-item"><strong>Comment: </strong>${Comment}</li>
                        </ul>
                        <div class="card-footer" id="shareResult">
                            <a class="btn btn-dark text-white" href="javascript:" onclick="window.open('https://twitter.com/intent/tweet?text=Congrats+to+%22${channelName}%22+For+Winning+The+Giveaway%21%0D%0A%23GiveAwayResults+via+%40comment_picker%0D%0AWinner+Channel+Url%3A%0D%0Ahttps%3A%2F%2Fwww.youtube.com%2Fchannel%2F${channelId}','GiveAway','height=600,width=800,top=50,left=200')"><i class="fa fa-twitter pr-2"></i>Share on Twitter</a>
                        </div>
                    </div>
                </div>
            `
            // $("#list").append(str);
            $("#list").html(str);
        },
        error: function(jqXHR,exception){
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Connection Not Available, Verify Network!';
            } else if (jqXHR.status === 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status === 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            showMessage(msg,'alert-danger',6000);
        }
    });
}

//generate Max Liked Comment Excluding Video Owners Liked Comment
function GenerateMaxLikedComment(){
    document.getElementById('list').style.display = "block";
    var info = IdNameLikeComment;
    var Id = "";
    var Name = "";
    for(var i = 0; i < info.length; i++){
        var indexOfcid = info[i].indexOf("@");
        var indexOflike = info[i].indexOf("$");
        var indexOfcomment = info[i].indexOf("#");
 
        Id = info[i].slice(0,indexOfcid);
        //Name = info[i].slice(indexOfcid +1, indexOflike);
        //dont save the like value if the id in array is same as the id of video owner as we dont want to consider owners likes
         
        if(channelIdWhoUploadedVideo != Id){
            //push the likes values of all comments in a single array
            arrayLikes.push(info[i].slice(indexOflike +1,indexOfcomment));
        }
        //Comment = info[i].slice(indexOfcomment +1);
    }
    console.log(arrayLikes);
    //calculate the maximum like value
    var maxLikes = Math.max(...arrayLikes);
    if(maxLikes > 0){
        //to find the details of that max liked comment we have to compare $liked# with every IdNameLikeComment value
        var maxLikeExpression = "$" + maxLikes + "#";
        for (var j = 0 ; j < IdNameLikeComment.length ; j++){
        var maxLikeExpression = "$" + maxLikes + "#";
        // console.log(IdNameLikeComment[j]);
        // console.log(j);
        // console.log(IdNameLikeComment.length);
 
            if (IdNameLikeComment[j].indexOf(maxLikeExpression) != -1){
                //maxLikeExpressionExists
                //get the details of that Index
                winnerInfo.push(IdNameLikeComment[j]);
                console.log(j);
            }
        }
        console.log(winnerInfo,"WINNER INFO");
        console.log(winnerInfo.length,"WINNER LEN");
        var winnerInfoDetails;
        if(winnerInfo.length > 0){
            //2 or more winners got same no of likes
            //PICK A RANDOM NUMBER AND DECLARE WINNER
            // function getRandomInt(min, max) {
            //     return Math.floor(Math.random() * (max - min + 1)) + min;
            // }
            var winnerIndex = getRandomInt(0, winnerInfo.length - 1);
            console.log(winnerIndex,"Random Choosen Index");
            winnerInfoDetails = winnerInfo[winnerIndex];
        }
        else{
            //winner is present at 0th index
            winnerInfoDetails = winnerInfo[0];
        }
 
        //extract the ID channel of the winner to get other details
        var idIndex = winnerInfoDetails.indexOf("@");
        winnerID = winnerInfoDetails.slice(0,idIndex);
        console.log(winnerInfo.length,"Length of Winner");
        console.log(winnerInfo,"Details of winner info");
 
        //fetch LikeCount And Comment
        var indexOfLike = winnerInfoDetails.indexOf("$");
        var indexOfComment = winnerInfoDetails.indexOf("#");
        Like = winnerInfoDetails.slice(indexOfLike +1,indexOfComment);
        Comment = winnerInfoDetails.slice(indexOfComment +1);
 
        console.log(Like,"Like");
        console.log(Comment,"Comment");
 
        getProfileDetails();
    }
    else{
        showMessage('No Comment Have Atleast 1 Like to Choose From!', 'alert-warning',6000);
    }
    console.log(maxLikes,"Max Liked Comment");
    console.log(IdNameLikeComment);
}

 function generateRandomComment(){
    document.getElementById('list').style.display = "block";
    var winnerIndex = getRandomInt(0, arrayFilterID.length - 1);
    winnerID = arrayFilterID[winnerIndex];
    console.log(winnerIndex, "WinnerIndex");
    console.log(winnerID, "WinnerID");

    //to get the details of winnerID
    for (var j = 0; j < IdNameLikeComment.length; j++) {
        //check if winnerID exist in other details
        if (IdNameLikeComment[j].indexOf(winnerID) != -1) {
            //exists
            winnerInfo.push(IdNameLikeComment[j]);
        }
    }
    //    $("#list").html(winnerInfo[0]);
    console.log(winnerInfo.length, "Count How many Comments were posted by winner");
    console.log(winnerInfo, "Actual Info of the Winner");

    //fetch LikeCount And Comment
    var indexOfLike = winnerInfo[0].indexOf("$");
    var indexOfComment = winnerInfo[0].indexOf("#");
    Like = winnerInfo[0].slice(indexOfLike +1,indexOfComment);
    Comment = winnerInfo[0].slice(indexOfComment +1);

    console.log(Like,"Like");
    console.log(Comment,"Comment");
    
    getProfileDetails();
}
var fc = 0;
function fetchVideoData(PageToken) {
    document.getElementById('list').style.display = "none";
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/commentThreads",
        method: "GET",
        data:{
            part: "snippet",
            maxResults: 100,
            key: key,
            videoId: video,
            pageToken: PageToken
        },
        success: function(data){
            var dataResults = data.items;
            for (var i = 0; i < dataResults.length; i++) {
                if(dataResults[i].snippet.topLevelComment.snippet.authorChannelUrl){
                    fc = fc + 1;
                    //push the channelID to Array
                    arrayID.push(dataResults[i].snippet.topLevelComment.snippet.authorChannelId.value);
                    //push other details
                    IdNameLikeComment.push(dataResults[i].snippet.topLevelComment.snippet.authorChannelId.value + "@" + dataResults[i].snippet.topLevelComment.snippet.authorDisplayName + "$" + dataResults[i].snippet.topLevelComment.snippet.likeCount + "#" + dataResults[i].snippet.topLevelComment.snippet.textDisplay);
                }
            }
            if(data.nextPageToken){
                document.getElementById('uc').innerHTML = fc + " comments fetched";
                fetchVideoData(data.nextPageToken);
            }
            else{
                arrayFilterID = arrayID.filter(function (value, index, array) {
                    return array.indexOf(value) == index;
                });
                //remove video owner ID in filteredID
                removeA(arrayFilterID, channelIdWhoUploadedVideo);

                //$("#uc").html(arrayFilterID.length);
                $("#uc").html(arrayFilterID.length + " Unique Out Of " + arrayID.length +" Comments!");
                console.log(arrayFilterID.length, "IdLength F");
                console.log(arrayFilterID, "IdArray F");

                console.log(arrayID.length, "IdLength");
                console.log(arrayID, "IdArray");
            }
        },
        error: function(jqXHR,exception){
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Connection Not Available, Verify Network!';
            } else if (jqXHR.status === 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status === 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            showMessage(msg,'alert-danger',6000);
        }
    });
}

//showMessage For empty URL
function showMessage(message, className, removalDuration){
   const div = document.createElement('div');
   //add class
   div.className = `alert ${className}`;
   //add text
   div.appendChild(document.createTextNode(message));
   const urlContainer = document.getElementById("url-container");
   const inputContainer = document.getElementById("input-container");
   urlContainer.insertBefore(div, inputContainer);
   //TimeOut
   setTimeout(function(){
       document.querySelector('.alert').remove();
   },removalDuration);
}

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $("#wait").show();
    }).ajaxStop(function () {
        $("#wait").hide();
    });

    $("#btn-search").click(function () {
        //get the user input video
        var txt =  document.getElementById('videoId').value;
        if(txt == ""){
             //show empty message
             showMessage('URL Field Cannot be Empty','alert-danger',3000);
        }
        else{
             video = txt.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
             if(video != null) {
                 video = video[1];
                 //var uniformResourceLocator = "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyDE1b3X8rcNjoQhbuUpAsgNNDAD8SZrK6c&id="+ video;
                 $.ajax({
                 url: "https://www.googleapis.com/youtube/v3/videos",
                 method: "GET",
                 data:{
                     part: "snippet",
                     key: key,
                     id: video
                 },
                 success: function(channelDetails){
                    console.log(channelDetails);
                    //if user uploads the unexisting Video Url
                    if(channelDetails.items.length > 0){
                        channelIdWhoUploadedVideo = channelDetails.items[0].snippet.channelId;
                        arrayID = [];
                        IdNameLikeComment = [];
                        winnerInfo = [];
                        arrayFilterID = [];
                        winnerID = "";
                        Like = "";
                        Comment = "";
                        arrayLikes = [];
                        fc = 0;
                        fetchVideoData();
                        //$("#btn-random").css("display", "block");
                        //$("#criteria").css("display", "block");
                        $("#btn-random").css("visibility", "visible");
                        $("#criteria").css("visibility", "visible");
                        //$("#btn-random").show();
                        //$("#criteria").show();
                    }
                    else{
                        showMessage("Video Url is Unavailable!",'alert-danger',6000);
                    }
                 },
                 error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Connection Not Available, Verify Network!';
                    } else if (jqXHR.status === 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status === 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    showMessage(msg,'alert-danger',6000);
                }
            });//end of ajax method
                //before calling empty out everything in case of second click
            } else { 
                 showMessage('Invalid URL!','alert-danger',3000);
             }
         }
    });

    $("#btn-random").click(function(){
        const generate = document.querySelector('input[name=cr]:checked').value;
        if(generate == "random"){
            winnerInfo = [];
            winnerID = "";
            Like = "";
            Comment = "";
            arrayLikes = [];
         generateRandomComment();
        }
        else if(generate == "liked"){
            winnerInfo = [];
            winnerID = "";
            Like = "";
            Comment = "";
            arrayLikes = [];
         GenerateMaxLikedComment();
        }
    });
 });